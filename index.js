window.onload = function () {

  const canvas = document.getElementById("paint-canvas");
  const context = canvas.getContext("2d");
  const boundings = canvas.getBoundingClientRect();

  let selectedTexture = '1.png';
  let mouseX = 0;
  let mouseY = 0;
  let scale = 1.0;
  let effectNumber = 0;
  context.lineWidth = 1;

  let isDrawing = false;


  const textures = document.getElementsByClassName('texture');

  for(let i = 0; i < textures.length; i++) {
    textures[i].addEventListener('click', function(event) {
      const img = textures[i].getElementsByTagName('img')[0];
      selectedTexture = img.src.slice(img.src.lastIndexOf('/') + 1);

      for(let j = 0; j < textures.length; j++) {
        textures[j].classList.remove('active');
      }
      textures[i].classList.add('active');
    });
  }


  const brushes = document.getElementsByClassName('brush_wrapper');

  for(let i = 0; i <brushes.length; i++) {
    brushes[i].addEventListener('click', function() {
      context.lineWidth = (i + 1);

      for(let j = 0; j < brushes.length; j++) {
        brushes[j].classList.remove('active');
      }
      brushes[i].classList.add('active');
    });
  }


  const effects = document.getElementsByClassName('effect');

  for(let i = 0; i <effects.length; i++) {
    effects[i].addEventListener('click', function() {
      effectNumber = i;

      for(let j = 0; j < effects.length; j++) {
        effects[j].classList.remove('active');
      }
      effects[i].classList.add('active');
    });
  }


  canvas.addEventListener('mousedown', function(event) {
    setMouseCoordinates(event);
    isDrawing = true;

    context.beginPath();
    context.moveTo(mouseX, mouseY);
  });


  canvas.addEventListener('mousemove', function(event) {
    setMouseCoordinates(event);

    if(isDrawing){

      const img = new Image();
      img.src = "textures/" + selectedTexture;

      context.drawImage(img, mouseX, mouseY, context.lineWidth * 15, context.lineWidth * 15);
      context.stroke();
    }
  });


  canvas.addEventListener('mouseup', function(event) {
    setMouseCoordinates(event);
    isDrawing = false;
  });


  canvas.addEventListener('dblclick', function (event) {
    setMouseCoordinates(event);

    switch(effectNumber) {
      case 1: drawSquare(); break;
      case 2: drawExplosion(); break;
      case 3: drawSpiral(); break;
      default: return;
    }

  });


  function drawSquare() {
    for (let step = 10; step < 210; step += 20) {

      for (let x = mouseX - step; x <= mouseX + step; x += 7) {
        let y1 = mouseY - step;
        let y2 = mouseY + step;
        drawSecondEffect(x, y1, 1 + step / 30, 1 + step / 30);
        drawSecondEffect(x, y2, 1 + step / 30, 1 + step / 30);
      }

      for (let y = mouseY - step; y <= mouseY + step; y += 7) {
        let x1 = mouseX - step;
        let x2 = mouseX + step;
        drawSecondEffect(x1, y, 1 + step / 30, 1 + step / 30);
        drawSecondEffect(x2, y, 1 + step / 30, 1 + step / 30);
      }
    }
  }


  function drawExplosion() {
    for (let a = 0; a < Math.PI * 2 + 0.01; a += Math.PI / 4) {

      for (let r = 1.0; r < 628; r *= 1.05) {
        let x = mouseX + r * Math.sin(a);
        let y = mouseY + r * Math.cos(a);

        let rr = 5 + (Math.sin(r / 20) + 1) * 20;

        drawSecondEffect(x, y, rr, rr);
      }
    }
  }


  function drawSpiral() {
    let r = 5;

    for (let a = 0; a < 100; a += 0.1) {
      r *= 1.01;
      let x = mouseX + r * Math.sin(a);
      let y = mouseY + r * Math.cos(a);
      drawSecondEffect(x, y, r / 5, r / 5);
    }
  }


  function drawFirstEffect(x, y, w, h) {
    let rw = w * scale;
    let rh = h * scale;

    const img = new Image();
    img.src = "textures/" + selectedTexture;

    context.drawImage(img, x - rw / 2, y - rh / 2, rw, rh);
    scale *= 1.01;
  }


  function drawSecondEffect(x, y, w, h) {
    const img = new Image();
    img.src = "textures/" + selectedTexture;
    context.drawImage(img, x - w / 2, y - h / 2, w, h);
  }


  function setMouseCoordinates(event) {
    mouseX = event.clientX - boundings.left;
    mouseY = event.clientY - boundings.top;
  }

  const clearButton = document.getElementById('clear');

  clearButton.addEventListener('click', function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  const saveButton = document.getElementById('save');

  saveButton.addEventListener('click', function() {
    const imageName = prompt('Please enter image name');
    const canvasDataURL = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = canvasDataURL;
    a.download = imageName || 'drawing';
    a.click();
  });
};
