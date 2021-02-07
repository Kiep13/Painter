let canvas;
let context;
let boundings;

let selectedTexture = '1.png';
let mouseX = 0;
let mouseY = 0;
let scale = 1.0;
let effectNumber;
let image;

let isDrawing = false;

window.onload = function () {

  canvas = document.getElementById("paint-canvas");
  context = canvas.getContext("2d");
  context.lineWidth = 1;
  boundings = canvas.getBoundingClientRect();

  image = document.createElement('img');
  image.src = "textures/" + selectedTexture;

  canvas.addEventListener('mousedown', function (event) {
    setMouseCoordinates(event);
    isDrawing = true;

    context.beginPath();
    context.moveTo(mouseX, mouseY);
  });

  canvas.addEventListener('mousemove', function (event) {
    setMouseCoordinates(event);

    if (isDrawing) {
      context.drawImage(image, mouseX, mouseY, context.lineWidth * 15, context.lineWidth * 15);
      context.stroke();
    }
  });

  canvas.addEventListener('mouseup', function (event) {
    setMouseCoordinates(event);
    isDrawing = false;
  });

  canvas.addEventListener('dblclick', function (event) {
    setMouseCoordinates(event);

    switch (effectNumber) {
      case 1:
        drawSquare();
        break;
      case 2:
        drawExplosion();
        break;
      case 3:
        drawSpiral();
        break;
      default:
        return;
    }
  });
};

function setMouseCoordinates(event) {
  mouseX = event.clientX - boundings.left;
  mouseY = event.clientY - boundings.top;
}

function drawImage(x, y, w, h) {
  context.drawImage(image, x - w / 2, y - h / 2, w, h);
}

function drawSquare() {
  for (let step = 10; step < 210; step += 20) {

    for (let x = mouseX - step; x <= mouseX + step; x += 7) {
      let y1 = mouseY - step;
      let y2 = mouseY + step;
      drawImage(x, y1, 1 + step / 30, 1 + step / 30);
      drawImage(x, y2, 1 + step / 30, 1 + step / 30);
    }

    for (let y = mouseY - step; y <= mouseY + step; y += 7) {
      let x1 = mouseX - step;
      let x2 = mouseX + step;
      drawImage(x1, y, 1 + step / 30, 1 + step / 30);
      drawImage(x2, y, 1 + step / 30, 1 + step / 30);
    }
  }
}

function drawExplosion() {
  for (let a = 0; a < Math.PI * 2 + 0.01; a += Math.PI / 4) {

    for (let r = 1.0; r < 628; r *= 1.05) {
      let x = mouseX + r * Math.sin(a);
      let y = mouseY + r * Math.cos(a);

      let rr = 5 + (Math.sin(r / 20) + 1) * 20;

      drawImage(x, y, rr, rr);
    }
  }
}

function drawSpiral() {
  let r = 5;

  for (let a = 0; a < 100; a += 0.1) {
    r *= 1.01;
    let x = mouseX + r * Math.sin(a);
    let y = mouseY + r * Math.cos(a);
    drawImage(x, y, r / 5, r / 5);
  }
}

function selectTexture(value) {
  selectedTexture = `${value}.png`;
  image.src = "textures/" + selectedTexture;

  const textures = document.getElementsByClassName('texture');
  for (let i = 0; i < textures.length; i++) {
    textures[i].classList.remove('active');
  }

  document.getElementById(`texture${value}`).classList.add('active');
}

function selectBrush(value) {
  context.lineWidth = +value;

  const brushes = document.getElementsByClassName('brush_wrapper');
  for (let i = 0; i < brushes.length; i++) {
    brushes[i].classList.remove('active');
  }

  document.getElementById(`brush${value}`).classList.add('active');
}

function selectEffect(value) {
  effectNumber = +value;

  const effects = document.getElementsByClassName('effect');
  for (let i = 0; i < effects.length; i++) {
    effects[i].classList.remove('active');
  }

  document.getElementById(`effect${value}`).classList.add('active');
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function save() {
  const imageName = prompt('Please enter image name');
  const canvasDataURL = canvas.toDataURL();
  const a = document.createElement('a');
  a.href = canvasDataURL;
  a.download = imageName || 'drawing';
  a.click();
}
