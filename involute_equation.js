
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
        canvas.noFill();
        canvas.stroke('red');
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
        /* let point_on_circle = this.circle.get_point(angle);
        let p = point_on_circle.copy().rotate(HALF_PI);
        p.setMag(this.circle.range*angle);
        p.add(point_on_circle).add(this.circle.center);
        return p;
         */
    }
    draw(canvas, start_rad, end_rad) {
        canvas.noFill();
        canvas.stroke('red');
        canvas.beginShape();
        console.log('begin:  ' + start_rad);
        console.log('end:    ' + end_rad);
        for (let o = start_rad; o <= end_rad; o += PI/40) {
            let point = this.get_point(o).add(this.circle.center);
            // console.log(o);
            canvas.vertex(point.x, point.y);
        }
        canvas.endShape();
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
        c.draw(p);
        involute.draw(p, start*PI, end*PI);
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'involute_equation');