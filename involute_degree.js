var t = function( p ) {
    var vector_position;

    var c;
    var involute;

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
        involute.draw(p, 0, 3*PI, false);
        drawAngle(p, involute.get_point(3*PI).add(c.center), involute.get_tangent_vector(3*PI).rotate(QUARTER_PI).setMag(200), HALF_PI, 'black');
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'involute_degree');