/* eslint-disable no-undef, no-unused-vars */
const CANVA_X_LEFT = 20;
const CANVA_X_RIGHT = 600;
const CANVA_Y_UP = 100;
const CANVA_Y_DOWN = 500;

var points = [];
var rayPoints = [];
var isPolygonClosed = false;
var redLines = [];


/**
 * return true if the segment [ab] intersect the polygon
 * @param a
 * @param b
 * @returns {boolean}
 */
function isIntersectionInPolygon(a, b, start = 0) {
  //window.print(points.length);
  if (points.length >= 2){
    c = points[points.length - 2];
    if (isPointOfSegment(c, a, b) || isPointOfSegment(a, b, c)){
      redLines.push([c, a]);
      return true;
    }
  }

  for (const i in points) {
    if (i > start && i < points.length - 1) {
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
  if (!isIntersectionInPolygon(points[points.length-1], points[0], 1)) {
    isPolygonClosed = true;
  } else {
    redLines.push([points[points.length-1], points[0]]);
  }
}

/**
 * return true if the point p is in the polygon
 * @param p
 * @returns {boolean}
 */
function isPointInPolygone(p){
  oddIntersection = false;
  o = new Point(0, 0);
  for (const i in points) {
    if (i > 0 && i < points.length) {
      if (isIntersection(o, p, points[i - 1], points[i])) {
        oddIntersection = !oddIntersection;
      }
    }
  }
  if (isIntersection(o, p,points[points.length-1], points[0])) {
    oddIntersection = !oddIntersection;
  }
  return oddIntersection;
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
    drawLine(points[points.length-1], points[0]);
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
      if (isPointInPolygone(newPoint)){
        rayPoints.push(newPoint);
      }
    } else {
      if (
        points.length > 0 &&
        isIntersectionInPolygon(points[points.length-1], newPoint)
      ) {
        redLines.push([points[points.length-1], newPoint]);
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

/**
 *
 * @param p
 * @returns {boolean} true if a point p is in the canva
 */
function isInCanva(p) {
  return (
    CANVA_X_LEFT < p.x &&
    p.x < CANVA_X_RIGHT &&
    CANVA_Y_UP < p.y &&
    p.y < CANVA_Y_DOWN
  );
}
