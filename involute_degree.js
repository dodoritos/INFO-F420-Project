
var angleSlider = document.getElementById("angleSlider");

var t = function( p ) {
    var angle;

    var c;
    var involute;

    angleSlider.oninput = function() {
        angle = 2*PI*this.value/this.max;
        redraw()
    }

    p.setup = function() {
        p.createCanvas(800, 600);
        angle = 2*PI;
        c = new CircleEq(30, createVector(400,300));
        involute = new InvoluteOfCircle(c, 0);
        redraw();
    };

    function redraw() {
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        involute.draw(p, 0, 2*PI, false);
        drawAngle(p, involute.get_point(angle).add(c.center), involute.get_tangent_vector(angle).rotate(QUARTER_PI).setMag(200), HALF_PI, 'black');
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'involute_degree');