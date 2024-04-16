const { message } = window.__TAURI__.dialog;
const { invoke } = window.__TAURI__.tauri;
import { dmsToDecimal, isDmsRegexMatch } from "../utils/utils.js";
import { changeCompassOffset } from "./interval_req_handler.js"


let prevCenterFreq = 0;
let prevAntSpace = 0;

function setAntena(fetchURL, antSpace) {
    if (prevAntSpace === antSpace) {
        return;
    }

    let typeAnt = "vhf";
    if (antSpace <= 0.25) {
        typeAnt = "uhf";
    }

    prevAntSpace = antSpace;

    fetch(fetchURL + "/api/ant/" + typeAnt, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log("Success, " + JSON.stringify(result));
        })
        .catch(error => {
            message("Error", error);
        });
}

function setFreqReq(fetchURL, dataFreq) {
    fetch(fetchURL + "/api/settings/freq", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataFreq)
    })
        .then(response => response.json())
        .then(result => {
            console.log("Success, " + JSON.stringify(result));
        })
        .catch(error => {
            message("Error", error);
        });
}


function setFreq(fetchURL) {
    const centerFreq = document.getElementById("input-freq").value;
    const gains = document.getElementById("input-gain").value

    if (!centerFreq || !gains) {
        message("Input tidak boleh kosong", "Error");
        return
    }

    const centerFreqValue = parseFloat(centerFreq);

    const antSpace = (centerFreqValue >= 250) ? 0.25 : 0.45;

    setAntena(fetchURL, antSpace);

    if (centerFreqValue - prevCenterFreq <= Math.abs(1.5)) {
        const data1 = {
            center_freq: (centerFreqValue + 10),
            uniform_gain: parseFloat(gains),
            ant_spacing_meters: antSpace
        }
        setFreqReq(fetchURL, data1);

        setTimeout(() => {
            const data2 = {
                center_freq: (centerFreqValue),
                uniform_gain: parseFloat(gains),
                ant_spacing_meters: antSpace
            }
            setFreqReq(fetchURL, data2);
        }, 1000);
    } else {
        const data = {
            center_freq: (centerFreqValue),
            uniform_gain: parseFloat(gains),
            ant_spacing_meters: antSpace
        }
        setFreqReq(fetchURL, data);
    }
}

function setStationId(fetchURL) {
    const station = document.getElementById("input-station-id").value;

    if (!station) {
        message("Input tidak boleh kosong", "Error");
        return
    }

    const stationId = {
        id: station
    }

    fetch(fetchURL + "/api/settings/station_id", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stationId)
    })
        .then(response => response.json())
        .then(result => {
            console.log("Success, " + JSON.stringify(result));
        })
        .catch(error => {
            message("Error", error);
        });
}

function setLatLng(fetchURL) {
    const dmsLat = document.getElementById("input-lat").value;
    const dmsLng = document.getElementById("input-lng").value;

    if (!dmsLat || !dmsLng) {
        message("Input tidak boleh kosong", "Error");
        return
    }

    const latlng = {
        lat: dmsToDecimal(dmsLat),
        lng: dmsToDecimal(dmsLng)
    }

    fetch(fetchURL + "/api/settings/latlng", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(latlng)
    })
        .then(response => response.json())
        .then(result => {
            console.log("Success, " + JSON.stringify(result));
        })
        .catch(error => {
            message("Error", error);
        });
}

function turnOffDF(fetchURL) {
    fetch(fetchURL + "/api/shutdown", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log("Success, " + JSON.stringify(result));
        })
        .catch(error => {
            message("Power Config", "Mematikan DF dalam waktu maks 1 menit");
        });
}

function restartDF(fetchURL) {
    fetch(fetchURL + "/api/restart", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(result => {
            console.log("Success, " + JSON.stringify(result));
        })
        .catch(error => {
            message("Power Config", "Restarting DF");
        });
}

async function refreshStatus(fetchURL) {
    const statusWebview = document.getElementById("df-status-webv");
    statusWebview.src = fetchURL + "/config";
    getInitSetting(fetchURL);
    await readSavedCoord();
    setCompassOffset();
}

async function getInitSetting(fetchURL) {
    try {
        const response = await fetch(fetchURL + "/api/settings");
        const settingJson = await response.json();

        await readSavedCoord();

        const centerFreq = settingJson.center_freq || "";
        prevCenterFreq = parseFloat(centerFreq);

        const antSpace = settingJson.ant_spacing_meters;
        setAntena(fetchURL, antSpace);

        document.getElementById("input-freq").value = centerFreq;
        document.getElementById("input-gain").value = settingJson.uniform_gain.toString() || "";
        document.getElementById("input-station-id").value = settingJson.station_id || "";

    } catch (error) {
        console.log("Get initial config failed...");
    }
}

async function convertLatLngToUtm() {
    const latitude = document.getElementById("input-lat").value;
    const longitude = document.getElementById("input-lng").value;
    const zoneField = document.getElementById("input-zone");
    const eastingField = document.getElementById("input-easting");
    const northingField = document.getElementById("input-northing");
    const coField = document.getElementById("input-co");

    if (!latitude || !longitude) {
        message("Input tidak boleh kosong", "Error");
        return
    }

    const lat = dmsToDecimal(latitude);
    const lng = dmsToDecimal(longitude);

    const utmCoordStr = await invoke("convert_latlng_to_utm", { lat: lat, lon: lng });

    const utmCoord = JSON.parse(utmCoordStr);

    zoneField.value = utmCoord.zone + utmCoord.zone_letter;
    eastingField.value = utmCoord.easting.toFixed(2);
    northingField.value = utmCoord.northing.toFixed(2);

    const strCOE = Math.round(utmCoord.easting).toString();
    const strCON = Math.round(utmCoord.northing).toString();

    coField.value = `${strCOE.substring(1, strCOE.length - 1)}, ${strCON.substring(2, strCON.length - 1)}`;
}

function setCompassOffset() {
    const inputValue = document.getElementById("input-compass-offset").value;

    if (!isNaN(inputValue) && inputValue >= -180 && inputValue <= 180) {
        const offset = parseFloat(inputValue);
        changeCompassOffset(offset.toFixed(2));
    } else {
        message("Error, Nilai offset hanya boleh -180 sampai 180");
        document.getElementById("input-compass-offset").value = 0;
        changeCompassOffset(0);
    }


}


//Save Coordinate
async function saveCoord() {
    const latDms = document.getElementById("input-lat").value;
    const lngDms = document.getElementById("input-lng").value;
    const zone = document.getElementById("input-zone").value;
    const easting = document.getElementById("input-easting").value || 0;
    const northing = document.getElementById("input-northing").value || 0;
    const co = document.getElementById("input-co").value;
    const compassOffset = document.getElementById("input-compass-offset").value;

    if (!isDmsRegexMatch(latDms)) {
        message(`Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`);
        document.getElementById("input-lat").value = `0°0'0.0"S`;
        return;
    }

    if (!isDmsRegexMatch(lngDms)) {
        message(`Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`);
        document.getElementById("input-lng").value = `0°0'0.0"E`;
        return;
    }

    const saveData = {
        latDms,
        lngDms,
        zone,
        easting,
        northing,
        co,
        compassOffset
    }
    const dataString = JSON.stringify(saveData);

    await invoke("write_file", { path: "app_data.json", content: dataString });
}

async function readSavedCoord() {
    const savedConf = await invoke("read_file", { path: "app_data.json" });
    const jsonConf = JSON.parse(savedConf);

    document.getElementById("input-lat").value = jsonConf.latDms || "";
    document.getElementById("input-lng").value = jsonConf.lngDms || "";
    document.getElementById("input-zone").value = jsonConf.zone || "";
    document.getElementById("input-easting").value = jsonConf.easting || "";
    document.getElementById("input-northing").value = jsonConf.northing || "";
    document.getElementById("input-co").value = jsonConf.co || "";
    document.getElementById("input-compass-offset").value = jsonConf.compassOffset || "";
}


export {
    setFreq,
    setLatLng,
    setStationId,
    turnOffDF,
    restartDF,
    refreshStatus,
    convertLatLngToUtm,
    setCompassOffset,
};