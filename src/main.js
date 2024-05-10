import {
  setFreq,
  setLatLng,
  setStationId,
  turnOffDF,
  restartDF,
  refreshStatus,
  convertLatLngToUtm,
  setCompassOffset,
  saveCoord,
} from "./handler/handler.js";
import { getNextFocusElement, getPrevFocusElement } from "./utils/dom-utils.js";
import {
  startFetchIntervalGPS,
  startFetchIntervalCompass,
  startFetchIntervalDF,
} from "./handler/interval_req_handler.js";

// const urlDF = "http://10.42.0.52:8087";
const urlDF = "http://192.168.17.17:8087";

let btnKeyPressed = "";
let currentView = "w";

const spectrumWebv = document.getElementById("spectrum-webv");
const spectrumView = document.getElementById("spectrum-container");
const dfview = document.getElementById("df-view");
const freqMenu = document.getElementById("freq-menu");
const compassMenu = document.getElementById("compass-menu");
const dfAbsv = document.getElementById("dfabsview");
const dfRltv = document.getElementById("dfrltview");
const statusWebview = document.getElementById("df-status-webv");

const btnShowDF = document.getElementById("btn-show-df");
const btnShowSetting = document.getElementById("btn-show-setting");
const btnShowLocation = document.getElementById("btn-show-location");
const btnShowSpectrum = document.getElementById("btn-show-spectrum");

const btnUp = document.getElementById("btn-menu-up");
const btnDown = document.getElementById("btn-menu-down");
const btnOk = document.getElementById("btn-menu-ok");
const btnRefresh = document.getElementById("btn-refresh-side");

function setDisplayDF() {
  const dfViewMode = document.getElementById("df-view-mode").value;

  statusWebview.src = urlDF + "/config";
  spectrumView.style.display = "none";
  spectrumWebv.src = "";
  dfview.style.display = "flex";

  if (dfViewMode === "0") {
    dfRltv.style.display = "none";
    dfAbsv.style.display = "flex";
  } else {
    dfAbsv.style.display = "none";
    dfRltv.style.display = "flex";
  }

  freqMenu.style.display = "none";
  compassMenu.style.display = "none";

  btnShowDF.style.backgroundColor = "red";
  btnShowSetting.style.backgroundColor = "var(--bg-color)";
  btnShowLocation.style.backgroundColor = "var(--bg-color)";
  btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
}

function setDisplaySettingFreq() {
  statusWebview.src = urlDF + "/config";
  spectrumView.style.display = "none";
  spectrumWebv.src = "";
  dfview.style.display = "flex";
  dfAbsv.style.display = "none";
  dfRltv.style.display = "none";
  freqMenu.style.display = "flex";
  compassMenu.style.display = "none";

  btnShowDF.style.backgroundColor = "var(--bg-color)";
  btnShowSetting.style.backgroundColor = "red";
  btnShowLocation.style.backgroundColor = "var(--bg-color)";
  btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
}

function setDisplayLocation() {
  statusWebview.src = urlDF + "/config";
  spectrumView.style.display = "none";
  spectrumWebv.src = "";
  dfview.style.display = "flex";
  dfAbsv.style.display = "none";
  dfRltv.style.display = "none";
  freqMenu.style.display = "none";
  compassMenu.style.display = "flex";

  btnShowDF.style.backgroundColor = "var(--bg-color)";
  btnShowSetting.style.backgroundColor = "var(--bg-color)";
  btnShowLocation.style.backgroundColor = "red";
  btnShowSpectrum.style.backgroundColor = "var(--bg-color)";
}

function setDisplaySpectrum() {
  statusWebview.src = "";
  spectrumView.style.display = "flex";
  spectrumWebv.src = urlDF + "/spectrum";
  dfview.style.display = "none";
  dfAbsv.style.display = "none";
  dfRltv.style.display = "none";
  freqMenu.style.display = "none";
  compassMenu.style.display = "none";

  btnShowDF.style.backgroundColor = "var(--bg-color)";
  btnShowSetting.style.backgroundColor = "var(--bg-color)";
  btnShowLocation.style.backgroundColor = "var(--bg-color)";
  btnShowSpectrum.style.backgroundColor = "red";
}

function nextMenu() {
  const focusedElement = document.activeElement;
  let id = "";

  if (currentView === "e") {
    id = "freq-menu";
  }

  if (currentView === "w") {
    id = "compass-menu";
  }

  const nextElement = getNextFocusElement(focusedElement, id);
  if (nextElement) {
    nextElement.focus();
  }
}

function prevMenu() {
  const focusedElement = document.activeElement;
  let id = "";

  if (currentView === "e") {
    id = "freq-menu";
  }

  if (currentView === "w") {
    id = "compass-menu";
  }
  const prevElement = getPrevFocusElement(focusedElement, id);
  if (prevElement) {
    prevElement.focus();
  }
}

function okMenu() {
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
    setTimeout(() => {
      button.classList.remove("active");
    }, 1000);
  } else {
    console.error("Button element not found with ID:", btnKeyPressed);
  }
}

//keyboard shortcut
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    const focusElement = document.activeElement;
    if (focusElement.tagName === "INPUT") {
      event.preventDefault();
    }
  }

  // refresh
  if (event.ctrlKey && (event.key === "l" || event.key === "L")) {
    if (currentView === "q") {
      setDisplaySpectrum();
    } else {
      refreshStatus(urlDF);
    }
  }

  //df View
  if (event.ctrlKey && (event.key === "r" || event.key === "R")) {
    if (currentView === "r") {
      return;
    }
    setDisplayDF();
    currentView = "r";
  }

  //setting freq
  if (event.ctrlKey && (event.key === "e" || event.key === "E")) {
    if (currentView === "e") {
      return;
    }
    setDisplaySettingFreq();
    currentView = "e";
  }

  // location menu
  if (event.ctrlKey && (event.key === "w" || event.key === "W")) {
    if (currentView === "w") {
      return;
    }
    setDisplayLocation();
    currentView = "w";
  }

  // spectrum view
  if (event.ctrlKey && (event.key === "q" || event.key === "Q")) {
    if (currentView === "q") {
      return;
    }
    setDisplaySpectrum();
    currentView = "q";
  }

  // UP button
  if (event.ctrlKey && (event.key === "k" || event.key === "K")) {
    prevMenu();
  }

  //down button
  if (event.ctrlKey && (event.key === "j" || event.key === "J")) {
    nextMenu();
  }

  if (event.ctrlKey && (event.key === "h" || event.key === "H")) {
    okMenu();
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

setFreqGainBtn.addEventListener("click", () => {
  setFreq(urlDF);
});
setStationBtn.addEventListener("click", () => {
  setStationId(urlDF);
});
restartBtn.addEventListener("click", () => {
  restartDF(urlDF);
});
turnOffBtn.addEventListener("click", () => {
  turnOffDF(urlDF);
});
latlngToUtmBtn.addEventListener("click", () => {
  convertLatLngToUtm();
});
// 4°15'2.08"S
// 138°21'34.33"E
readGpsBtn.addEventListener("click", () => {
  startFetchIntervalGPS(urlDF);
});
// saveLatlngBtn.addEventListener("click", () => { setLatLng(urlDF) });
setCmpsOffsBtn.addEventListener("click", () => {
  setCompassOffset();
});
saveCoordBtn.addEventListener("click", async () => {
  saveCoord();
});
refreshBtn.addEventListener("click", () => {
  refreshStatus(urlDF);
});

//Button focus
const parentButtons = document.querySelectorAll(".config-menu");

parentButtons.forEach(function (parentButton) {
  const buttons = parentButton.querySelectorAll("button");
  buttons.forEach(function (button) {
    button.addEventListener("focus", function (event) {
      btnKeyPressed = event.target.id;
    });

    button.addEventListener("blur", function (_event) {
      btnKeyPressed = null;
    });
  });
});

//Side Buttons
btnShowDF.addEventListener("click", () => {
  if (currentView === "r") {
    return;
  }
  setDisplayDF();
  currentView = "r";
});
btnShowSetting.addEventListener("click", () => {
  if (currentView === "e") {
    return;
  }
  setDisplaySettingFreq();
  currentView = "e";
});
btnShowLocation.addEventListener("click", () => {
  if (currentView === "w") {
    return;
  }
  setDisplayLocation();
  currentView = "w";
});
btnShowSpectrum.addEventListener("click", () => {
  if (currentView === "q") {
    return;
  }
  setDisplaySpectrum();
  currentView = "q";
});
btnRefresh.addEventListener("click", () => {
  if (currentView === "q") {
    setDisplaySpectrum();
  } else {
    refreshStatus(urlDF);
  }
});
btnUp.addEventListener("mousedown", (event) => {
  event.preventDefault();
  prevMenu();
  console.log("prev");
});
btnDown.addEventListener("mousedown", (event) => {
  event.preventDefault();
  nextMenu();
  console.log("next");
});
btnOk.addEventListener("mousedown", (event) => {
  event.preventDefault();
  okMenu();
  console.log("ok");
});

document.addEventListener("DOMContentLoaded", () => {
  setDisplayDF();
  refreshStatus(urlDF);
  currentView = "r";
});

startFetchIntervalCompass(urlDF);
startFetchIntervalDF(urlDF);
