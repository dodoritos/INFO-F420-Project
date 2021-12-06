/* eslint-disable no-undef, no-unused-vars */
const CANVA_X_LEFT = 20;
const CANVA_X_RIGHT = 600;
const CANVA_Y_UP = 100;
const CANVA_Y_DOWN = 500;

var canvas;

var points = [];
var pointsInside = [];
var isPolygonClosed = false;
var redLines = [];
var blueLines = [];
var orangeLines = [];
var isConvex = [];
var path = [];

class CyclicSpace{
  constructor(bound1, bound2){
    if (bound1 < bound2){
      this.l = bound1;
      this.h = bound2;
    }
    else{
      this.l = bound2;
      this.h = bound1;
    }
  }

  doesContain(v){
    return this.l < v && v < this.h;
  }

  isBetween(start, end, v, decrease = false){
    let d = decrease ? -1 : 1;

    if (start*d < end*d){
      return start*d < v*d && v*d < end*d; // no loop case
    }
    else{
      return start*d < v*d || v*d < end*d;
    }
  }
}

class PathPart{
  constructor(start, end, eq = null){
    this.start = start;
    this.end = end;
    this.eq = eq;
    this.redZone = null;
    this.computeRedZone(start);
  }
  copy(){
    return new PathPart(this.start, this.end, this.eq);
  }
  getCenter(){
    if(this.eq == null) return null;
    if(this.eq.getType() == "circle") return this.eq.range;
    else return this.eq.circle.range;
  }
  computeRedZone(p){
    if(this.eq == null){ // line
      this.redZone = new CircleEq(distance(this.start, p), createVector(this.start.x, this.start.y));
    }
    else if(this.eq.getType() == "circle"){
      this.eq.range = distance(this.start, p);
      this.redZone = new InvoluteOfCircle(this.eq, lineAngle(start, this.eq.center));
    }
    else if(this.eq.getType() == "Involute1"){
      this.eq.circle.range = distance(this.start, p);
      this.redZone = new InvoluteOfCircle(this.eq.circle, lineAngle(start, this.eq.circle.center));
    }
    else if(this.eq.getType() == "Involute2"){
      //should be done for Involute k and do k+1;
      console.log("Involute of order higher than 2 not implemented");
    }

  }
  isPointInRedZone(p){
    return this.redZone.isPointInside(p);
  }
  getTangentFrom(p){
    if (this.eq == null){
      return null;
    }
    else{
      let c = this.getCenter();
      let t = this.eq.get_tangent_from_point(p, lineAngle(this.start, c), lineAngle(this.end, c));
      if (t == null) return null;
      return [this.eq.get_point(t), p];
    }
  }

  draw(){
    if (this.eq == null){
      orangeLines.push([this.start, this.end]);
    }
    else if(this.eq.getType() == "circle"){
      this.eq.draw(canvas, lineAngle(this.start, this.eq.center), lineAngle(this.end, this.eq.center), false);
    }
    else{
      this.eq.draw(canvas, lineAngle(this.start, this.eq.circle.center), lineAngle(this.end, this.eq.circle.center), false);
    }
  }
}

function isPointInsidePathCH(p, prev) {
  for (const i in path){
    path[i].computeRedZone(prev);
    if (path[i].isPointInRedZone(p)){
      return true;
    }
  }
  return false
}

function rayShoot(p, end, poly, searchLine = false){
  let best = null;
  let bestDist = null;
  for (const i in poly){
    let j = parseInt(i) - 1;
    if (j == -1){
      j = poly.length-1;
    }
    if (isLineCrossingSegment(p, end, poly[i], poly[j])){
      let intersection = computeIntersection(p, end, poly[i], poly[j]);
      let dist = distance(p, intersection);
      if((bestDist == null || bestDist > dist) && !isPointOfSegment(p, intersection, end)){
        if (searchLine){
          best = [j,i];
        }
        else{
          best = intersection;
        }
        bestDist = dist;
      }
    }
  }
  return res;
}

function chains(geodesic, poly){
  let a = rayShoot(geodesic[0], geodesic[1], poly, true);
  let b = rayShoot(geodesic[geodesic.length-1], geodesic[geodesic.length-2], poly, true);
  let lChain = [];
  let rChain = [];
  let i = b[1];
  while(i !== a[1]){
    lChain.push(poly[i]);
    i += 1;
    if (i = poly.length){
      i = 0;
    }
  }
  while(i !== b[1]){
    rChain.push(poly[i]);
    i += 1;
    if (i = poly.length){
      i = 0;
    }
  }
  return [lChain, rChain];
}


function shortestSelfApprochingPath(poly, geodesic, triangles=null){
  let lrChains = chains(geodesic, poly);
  let lChain = lrChains[0];
  let rChain = lrChains[1];
  let current = geodesic.pop();
  let next = geodesic.pop();
  let isLChain = lChain.indexOf(current) !== -1;
  path.push(new PathPart(current, next));

  while (geodesic.length > 0){
    current = next;
    isLChain = lChain.indexOf(current) !== -1;
    next = geodesic.pop();
    let direct = true;
    console.log(next);
    while (isPointInsidePathCH(next, current)){
      direct = false;
      if (geodesic.length == 0){
        console.log("no available path");
        return null;
      }
      next = geodesic.pop();
      console.log(next);
    }

    if (direct){
      path.push(new PathPart(current, next));
    }
    else{
      console.log("todo");
    }
    for (const i in path){
      path[i].draw();
    }


  }
}

function intersectCH(p1, p2, ch){
  for (const i in ch){
    if (ch[i].intesect(p1, p2)) return true;
  }
  return false;
}

/**
 * high possibility of bug
 *@param part A PathPart the tangents should touch
 *@param ch The convex hull
 *@return [[pointCW from CH, pointCW from part], [pointCCW from CH, pointCCW from part], partCW, partCCW]
 *        partCCW is null if lineCCW[0] == lineCCW[1] and partCW is null if lineCW[0] == lineCW[1]
 */
function tangantToCHFrom(part, ch){
  let res = [null, null, null, null];
  let i = 0;
  let cwNotFound = true;
  let pPart;
  while (i < ch.length && cwNotFound){
    pPart = part.getTangentFrom(ch[i].end);
    if (pPart == null){
      pPart = part.end;
    }
    cwNotFound = !intersectCH(pPart, ch[i].end, ch);
    i += 1;
  }

  res[0] = [ch[i-1].end, pPart];
  res[2] = ch[i-1];


  let cwwNotFound = true;
  while (i < ch.length && cwwNotFound){
    pPart = part.getTangentFrom(ch[i].end);
    if (pPart == null){
      pPart = part.end;
    }
    cwwNotFound = intersectCH(pPart, ch[i].end, ch);
    i += 1;
  }

  res[1] = [ch[i-1].end, pPart];
  if (ch[i-1].end == part.start) res[3] = ch[i-1];

  return res;
}

/*function tangantToCHFrom(part, ch){
  let endTan = [];
  for (const i in ch){
    if (ch[i].eq == null){// line
      let intersectS = false;
      let intersectE = false;
      for (const j in ch){
        if (ch[j].intesect(part.end, ch[i].start)) intersectS = true;
        if (ch[j].intesect(part.end, ch[i].end)) intersectE = true;
      }
      if (!intersectS) endTan.push([ch[i].start, ch[i]]);
      if (!intersectE) endTan.push([ch[i].end, ch[i]]);
    }
    else{
      let tanI = ch[i].getTangentFrom(part.end);
      for (const j in tanI){
        endTan.push([tanI[j], ch[i]]);
      }
    }
  }

  //endTan should have size 2
  if (part.eq == null){
    for (const i in ch){
      if (ch[i].eq == null){// line
        let ts = part.getTangentFrom(ch[i].start);
        let te = part.getTangentFrom(ch[i].end);
        let intersectS = ts.length == 0;
        let intersectE = te.length == 0;
        for (const j in ch){
          if ((!intersectS) && ch[j].intesect(ts[0][0], ch[i].start)) intersectS = true;
          if ((!intersectE) && ch[j].intesect(te[0][0], ch[i].end)) intersectE = true;
        }
        if (!intersectS) endTan.push([ch[i].start, ch[i]]);
        if (!intersectE) endTan.push([ch[i].end, ch[i]]);
      }
      else{
        let tanI = part.commonTangent(ch[i]);
        for (const j in tanI){
          endTan.push([tanI[j], ch[i]]);
        }
      }
    }
  }
  //endTan should have size 3 or 2

  let res = [null, null, null, null];
  if (endTan.length == 2){
    res[0] = endTan[0][0];
    res[2] = endTan[0][1];
  }
  else if (endTan.length == 3) {
    res[0] = endTan[2][0];
    res[0] = endTan[2][1];
  }
  res[1] = endTan[1][0];
  res[3] = endTan[1][1];

  return res;
}*/

function maintainCH(ch, newPart){
  //CW  : from 0 to newPart.length
  //CCW : from newPart.length to 0
  newPart = newPart.copy();
  let parts = tangantToCHFrom(newPart, ch, true);
  let lineCW = parts[0];
  let lineCCW = parts[1];
  let partCW = parts[2];
  let partCCW = parts[3];

  //delete newly covered part
  let i = ch.length - 1;
  while (partCCW !== null && ch[i] !== partCCW){
    i -= 1;
  }
  let j = 0;
  while (partCW !== null && ch[j] !== partCW){
    j += 1;
  }
  ch = ch.slice(j, i+1);

  //close polygon with newPart
  if (partCW !== null){
    ch[0].start = lineCW[0];
    ch = [new PathPart(lineCW[1], lineCW[0])].concat(ch);
  }
  if (partCCW !== null){
    ch[ch.length - 1].end = lineCCW[0];
    ch.push(new PathPart(lineCCW[0], lineCCW[1]));
  }

  newPart.start = lineCCW[1];
  newPart.end = lineCW[1];
  ch.push(newPart);

  return ch;
}



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
//    if (poly.length > 3){
//      orangeLines.push([poly[ear[0]], poly[ear[2]]]);
//    }
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
  canvas = createCanvas(400, 400);
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
    console.log(orangeLines);
    for (const p in orangeLines) {
      drawLine(orangeLines[p][0], orangeLines[p][1]);
    }
  }

  if (pointsInside.length > 0) {
    stroke("green");
    drawPoint(pointsInside[0]);
    if (pointsInside.length > 1) {
      drawPoint(pointsInside[1]);
      //drawLine(pointsInside[0], pointsInside[1]);
    }
  }
}

function addPoint() {

  var newPoint = new Point(mouseX, mouseY);
  redLines = [];
  if (isPolygonClosed) {
    if (isPointInPolygone(newPoint, points)){
      pointsInside.push(newPoint);
      if (pointsInside.length > 1){
        geoPath = geodesicPath(points, pointsInside[0], pointsInside[1]);
        //shortestSelfApprochingPath(points, geoPath);

        for (const i in geoPath){
          let j = parseInt(i);
          if (j > 0){
            blueLines.push([geoPath[j-1], geoPath[j]]);
          }
        }
      }
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
  orangeLines = [];
  pointsInside = [];
  isConvex = [];
  blueLines = [];
  path = [];
}
