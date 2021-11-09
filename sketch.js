/* eslint-disable no-undef, no-unused-vars */
const CANVA_X_LEFT = 20;
const CANVA_X_RIGHT = 600;
const CANVA_Y_UP = 100;
const CANVA_Y_DOWN = 500;

var points = [];
var rayPoints = [];
var isPolygonClosed = false;
var redLines = [];

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function isLeftTurn(a, b, c) {
  /*
    return true if if the point c turn to the left compared to the 2 others
    @param {Point} a, b, c
  */
  return a.x * (b.y - c.y) - a.y * (b.x - c.x) + b.x * c.y - b.y * c.x < 0;
}

function isLineCrossingSegment(a, b, c, d) {
  /* return true if the line a-b crosses the segemnt [cd] */
  return isLeftTurn(a, b, c) !== isLeftTurn(a, b, d);
}

function isRayCrossingSegment(a, b, c, d) {}

function isIntersection(a, b, c, d) {
  return isLineCrossingSegment(a, b, c, d) && isLineCrossingSegment(c, d, a, b);
}

function isIntersectionInPolygon(a, b) {
  /**
   * return true if the line a-b intersect the polygon
   */
  for (const i in points) {
    if (i > 1 && i < points.length - 1) {
      if (isIntersection(a, b, points[i - 1], points[i])) {
        redLines.push([points[i - 1], points[i]]);
        return true;
      }
    }
  }
  return false;
}

function closePolygon() {
  redLines = [];
  if (!isIntersectionInPolygon(points.at(-1), points.at(0))) {
    isPolygonClosed = true;
  } else {
    redLines.push([points.at(-1), points.at(0)]);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Put setup code here
}

function draw() {
  background(200);
  stroke("black");
  fill("white");

  buttonClear = createButton("Clear");
  buttonClear.position(30, 30);
  buttonClear.mousePressed(resetPoints);
  buttonClose = createButton("Close polygon");
  buttonClose.position(30, 60);
  buttonClose.mousePressed(closePolygon);

  rectMode(CORNERS);
  rect(CANVA_X_LEFT, CANVA_Y_UP, CANVA_X_RIGHT, CANVA_Y_DOWN);

  fill("black");
  for (i in points) {
    drawPoint(points[i]);
    if (i > 0) {
      drawLine(points[i - 1], points[i]);
    }
  }
  if (isPolygonClosed) {
    drawLine(points.at(-1), points.at(0));
  }
  if (redLines.length > 0) {
    stroke("red");
    for (const p in redLines) {
      drawLine(redLines[p][0], redLines[p][1]);
    }
  }

  if (rayPoints.length > 0) {
    stroke("green");
    drawPoint(rayPoints[0]);
    if (rayPoints.length > 1) {
      drawPoint(rayPoints[1]);
      drawRay(rayPoints[0], rayPoints[1]);
    }
  }
}

function mousePressed() {
  console.log(rayPoints.length);

  var newPoint = new Point(mouseX, mouseY);
  if (isInCanva(newPoint)) {
    redLines = [];
    if (isPolygonClosed) {
      rayPoints.push(newPoint);
    } else {
      if (
        points.length > 0 &&
        isIntersectionInPolygon(points.at(-1), newPoint)
      ) {
        redLines.push([points.at(-1), newPoint]);
      } else {
        points.push(newPoint);
      }
    }
  }
}

// This Redraws the Canvas when resized
windowResized = function () {
  resizeCanvas(windowWidth, windowHeight);
};

function resetPoints() {
  points = [];
  convexHullPoints = [];
  isPolygonClosed = false;
  redLines = [];
  rayPoints = [];
}

function drawPoint(point) {
  ellipse(point.x, point.y, 5, 5);
}

function drawLine(a, b) {
  /* draw a line between two points */
  line(a.x, a.y, b.x, b.y);
}

function drawRay(a, b) {
  /* draw a ray passing by two points */
  // using p5.js library for vectors operations
  var vect_a = new p5.Vector(a.x, a.y);
  var vect_b = new p5.Vector(b.x, b.y);
  let direction = p5.Vector.sub(vect_a, vect_b).setMag(500);
  vect_a = p5.Vector.add(vect_a, direction);
  vect_b = p5.Vector.sub(vect_b, direction);
  line(vect_a.x, vect_a.y, vect_b.x, vect_b.y);
}

function isInCanva(p) {
  /* return true if a point p is in the canva */
  return (
    CANVA_X_LEFT < p.x &&
    p.x < CANVA_X_RIGHT &&
    CANVA_Y_UP < p.y &&
    p.y < CANVA_Y_DOWN
  );
}
