function dmsToDecimal(dmsString) {
    // Regular expression to extract degrees, minutes, seconds, and direction
    const dmsRegex = /(-?\d+(?:\.\d+)?)[°](\d+(?:\.\d+)?)['′](\d+(?:\.\d+)?)(?:["″])?([NSEW])/i;
    const matches = dmsString.match(dmsRegex);

    if (!matches) {
        message(`Masukan Format Koordinat dengan benar\nContoh:\nLatitude: 6°10'31.36"S\nLongitude: 106°49'37.26"E`);
    }

    const degrees = parseFloat(matches[1]);
    const minutes = parseFloat(matches[2]);
    const seconds = parseFloat(matches[3]);
    const direction = matches[4];

    let decimalDegrees = degrees + minutes / 60 + seconds / 3600;

    if (direction === 'S' || direction === 'W') {
        decimalDegrees *= -1;
    }

    return decimalDegrees;
}

function decimalToDMS(decimal, isLatitude) {
    if (isNaN(decimal) || decimal < -180 || decimal > 180) {
        throw new Error('Invalid decimal degrees');
    }

    // Get the absolute value for the conversion
    const positiveDecimal = Math.abs(decimal);

    // Calculate degrees, minutes, and seconds
    const degrees = Math.floor(positiveDecimal);
    const minutesDecimal = (positiveDecimal - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = (minutesDecimal - minutes) * 60;

    let direction = '';
    if (isLatitude) {
        direction = decimal >= 0 ? 'N' : 'S';
    } else {
        direction = decimal >= 0 ? 'E' : 'W';
    }

    const dmsString = `${degrees}°${minutes}'${seconds.toFixed(2)}"${direction}`;

    return dmsString;
}

function isDmsRegexMatch(dmsString) {
    const dmsRegex = /(-?\d+(?:\.\d+)?)[°](\d+(?:\.\d+)?)['′](\d+(?:\.\d+)?)(?:["″])?([NSEW])/i;
    const matches = dmsString.match(dmsRegex);

    if (matches) {
        return true;
    } else {
        return false;
    }
}

export { dmsToDecimal, decimalToDMS, isDmsRegexMatch };