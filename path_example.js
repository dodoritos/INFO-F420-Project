
var t = function( p ) {
    let draw_angle;

    let polygon = [];
    var s;
    var t;

    function draw_polygon() {
        p.beginShape();
        for (ppoint of polygon) {
            p.vertex(ppoint.x, ppoint.y);
        }
        p.endShape();
    }


    function draw_path() {
        p.beginShape();
        p.vertex(s.x, s.y);
        p.vertex(polygon[1].x, polygon[1].y);
        p.vertex(polygon[6].x, polygon[6].y);
        p.vertex(t.x, t.y);
        p.endShape();
    }

    function draw_sap() {
        const radius = t.copy().sub(polygon[6]).mag()*2;
        p.arc(t.x, t.y, radius, radius, polygon[6].copy().sub(t).heading()-HALF_PI/3, polygon[6].copy().sub(t).heading());
        let tmp = polygon[6].copy().sub(t).rotate(-HALF_PI/3);
        tmp.add(t);
        p.line(tmp.x, tmp.y, polygon[1].x, polygon[1].y);
        let tmp2 = createVector(tmp.x, tmp.y).sub(createVector(polygon[1].x, polygon[1].y));
        const radius2 = tmp2.mag()*2;
        // p.arc(tmp.x, tmp.y, radius2,radius2,tmp2.heading()+PI,PI-HALF_PI/4);

        let circle = new CircleEq(radius/2, t);
        //let circle = new CircleEq(radius/5, t);
        //circle.draw(p, 0, TWO_PI)
        const lenght_of_the_line = tmp2.mag();
        const lenght_of_the_arc = radius*HALF_PI/3;
        // const degree_of_start = tmp.heading()+lenght_of_the_arc;
        //const degree_of_start = -polygon[6].copy().sub(t).heading();
        const degree_of_start = -tmp.sub(t).heading() + lenght_of_the_line/radius*2;
        const degree_of_draw_start = tmp.sub(t).heading()+0.21;
        const degree_of_draw_end = degree_of_draw_start + HALF_PI/3;
        // console.log(" :"+degrees(lenght_of_the_line/radius*2));
        console.log(degree_of_start)
        let inv = new InvoluteOfCircle(circle, degree_of_start);
        console.log(lenght_of_the_line)
        console.log(lenght_of_the_arc)
        //inv.draw(p,radians(lenght_of_the_line), radians(lenght_of_the_line+lenght_of_the_arc), false);

        p.stroke('purple');
        inv.draw(p,degree_of_draw_start, degree_of_draw_end, true);
    }

    p.setup = function() {
        p.createCanvas(500, 500);
        p.noFill();

        polygon.push(createVector(160,100));
        polygon.push(createVector(160,320));
        polygon.push(createVector(350,100));
        polygon.push(createVector(400,200));
        polygon.push(createVector(400,350));
        polygon.push(createVector(350,350));
        polygon.push(createVector(350,200));
        polygon.push(createVector(150,400));
        polygon.push(createVector(70,100));
        polygon.push(polygon[0]);

        s = createVector(150,200);
        t = createVector(360,300);

        redraw();
    };

    function redraw() {

        p.background(200);
        p.strokeWeight(1);
        p.noFill();

        p.stroke('black');

        draw_polygon();
        p.strokeWeight(3);
        p.stroke('blue');
        p.point(s);
        p.point(t);
        draw_path();
        p.stroke('red');
        draw_sap();
    }

    p.draw = function() {
    };
};
var myp5 = new p5(t, 'path_example_canvas');
