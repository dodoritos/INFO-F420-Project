var t = function( p ) {
    var draw_angle;
    var start_angle;

    var c;
    var involute;
    var second_involute;

    p.setup = function() {
        p.createCanvas(700, 500);
        draw_angle = 2*PI;
        c = new CircleEq(100, createVector(550,190));
        start_angle = HALF_PI/2;
        involute = new InvoluteOfCircle(c, start_angle);
        second_involute = new SecondInvoluteOfCircle(c, start_angle);
        redraw();
    };

    function redraw() {
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, start_angle, draw_angle, false);
        p.stroke('red');
        second_involute.draw(p, start_angle, draw_angle, false);
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'second_involute');