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

// const urlDF = "http://localhost:3000";
const urlDF = "http://192.168.17.17:8087";

let btnKeyPressed = "";
let currentView = 'w';

const spectrumWebv = document.getElementById("spectrum-webv");
const dfview = document.getElementById("df-view");
const freqMenu = document.getElementById("freq-menu");
const compassMenu = document.getElementById("compass-menu");
const dfAbsv = document.getElementById("dfabsview");
const statusWebview = document.getElementById("df-status-webv");

//keyboard shortcut
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const focusElement = document.activeElement;
        if (focusElement.tagName === "INPUT") {
            event.preventDefault();
        }
    }

    if (event.ctrlKey && event.key === 'q') {
        if (currentView = 'h') {
            statusWebview.src = "";
            spectrumWebv.style.display = "flex";
            spectrumWebv.src = urlDF + "/spectrum";
            dfview.style.display = "none";
            dfAbsv.style.display = "none";
            freqMenu.style.display = "none";
            compassMenu.style.display = "none";
        } else {
            refreshStatus(urlDF);
        }
    }

    if (event.ctrlKey && event.key === 'w') {
        statusWebview.src = urlDF + "/config";
        spectrumWebv.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "flex";
        freqMenu.style.display = "none";
        compassMenu.style.display = "none";
        currentView = 'w';
    }

    if (event.ctrlKey && event.key === 'e') {
        statusWebview.src = urlDF + "/config";
        spectrumWebv.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "flex";
        compassMenu.style.display = "none";
        currentView = 'e';
    }

    if (event.ctrlKey && event.key === 'r') {
        statusWebview.src = urlDF + "/config";
        spectrumWebv.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "none";
        compassMenu.style.display = "flex";
        currentView = 'r';
    }

    if (event.ctrlKey && event.key === 'h') {
        statusWebview.src = "";
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

    if (event.ctrlKey && event.key === 'l') {
        console.log(btnKeyPressed);
        if (btnKeyPressed === "btn-set-freq-gain") {
            setFreq(urlDF);
        }
        if (btnKeyPressed === "btn-set-station-id") {
            setStationId(urlDF);
        }
        if (btnKeyPressed === "btn-read-gps") {
            startFetchIntervalGPS(urlDF);
        }

        if (btnKeyPressed === "btn-convert-utm") {
            convertLatLngToUtm();
        }

        if (btnKeyPressed === "btn-set-compass-offset") {
            setCompassOffset();
        }

        if (btnKeyPressed === "btn-save-coord-config") {
            saveCoord();
        }

        if (btnKeyPressed === "btn-restart") {
            restartDF(urlDF);
        }

        if (btnKeyPressed === "btn-turnoff") {
            turnOffDF(urlDF);
        }
        const button = document.getElementById(btnKeyPressed);
        if (button) {
            button.classList.add("active");
            setTimeout(() => { button.classList.remove("active") }, 1000);
        } else {
            console.error("Button element not found with ID:", btnKeyPressed);
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
const refreshBtn = document.getElementById("btn-refresh");

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
saveCoordBtn.addEventListener("click", async () => { saveCoord(); });
refreshBtn.addEventListener("click", () => { refreshStatus(urlDF) });



//Button focus
const parentButtons = document.querySelectorAll(".config-menu");

parentButtons.forEach(function (parentButton) {
    const buttons = parentButton.querySelectorAll("button");
    buttons.forEach(function (button) {
        button.addEventListener("focus", function (event) {
            btnKeyPressed = event.target.id;
        });

        button.addEventListener("blur", function (event) {
            btnKeyPressed = null;
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    refreshStatus(urlDF);
});

startFetchIntervalCompass(urlDF);
startFetchIntervalDF(urlDF);