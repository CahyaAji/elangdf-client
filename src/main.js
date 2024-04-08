import {
    setFreq,
    setLatLng,
    setStationId,
    turnOffDF,
    restartDF,
    refreshStatus,
    convertLatLngToUtm,
    setCompassOffset,
    saveCoord
} from "./handler/handler.js"
import { getNextFocusElement, getPrevFocusElement } from "./utils/dom-utils.js";
import { startFetchIntervalGPS, startFetchIntervalCompass, startFetchIntervalDF } from "./handler/interval_req_handler.js";

const urlDF = "http://localhost:3000";

let btnKeyPressed = "";
let currentView = 'w';

const spectrumWebv = document.getElementById("spectrum-webv");
const dfview = document.getElementById("df-view");
const freqMenu = document.getElementById("freq-menu");
const compassMenu = document.getElementById("compass-menu");
const dfAbsv = document.getElementById("dfabsview");

//keyboard shortcut
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const focusElement = document.activeElement;
        if (focusElement.tagName === "INPUT") {
            event.preventDefault();
        }
    }

    if (event.ctrlKey && event.key === 'w') {
        spectrumWebv.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "flex";
        freqMenu.style.display = "none";
        compassMenu.style.display = "none";
        currentView = 'w';
    }

    if (event.ctrlKey && event.key === 'e') {
        spectrumWebv.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "flex";
        compassMenu.style.display = "none";
        currentView = 'e';
    }

    if (event.ctrlKey && event.key === 'r') {
        spectrumWebv.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "none";
        compassMenu.style.display = "flex";
        currentView = 'r';
    }

    if (event.ctrlKey && event.key === 'h') {
        spectrumWebv.style.display = "flex";
        spectrumWebv.src = urlDF + "/spectrum";
        dfview.style.display = "none";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "none";
        compassMenu.style.display = "none";
        currentView = 'h';
    }

    if (event.ctrlKey && event.key === 'j') {
        const focusedElement = document.activeElement;
        let id = '';

        if (currentView === 'e') {
            id = "freq-menu";
        }

        if (currentView === 'r') {
            id = "compass-menu";
        }
        const prevElement = getPrevFocusElement(focusedElement, id);
        if (prevElement) {
            prevElement.focus();
        }
    }

    if (event.ctrlKey && event.key === 'k') {
        const focusedElement = document.activeElement;
        let id = '';

        if (currentView === 'e') {
            id = "freq-menu";
        }

        if (currentView === 'r') {
            id = "compass-menu";
        }

        const nextElement = getNextFocusElement(focusedElement, id);
        if (nextElement) {
            nextElement.focus();
        }
    }
});


//button pressed
const setFreqGainBtn = document.getElementById("btn-set-freq-gain");
const setStationBtn = document.getElementById("btn-set-station-id");
const latlngToUtmBtn = document.getElementById("btn-convert-utm");
// const saveLatlngBtn = document.getElementById("btn-save-coord");
const readGpsBtn = document.getElementById("btn-read-gps");
const restartBtn = document.getElementById("btn-restart");
const turnOffBtn = document.getElementById("btn-turnoff");
const setCmpsOffsBtn = document.getElementById("btn-set-compass-offset");
const saveCoordBtn = document.getElementById("btn-save-coord-config");

setFreqGainBtn.addEventListener("click", () => { setFreq(urlDF); });
setStationBtn.addEventListener("click", () => { setStationId(urlDF); });
restartBtn.addEventListener("click", () => { restartDF(urlDF); });
turnOffBtn.addEventListener("click", () => { turnOffDF(urlDF); });
latlngToUtmBtn.addEventListener("click", () => { convertLatLngToUtm(); });
// 4°15'2.08"S
// 138°21'34.33"E
readGpsBtn.addEventListener("click", () => { startFetchIntervalGPS(urlDF); });
// saveLatlngBtn.addEventListener("click", () => { setLatLng(urlDF) });
setCmpsOffsBtn.addEventListener("click", () => { setCompassOffset(); });

saveCoordBtn.addEventListener("click", async () => {
    await saveCoord();
});

document.addEventListener('DOMContentLoaded', () => {
    refreshStatus(urlDF);
});

startFetchIntervalCompass(urlDF);
startFetchIntervalDF(urlDF);