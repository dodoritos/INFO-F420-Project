var t = function( p ) {
    var angle;

    var c;
    var involute;
    var second_involute;

    p.setup = function() {
        p.createCanvas(700, 500);
        angle = 2*PI;
        c = new CircleEq(30, createVector(550,190));
        involute = new InvoluteOfCircle(c, 0);
        second_involute = new SecondInvoluteOfCircle(c, 0);
        redraw();
    };

    function redraw() {
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, 0, angle, false);
        p.stroke('red');
        second_involute.draw(p, 0, angle, false);
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'second_involute');