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
const spectrumView = document.getElementById("spectrum-container");
const dfview = document.getElementById("df-view");
const freqMenu = document.getElementById("freq-menu");
const compassMenu = document.getElementById("compass-menu");
const dfAbsv = document.getElementById("dfabsview");
const statusWebview = document.getElementById("df-status-webv");

const btnShowDF = document.getElementById("btn-show-df");
const btnShowSetting = document.getElementById("btn-show-setting");
const btnShowLocation = document.getElementById("btn-show-location");
const btnShowSpectrum = document.getElementById("btn-show-spectrum");

//keyboard shortcut
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const focusElement = document.activeElement;
        if (focusElement.tagName === "INPUT") {
            event.preventDefault();
        }
    }

    // refresh
    if (event.ctrlKey && event.key === 'l') {
        if (currentView === 'q') {
            statusWebview.src = "";
            spectrumView.style.display = "flex";
            spectrumWebv.src = urlDF + "/spectrum";
            dfview.style.display = "none";
            dfAbsv.style.display = "none";
            freqMenu.style.display = "none";
            compassMenu.style.display = "none";
        } else {
            refreshStatus(urlDF);
        }
    }

    //df View
    if (event.ctrlKey && event.key === 'r') {

        if(currentView === 'r') {
            return
        }

        statusWebview.src = urlDF + "/config";
        spectrumView.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "flex";
        freqMenu.style.display = "none";
        compassMenu.style.display = "none";
        
        btnShowDF.style.backgroundColor = "red";
        btnShowSetting.style.backgroundColor = "var(--bg-color)";
        btnShowLocation.style.backgroundColor = "var(--bg-color)";
        btnShowSpectrum.style.backgroundColor = "var(--bg-color)";

        currentView = 'r';
    }

    //setting freq
    if (event.ctrlKey && event.key === 'e') {

        if(currentView === 'e') {
            return
        }

        statusWebview.src = urlDF + "/config";
        spectrumView.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "flex";
        compassMenu.style.display = "none";

        btnShowDF.style.backgroundColor = "var(--bg-color)";
        btnShowSetting.style.backgroundColor = "red";
        btnShowLocation.style.backgroundColor = "var(--bg-color)";
        btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
        

        currentView = 'e';
    }

    // location menu
    if (event.ctrlKey && event.key === 'w') {
        if(currentView === 'w') {
            return
        }

        statusWebview.src = urlDF + "/config";
        spectrumView.style.display = "none";
        spectrumWebv.src = "";
        dfview.style.display = "flex";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "none";
        compassMenu.style.display = "flex";

        btnShowDF.style.backgroundColor = "var(--bg-color)";
        btnShowSetting.style.backgroundColor = "var(--bg-color)";
        btnShowLocation.style.backgroundColor = "red";
        btnShowSpectrum.style.backgroundColor = "var(--bg-color)";

        currentView = 'w';
    }

    // spectrum view
    if (event.ctrlKey && event.key === 'q') {

        if(currentView === 'q') {
            return
        }

        statusWebview.src = "";
        spectrumView.style.display = "flex";
        spectrumWebv.src = urlDF + "/spectrum";
        dfview.style.display = "none";
        dfAbsv.style.display = "none";
        freqMenu.style.display = "none";
        compassMenu.style.display = "none";

        btnShowDF.style.backgroundColor = "var(--bg-color)";
        btnShowSetting.style.backgroundColor = "var(--bg-color)";
        btnShowLocation.style.backgroundColor = "var(--bg-color)";
        btnShowSpectrum.style.backgroundColor = "red";

        currentView = 'q';
    }

    // UP button
    if (event.ctrlKey && event.key === 'k') {
        const focusedElement = document.activeElement;
        let id = '';

        if (currentView === 'e') {
            id = "freq-menu";
        }

        if (currentView === 'w') {
            id = "compass-menu";
        }
        const prevElement = getPrevFocusElement(focusedElement, id);
        if (prevElement) {
            prevElement.focus();
        }
    }

    if (event.ctrlKey && event.key === 'j') {
        const focusedElement = document.activeElement;
        let id = '';

        if (currentView === 'e') {
            id = "freq-menu";
        }

        if (currentView === 'w') {
            id = "compass-menu";
        }

        const nextElement = getNextFocusElement(focusedElement, id);
        if (nextElement) {
            nextElement.focus();
        }
    }

    if (event.ctrlKey && event.key === 'h') {
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

// Detect touch events
document.addEventListener('touchstart', function(event) {
    // Check if the touch event target is an input field or textarea
    if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') {
        // Prevent the default behavior (showing on-screen keyboard)
        event.preventDefault();
        // Blur the input field to remove focus
        event.target.blur();
    }
}, { passive: false }); // Make sure to set passive to false to prevent default

// For some browsers, touchmove events may also need to be handled
document.addEventListener('touchmove', function(event) {
    if (event.target.nodeName === 'INPUT' || event.target.nodeName === 'TEXTAREA') {
        event.preventDefault();
        event.target.blur();
    }
}, { passive: false });



document.addEventListener('DOMContentLoaded', () => {
    refreshStatus(urlDF);
    // statusWebview.src = urlDF + "/config";
    spectrumView.style.display = "none";
    spectrumWebv.src = "";
    dfview.style.display = "flex";
    dfAbsv.style.display = "flex";
    freqMenu.style.display = "none";
    compassMenu.style.display = "none";

    btnShowDF.style.backgroundColor = "red";

    currentView = 'r';
});

startFetchIntervalCompass(urlDF);
startFetchIntervalDF(urlDF);