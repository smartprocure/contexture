function log10(number) {
    return Math.log(number) / Math.log(10);
}
function calcSmartInterval(min, max) {
    let range = Math.max(Math.round(max - min), 1);
    // 1 order of magnitude less and at least 1
    let interval = Math.max(Math.pow(10, (Math.floor(log10(range)) - 1)), 1);

    // Increase interval by a multiple depending on the highest digit
    let highestDigit = parseInt(range.toString()[0], 10);

    if (highestDigit <= 1)      interval *= 1;
    else if (highestDigit <= 5) interval *= 2.5;
    else if (highestDigit <= 9) interval *= 5;

    return Math.floor(interval);
}

module.exports = {
    log10,
    calcSmartInterval
};