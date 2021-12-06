
var t = function( p ) {

    var c;
    var involute;
    var angle = 0;
    var start = 0;
    var end = 4;

    p.setup = function() {
        p.createCanvas(400, 400);
        p.frameRate(5);
        c = new CircleEq(15, createVector(200,200));
        redraw();
    };

    function redraw() {
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('red');
        involute = new InvoluteOfCircle(c, angle*PI);
        involute.draw(p, start*PI, end*PI, false);
        p.stroke('purple'); // Change the color
        p.strokeWeight(5); // Make the points 10 pixels in size
        var point = createVector(p.mouseX, p.mouseY)
        // var point = createVector(250, 300);
        p.point(point.x, point.y);
        point.sub(c.center);
        var a = involute.get_tangent_of_point(point, 0, TWO_PI+1);
        var t = involute.get_point(a);
        p.point(t.add(c.center));
        p.strokeWeight(1); // Make the points 10 pixels in size
    }

    p.draw = function() {
        redraw()
    };
};
var myp5 = new p5(t, 'involute_tangent');