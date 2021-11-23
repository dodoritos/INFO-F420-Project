const CLOCK_WISE = true;
const COUNTER_CLOCK_WISE = true;

var s = function( p ) { // p could be any variable name

    function draw_involute_of_circle(center, starting_point, direction) {
        p.strokeWeight(2);
        p.stroke('black');

        let radius = starting_point.dist(center);
        p.circle(center.x, center.y, radius+radius);

        var relative_point = starting_point.copy();
        relative_point.sub(center);
        var tengent_point = relative_point.copy();
        tengent_point.rotate(-HALF_PI);
        // console.log(relative_point.toString());
        // console.log(tengent_point.toString());
        var angle = 0;
        let delta = -HALF_PI/40;
        p.noFill();
        p.stroke('red');
        p.strokeWeight(4);
        p.beginShape();
        for (let i = 0; i < 100; i++) {
            // console.log(relative_point.toString());

            let tg_copy = tengent_point.copy().setMag(TWO_PI*radius*(angle/TWO_PI));
            var drawing_point = relative_point.copy();
            drawing_point.add(center)
            drawing_point.add(tg_copy)
            p.vertex(drawing_point);
            p.point(drawing_point);
            relative_point.rotate(delta);
            tengent_point.rotate(delta);

            angle += delta;

        }
        p.endShape();
    }

    var x = 100;
    var y = 100;
    p.setup = function() {
        p.createCanvas(400, 400);
    };

    p.draw = function() {
        p.background(200);
        p.fill(200);
        draw_involute_of_circle(createVector(200, 200), createVector(250, 200), COUNTER_CLOCK_WISE);
    };
};
var p5 = new p5(s, 'involute');