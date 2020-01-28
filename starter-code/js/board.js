class Board {
  constructor(options) {
    this.ctx = options.ctx;
    this.columnWidth= options.columnWidth;
    this.rowHeight= options.rowHeight;
    this.rithm = options.rithm;
    this.timeLine = options.timeLine;
    this.interval = undefined;
    this.soundsSrc = options.soundsSrc;
    this.mySounds = {};
  }

  _drawBoard() {
    this.ctx.beginPath();
    this.ctx.lineWidth = "2";
    this.ctx.strokeStyle = "black";
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
    this.ctx.strokeStyle = "grey";
    this.ctx.moveTo(this.timeLine.position, 0);
    this.ctx.lineTo(this.timeLine.position, this.ctx.canvas.height);
    this.ctx.stroke();
  };

  _drawAccents(){
    for (const proptAccents in this.rithm.accents){
      for (const proptColors in this.rithm.colors){
        if ( proptColors === proptAccents){
          this.ctx.fillStyle=this.rithm.colors[proptColors];
        }
        this.rithm.accents[proptAccents].forEach(accentPosition => {
          const y = proptAccents === 'high'
            ? 0 
            : proptAccents === 'base'
              ? 1
              : 2;
          
          this.ctx.fillRect(this.columnWidth * accentPosition, this.rowHeight * y, this.columnWidth, this.rowHeight);
        });
      }
    }
  };
  
  _crash(accentType){
    for (const propt in this.rithm.accents){
      this.rithm.accents[propt].forEach(accentPosition => {
        if ((propt === accentType) && (this.columnWidth * accentPosition === this.timeLine.position)){
          //this.mySounds[propt].play();
        }
      });
    }
  }

  _update(){
    this._clean();
    this._drawBoard()
    this._drawAccents();
    this._drawTimeLine();
    this._crash('high');
    this._crash('base');
    this._crash('ctp');
    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  };

  _startPlayback() {
    return this.mySounds.high.play();
  }
  
  _assignControlsToKeys() {
    document.addEventListener('keydown', e => {
      if(e.keyCode === 32){
        this._startPlayback().then(function() {
          console.log('The play() Promise fulfilled! Rock on!');
        }).catch(function(error) {
          console.log('The play() Promise rejected!');
          console.log(error);
        }
      )};
    });                 
  };

  _clean(){
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  };
  
  /*gameOver(){

  };*/
  
  init(){
    this.interval = window.requestAnimationFrame(this._update.bind(this));
    this.mySounds['high'] = this.rithm._createSoundElement(this.soundsSrc['high']);
    this.mySounds['base'] = this.rithm._createSoundElement(this.soundsSrc['base']);
    this.mySounds['ctp'] = this.rithm._createSoundElement(this.soundsSrc['ctp']);
    this._assignControlsToKeys();
    this._drawBoard();
    this.timeLine._move();
  };
}