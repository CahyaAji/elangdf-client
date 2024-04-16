import {
    setFreq,
    setLatLng,
    setStationId,
    turnOffDF,
    restartDF,
    refreshStatus,
    convertLatLngToUtm
} from "./handler.js"

const urlDF = "http://localhost:3000";

const spectrumWebv = document.getElementById("spectrum-webv");
const dfview = document.getElementById("df-view");
const setupMenu = document.querySelector(".setup-menu");
const dfRtlv = document.getElementById("rltv");

let btnKeyPressed = "";


function getNextFocusElement(currentElement) {
    const focusableElements = getFocusableElementsWithinClass("setup-menu");
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
        return focusableElements[0];
    }
    return focusableElements[currentIndex + 1];
}

function getPrevFocusElement(currentElement) {
    const focusableElements = getFocusableElementsWithinClass("setup-menu");
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex === -1 || currentIndex === 0) {
        return focusableElements[focusableElements.length - 1];
    }
    return focusableElements[currentIndex - 1];
}

function getFocusableElementsWithinClass(className) {
    const focusableElements = Array.from(document.querySelectorAll('.' + className + ' button, .' + className + ' [href], .' + className + ' input, .' + className + ' select, .' + className + ' textarea, .' + className + ' [tabindex]:not([tabindex="-1"])'));
    return focusableElements;
}


//button focus
const parent = document.querySelector('.setup-menu');
const buttons = parent.querySelectorAll('button');
buttons.forEach(function (button) {
    button.addEventListener("focus", function (event) {
        btnKeyPressed = event.target.id;
    });

    button.addEventListener("blur", function (event) {
        btnKeyPressed = "";
    });
});

//button pressed
const setFreqGainBtn = document.getElementById("btn-set-freq-gain");
const setStationBtn = document.getElementById("btn-set-station-id");
const latlngToUtmBtn = document.getElementById("btn-convert-utm");
const restartBtn = document.getElementById("btn-restart");
const turnOffBtn = document.getElementById("btn-turnoff");

setFreqGainBtn.addEventListener("click", () => { setFreq(urlDF); });
setStationBtn.addEventListener("click", () => { setStationId(urlDF); });
latlngToUtmBtn.addEventListener("click", () => { convertLatLngToUtm(); });
restartBtn.addEventListener("click", () => { restartDF(urlDF); });
turnOffBtn.addEventListener("click", () => { convertLatLngToUtm(); });

//keyboard shortcut
document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        const focusElement = document.activeElement;
        if (focusElement.tagName === "INPUT") {
            event.preventDefault();
        }
    }

    if (event.ctrlKey && event.key === 'l') {
        if (btnKeyPressed === "btn-set-freq-gain") {
            setFreq(urlDF);
        }
        if (btnKeyPressed === "btn-set-station-id") {
            setStationId(urlDF);
        }
        if (btnKeyPressed === "btn-set-latlng") {
            setLatLng(urlDF);
        }

        if (btnKeyPressed === "btn-restart") {
            restartDF(urlDF);
        }

        if (btnKeyPressed === "btn-turnoff") {
            turnOffDF(urlDF);
        }
        // document.activeElement.blur();
    }

    if (event.ctrlKey && event.key === 'h') {
        refreshStatus(urlDF);
    }

    if (event.ctrlKey && event.key === 'j') {
        const focusedElement = document.activeElement;
        const prevElement = getPrevFocusElement(focusedElement);
        if (prevElement) {
            prevElement.focus();
        }
    }

    if (event.ctrlKey && event.key === 'k') {
        const focusedElement = document.activeElement;
        const nextElement = getNextFocusElement(focusedElement);
        if (nextElement) {
            nextElement.focus();
        }
    }

    if (event.ctrlKey && event.key === 'w') {
        spectrumWebv.style.display = "none";
        dfview.style.display = "flex";
        spectrumWebv.src = "";
        setupMenu.style.display = "flex";
        dfRtlv.style.display = "none";
    }
    if (event.ctrlKey && event.key === 'e') {
        spectrumWebv.style.display = "none";
        dfview.style.display = "flex";
        spectrumWebv.src = "";
        setupMenu.style.display = "none";
        dfRtlv.style.display = "flex";
    }
    if (event.ctrlKey && event.key === 'r') {
        spectrumWebv.style.display = "flex";
        dfview.style.display = "none";
        spectrumWebv.src = urlDF + "/spectrum";
    }
});



