// set up socket connection
var socket = io.connect();
socket.on('connect', function() {
    console.log("Connected");
});  
let livepeople = [];

//let x = 0;
//let y = 0;

let p5lm;

//let cube;

let start; //button
let shapeChange; // button to change brush shape
let colorChange; // button to change brush color

let r = 0;
let g = 0;
let b = 0;
let rs = 0;
let gs = 0;
let bs = 0;

let sizeChangex; // button to change brush shape
let sizeChangex2; // button to change brush shape

let sizeChangey; // button to change brush shape
let sizeChangey2; // button to change brush shape

let sizeChangez; // button to change brush shape
let sizeChangez2; // button to change brush shape

let strokeMode;
let strokeMode1;

let boxL = 50;
let boxW = 50;
let boxH = 50;

let frameR;

let shapeFill;
let saveImg;
function windowResized(){
  resizeCanvas(windowWidth, windowHeight, WEBGL)
}
function setup() {
  socket = io.connect('http//zjl5636.itp.io:90')
  //frameRate(10);
  x = random(width);
  y = random(height);
  let myCanvas = createCanvas(windowWidth, windowHeight, WEBGL);

  background(250);

  p5lm = new p5LiveMedia(this, "DATA", null, "blahblabhbababab"); //p5lm - p5.js Live media to sent and receive data
  p5lm.on("data", gotData);
  p5lm.on("disconnect", gotDisconnect);
  angleMode(DEGREES);
  start = createButton("Start");
  start.style("font-size", "24px");
  start.center();

  start.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "start" }));
    start.remove(); //remove the start button
    background(255);

    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("deviceorientation", (e) => {
            // do something with e
            var alpha = e.alpha,
              beta = e.beta,
              gamma = e.gamma;

            //var elem = document.getElementById('map');
            //map.innerHTML = alpha + " " + beta + " " + gamma;

            console.log(
              Math.floor(alpha) +
                " " +
                Math.floor(beta) +
                " " +
                Math.floor(gamma)
            );
            let dataToSend = {
              x: Math.floor(gamma),
              y: Math.floor(beta),
              rotation: Math.floor(alpha),
            };

            p5lm.send(JSON.stringify(dataToSend));
          });
        }
      })
      .catch(console.error);
  });

  background(220);

  //buttons to reseze the shape
  sizeChangex = createButton("Add width");
  sizeChangex.size(100, 20);
  sizeChangex.position(0, 0);
  sizeChangex.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "addwidth" }));
    sizeShapex();
  });

  sizeChangex2 = createButton("Reduce W");
  sizeChangex2.size(100, 20);
  sizeChangex2.position(0, 20);
  sizeChangex2.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "reducew" }));
    sizeShapex2();
  });

  sizeChangey = createButton("Add H");
  sizeChangey.size(100, 20);
  sizeChangey.position(100, 0);
  sizeChangey.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "addh" }));
    sizeShapey();
  });
  sizeChangey2 = createButton("reduce H");
  sizeChangey2.size(100, 20);
  sizeChangey2.position(100, 20);
  sizeChangey2.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "reduceh" }));
    sizeShapey2();
  });

  sizeChangez = createButton("Add L");
  sizeChangez.size(100, 20);
  sizeChangez.position(200, 0);
  sizeChangez.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "addl" }));
    sizeShapez();
  });

  sizeChangez2 = createButton("Reduce L");
  sizeChangez2.size(100, 20);
  sizeChangez2.position(200, 20);
  sizeChangez2.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "reducel" }));
    sizeShapez2();
  });

  //button for color change
  ColorChange = createButton("Brush Color");
  ColorChange.position(300, 0);
  ColorChange.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "brushcolor" }));
    changeColor();
  });
  ColorChange.size(100, 20);

  shapeFill = createButton("No Fill");
  shapeFill.position(300, 20);
  shapeFill.size(100, 20);
  shapeFill.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "nofill" }));
    NoneFill();
  });

  //random color start
  r = random(255);
  g = random(255);
  b = random(255);
  //buttons for stroke elements
  strokeMode = createButton("No stroke");
  strokeMode.position(400, 0);
  strokeMode.size(100, 20);
  strokeMode.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "nostroke" }));
    strokedisable();
  });

  strokeMode1 = createButton("Enable stroke");
  strokeMode1.position(500, 0);
  strokeMode1.size(100, 20);
  strokeMode.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "enablestroke" }));
    strokeEnable();
  });
  strokeMode2 = createButton("Stroke Color");
  strokeMode2.position(400, 20);
  strokeMode1.size(100, 20);
  strokeMode.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "strokecolor" }));
    changeStrokeColor();
  });

  // slider for subdivisions
  //frameRate(10);

  frameR = createSlider(1, 255, 100);
  frameR.position(500, 20);
  frameR.style("width", "100px");
  let val = frameR.value();
  frameRate(val);

  saveImg = createButton("Save Img");
  saveImg.position(600, 20);
  saveImg.size(100, 20);
  saveImg.mousePressed(function () {
    p5lm.send(JSON.stringify({ button: "saveimg" }));
    saveImage(saveImage);
  });

  fill(r, g, b);

}

function draw() {
  // stroke(255,0,0);
  //fill(255,0,0);
  // background(150);

  for (let i = 0; i < livepeople.length; i++) {
    push();
    translate(livepeople[i].x, livepeople[i].y);
    // translate (windowWidth,windowHeight);

    rotate(livepeople[i].rotation);

    strokeMode.mousePressed(strokedisable);
    strokeMode1.mousePressed(strokeEnable);
    strokeMode2.mousePressed(changeStrokeColor);

    shapeFill.mousePressed(NoneFill);
    ColorChange.mousePressed(changeColor);
    //rotateX(angle);
    //rotateY(angle);
    box(boxL, boxW, boxH);

    //rect(0,0,10,10); //rect(x, y, w, h, [detailX], [detailY])
    pop();
  }
}

function gotDisconnect(id) {
  print(id + ": disconnected");
}

function gotData(data, id) {
  //print(id + ":" + data);

  // If it is JSON, parse it
  let d = JSON.parse(data);
  if (d.button) {
    if (d.button == "addwidth") {
      sizeShapex();
     } else {
      if (d.button == "reducew") {
        sizeShapex2();
      } else {
        if (d.button == "addh") {
          sizeShapey();
        } else {
          if (d.button == "reduceh") {
            sizeShapey2();
          } else {
            if (d.button == "addl") {
              sizeShapez();
            } else {
              if (d.button == "reducel") {
                sizeShapez2();
              } else {
                if (d.button == "brushcolor") {
                  changeColor();
                } else {
                  if (d.button == "nofill") {
                    NoneFill();
                  } else {
                    if (d.button == "strokeColor") {
                      changeStrokeColor();
                    } else {
                      if (d.button == "enableStroke") {
                        strokeEnable();
                      } else {
                        if (d.button == "disableStroke") {
                          strokedisable();
                        } else {
                          if (d.button == "start") {
                            start.remove(); //remove the start button
                            //background(150);
                          } else {
                            if (d.button == "saveimg") {
                              saveImage(saveImage);
                            }else{
                              
                            } 
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  // Let's see if this user is here already
  let herealready = false;
  for (let i = 0; i < livepeople.length; i++) {
    if (livepeople[i].id == id) {
      herealready = true;
      // console.log(d.x, d.y); //consolelog the data from phone rotation
      let x = map(d.x, 0, 180, 0, width);
      let y = map(d.y, 0, 180, 0, height);
      livepeople[i].x = x;
      livepeople[i].y = y;
      // livepeople[i].rotation = d.rotation;
    }
  
  }
  if (herealready == false) {
    let newliveperson = { id: id, x: d.x, y: d.y, rotation: d.rotation };
    livepeople.push(newliveperson);
  }

  // x = d.x;
  // y = d.y;
}



function saveImage(saveImage) {
  saveCanvas();
  ellipse(10, 130, 10);
}
function changeColor() {
  r = random(255);
  g = random(255);
  b = random(255);
}
//Add X
function sizeShapex() {
  if (boxL < width) {
    boxL = boxL + 3;
  }
}
//add Y
function sizeShapey() {
  if (boxW < height) {
    boxW = boxW + 5;
  }
}
//zdd z
function sizeShapez() {
  boxH = boxH + 5;
}
//reduce x
function sizeShapex2() {
  boxL = boxL - 5;
}
//reduce Y
function sizeShapey2() {
  boxW = boxW - 5;
}
//reduce z
function sizeShapez2() {
  boxH = boxH - 5;
}
//disable stroke
function strokedisable() {
  noStroke();
}
//change strokestate
function strokeEnable() {
  stroke(rs, gs, bs);
}
function changeStrokeColor() {
  push();
  rs = random(255);
  gs = random(255);
  bs = random(255);
  pop();

  stroke(rs, gs, bs);
}
function changeShape() {
  ellipsoid(boxL, boxW, boxH, detailY.value());
  //rect(30,30,20,10)
}
function NoneFill() {
  noFill();
}



