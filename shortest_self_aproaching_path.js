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
var orangeLines = [];
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
  isConvex = computeConvexList(points);
  let tr = triangulate(points);
  spt = shortestPathTree(points, 0);
  console.log(spt);
  showSPT(spt);
}

function showSPT(spt){
  for (const i in spt.childs){
    blueLines.push([spt.childs[i].label, spt.label]);
    showSPT(spt.childs[i]);
  }
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
 * @param poly The polygone
 * @returns {int}
 */
function maxXPoint(poly){
  let res = 0;
  let maxi = poly[0].x;
  for (i in poly){
    if (poly[i].x > maxi){
      maxi = poly[i].x;
      res = i;
    }
  }
  return parseInt(res);
}

function getAnglePointsIndex(i, poly){
  let p = []
  if (i == 0){
    p.push(poly.length-1);
  }
  else{
    p.push(i-1);
  }

  p.push(i);

  if (i >= poly.length-1){
    p.push(0);
  }
  else{
    p.push(i+1);
  }
  //console.log(p);
  return p;
}

function getAnglePoints(i, poly){
  let indexs = getAnglePointsIndex(i, poly);
  return [poly[indexs[0]], poly[indexs[1]], poly[indexs[2]]];
}


function computeConvexList(poly){
  let before = [];
  let after = [];
  let start = maxXPoint(poly);
  let i = start;

  let abc = getAnglePoints(start, poly);
  let a = abc[0];
  let b = abc[1];
  let c = abc[2];
  let isLeftTurnCovex = isLeftTurn(a,b,c);

  while (i < poly.length){
    abc = getAnglePoints(i, poly);
    a = abc[0];
    b = abc[1];
    c = abc[2];
    after.push(isLeftTurn(a,b,c) == isLeftTurnCovex);
    i = i+1;
  }
  i = 0;
  while (i < start){
    abc = getAnglePoints(i, poly);
    a = abc[0];
    b = abc[1];
    c = abc[2];
    before.push(isLeftTurn(a,b,c) == isLeftTurnCovex);
    i = i+1;
  }
  return before.concat(after);
}

function computeFlatList(poly){
  let res = [];
  let i = 0;

  while (i < poly.length){
    abc = getAnglePoints(i, poly);
    a = abc[0];
    b = abc[1];
    c = abc[2];
    res.push(isPointOfSegment(a,c,b));
    i = i+1;
  }
  return res;
}

/**
 * return one ear of the polygon
 * @returns {Array}
 */
function findEar(poly, convex){
  let i = 0;
  while (true){
    if (convex[i]){
      let triangle = getAnglePoints(i, poly);
      let triangleIndexs = getAnglePointsIndex(i, poly);
      let triangleEmpty = true;
      let j = 0

      while (triangleEmpty && j < poly.length){
        if (j !== parseInt(triangleIndexs[0]) && j !== parseInt(triangleIndexs[1]) && j !== parseInt(triangleIndexs[2])){
          triangleEmpty = ! isPointInPolygone(poly[j], triangle);
        }
        j = j+1;
      }

      if (triangleEmpty){
        return triangleIndexs;
      }
    }
    i = i+1;
  }
}

function triangulate(polygone){
  res = {};
  res["all"] = [];
  let poly = [];
  for (const i in polygone){
    poly.push(polygone[i]);
  }

  while (poly.length >= 3){
    let convex = computeConvexList(poly);
    let ear = findEar(poly, convex);
    //orangeLines.push([poly[ear[0]], poly[ear[2]]]);
    let triangle = new Triangle(poly[ear[0]], poly[ear[1]], poly[ear[2]]);
    res["all"].push(triangle);
    let edges = triangle.getEdgesPermutaions();
    for (const i in edges){
      let neighbor = res[edges[i]];
      if (neighbor == null){
        res[edges[i]] = triangle;
      }
      else{
        triangle.setNeighbor(edges[i][0], edges[i][1], neighbor);
      }
    }
    poly.splice(ear[1],1);
  }

  //if (poly == 3){
  //  res["all"].push(new Triangle(poly[0], poly[1], poly[2]));
  //}

  return res;
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
  if (orangeLines.length > 0) {
    stroke("orange");
    for (const p in orangeLines) {
      drawLine(orangeLines[p][0], orangeLines[p][1]);
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
