const CLOCK_WISE = true;
const COUNTER_CLOCK_WISE = true;

var slider = document.getElementById("stepSlider");


var s = function( p ) {

    function draw_involute_of_circle(center, starting_point, direction, step_to_output) {
        var output_vectors = [];
        p.strokeWeight(2);
        p.stroke('black');

        let radius = starting_point.dist(center);

        var relative_point = starting_point.copy();
        relative_point.sub(center);


        var tengent_point = relative_point.copy();
        tengent_point.rotate(-HALF_PI);
        var angle = 0;
        let delta = -PI/40;


        if (delta*step_to_output<-TWO_PI) {
            p.strokeWeight(4);
            p.stroke('purple');
        }
        p.circle(center.x, center.y, radius+radius);
        p.strokeWeight(4);
        p.stroke('purple');
        p.arc(center.x, center.y, radius+radius, radius+radius, relative_point.heading(), relative_point.heading()+delta*step_to_output);

        p.noFill();
        p.stroke('red');
        p.beginShape();
        for (let i = 0; i < 80; i++) {
            // console.log(relative_point.toString());
            let tg_copy = tengent_point.copy().setMag(radius*angle);
            var drawing_point = relative_point.copy();
            drawing_point.add(center)
            drawing_point.add(tg_copy)
            p.vertex(drawing_point.x, drawing_point.y);
            // p.point(drawing_point.x, drawing_point.y);


            if (i==step_to_output) {
                output_vectors = [drawing_point.copy(), drawing_point.copy().sub(tg_copy)];
            }

            relative_point.rotate(delta);
            tengent_point.rotate(delta);

            angle += delta;
        }
        p.endShape();
        return output_vectors;
    }

    var starting_point = p.createVector(230, 200);
    var step = slider.value;

    slider.oninput = function() {
        step = this.value;
    }
    function move_point() {
        starting_point = createVector(p.mouseX, p.mouseY);
    }


    p.setup = function() {
        var canvas = p.createCanvas(400, 400);
        canvas.mousePressed(move_point);
    };

    p.draw = function() {
        p.background(200);
        p.fill(200);
        let tengent_line = draw_involute_of_circle(createVector(200, 200), starting_point, COUNTER_CLOCK_WISE, step);
        if (tengent_line.length > 0) {
            p.stroke('purple')
            p.line(tengent_line[0].x, tengent_line[0].y, tengent_line[1].x, tengent_line[1].y);
        }
        //noFill();
    };
};
var myp5 = new p5(s, 'involute');


