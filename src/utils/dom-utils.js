function getNextFocusElement(currentElement, id) {
    const focusableElements = getFocusableElementsWithinId(id);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
        return focusableElements[0];
    }
    return focusableElements[currentIndex + 1];
}

function getPrevFocusElement(currentElement, id) {
    const focusableElements = getFocusableElementsWithinId(id);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex === -1 || currentIndex === 0) {
        return focusableElements[focusableElements.length - 1];
    }
    return focusableElements[currentIndex - 1];
}

function getFocusableElementsWithinId(id) {
    const focusableElements = Array.from(document.querySelectorAll('#' + id + ' button, #' + id + ' [href], #' + id + ' input, #' + id + ' select, #' + id + ' textarea, #' + id + ' [tabindex]:not([tabindex="-1"])'));
    return focusableElements;
}

export { getNextFocusElement, getPrevFocusElement };