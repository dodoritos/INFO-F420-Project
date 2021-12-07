
var t = function( p ) {

    let c;
    let involute;
    let draw_angle;
    let start_angle;
    let y;
    let range = 5

    p.setup = function() {
        p.createCanvas(500, 500);
        draw_angle = -TWO_PI;
        start_angle = 0;
        y = 400;

        c = new CircleEq(range, createVector(50,y));

        involute = new InvoluteOfCircle(c, start_angle);
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, 0, draw_angle, false);
    };


    p.draw = function() {
    };
};
var myp5 = new p5(t, 'path');
