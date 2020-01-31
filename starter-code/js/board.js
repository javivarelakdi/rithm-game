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
    this.drumHitDown= function(event){
      if(event.keyCode === 81 || event.keyCode === 80){
        this._hitSoundDown(this.instrument);
        this._checkIfMomentOk(this.timeLine.position, this.instrument);
      }
    }
    this.drumHitUp= function(event){
      if(event.keyCode === 81 || event.keyCode === 80){
        this._hitSoundUp(this.instrument);
      }
    }
    this.drumHitDownHandler = this.drumHitDown.bind(this);
    this.drumHitUpHandler = this.drumHitUp.bind(this);
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
            this.mySounds[propt].play();
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

  _hitSoundDown(type) {
    this.mySounds[type].play();
    const instr = document.querySelectorAll(`.${type}`);
    for (let i = 0; i < instr.length; ++i) {
      instr[i].classList.add('is-hit');
      if (type === 'high') {
        instr[i].classList.remove('cymbal-animation');
        void instr[i].offsetWidth;
        instr[i].classList.add('cymbal-animation');
      }
    }
  }

  _hitSoundUp(type){
    const instr = document.querySelectorAll(`.${type}`);
    for (let i = 0; i < instr.length; ++i) {
      instr[i].classList.remove('is-hit');
    }
  }
  
  _assignEventListeners() {
    document.addEventListener('keydown', this.drumHitDownHandler);  
    document.addEventListener('keyup', this.drumHitUpHandler);                
  };

  _removeAssignControlsToKeys() {
    document.removeEventListener('keydown', this.drumHitDownHandler);  
    document.removeEventListener('keyup', this.drumHitUpHandler);                 
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
    const hits = document.querySelectorAll('.is-hit');
    for (let i = 0; i < hits.length; ++i) {
      hits[i].classList.remove('is-hit');
    }
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
      this._assignEventListeners();
      this._drawBoard();
      this._drawAccents();
      this.timeLine._move();
    }
  };
}