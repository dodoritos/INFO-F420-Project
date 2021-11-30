
var animationSlider = document.getElementById("animationSlider");
var distanceSpan = document.getElementById("distanceSpan");

var t = function( p ) {
    var vector_position;

    var c;
    var involute;
    animationSlider.oninput = function() {
        vector_position = 3*PI*this.value/this.max;
        distanceSpan.innerHTML =  involute.get_point(vector_position).mag();
        redraw()
    }

    p.setup = function() {
        p.createCanvas(800, 600);
        c = new CircleEq(30, createVector(400,300));
        involute = new InvoluteOfCircle(c, 0);
        vector_position = 3*PI*animationSlider.value/animationSlider.max;
        distanceSpan.innerHTML =  involute.get_point(vector_position).mag();
        redraw();
    };

    function redraw() {
        p.background(200);
        p.stroke('black');
        p.noFill();
        c.draw(p);
        p.stroke('red');
        involute.draw(p, 0, 3*PI, false);
        drawArrow(p, involute.get_point(vector_position).add(c.center), involute.get_point(vector_position).rotate(PI), 'black');
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'involute_aproaching');