class Board {
  constructor(options) {
    this.ctx = options.ctx;
    this.columnWidth= options.columnWidth;
    this.rowHeight= options.rowHeight;
    //instrument = options.instrument;
    this.timeLine = options.timeLine;
    this.interval = undefined;
  }

  _drawBoard() {
    this.ctx.beginPath();
    for (var x = 0; x <= this.ctx.canvas.width; x += this.columnWidth) {
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.ctx.canvas.height);
    }
    for (var x = 0; x <= this.ctx.canvas.height; x += this.rowHeight) {
      this.ctx.moveTo(0, x);
      this.ctx.lineTo(this.ctx.canvas.width, x);
    }
    this.ctx.stroke();
  };

  _drawTimeLine() {
    this.ctx.beginPath();
    this.ctx.lineWidth = "2";
    this.ctx.strokeStyle = "green";
    this.ctx.moveTo(this.timeLine.position, 0);
    this.ctx.lineTo(this.timeLine.position, this.ctx.canvas.height);
    this.ctx.closePath();
    this.ctx.stroke();
  };

  /*_drawAccentPosition(){

  };*/

  _update(){
    this._clean();
    this._drawBoard()
    this._drawTimeLine();
    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  };
  
  /*_assignControlsToKeys() {
    document.addEventListener('keydown', e => {
      if(e.keyCode === 32){this.instrument.sound()}
    })
  };*/

  _clean(){
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  };
  
  /*gameOver(){

  };*/
  
  init(){
    this._drawBoard();
    this.timeLine._move();
    this.interval = window.requestAnimationFrame(this._update.bind(this));
    //this._assignControlsToKeys();
  };
}