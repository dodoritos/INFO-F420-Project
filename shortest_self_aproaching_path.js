/* eslint-disable no-undef, no-unused-vars */
const CANVA_X_LEFT = 20;
const CANVA_X_RIGHT = 600;
const CANVA_Y_UP = 100;
const CANVA_Y_DOWN = 500;

var points = [];
var pointsInside = [];
var isPolygonClosed = false;
var redLines = [];
var blueLines = [];
var isConvex = [];


/**
 * return true if the segment [ab] intersect the polygon
 * @param a
 * @param b
 * @returns {boolean}
 */
function isIntersectionInPolygon(a, b, start = 0) {
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
  computeConvexList();
  let ear = findEar();
  blueLines.push([ear[0], ear[2]]);
}

/**
 * return true if the point p is in the polygon
 * @param p
 * @returns {boolean}
 */
function isPointInPolygone(p, poly){
  let oddIntersection = false;
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
 * @returns {int}
 */
function maxXPoint(){
  let res = 0;
  let maxi = points[0].x;
  for (i in points){
    if (points[i].x > maxi){
      maxi = points[i].x;
      res = i;
    }
  }
  return parseInt(res);
}

function getAnglePointsIndex(i){
  let p = []
  if (i == 0){
    p.push(points.length-1);
  }
  else{
    p.push(i-1);
  }

  p.push(i);

  if (i >= points.length-1){
    p.push(0);
  }
  else{
    p.push(i+1);
  }
  //console.log(p);
  return p;
}

function getAnglePoints(i){
  let indexs = getAnglePointsIndex(i);
  return [points[indexs[0]], points[indexs[1]], points[indexs[2]]];
}

function computeConvexList(){
  let before = [];
  let after = [];
  let start = maxXPoint();
  let i = start;

  let abc = getAnglePoints(start);
  let a = abc[0];
  let b = abc[1];
  let c = abc[2];
  let isLeftTurnCovex = isLeftTurn(a,b,c);

  while (i < points.length){
    abc = getAnglePoints(i);
    a = abc[0];
    b = abc[1];
    c = abc[2];
    after.push(isLeftTurn(a,b,c) == isLeftTurnCovex);
    i = i+1;
  }
  i = 0;
  while (i < start){
    abc = getAnglePoints(i);
    a = abc[0];
    b = abc[1];
    c = abc[2];
    before.push(isLeftTurn(a,b,c) == isLeftTurnCovex);
    i = i+1;
  }
  isConvex = before.concat(after);
}

/**
 * return one ear of the polygon
 * @returns {Array}
 */
function findEar(){
  let i = 0;
  while (true){
    if (isConvex[i]){
      let triangle = getAnglePoints(i);
      let triangleIndexs = getAnglePointsIndex(i);
      let triangleEmpty = true;
      let j = 0

      while (triangleEmpty && j < points.length){
        if (j !== parseInt(triangleIndexs[0]) && j !== parseInt(triangleIndexs[1]) && j !== parseInt(triangleIndexs[2])){
          triangleEmpty = ! isPointInPolygone(points[j], triangle);
        }
        j = j+1;
      }

      if (triangleEmpty){
        return triangle;
      }
    }
    i = i+1;
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

  if (blueLines.length > 0) {
    stroke("blue");
    for (const p in blueLines) {
      drawLine(blueLines[p][0], blueLines[p][1]);
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
  blueLines = [];
}
