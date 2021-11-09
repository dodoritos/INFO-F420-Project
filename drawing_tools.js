/**
 * Draw a point
 * @param {Point} point
 */
function drawPoint(point) {
    ellipse(point.x, point.y, 5, 5);
}

/**
 * Draw a line between two points
 * @param {Point} a
 * @param {Point} b
 */
function drawLine(a, b) {
    line(a.x, a.y, b.x, b.y);
}

/**
 * Draw a ray passing by two points
 * @param {Point} a
 * @param {Point} b
 */
function drawRay(a, b) {
    // using p5.js library for vectors operations
    var vect_a = new p5.Vector(a.x, a.y);
    var vect_b = new p5.Vector(b.x, b.y);
    let direction = p5.Vector.sub(vect_a, vect_b).setMag(500);
    vect_a = p5.Vector.add(vect_a, direction);
    vect_b = p5.Vector.sub(vect_b, direction);
    line(vect_a.x, vect_a.y, vect_b.x, vect_b.y);
}