let canvas = document.getElementById('rithm')
const ctx = canvas.getContext('2d');
document.addEventListener('DOMContentLoaded', (event) => {
  //the DOM is ready, we can do what we want!
  const maxColumns = 16;
  const maxRows = 3
  const sambaReagge = {
    ctx,
    name: 'samba reagge',
    accents: {
      high: [0,3,7,10,12],
      base: [0,4,8,12],
      ctp: [6,13,14]
    },
    colors : {
      high:'#B11E31',
      base:'#F8AD1E',
      ctp: '#166138'
    }
  };
  canvas.width = document.querySelector('.container').offsetWidth;
  canvas.height = document.querySelector('.container').offsetHeight;
  const options = {
    ctx,
    columnWidth: canvas.width / maxColumns,
    rowHeight: canvas.height / maxRows,
    timeLine: new TimeLine(ctx),
    rithm: new Rithm(sambaReagge),
    soundsSrc :{
      high:'../sounds/high.wav',
      base:'../sounds/base.wav',
      ctp: '../sounds/ctp.wav'
    }
  }

  const board = new Board(options);
  board.init();
})

