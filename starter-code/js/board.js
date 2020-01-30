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
    this.instrument = undefined;
    this.failCounter= 0;
    this.eventFire = 0;
    this.drumHit= function(event){
      this.eventFire++;
      console.log(this.eventFire);
      if(event.keyCode === 81 || event.keyCode === 80){
        this.mySounds[this.instrument].play();
        this._checkIfMomentOk(this.timeLine.position, this.instrument);
      }
    }
    this.drumHitHandler = this.drumHit.bind(this);
  }

  _drawBoard() {
    this.ctx.beginPath();
    this.ctx.lineWidth = "2";
    this.ctx.strokeStyle = "#aaa";
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
    if (this.timeLine.intervalId){
      for (const propt in this.rithm.accents){
        this.rithm.accents[propt].forEach(accentPosition => {
          if (
            propt === accentType && 
            this.timeLine.position >= Math.ceil(this.columnWidth * accentPosition) &&
            this.timeLine.position <= Math.ceil(this.columnWidth * (accentPosition+1)) 
            ){
            this._startPlayback(propt);
          }
        });
      }
    }
  }

  _update(){
    this._clean();
    this._drawBoard()
    this._drawAccents();
    this._drawTimeLine();
    switch (this.instrument) {
      case 'base':
        this._crash('high');
        this._crash('ctp');
        break;
      case 'ctp':
        this._crash('high');
        this._crash('base');
        break;
      default:
        this._crash('ctp');
        this._crash('base');
    }
    if (!!this.interval) {
      this.interval = window.requestAnimationFrame(this._update.bind(this));
    }
  };

  _startPlayback(type) {
    this.mySounds[type].play();
  }
  
  _assignControlsToKeys() {
    document.addEventListener('keydown', this.drumHitHandler);                 
  };

  _removeAssignControlsToKeys() {
    document.removeEventListener('keydown', this.drumHitHandler);                 
  };

  

  _checkIfMomentOk(tlPosition, instrument){
    let flag=false;
    for (const propt in this.rithm.accents){
      if (propt === instrument){
        this.rithm.accents[propt].forEach(accentPosition => {
          if (
            tlPosition >= Math.ceil(this.columnWidth * accentPosition) &&
            tlPosition <= Math.ceil(this.columnWidth * (accentPosition+1))
            ){
            flag=true;
          }
        });
      }
    }
    if (flag === false){
      this.failCounter < 3 ? this.failCounter++ : this._gameOver();
      if (this.failCounter > 0 && this.failCounter <= 3) {
        document.querySelector(`.fail-container .fail-${this.failCounter}`).classList.remove('display-none');
      }
    }
  }

  _clean(){
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  };
  
  _gameOver(){
    this.timeLine._stop();
    this.interval = undefined;
    this.failCounter = 0;
    this._removeAssignControlsToKeys();
    document.querySelector('.fail-container').classList.add('display-none');
    document.querySelector('.fail-1').classList.add('display-none');
    document.querySelector('.fail-2').classList.add('display-none');
    document.querySelector('.fail-3').classList.add('display-none');
    document.querySelector('.select-container h1').innerText = "Game Over";
    document.querySelector('.select-container p').innerText = "Try again with same or other instrument";
    document.querySelector('.select-container').classList.remove('display-none');
  };

  _selectInstrument(e){
    this.instrument = e.currentTarget.id;
    document.querySelector('.select-container').classList.add('display-none');
    document.querySelector('.start-container').classList.remove('display-none');
  }

  init(){
    if (this.interval === undefined){
      document.querySelector('.start-container').classList.add('display-none');
      document.querySelector('.fail-container').classList.remove('display-none');
      this.interval = window.requestAnimationFrame(this._update.bind(this));
      this.mySounds['high'] = this.rithm._createSoundElement(this.soundsSrc['high']);
      this.mySounds['base'] = this.rithm._createSoundElement(this.soundsSrc['base']);
      this.mySounds['ctp'] = this.rithm._createSoundElement(this.soundsSrc['ctp']);
      this._assignControlsToKeys();
      this._drawBoard();
      this._drawAccents();
      this.timeLine._move();
    }
  };
}