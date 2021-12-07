
var t = function( p ) {

    var c;
    var involute;
    var involute_small;
    var draw_angle;
    var start_angle;
    var y;
    var start_up_point;
    var start_down_point;
    var offset = 0;
    let range = 5
    let height = 300;

    p.setup = function() {
        p.createCanvas(500, height);
        draw_angle = -TWO_PI;
        start_angle = 0;
        y = height-50;

        c = new CircleEq(range, createVector(50,y))

        involute = new InvoluteOfCircle(c, start_angle);
        // involute_small = new InvoluteOfCircle(c, start_angle);
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, 0, draw_angle, false);
        draw_end(p);

        offset = HALF_PI/2;
    };


    p.draw = function() {
        p.frameRate(30);
        p.background(200);
        //draw_angle -= PI/60;
        //start_angle += PI/160;
        //y -= PI/6;

        /*
        if (draw_angle < -TWO_PI * 3) {
            draw_angle = TWO_PI;
            start_angle = TWO_PI;
            y = 300;
        }
         */
        offset += 0.1;
        if (offset > 20) {
            offset = 0;
        }
        y = height - 50 - offset*range;
        c = new CircleEq(range, createVector(50+offset*range*TWO_PI,y));

        //c.draw(p);
        involute = new InvoluteOfCircle(c, start_angle-offset);

        start_up_point = involute.get_point(start_angle).add(c.center);
        start_down_point = involute.get_point(start_angle-TWO_PI).add(c.center);
        p.line(start_up_point.x, start_up_point.y, 500, start_up_point.y);
        p.line(start_down_point.x, start_down_point.y, 500, start_down_point.y);

        involute.draw(p, offset-TWO_PI, draw_angle, false);
        involute.draw(p, 0, offset, false);

        draw_end(p);
    };

    function draw_end(p) {
        var start_point = involute.get_point(offset).add(c.center);
        var end_point = involute.get_point(offset-TWO_PI).add(c.center);
        p.line(start_point.x, start_point.y, end_point.x, end_point.y);
    }
};
var myp5 = new p5(t, 'carpet');
