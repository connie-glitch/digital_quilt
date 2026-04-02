let grid = [];
let cols = 4;
let rows = 4;
let cellSize;
let colors = ['#ffffff', '#000000', '#ec0808', '#f8a0d2','#1f91cf','#94c309']; // Limited palette
let currentColor = 1;
let showGrid = true; // default to showing grid
let symmetryGraphics; // offscreen buffer for 45° radial symmetry
let symmetryCanvas; // separate canvas for symmetry display

angleMode(RADIANS);

function setup() {
  let mainCanvas = createCanvas(500, 500);
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
  
  // Draw 2x2 grid with custom rotations
  // Top-left: 90°, Top-right: 180°, Bottom-left: 0°, Bottom-right: 270°
  let rotations = [1, 2, 0, 3]; // Multipliers for PI/2
  
  for (let rot = 0; rot < 4; rot++) {
    let x = (rot % 2) * tileSize;
    let y = Math.floor(rot / 2) * tileSize;
    
    ctx.save();
    ctx.translate(x + tileSize / 2, y + tileSize / 2);
    ctx.rotate(rotations[rot] * Math.PI / 2);
    ctx.translate(-tileSize / 2, -tileSize / 2);
    
    // Draw cells for this tile
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        ctx.fillStyle = colors[grid[i][j]];
        ctx.fillRect(i * cellSizeSym, j * cellSizeSym, cellSizeSym, cellSizeSym);
        
        // Draw grid lines if enabled
        if (showGrid) {
          ctx.strokeStyle = '#000';
          ctx.lineWidth = 0.2;
          ctx.strokeRect(i * cellSizeSym, j * cellSizeSym, cellSizeSym, cellSizeSym);
        }
      }
    }
    
    ctx.restore();
  }
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
