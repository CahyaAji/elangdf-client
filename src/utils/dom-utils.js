function getNextFocusElement(currentElement, id) {
    const focusableElements = getFocusableElementsWithinId(id);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
        return focusableElements[0];
    }

    const nextElement = focusableElements[currentIndex + 1];
    if (nextElement.tagName.toLowerCase() === 'input') {
        nextElement.blur();
    }

    return nextElement;
}

function getPrevFocusElement(currentElement, id) {
    const focusableElements = getFocusableElementsWithinId(id);
    const currentIndex = focusableElements.indexOf(currentElement);

    if (currentIndex === -1 || currentIndex === 0) {
        return focusableElements[focusableElements.length - 1];
    }
    const prevElement = focusableElements[currentIndex - 1];

    // Prevent the default behavior (opening the on-screen keyboard)
    if (prevElement.tagName.toLowerCase() === 'input') {
        prevElement.blur();
    }

    return prevElement;
}

function getFocusableElementsWithinId(id) {
    const focusableElements = Array.from(document.querySelectorAll('#' + id + ' button, #' + id + ' [href], #' + id + ' input, #' + id + ' select, #' + id + ' textarea, #' + id + ' [tabindex]:not([tabindex="-1"])'));
    return focusableElements;
}

export { getNextFocusElement, getPrevFocusElement };