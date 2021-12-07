
var startSlider = document.getElementById("startSlider");
var endSlider = document.getElementById("endSlider");
var rotationSlider = document.getElementById("rotationSlider");

var factorialCalculator = function() {
    var values = [1,1];

    var i = function(i) {
        last_index = values.length-1;
        while (last_index<i) {
            last_index++;
            values.push(values[last_index-1]*last_index);
        }
        return values[last_index];
    }
    return {
        i: i,
        values: values,
    }
}

var factorial = factorialCalculator();

function lineAngle(p1, p2){
  return Math.atan2((p2.y - p1.y), (p2.x - p1.x));
}

function angleBetweenTreeVectors(a, b, c) {
    var x = a.copy().sub(b);
    var y = c.copy().sub(b);
    return x.angleBetween(y);
}

function angleBetween(l1, l2){
  return Math.atan2(l1.x * l2.y - l1.y * l2.x, l1.x * l2.x + l1.y * l2.y);
}

function computeEqSecondOrder(a, b, c){
  let delta = b**2 - 4 * a * c;
  if (delta < 0.0000000001 && delta > -0.0000000001){
    delta = 0;
  }
  console.log(delta);
  if (delta < 0)
    return null;
  let m1 = (- b + Math.sqrt(delta))/(2*a);
  let m2 = (- b - Math.sqrt(delta))/(2*a);
  return [m1, m2]
}

function smallestAngle(l1, l2){
  let res = angleBetween(l1, l2);
  if (res < 0)
    res = -res;
  return res;
}



class CircleEq {
    /**
     * @param {number} range
     * @param {p5.Vector} center
     */
    constructor(range, center) {
        this.range = range;
        this.center = center;
    }

    getType(){
      return "circle";
    }

    draw(canvas) {
        canvas.beginShape();
        for (let o = 0; o <= TWO_PI; o += TWO_PI/40) {
            let point_on_canvas = this.get_point(o).add(this.center);
            canvas.vertex(point_on_canvas.x, point_on_canvas.y);
        }
        canvas.endShape();
    }

    /** return a point relative to the center (0,0)
     * @param {number} angle
     */
    get_point(angle) {
        return createVector(this.range * Math.cos(angle), this.range*Math.sin(angle));
    }

    isPointInside(p){
      return distance(p, this.center) < this.range;
    }

    get_tangent_of_point(p){
      // eq : y = mx + r * sqrt(1 + m**2)
      //      y-mx = r sqrt(1 + m**2)
      //      y**2 - 2ymx + m**2 * x**2 = r**2 (1 + m**2)
      //      (x**2 - r**2)*m**2 - 2*y*x * m + y**2 - r**2 = 0
      let r = this.range;
      p = new Point(p.x - this.center.x, p.y - this.center.y);

      let a = p.x**2 - r**2;
      let b = -2 * p.y * p.x;
      let c = p.y**2 - r**2;

      let m = computeEqSecondOrder(a, b, c);

      // y-p.y = m * (x-p.x)               y = m * (x-p.x) + p.y
      // y**2 + x**2 = r**2                       (m * (x-p.x) + p.y)**2 + x**2 = r**2
      //
      // (m * (x-p.x) + p.y)**2 + x**2 = r**2
      // (mx - m*p.x +p.y)**2 + x**2 = r**2     let d = -m*p.x +p.y
      // (mx + d)**2 + x**2 = r**2
      // m**2 * x**2 + 2mxd + d**2 + x**2 = r**2
      // (m**2 + 1)* x**2 + 2mxd + d**2 - r**2 = 0

      let d = -m[0] * p.x + p.y;
      a = m[0]**2 + 1;
      b = 2 * m[0] * d;
      c = (d**2) - r**2;
      console.log("abcd");
      console.log(a);
      console.log(b);
      console.log(c);
      console.log(d);
      let x1 = computeEqSecondOrder(a, b, c)[0];
      let y1 = m[0] * (x1 - p.x) + p.y;
      d = -m[1] * p.x + p.y;
      a = m[1]**2 + 1;
      b = 2 * m[1] * d;
      c = (d**2) - r**2;
      let x2 = computeEqSecondOrder(a, b, c)[0];
      let y2 = m[1] * (x2 - p.x) + p.y;

      return [[new Point(x1, y1).add(this.center), p.add(this.center)], [new Point(x2, y2).add(this.center), p.add(this.center)]];
    }
}

class InvoluteOfCircle {
    constructor(circle, degree_of_start) {
        this.circle = circle;
        this.degree_of_start = degree_of_start;
    }

    /** return a point relative to the center (0,0)
     * @param {number} angle the angle of the relative circle
     */
    get_point(angle) {
        let r = this.circle.range;
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        // return createVector(r*(cos+(angle-this.degree_of_start)*sin),r*(sin-(angle-this.degree_of_start)*cos));
        return createVector(r*(cos-(angle+this.degree_of_start)*(-sin)),r*(sin-(angle+this.degree_of_start)*cos));
    }

    getType(){
      return "Involute1";
    }

    isPointInside(p){
      return distance(p, this.circle.center) < distance(this.get_point(lineAngle(p, this.circle.center)).add(this.circle.center), this.circle.center);
    }

    get_tangent_vector(angle) {
        return p5.Vector.fromAngle(angle + HALF_PI);
    }

    /**
     * Take any point in space and return the angle of the tangent point on the involute between two angles
     * /!\ It's important to search in a tiny area
     */
    get_tangent_of_point(p, start, end) {

        var angle = (end+start)/2;

        var point_on_involute = this.get_point(angle);
        var point_on_circle = this.circle.get_point(angle);
        var tangent_angle = Math.abs(angleBetweenTreeVectors(p, point_on_involute, point_on_circle));

        const delta = 0.0000001; // Precision of the search
        while (Math.abs(tangent_angle - HALF_PI) > delta && Math.abs(start-end) > delta) {
            if (tangent_angle < HALF_PI) {
                end = angle;
            } else {
                start = angle;
            }
            angle = (end+start)/2;

            var point_on_involute = this.get_point(angle);
            var point_on_circle = this.circle.get_point(angle);
            tangent_angle = Math.abs(angleBetweenTreeVectors(p, point_on_involute, point_on_circle));
        }
        if (Math.abs(tangent_angle - HALF_PI) <= 2*delta) {
            return angle;
        } else {
            return null;
        }
    }

    draw(canvas, start_rad, end_rad, display_lines) {
        if (end_rad < start_rad)
            [end_rad, start_rad] = [start_rad, end_rad];
        canvas.beginShape();
        for (let o = start_rad; o <= end_rad; o += PI/40) {
            let point = this.get_point(o).add(this.circle.center);
            canvas.vertex(point.x, point.y);
        }

        let point = this.get_point(end_rad).add(this.circle.center);
        canvas.vertex(point.x, point.y);
        canvas.endShape();
        if (display_lines) {
            canvas.stroke('black');
            let c1 = this.circle.get_point(start_rad).add(this.circle.center);
            let p1 = this.get_point(start_rad).add(this.circle.center);
            canvas.line(c1.x, c1.y, p1.x, p1.y);
            let c2 = this.circle.get_point(end_rad).add(this.circle.center);
            let p2 = this.get_point(end_rad).add(this.circle.center);
            canvas.line(c2.x, c2.y, p2.x, p2.y);
        }
    }
}

class SecondInvoluteOfCircle {
    constructor(circle, degree_of_start, second_degree_of_start) {
        this.circle = circle;
        this.degree_of_start = degree_of_start;
        this.second_degree_of_start = second_degree_of_start;
    }

    getType(){
      return "Involute2";
    }

    isPointInside(p){
      return distance(p, this.circle.center) < distance(this.get_point(lineAngle(p, this.circle.center)).add(this.circle.center), this.circle.center);
    }

    /** return a point relative to the center (0,0)
     * @param {number} angle the angle of the relative circle
     */
    get_point(angle) {
        let r = this.circle.range;
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        // let frac = ((angle-this.degree_of_start)*(angle-this.degree_of_start))/2;
        // let frac = (angle*angle)/2-(angle*this.degree_of_start) - (this.second_degree_of_start*this.second_degree_of_start/2 - this.degree_of_start*this.second_degree_of_start);
        let frac = (angle*angle)/2+(angle*this.degree_of_start)+this.second_degree_of_start;
        // return createVector(r*(cos+(angle-this.degree_of_start)*sin-cos*frac),r*(sin-(angle-this.degree_of_start)*cos-sin*frac));
        return createVector(r*(cos-(angle+this.degree_of_start)*(-sin)-cos*frac),r*(sin-(angle+this.degree_of_start)*cos-sin*frac));
    }

    get_tangent_vector(angle) {
        return p5.Vector.fromAngle(angle + HALF_PI);
    }

    /**
     * Take any point in space and return the angle of the tangent point on the involute between two angles
     * /!\ It's important to search in a tiny area
     */
    get_tangent_of_point(p, start, end) {

        var angle = (end+start)/2;

        var point_on_involute = this.get_point(angle);
        var point_on_circle = this.circle.get_point(angle);
        var tangent_angle = Math.abs(angleBetweenTreeVectors(p, point_on_involute, point_on_circle));

        const delta = 0.0000001; // Precision of the search
        while (Math.abs(tangent_angle - HALF_PI) > delta && Math.abs(start-end) > delta) {
            if (tangent_angle < HALF_PI) {
                end = angle;
            } else {
                start = angle;
            }
            angle = (end+start)/2;

            var point_on_involute = this.get_point(angle);
            var point_on_circle = this.circle.get_point(angle);
            tangent_angle = Math.abs(angleBetweenTreeVectors(p, point_on_involute, point_on_circle));
        }
        if (Math.abs(tangent_angle - HALF_PI) <= 2*delta) {
            return angle;
        } else {
            return null;
        }
    }

    get_draw_points(start_rad, end_rad){
      let res = [];
      if (end_rad < start_rad)
          [end_rad, start_rad] = [start_rad, end_rad];

      for (let o = start_rad; o <= end_rad; o += PI/40) {
          let point = this.get_point(o).add(this.circle.center);
          res.push(point);
      }

      let point = this.get_point(end_rad).add(this.circle.center);
      res.push(point);

      return res;
    }

    draw(canvas, start_rad, end_rad, display_lines) {
        let toDraw = this.get_draw_points(start_rad, end_rad);
        canvas.beginShape();
        for (const i in toDraw) {
            let point = toDraw[i];
            canvas.vertex(point.x, point.y);
        }
        canvas.endShape();
        if (display_lines) {
            canvas.stroke('black');
            let c1 = this.circle.get_point(start_rad).add(this.circle.center);
            let p1 = this.get_point(start_rad).add(this.circle.center);
            canvas.line(c1.x, c1.y, p1.x, p1.y);
            let c2 = this.circle.get_point(end_rad).add(this.circle.center);
            let p2 = this.get_point(end_rad).add(this.circle.center);
            canvas.line(c2.x, c2.y, p2.x, p2.y);
        }
    }
}

/**
 * Involute of any order
 */
class KthInvoluteOfCircle {
    /**
     * Construct an involute of order k
     * Add this new involute to the list of curves
     * @param order The order k
     * @param lower_curves_start List of all degrees of curves of lower order (if order = 5, length of the list = 4)
     * @param degree_of_start
     * @param second_degree_of_start
     */
    constructor(order, circle, lower_curves_start, degree_of_start) {
        this.order = order;
        this.lower_curves_start = [...lower_curves_start];
        this.degree_of_start = degree_of_start;
        this.circle = circle;
        this.lower_curves_start.push(degree_of_start);
    }

    getType(){
        return "Involute"+this.order;
    }

    /**
     * NOT WORKING
     * @param p
     * @returns {boolean}
     */
    isPointInside(p){
        return distance(p, this.circle.center) < distance(this.get_point(lineAngle(p, this.circle.center)).add(this.circle.center), this.circle.center);
    }

    /**
     * Same a as in the paper page 5 (long version)
     * @param i
     * @param angle
     */
    a(i, angle) {
        let result = 0;
        let angle_power = 1;
        for (let j = 0; j < i; j++) {
            result += (angle_power/factorial.i(j))*this.lower_curves_start[i-j];
            //console.log(""+j+" a:"+result+" += " + angle_power + "/" + factorial.i(j) +"*"+ this.lower_curves[i-j].degree_of_start);
            angle_power *= angle;
        }
        result += this.circle.range*angle_power/factorial.i(i);
        return result
    }


    /** return a point relative to the center (0,0)
     * @param {number} angle the angle of the relative circle
     */
    get_point(angle) {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let left_side = 0;
        let right_side = 0;
        for (let i = 0; i <= Math.floor(this.order / 2); i++) {
            left_side += Math.pow(-1, i)*this.a(2*i, angle);
            // console.log(x)
        }
        for (let i = 1; i <= Math.ceil(this.order / 2); i++) {
            right_side += Math.pow(-1, i-1)*this.a(2*i-1, angle);
        }
        let x = left_side*cos - right_side*(-sin);
        let y = left_side*sin - right_side*cos;
        return createVector(x, y);
    }

    get_tangent_vector(angle) {
        return p5.Vector.fromAngle(angle + HALF_PI);
    }

    /**
     * Take any point in space and return the angle of the tangent point on the involute between two angles
     * /!\ It's important to search in a tiny area
     */
    get_tangent_of_point(p, start, end) {

        var angle = (end+start)/2;

        var point_on_involute = this.get_point(angle);
        var point_on_circle = this.circle.get_point(angle);
        var tangent_angle = Math.abs(angleBetweenTreeVectors(p, point_on_involute, point_on_circle));

        const delta = 0.0000001; // Precision of the search
        while (Math.abs(tangent_angle - HALF_PI) > delta && Math.abs(start-end) > delta) {
            if (tangent_angle < HALF_PI) {
                end = angle;
            } else {
                start = angle;
            }
            angle = (end+start)/2;

            var point_on_involute = this.get_point(angle);
            var point_on_circle = this.circle.get_point(angle);
            tangent_angle = Math.abs(angleBetweenTreeVectors(p, point_on_involute, point_on_circle));
        }
        if (Math.abs(tangent_angle - HALF_PI) <= 2*delta) {
            return angle;
        } else {
            return null;
        }
    }

    get_draw_points(start_rad, end_rad){
        let res = [];
        if (end_rad < start_rad)
            [end_rad, start_rad] = [start_rad, end_rad];

        for (let o = start_rad; o <= end_rad; o += PI/40) {
            let point = this.get_point(o).add(this.circle.center);
            res.push(point);
        }

        let point = this.get_point(end_rad).add(this.circle.center);
        res.push(point);

        return res;
    }

    draw(canvas, start_rad, end_rad, display_lines) {
        let toDraw = this.get_draw_points(start_rad, end_rad);
        canvas.beginShape();
        for (const i in toDraw) {
            let point = toDraw[i];
            canvas.vertex(point.x, point.y);
        }
        canvas.endShape();
        if (display_lines) {
            canvas.stroke('black');
            let c1 = this.circle.get_point(start_rad).add(this.circle.center);
            let p1 = this.get_point(start_rad).add(this.circle.center);
            canvas.line(c1.x, c1.y, p1.x, p1.y);
            let c2 = this.circle.get_point(end_rad).add(this.circle.center);
            let p2 = this.get_point(end_rad).add(this.circle.center);
            canvas.line(c2.x, c2.y, p2.x, p2.y);
        }
    }
}


var t = function( p ) {
    var start = 4*startSlider.value/startSlider.max;
    document.getElementById("startSpan").innerHTML = start;
    var end = 4*endSlider.value/endSlider.max;
    document.getElementById("endSpan").innerHTML = end;
    var angle = 4*rotationSlider.value/rotationSlider.max;
    document.getElementById("rotationSpan").innerHTML = angle;

    var c;
    var involute;
    startSlider.oninput = function() {
        start = 4*this.value/this.max;
        redraw()
    }
    endSlider.oninput = function() {
        end = 4*this.value/this.max;
        redraw()
    }
    rotationSlider.oninput = function() {
        angle = 4*this.value/this.max;
        redraw()
    }

    p.setup = function() {
        p.createCanvas(400, 400);
        c = new CircleEq(15, createVector(200,200));
        redraw();
    };

    function redraw() {
        document.getElementById("rotationSpan").innerHTML = angle;
        document.getElementById("endSpan").innerHTML = end;
        document.getElementById("startSpan").innerHTML = start;
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('red');
        involute = new InvoluteOfCircle(c, angle*PI);
        involute.draw(p, start*PI, end*PI, true);
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'involute_equation');
