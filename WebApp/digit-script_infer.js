var canvas, ctx, saveButton, clearButton;
var pos = {x:0, y:0};
var rawImage;
var model;

async function getModel() {
    const MODEL_URL = 'http://127.0.0.1:8887/model.json';
    const  model = await tf.loadLayersModel(MODEL_URL);
    console.log(model.summary());
    return model
}

function setPosition(e){
    pos.x = e.clientX-100;
    pos.y = e.clientY-100;
}
     
function draw(e) {
    if(e.buttons!=1) return;
    ctx.beginPath();
    ctx.lineWidth = 24;
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';
    ctx.moveTo(pos.x, pos.y);
    setPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    rawImage.src = canvas.toDataURL('image/png');
}
    
function erase() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,280,280);
}

// model.then(function (res) {
//     const example = tf.browser.fromPixels(canvas);
//     const prediction = res.predict(example);
//     console.log(prediction);
// }, function (err) {
//     console.log(err);
// });

function save() {
    var raw = tf.browser.fromPixels(rawImage,1);
    var resized = tf.image.resizeBilinear(raw, [28,28]);
    var tensor = resized.expandDims(0);
    
    var prediction = model.predict(tensor);
    var pIndex = tf.argMax(prediction, 1).dataSync();
    
    var classNames = ["1", "2", "3", 
                      "4", "5", "6", "7",
                      "8",  "9", "10"];
            
            
    alert(classNames[pIndex]);
}
    
function init() {
    canvas = document.getElementById('canvas');
    rawImage = document.getElementById('canvasimg');
    ctx = canvas.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,280,280);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mousedown", setPosition);
    canvas.addEventListener("mouseenter", setPosition);
    saveButton = document.getElementById('sb');
    saveButton.addEventListener("click", save);
    clearButton = document.getElementById('cb');
    clearButton.addEventListener("click", erase);
}


async function run() {
    const model = getModel();
    init();
    //alert("Training is done, try classifying your drawings!");
}

document.addEventListener('DOMContentLoaded', run);