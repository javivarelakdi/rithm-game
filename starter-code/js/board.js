class Board {
  constructor(options) {
    this.ctx = options.ctx;
    this.columns = options.columns;
    this.maxCells = options.maxCells;
    instrument = options.instrument;
    timeLine = options.timeLine;
  }

  _drawBoard() {
    
  };

  _drawTimeLine() {

  };

   _drawAccentPosition(){

  };

  _update(){

  };
  
  _assignControlsToKeys() {
    document.addEventListener('keydown', e => {
      if(e.keyCode === 32){this.instrument.sound()}
    })
  };

  _clean(){

  };
  
  gameOver(){

  };
  
  init(){
    this._assignControlsToKeys();
    this.timeLine.move();
    this.interval = window.requestAnimationFrame(this._update.bind(this));
  };
}