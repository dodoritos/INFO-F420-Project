
var t = function( p ) {

    var c;
    var involute;
    var involute_small;
    var draw_angle;
    var start_angle;
    var y;
    var start_up_point;
    var start_down_point;

    p.setup = function() {
        p.createCanvas(500, 500);
        draw_angle = PI;
        start_angle = PI;
        y = 400;
        c = new CircleEq(10, createVector(250,y))

        involute = new InvoluteOfCircle(c, start_angle);
        involute_small = new InvoluteOfCircle(c, start_angle);
        start_up_point = involute.get_point(start_angle-PI).add(c.center);
        start_down_point = involute.get_point(start_angle+PI).add(c.center);
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, 0, draw_angle, false);
        draw_end(p);

        draw_angle = TWO_PI;
        start_angle = TWO_PI;
        y = 400 - PI*10;
    };


    p.draw = function() {
        p.background(200);
        draw_angle += PI/60;
        start_angle += PI/60;
        y -= PI/6;

        if (draw_angle > TWO_PI * 5) {
            draw_angle = TWO_PI;
            start_angle = TWO_PI;
            y = 400 - PI*10;
        }

        c = new CircleEq(10, createVector(250,y));

        //c.draw(p);
        involute = new InvoluteOfCircle(c, start_angle);

        p.line(start_up_point.x, start_up_point.y, 500, start_up_point.y);
        p.line(start_down_point.x, start_down_point.y, 500, start_down_point.y);
        //if (draw_angle<TWO_PI*0) {
        //    involute.draw(p, 0, draw_angle-PI, false);
        //} else {
            involute.draw(p, 0, draw_angle-TWO_PI, false);
            //involute.small.draw(p, 0, draw_angle, false);
        //}
        draw_end(p);
    };

    function draw_end(p) {
        var start_point = involute.get_point(start_angle).add(c.center);
        var end_point = involute.get_point(start_angle-TWO_PI).add(c.center);
        p.line(start_point.x, start_point.y, end_point.x, end_point.y);
    }
};
var myp5 = new p5(t, 'carpet');
