let canvas = document.getElementById('rhythm')
const ctx = canvas.getContext('2d');
const soundsSrc = {
  high:'./sounds/high.wav',
  base:'./sounds/base.wav',
  ctp: './sounds/ctp.wav',
  aplause: './sounds/aplause.wav',
}
const accomplished = [];
document.addEventListener('DOMContentLoaded', (event) => {
  //the DOM is ready, we can do what we want!
  const maxColumns = 16;
  const maxRows = 3
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
    timeLine: new TimeLine(ctx)
  }
  const board = new Board(options);
  board._drawBoard();
  board._drawAccents()
  document.getElementById('start').addEventListener('click', board.init.bind(board));
  document.getElementById('high').addEventListener('click', board._selectInstrument.bind(board));
  document.getElementById('base').addEventListener('click', board._selectInstrument.bind(board));
  document.getElementById('ctp').addEventListener('click', board._selectInstrument.bind(board));
})


