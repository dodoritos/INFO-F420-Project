var firstDegreeOfStart = document.getElementById("firstDegreeOfStart");
var secondDegreeOfStart = document.getElementById("secondDegreeOfStart");

var t = function( p ) {
    var draw_angle;
    var first_start_angle;
    var second_start_angle;

    var c;
    var involute;
    var second_involute;

    firstDegreeOfStart.oninput = function() {
        first_start_angle = 2*PI*this.value/this.max;
        redraw()
    }
    secondDegreeOfStart.oninput = function() {
        second_start_angle = 2*PI*this.value/this.max;
        redraw()
    }

    p.setup = function() {
        p.createCanvas(500, 500);
        draw_angle = 2*PI;
        c = new CircleEq(20, createVector(300,190));
        first_start_angle = 2*PI*firstDegreeOfStart.value/firstDegreeOfStart.max;
        second_start_angle = 2*PI*secondDegreeOfStart.value/secondDegreeOfStart.max;
        // start_angle = 0;
        redraw();
    };

    function redraw() {
        involute = new InvoluteOfCircle(c, first_start_angle);
        second_involute = new SecondInvoluteOfCircle(c, first_start_angle, second_start_angle);
        p.background(200);
        p.stroke('black');
        let testP = new Point(200, 100);
        p.ellipse(testP.x, testP.y, 5, 5);
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, first_start_angle, draw_angle, false);
        p.stroke('red');
        second_involute.draw(p, first_start_angle, draw_angle, false);
        // debug
        p.stroke('blue');
        let tg = c.get_tangent_from_point(testP);
        console.log(tg);
        p.line(tg[0][0].x, tg[0][0].y, tg[0][1].x, tg[0][1].y);
        p.line(tg[1][0].x, tg[1][0].y, tg[1][1].x, tg[1][1].y);

    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'second_involute');
