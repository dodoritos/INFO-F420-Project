
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(p){
      return new Point(this.x + p.x, this.y + p.y);
    }

    toString(){
      return "(" + this.x + "," + this.y + ")";
    }
}
/**
 * @param {Point} a
 * @param {Point} b
 * @return {float} distance between a and b
 */
function distance(a, b){
    return sqrt((a.x-b.x)**2 + (a.y-b.y)**2);
}

function toVector(p1, p2){
  return new Point(p2.x - p1.x, p2.y - p1.y);
}

function computeIntersection(a, b, c, d){
  m = a.y - b.y;
  n = b.x - a.x;
  o = -(a.x*b.y - b.x*a.y);

  s = c.y - d.y;
  t = d.x - c.x;
  u = -(c.x*d.y - d.x*c.y);

  div = m*t - n*s;
  if (div == 0){
    return null;
  }
  return new Point((o*t - n*u)/div, (m*u - o*s)/div);
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
 * @param {Point} a
 * @param {Point} b
 * @param {Point} c
 * @return {boolean} true if the point c is on segement [ab]
 */
function isPointOfSegment(a, b, c) {
    return distance(a, c) + distance(c, b) == distance(a, b);
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
