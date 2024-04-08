import { decimalToDMS } from "../utils/utils.js";

let intervalFetchDF;
let timeStamp = 0;

let intervalFetchGPS;
let counterIntervalGps = 0;

let intervalFetchCompass;
let compassOffset = 0;
let headingCompass = 0;

const angleAbsv = document.querySelector("#dfabsview>.angle-value");
const arrowAbsv = document.querySelector("#dfabsview>.arrow");

const latInDms = document.getElementById("input-lat");
const lngInDms = document.getElementById("input-lng");

const compassValue = document.getElementById("angle-value-compass");
const compassArrow = document.getElementById("arrow-compass");


function changeCompassOffset(data) {
    compassOffset = parseFloat(data);
}

async function fetchDF(urlDF) {
    try {
        const response = await fetch(`${urlDF}/df`);
        if (!response.ok) {
            throw new Error("Error DF");
        }

        const dataStringDF = await response.text();
        const dataArrayDF = dataStringDF.split(",");
        const data = {
            time: dataArrayDF[0].trim(),
            heading: dataArrayDF[1].trim()
        }
        return data;

    } catch (error) {
        return error;
    }
}

async function fetchGPS(urlDF) {
    try {
        const response = await fetch(`${urlDF}/api/gps/status`);
        if (!response.ok) {
            throw new Error("Error GPS");
        }
        const dataGPS = await response.json();
        return dataGPS;

    } catch (error) {
        return error;
    }
}

async function fetchCompass(urlDF) {
    try {
        const response = await fetch(`${urlDF}/api/compass`);
        if (!response.ok) {
            throw new Error("Error Compass");
        }
        const dataCompass = await response.json();
        return dataCompass;
    } catch (error) {
        return error
    }
}

function startFetchIntervalCompass(urlDF) {
    if (intervalFetchCompass) {
        return
    }

    intervalFetchCompass = setInterval(() => {
        fetchCompass(urlDF).then(data => {
            headingCompass = (data.heading + compassOffset) % 360;
            compassValue.innerHTML = headingCompass;
            compassArrow.style.display = "block";
            compassArrow.style.transform = `rotate(${headingCompass}deg)`;
        }).catch(() => {
            compassValue.innerHTML = " - ";
        })
    }, 1000);
}

function stopFetchIntervalCompass() {
    clearInterval(intervalFetchCompass);
    intervalFetchCompass = null;
}

function startFetchIntervalGPS(urlDF) {
    document.getElementById("btn-read-gps").disabled = true;
    if (intervalFetchGPS) {
        return;
    }
    counterIntervalGps = 0;

    intervalFetchGPS = setInterval(() => {
        fetchGPS(urlDF).then(gps => {
            latInDms.value = decimalToDMS(gps.data.lat, true);
            lngInDms.value = decimalToDMS(gps.data.lng, false);
        })
            .catch(() => {
                latInDms.value = decimalToDMS(0.0, true);
                lngInDms.value = decimalToDMS(0.0, false);
            });

        counterIntervalGps++;
        if (counterIntervalGps >= 7) {
            stopFetchIntervalGPS();
        }
    }, 3000);
}

function stopFetchIntervalGPS() {
    clearInterval(intervalFetchGPS);
    intervalFetchGPS = null;
    document.getElementById("btn-read-gps").disabled = false;
}

function startFetchIntervalDF(urlDF) {
    if (intervalFetchDF) {
        return;
    }
    let dfValue = "- - -";
    intervalFetchDF = setInterval(() => {
        fetchDF(urlDF).then(data => {
            if (timeStamp !== data.time) {
                dfValue = (360 + parseFloat(data.heading) - headingCompass) % 360;
                arrowAbsv.style.display = "block";
                arrowAbsv.style.transform = `rotate(${dfValue}deg)`;
                timeStamp = data.time;
            } else {
                arrowAbsv.style.display = "none";
                dfValue = "---";
            }
            angleAbsv.innerHTML = dfValue;
        })
            .catch((error) => {
                dfValue = "-|-"
                angleAbsv.innerHTML = dfValue;
                console.log(error);
            });
    }, 1000);
}

function stopFetchIntervalDF() {
    clearInterval(intervalFetchDF);
    intervalFetchDF = null;
}

export {
    startFetchIntervalGPS,
    startFetchIntervalCompass,
    startFetchIntervalDF,
    changeCompassOffset
};