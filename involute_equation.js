
var startSlider = document.getElementById("startSlider");
var endSlider = document.getElementById("endSlider");


class CircleEq {
    /**
     * @param {number} range
     * @param {p5.Vector} center
     */
    constructor(range, center) {
        this.range = range;
        this.center = center;
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
        return createVector(r*(cos+angle*sin),r*(sin-angle*cos));
    }

    get_tangent_vector(angle) {
        return p5.Vector.fromAngle(angle + HALF_PI);
    }

    draw(canvas, start_rad, end_rad, display_lines) {
        if (end_rad < start_rad)
            [end_rad, start_rad] = [start_rad, end_rad];
        canvas.noFill();
        canvas.stroke('red');
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

var t = function( p ) {
    var start = 4*startSlider.value/startSlider.max;
    document.getElementById("startSpan").innerHTML = start;
    var end = 4*endSlider.value/endSlider.max;
    document.getElementById("endSpan").innerHTML = end;
    var c;
    var involute;
    startSlider.oninput = function() {
        start = 4*this.value/this.max;
        document.getElementById("startSpan").innerHTML = start;
        redraw()
    }
    endSlider.oninput = function() {
        end = 4*this.value/this.max;
        document.getElementById("endSpan").innerHTML = end;
        redraw()
    }

    p.setup = function() {
        p.createCanvas(800, 600);
        c = new CircleEq(30, createVector(400,300));
        involute = new InvoluteOfCircle(c, 0);
        redraw();
    };

    function redraw() {
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        involute.draw(p, start*PI, end*PI, true);
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'involute_equation');