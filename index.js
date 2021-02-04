window.onload = function () {

  // Definitions
  const canvas = document.getElementById("paint-canvas");
  const context = canvas.getContext("2d");
  const boundings = canvas.getBoundingClientRect();

  // Specifications
  let selectedTexture = '1.png';
  let mouseX = 0;
  let mouseY = 0;
  context.strokeStyle = 'black'; // initial brush color
  context.lineWidth = 1; // initial brush width

  let isDrawing = false;


  //Handle Textures
  const textures = document.getElementsByClassName('texture');

  for(let i = 0; i < textures.length; i++) {
    textures[i].addEventListener('click', function(event) {
      //context.strokeStyle = event.target.value || 'black';
      const img = textures[i].childNodes[0];
      console.log(textures[i], textures[i].childNodes[0]);
      //selectedTexture = img.src.slice(img.src.lastIndexOf('/') + 1);
    });
  }

  // Handle Brushes
  const brushes = document.getElementsByClassName('brush_wrapper');
  console.log(brushes);

  for(let i = 0; i <brushes.length; i++) {
    brushes[i].addEventListener('click', function() {
      context.lineWidth = (i + 1);
    });
  }

  // Mouse Down Event
  canvas.addEventListener('mousedown', function(event) {
    setMouseCoordinates(event);
    isDrawing = true;

    // Start Drawing
    context.beginPath();
    context.moveTo(mouseX, mouseY);
  });

  // Mouse Move Event
  canvas.addEventListener('mousemove', function(event) {
    setMouseCoordinates(event);

    if(isDrawing){

      const img = new Image();
      img.src = "textures/" + selectedTexture;
      //img.width = context.lineWidth * 10;
      //img.height = context.lineWidth * 10;

      console.log(img.width, img.height, context.lineWidth);
      context.drawImage(img, mouseX, mouseY, context.lineWidth * 10, context.lineWidth * 10);
      //context.lineTo(mouseX, mouseY);
      context.stroke();
    }
  });

  // Mouse Up Event
  canvas.addEventListener('mouseup', function(event) {
    setMouseCoordinates(event);
    isDrawing = false;
  });

  // Handle Mouse Coordinates
  function setMouseCoordinates(event) {
    mouseX = event.clientX - boundings.left;
    mouseY = event.clientY - boundings.top;
  }

  //Handle Clear Button
  const clearButton = document.getElementById('clear');

  clearButton.addEventListener('click', function() {
    context.clearRect(0, 0, canvas.width, canvas.height);
  });

  // Handle Save Button
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
