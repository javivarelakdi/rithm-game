let canvas = document.getElementById('rithm')
const ctx = canvas.getContext('2d');
const soundsSrc = {
  high:'/starter-code/sounds/high.wav',
  base:'/starter-code/sounds/base.wav',
  ctp: '/starter-code/sounds/ctp.wav'
}

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
      high:'#d29803',
      base:'#2F4D50',
      ctp: 'green'
    }
  };
  //canvas.width = document.querySelector('.container').offsetWidth;
  //canvas.height = document.querySelector('.container').offsetHeight;
  
  const sounds = Object.values(soundsSrc);

  // preload all sounds
  Promise.all(
    sounds.map(sound => {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        // once this file loads, it will call loadedAudio()
        // the file will be kept by the browser as cache
        audio.addEventListener('canplaythrough', resolve, false);
        audio.src = sound;
      })
    })
  ).then(() => console.log("Success.")).catch(err => console.error(err));

  const options = {
    ctx,
    columnWidth: canvas.width / maxColumns,
    rowHeight: canvas.height / maxRows,
    timeLine: new TimeLine(ctx),
    rithm: new Rithm(sambaReagge)
  }
  const board = new Board(options);
  board._drawBoard();
  board._drawAccents()
  document.getElementById('start').addEventListener('click', board.init.bind(board));
  document.getElementById('high').addEventListener('click', board._selectInstrument.bind(board));
  document.getElementById('base').addEventListener('click', board._selectInstrument.bind(board));
  document.getElementById('ctp').addEventListener('click', board._selectInstrument.bind(board));
})


