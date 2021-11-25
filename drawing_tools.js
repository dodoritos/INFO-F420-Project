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

/**
 * draw an arrow for a vector at a given base position
 * source: https://p5js.org/reference/#/p5.Vector/rotate
 */
function drawArrow(canvas, base, vec, myColor) {
    canvas.push();
    canvas.stroke(myColor);
    canvas.strokeWeight(3);
    canvas.fill(myColor);
    canvas.translate(base.x, base.y);
    canvas.line(0, 0, vec.x, vec.y);
    canvas.rotate(vec.heading());
    let arrowSize = 7;
    canvas.translate(vec.mag() - arrowSize, 0);
    canvas.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    canvas.pop();
}

function drawAngle(canvas, base, vec, angle, myColor) {
    canvas.push();
    canvas.strokeWeight(2);
    canvas.noFill();
    canvas.stroke(myColor);
    canvas.translate(base.x, base.y);
    let vec_left = vec.copy().rotate(angle/2);
    let vec_right = vec.copy().rotate(-angle/2);
    canvas.line(0, 0, vec_left.x, vec_left.y);
    canvas.line(0, 0, vec_right.x, vec_right.y);
    canvas.arc(0,0,vec.mag()/5,vec.mag()/5,vec.heading()-(angle/2), vec.heading()+(angle/2));
    // canvas.arc(0,0,100, 100,10, 20);
    canvas.pop();
}