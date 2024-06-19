/*
    return values:
        1: a > b
        0: a === b
        -1: a < b
 */
function compareStringsWithNumbers(a, b) {
    const regex = /(\D+)(\d+)/;

    const matchA = a.match(regex);
    const matchB = b.match(regex);

    if (matchA && matchB) {
        const prefixA = matchA[1];
        const prefixB = matchB[1];
        const numberA = parseInt(matchA[2], 10);
        const numberB = parseInt(matchB[2], 10);

        if (prefixA === prefixB) {
            if (numberA < numberB) {
                return -1;
            } else if (numberA > numberB) {
                return 1;
            }

            return 0;
        } else {
            return prefixA < prefixB ? -1 : 1;
        }
    }

    return a < b ? -1 : 1;
}

module.exports = { compareStringsWithNumbers };