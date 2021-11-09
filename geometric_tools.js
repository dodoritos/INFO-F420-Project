
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @return {boolean} true if if the point c turn to the left compared to the 2 others
 */
function isLeftTurn(a, b, c) {
    return a.x * (b.y - c.y) - a.y * (b.x - c.x) + b.x * c.y - b.y * c.x < 0;
}


/**
 *
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @param {Point} d
 * @returns {boolean} true if the line a-b crosses the segemnt [cd]
 */
function isLineCrossingSegment(a, b, c, d) {
    return isLeftTurn(a, b, c) !== isLeftTurn(a, b, d);
}


/**
 *
 * @param a {Point}
 * @param b {Point}
 * @param c {Point}
 * @param d {Point}
 * @returns {boolean} true if there is an intersection between two segments a-b and c-d
 */
function isIntersection(a, b, c, d) {
    return isLineCrossingSegment(a, b, c, d) && isLineCrossingSegment(c, d, a, b);
}


/**
 *
 * @param a {Point}
 * @param b {Point}
 * @param c {Point}
 * @param d {Point}
 */
function isRayCrossingSegment(a, b, c, d) {

}
