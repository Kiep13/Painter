window.onload = function () {

  const canvas = document.getElementById("paint-canvas");
  const context = canvas.getContext("2d");
  const boundings = canvas.getBoundingClientRect();
  console.log(boundings);

  let selectedTexture = '1.png';
  let mouseX = 0;
  let mouseY = 0;
  context.lineWidth = 1; // initial brush width

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

      console.log(img.width, img.height, context.lineWidth);
      context.drawImage(img, mouseX, mouseY, context.lineWidth * 15, context.lineWidth * 15);
      context.stroke();
    }
  });


  canvas.addEventListener('mouseup', function(event) {
    setMouseCoordinates(event);
    isDrawing = false;
  });


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
