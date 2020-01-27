let canvas = document.getElementById('rithm')
const ctx = canvas.getContext('2d');
document.addEventListener('DOMContentLoaded', (event) => {
  //the DOM is ready, we can do what we want!
  const maxColumns = 16;
  const maxRows = 3
  canvas.width = document.querySelector('.container').offsetWidth;
  canvas.height = document.querySelector('.container').offsetHeight;
  const options = {
    ctx,
    columnWidth: canvas.width / maxColumns,
    rowHeight: canvas.height / maxRows,
    timeLine: new TimeLine(ctx),
    //instrument: new Instrument('high', [0,3,7,10,12], 'red'),
  }

  const board = new Board(options);
  board.init();
})

