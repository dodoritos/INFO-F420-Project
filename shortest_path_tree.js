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
}

class Funnel{
  constructor(vertices, cusp){
    this.vertices = vertices; // Array of at least 2 points in the order from the first end of the funnel to the other.
    this.cusp = cusp; // index of the cusp in this.vertices
  }

  shotestPathTo(p){
    // check if the shortest path pass through one of the end of the funnel
    this.vertices.push(p);
    let convex = computeConvexList(this.vertices);
    let flat = computeFlatList(this.vertices);
    this.vertices.pop();

    if (flat[1] || !convex[0]){
      return 0;
    }
    if (flat[flat.length - 3] || !convex[convex.length-2]){
      return convex.length-2;
    }

    //check the edges before the cusp
    let i = 1;
    let noCrossing = true;
    while (noCrossing && i <= this.cusp){
      let j = i;
      while (noCrossing && j > 0){
        noCrossing = ! isIntersection(this.vertices[j], this.vertices[j-1], this.vertices[i], p);
        j-= 1;
      }
      i+= 1;
    }

    if (! noCrossing){
      return i-2;
    }

    //check the edges after the cusp
    i = this.vertices.length - 2;
    while (noCrossing && i >= this.cusp){
      let j = i;
      while (noCrossing && j < this.vertices.length - 1){
        noCrossing = ! isIntersection(this.vertices[j], this.vertices[j+1], this.vertices[i], p);
        j+= 1;
      }
      i-= 1;
    }

    if (! noCrossing){
      return i+2;
    }

    return this.cusp;
  }
}

function shortestPathTree(poly, root){
  let triangles = triangulate(poly);
  let nextVertex = root - 1;
  if (root == 0){
    nextVertex = poly.length - 1;
  }
  let funnel = new Funnel([poly[root], poly[nextVertex]], 0);
  let treeRoot = new Tree(poly[root]);
  let child = new Tree(poly[nextVertex]);
  treeRoot.addChild(child);
  buildSPT(funnel, triangles[funnel.vertices], [treeRoot, child]);

  return treeRoot;
}

function buildSPT(funnel, triangle, spt){
  let p = triangle.getThirdVertex(funnel.vertices[0], funnel.vertices[funnel.vertices.length - 1]);
  let prev = funnel.shotestPathTo(p);
  let tree = new Tree(p);
  console.log(funnel);

  let newFunnel1Vertices = funnel.vertices.slice(0, prev+1);
  newFunnel1Vertices.push(p);
  let newFunnel2Vertices = [p].concat(funnel.vertices.slice(prev, funnel.vertices.length));

  let newFunnel1 = new Funnel(newFunnel1Vertices, null);
  let newFunnel2 = new Funnel(newFunnel2Vertices, null);
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
    buildSPT(newFunnel1, nextTriangle, [spt[0], tree]);
  }

  nextTriangle = triangle.getNeighbor(newFunnel2.vertices[0], newFunnel2.vertices[newFunnel2.vertices.length-1]);
  if (nextTriangle !== null){
    buildSPT(newFunnel2, nextTriangle, [tree, spt[1]]);
  }

}
