let ctx;
let board;
document.addEventListener('DOMContentLoaded', (event) => {
  //the DOM is ready, we can do what we want!
  let canvas = document.getElementById('rithm')
  ctx = canvas.getContext('2d');
  const widthCell = 16;

  board = new Board({
    ctx,
    columns: canvas.width / widthCell,
    maxCells: widthCell,
    instrument
  });

  function init() {
    board.init();
  }
})