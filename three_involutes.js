var inv1DegreeOfStart = document.getElementById("inv1DegreeOfStart");
var inv2DegreeOfStart = document.getElementById("inv2DegreeOfStart");
var inv3DegreeOfStart = document.getElementById("inv3DegreeOfStart");


var t = function( p ) {
    var sliders = [inv1DegreeOfStart, inv2DegreeOfStart, inv3DegreeOfStart];
    var draw_angles = [0,0,0];
    var draw_angle;

    var c;
    var involute;
    var involute_k;
    var second_involute;
    var second_involute_k;
    var third_involute;


    for (s of sliders) {
        //s.oninput = redraw;
    }
    p.setup = function() {
        p.createCanvas(500, 500);
        p.noFill();
        draw_angle = 4*PI;
        redraw();
    };

    function redraw() {

        // draw_angles[0] = 2*PI*sliders[0].value/sliders[0].max;
        // draw_angles[1] = 2*PI*sliders[1].value/sliders[1].max;
        // draw_angles[2] = 2*PI*sliders[2].value/sliders[2].max;
        p.background(200);
        p.strokeWeight(1);

        c = new CircleEq(40, createVector(300,190));
        p.stroke('black');
        c.draw(p);

        involute = new InvoluteOfCircle(c, draw_angles[0]);
        // involute_k = new KthInvoluteOfCircle(1, [c], TWO_PI/5*20);
        //involute_k = new KthInvoluteOfCircle(1, c, [0], draw_angles[0]);
        involute_k = new KthInvoluteOfCircle(1, c, [0], 0);
        p.stroke('white');
        p.strokeWeight(4);
        involute_k.draw(p, 0, draw_angle, false);
        p.stroke('purple');
        p.strokeWeight(2);
        involute.draw(p, 0, draw_angle, false);

        second_involute = new SecondInvoluteOfCircle(c, draw_angles[0], draw_angles[1]);
        // second_involute_k = new KthInvoluteOfCircle(2, c, [0, involute.degree_of_start], draw_angles[1]);
        second_involute_k = new KthInvoluteOfCircle(2, c, [0, draw_angles[0]], draw_angles[1]);
        p.stroke('white');
        p.strokeWeight(4);
        second_involute_k.draw(p, 1, draw_angle, false);
        p.stroke('red');
        p.strokeWeight(2);
        second_involute.draw(p, 0, draw_angle, false);


        //let involuteList = [0, involute.degree_of_start, second_involute.degree_of_start];
        //third_involute = new KthInvoluteOfCircle(3, c, involuteList, draw_angles[2]);
        third_involute = new KthInvoluteOfCircle(3, c, [0, draw_angles[0], draw_angles[1]], draw_angles[2]);
        p.stroke('blue');
        third_involute.draw(p,  0, draw_angle, false);
    }

    p.draw = function() {
        //redraw();
    };
};
var myp5 = new p5(t, 'three_involutes');
