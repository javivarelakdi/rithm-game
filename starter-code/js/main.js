const ctx;
const board;
document.addEventListener('DOMContentLoaded', (event) => {
  //the DOM is ready, we can do what we want!
  let canvas = document.getElementById('rithm')
  ctx = canvas.getContext('2d');
  const widthCell = 16;
  const options = {
    ctx,
    columns: canvas.width / widthCell,
    maxCells: widthCell,
    instrument: new Instrument('high', [0,3,7,10,12], 'red'),
    timeLine: new TimeLine(1)
  }

  board = new Board(options);

  function init() {
    board.init();
  }
})