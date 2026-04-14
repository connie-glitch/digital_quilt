let grid = [];
let cols = 10;
let rows = 10;
let cellSize;
let colors = ['#ffffff', '#000000', '#feea09', '#f8a0d2','#1f91cf','#f74f12']; // Limited palette
let currentColor = 1;
let showGrid = true; // default to showing grid
let symmetryGraphics; // offscreen buffer for 45° radial symmetry
let symmetryCanvas; // separate canvas for symmetry display

angleMode(RADIANS);

function setup() {


const clickBtn = document.getElementById("saveBtn");
const popup = document.getElementById("popup");
const closeBtn = document.getElementById("closeBtn");

clickBtn.addEventListener('click', ()=>{
    // Copy the symmetry canvas to the popup preview (without grid)
    let popupPreview = document.getElementById('popup-preview');
    let previewCtx = popupPreview.getContext('2d');
    
    // Temporarily disable grid for preview
    let originalShowGrid = showGrid;
    showGrid = false;
    
    // Redraw symmetry canvas without grid
    drawSymmetry45Preview();
    
    // Get image data from symmetryCanvas and draw to popup preview
    let symmetryCtx = symmetryCanvas.getContext('2d');
    let imageData = symmetryCtx.getImageData(0, 0, 500, 500);
    previewCtx.putImageData(imageData, 0, 0);
    
    // Restore original grid setting
    showGrid = originalShowGrid;
    
    popup.style.display = 'block';
});
closeBtn.addEventListener('click', ()=>{
    popup.style.display = 'none';
});
// Close popup only when clicking the backdrop, not the form content
const popupContainer = document.querySelector('.popup-container');
popupContainer.addEventListener('click', (e)=>{
    if (e.target === popupContainer) {
        popup.style.display = 'none';
    }
});
// Prevent form clicks from closing the popup
document.querySelector('.popup').addEventListener('click', (e)=>{
    e.stopPropagation();
});




  let mainCanvas = createCanvas(350, 350);
  mainCanvas.parent('main-canvas');
  cursor(HAND);
  cellSize = width / cols;
  // Create offscreen graphics buffer for symmetry preview
  symmetryGraphics = createGraphics(500, 500);
  // Create canvas element for symmetry display
  symmetryCanvas = document.createElement('canvas');
  symmetryCanvas.width = 500;
  symmetryCanvas.height = 500;
  symmetryCanvas.style.border = '1px solid #939393';
  symmetryCanvas.style.background = 'white';
  document.getElementById('symmetry-canvas').appendChild(symmetryCanvas);
  // Initialize grid with 0 (default color)
  for (let i = 0; i < cols; i++) {
    grid[i] = [];
    for (let j = 0; j < rows; j++) {
      grid[i][j] = 0;
    }
  }
}

function draw() {
  background(220);
  // apply stroke/noStroke according to showGrid
  if (showGrid) {
    stroke(1);
  } else {
    noStroke();
  }
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      fill(colors[grid[i][j]]);
      rect(i * cellSize, j * cellSize, cellSize, cellSize);
    }
  }
  
  // Draw and display the 45° symmetry preview
  drawSymmetry45Preview();
}

function drawSymmetry45Preview() {
  if (!symmetryCanvas) return;
  
  let ctx = symmetryCanvas.getContext('2d');
  ctx.fillStyle = '#dccccc';
  ctx.fillRect(0, 0, 500, 500);
  
  let cellSizeSym = 500 / cols / 2; // Half size for 2x2 grid
  let tileSize = 250; // Half of canvas for each tile
  
  // Draw 2x2 preview with the requested flip relationship
  // Bottom-left is the base tile.
  // Top-left is the vertical flip of bottom-left.
  // Top-right is the rotated tile for the second quadrant.
  // Bottom-right is the vertical flip of top-right.
  let tileConfigs = [
    { x: 0, y: 0, flipX: false, flipY: true },
    { x: tileSize, y: 0, flipX: true, flipY: true },
    { x: 0, y: tileSize, flipX: false, flipY: false },
    { x: tileSize, y: tileSize, flipX: true, flipY: false }
  ];

  tileConfigs.forEach(tile => {
    ctx.save();
    ctx.translate(tile.x, tile.y);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let drawI = tile.flipX ? cols - 1 - i : i;
        let drawJ = tile.flipY ? rows - 1 - j : j;

        ctx.fillStyle = colors[grid[drawI][drawJ]];
        ctx.fillRect(i * cellSizeSym, j * cellSizeSym, cellSizeSym, cellSizeSym);

        if (showGrid) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 0.2;
          ctx.strokeRect(i * cellSizeSym, j * cellSizeSym, cellSizeSym, cellSizeSym);
        }
      }
    }

    ctx.restore();
  });
}

function mousePressed() {
  // Determine which cell was clicked
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);
  
  // Fill cell if within bounds
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    grid[i][j] = currentColor;
  }
}

function mouseDragged() {
  let i = floor(mouseX / cellSize);
  let j = floor(mouseY / cellSize);
  
  // Fill cell if within bounds
  if (i >= 0 && i < cols && j >= 0 && j < rows) {
    grid[i][j] = currentColor;
  }
}

// Change color with keys
function keyPressed() {
  if (key === '1') currentColor = 1;
  if (key === '2') currentColor = 2;
  if (key === '3') currentColor = 3;
  if (key === '4') currentColor = 4;
   if (key === '5') currentColor = 5;
  if (key === '6') currentColor = 0;
  if (key === 'c') {
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0; //clear grid
      }
    }
  }
  if (key === 'g') {
    showGrid = !showGrid; // toggle grid visibility
  }
}
