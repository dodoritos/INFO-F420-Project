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
        p.createCanvas(700, 500);
        draw_angle = 2*PI;
        c = new CircleEq(20, createVector(550,190));
        first_start_angle = HALF_PI/2;
        // start_angle = 0;
        redraw();
    };

    function redraw() {
        involute = new InvoluteOfCircle(c, first_start_angle);
        second_involute = new SecondInvoluteOfCircle(c, first_start_angle, second_start_angle);
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('purple');
        involute.draw(p, first_start_angle, draw_angle, false);
        p.stroke('red');
        second_involute.draw(p, first_start_angle, draw_angle, false);
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'second_involute');
