/* eslint-disable no-undef, no-unused-vars */
const CANVA_X_LEFT = 20;
const CANVA_X_RIGHT = 600;
const CANVA_Y_UP = 100;
const CANVA_Y_DOWN = 500;

var points = [];
var pointsInside = [];
var isPolygonClosed = false;
var redLines = [];
var isConvex = [];


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
  if (points.length >= 2) {
    if (!isIntersectionInPolygon(points[points.length-1], points[0], 1)) {
      isPolygonClosed = true;
    } else {
      redLines.push([points[points.length-1], points[0]]);
    }
  }
}

/**
 * return true if the point p is in the polygon
 * @param p
 * @returns {boolean}
 */
function isPointInPolygone(p, poly){
  var oddIntersection = false;
  o = new Point(0, 0);
  for (const i in poly) {
    if (i > 0 && i < poly.length) {
      if (isIntersection(o, p, poly[i - 1], poly[i])) {
        oddIntersection = !oddIntersection;
      }
    }
  }
  if (isIntersection(o, p,poly[poly.length-1], poly[0])) {
    oddIntersection = !oddIntersection;
  }
  return oddIntersection;
}

/**
 * return the right-most point of the polygon.
 * @returns {Point}
 */
function maxXPoint(){
  var res = 0;
  var maxi = Points[0].x;
  for (const i in points){
    if (points[i].x > maxi){
      maxi = points[i].x;
      res = i;
    }
  }
  return res;
}

function getAnglePoints(i){
  var p = []
  if (i == 0){
    p.push(points[points.length-1]);
  }
  else{
    p.push(points[i-1]);
  }

  p.push(points[i]);

  if (i == points.length-1){
    p.push(points[0]);
  }
  else{
    p.push(points[i+1]);
  }
  return p;
}

function computeConvexList(){
  var before = [];
  var after = [];
  const start = maxXPoint();
  var i = start;

  var abc = getAnglePoints(start);
  let a = abc[0];
  let b = abc[1];
  let c = abc[2];

  var isLeftTurnCovex = isLeftTurn(a,b,c);

  while (i < points.length){
    abc = getAnglePoints(i);
    after.push(isLeftTurn(a,b,c) !== isLeftTurnCovex);
    i = i+1;
  }
  i = 0;
  while (i < start){
    abc = getAnglePoints(i);
    before.push(isLeftTurn(a,b,c) !== isLeftTurnCovex);
    i = i+1;
  }
  isConvex = before.concat(after);
}

/**
 * returnone ear of the polygon
 * @returns {Array}
 */
function findEar(){
  var i = 0;
  var found = false;
  while (!found){



  }
}

function setup() {
  var buttonClear = createButton("Clear");
  buttonClear.parent("canvas");
  buttonClear.mousePressed(resetPoints);

  var buttonClose = createButton("Close polygon");
  buttonClose.parent("canvas");
  buttonClose.mousePressed(closePolygon);

  createP('').parent("canvas"); // new line
  let canvas = createCanvas(400, 400);
  canvas.parent("canvas");
  canvas.mousePressed(addPoint);
}


function draw() {
  background(200);
  stroke("black");
  fill("white");

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

  if (pointsInside.length > 0) {
    stroke("green");
    drawPoint(pointsInside[0]);
    if (pointsInside.length > 1) {
      drawPoint(pointsInside[1]);
      drawLine(pointsInside[0], pointsInside[1]);
    }
  }
}

function addPoint() {

  var newPoint = new Point(mouseX, mouseY);
  redLines = [];
  if (isPolygonClosed) {
    if (isPointInPolygone(newPoint, points)){
      pointsInside.push(newPoint);
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


function resetPoints() {
  points = [];
  convexHullPoints = [];
  isPolygonClosed = false;
  redLines = [];
  pointsInside = [];
  isConvex = [];
}
