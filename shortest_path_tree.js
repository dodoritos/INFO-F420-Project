class Triangle{
  constructor(p1, p2, p3, p1p2 = null, p2p3 = null, p1p3 = null){
    this.p1 = p1;
    this.p2 = p2;
    this.p3 = p3;
    this.p1p2 = p1p2;
    this.p2p3 = p2p3;
    this.p1p3 = p1p3;
  }

  getNeighbor(v1, v2){
    let opposite = this.getThirdVertex(v1, v2);
    if (opposite == this.p1){
      return this.p2p3;
    }
    if (opposite == this.p2){
      return this.p1p3;
    }
    return this.p1p2;
  }

  setNeighbor(v1, v2, neighbor, reciprocity = true){
    let opposite = this.getThirdVertex(v1, v2);
    if (opposite == this.p1){
      this.p2p3 = neighbor;
    }
    else if (opposite == this.p2){
      this.p1p3 = neighbor;
    }
    else{
      this.p1p2 = neighbor;
    }
    if (reciprocity){
      neighbor.setNeighbor(v1, v2, this, false);
    }
  }

  getThirdVertex(v1, v2){
    if (this.p1 !== v1 && this.p1 !== v2){
      return this.p1;
    }
    if (this.p2 !== v1 && this.p2 !== v2){
      return this.p2;
    }
    return this.p3;
  }

  getEdges(){
    return [[this.p1,this.p2], [this.p2,this.p3], [this.p3,this.p1]];
  }

  getEdgesPermutaions(){
    return this.getEdges().concat([[this.p2,this.p1], [this.p3,this.p2], [this.p1,this.p3]]);
  }

  isPointInside(p){
    return isPointInPolygone(p, [this.p1, this.p2, this.p3]);
  }

  draw(){
    orangeLines = orangeLines.concat(this.getEdges());
    draw();
  }

}

class Tree{
  constructor(label, parent = null, childs = null){
    this.label = label;
    this.parent = parent;
    this.childs = childs;
    if (childs == null){
      this.childs = [];
    }
  }

  addChild(child){
    child.parent = this;
    this.childs.push(child);
  }

  addChildTo(child, parent){
    if (this.label == parent){
      this.addChild(child);
    }
    else if (this.parent !== null) {
      this.parent.addChildTo(child, parent);
    }
  }
  pathToRoot(){
    if (this.parent == null){
      return [this.label];
    }
    res = this.parent.pathToRoot();
    res.push(this.label);
    return res;
  }
}

class Funnel{
  constructor(vertices, cusp){
    this.vertices = vertices; // Array of at least 2 points in the order from the first end of the funnel to the other.
    this.cusp = cusp; // index of the cusp in this.vertices
  }

  isPointInside(p){
    if (this.vertices.length <= 2){
      return false;
    }
    return isPointInPolygone(p, this.vertices);
  }

  shotestPathTo(p){
    // check if the shortest path pass through one of the end of the funnel
    this.vertices.push(p);
    let convex = computeConvexList(this.vertices);
    let flat = computeFlatList(this.vertices);
    this.vertices.pop();

    if (flat[0] || !convex[0]){
      return 0;
    }
    if (flat[flat.length - 2] || !convex[convex.length-2]){
      return convex.length-2;
    }

    if (this.vertices.length == 2){
      return this.cusp;
    }

    let res = this.cusp;
    let dist = distance(this.vertices[this.cusp], p);
    if (isIntersection(this.vertices[0], this.vertices[this.vertices.length - 1], this.vertices[this.cusp], p)){
      let noCrossing = true;
      for (const j in this.vertices){
        if (j !== this.cusp && j>0 && noCrossing){
          noCrossing = ! isIntersection(this.vertices[j], this.vertices[parseInt(j) - 1], this.vertices[this.cusp], p)
        }
      }
      if (noCrossing){
        return this.cusp;
      }
    }
    //check the edges before the cusp
    let i = 1;
    let noCrossing1 = true;
    while (noCrossing1 && i <= this.cusp){
      noCrossing1 = isIntersection(this.vertices[0], this.vertices[this.vertices.length - 1], this.vertices[i], p);
      let j = i;
      while (noCrossing1 && j > 0){
        noCrossing1 = ! isIntersection(this.vertices[j], this.vertices[j-1], this.vertices[i], p);
        j-= 1;
      }
      i+= 1;
    }

    if (! noCrossing1){
      dist = 0;
      for (const j in this.vertices){
        if (j > i-2 && j <= this.cusp){
          dist += distance(this.vertices[j], this.vertices[parseInt(j)-1]);
        }
      }
      dist += distance(this.vertices[i-2], p);
      res = i-2;
    }

    //check the edges after the cusp
    i = this.vertices.length - 2;
    let noCrossing2 = true;
    while (noCrossing2 && i >= this.cusp){
      noCrossing2 = isIntersection(this.vertices[0], this.vertices[this.vertices.length - 1], this.vertices[i], p);
      let j = i;
      while (noCrossing2 && j < this.vertices.length - 1){
        noCrossing2 = ! isIntersection(this.vertices[j], this.vertices[j+1], this.vertices[i], p);
        j+= 1;
      }
      i-= 1;
    }

    if (! noCrossing2){
      if (noCrossing1){
        return i+2;
      }
      else if (i+2 < this.vertices.length) {
        let dist2 = 0;
        for (const j in this.vertices){
          if (j < i+2 && j >= this.cusp){
            dist2 += distance(this.vertices[j], this.vertices[parseInt(j)+1]);
          }
        }
        dist2 += distance(this.vertices[i+2], p);
        if (dist2 < dist){
          res = i+2;
          dist = dist2;
        }
      }
    }

    return res;
  }
}

function isVisibleFrom(poly ,s, t){
  for (const i in poly){
    let j = parseInt(i);
    if (i > 0 && isIntersection(poly[i-1], poly[i], s, t)){
      return false;
    }
  }
  if (isIntersection(poly[0], poly[poly.length -1], s, t)){
    return false;
  }
  return true;
}

function findStart(triangles, s, t){
  let res = [null, null];
  for (const i in triangles["all"]){
    if (triangles["all"][i].isPointInside(s)){
      res[0] = triangles["all"][i].p1;
    }
    if (triangles["all"][i].isPointInside(t)){
      res[1] = triangles["all"][i].p1;
    }
  }
  return res;
}

function geodesicPath(poly, s, t){
  if (isVisibleFrom(poly, s, t)){
    return [s, t];
  }
  let triangles = triangulate(poly);
  let roots = findStart(triangles, s, t);
  let treeNodeT = shortestPathTree(poly, triangles, poly.indexOf(roots[0]), t);
  let sPathT = treeNodeT.pathToRoot();
  let treeNodeS = shortestPathTree(poly, triangles, poly.indexOf(roots[1]), s);
  let sPathS = treeNodeS.pathToRoot();
  let prevS = sPathS[sPathS.length - 2];
  return [s].concat(sPathT.slice(sPathT.indexOf(prevS), sPathT.length));
}

function shortestPathTree(poly, triangles, root, obj = null){
  let nextVertex = root - 1;
  if (root == 0){
    nextVertex = poly.length - 1;
  }
  let funnel = new Funnel([poly[root], poly[nextVertex]], 0);
  let treeRoot = new Tree(poly[root]);
  let child = new Tree(poly[nextVertex]);
  treeRoot.addChild(child);
  let res = buildSPT(funnel, triangles[funnel.vertices], [treeRoot, child], obj);
  if (obj !== null){
    return res;
  }
  return treeRoot;
}

function buildSPT(funnel, triangle, spt, obj){
  let res = null;
  let isObjInTriangle = obj !== null && triangle.isPointInside(obj);
  let p = triangle.getThirdVertex(funnel.vertices[0], funnel.vertices[funnel.vertices.length - 1]);
  if (isObjInTriangle){
    p = obj;
  }
  let prev = funnel.shotestPathTo(p);
  let tree = new Tree(p);
  if (isObjInTriangle){
    spt[0].addChildTo(tree, funnel.vertices[prev]);
    return tree;
  }

  let newFunnel1Vertices = funnel.vertices.slice(0, prev+1);
  newFunnel1Vertices.push(p);
  let newFunnel2Vertices = [p].concat(funnel.vertices.slice(prev, funnel.vertices.length));

  let newFunnel1 = new Funnel(newFunnel1Vertices, null);
  let newFunnel2 = new Funnel(newFunnel2Vertices, null);

  //blueLines.push([tree.label, funnel.vertices[prev]]);
  //draw();

  if (prev < funnel.cusp){
    spt[0].addChildTo(tree, funnel.vertices[prev]);
    newFunnel1.cusp = newFunnel1.vertices.indexOf(funnel.vertices[prev]);
    newFunnel2.cusp = newFunnel2.vertices.indexOf(funnel.vertices[funnel.cusp]);
  }
  else{
    spt[1].addChildTo(tree, funnel.vertices[prev]);
    newFunnel1.cusp = newFunnel1.vertices.indexOf(funnel.vertices[funnel.cusp]);
    newFunnel2.cusp = newFunnel2.vertices.indexOf(funnel.vertices[prev]);
  }

  let nextTriangle = triangle.getNeighbor(newFunnel1.vertices[0], newFunnel1.vertices[newFunnel1.vertices.length-1]);
  if (nextTriangle !== null){
    res = buildSPT(newFunnel1, nextTriangle, [spt[0], tree], obj);
    if (res !== null){
      return res;
    }
  }

  nextTriangle = triangle.getNeighbor(newFunnel2.vertices[0], newFunnel2.vertices[newFunnel2.vertices.length-1]);
  if (nextTriangle !== null){
    res = buildSPT(newFunnel2, nextTriangle, [tree, spt[1]], obj);
    if (res !== null){
      return res;
    }
  }
  return res;
}
