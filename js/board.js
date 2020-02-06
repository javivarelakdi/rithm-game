class Board {
  constructor(options) {
    this.ctx = options.ctx;
    this.columnWidth= options.columnWidth;
    this.rowHeight= options.rowHeight;
    this.rhythm = new Rhythm();
    this.timeLine = options.timeLine;
    this.interval = undefined;
    this.instrument = undefined;
    this.failCounter= 0;
    this.eventFire = 0;
    this.drumHitDown= function(event){
      if(event.keyCode === 81 || event.keyCode === 80){
        this._hitSoundDown(this.instrument);
        this._checkIfMomentOk(this.timeLine.position, this.instrument);
      }
    }
    this.drumHitDownHandler = this.drumHitDown.bind(this);
    this.drumHitUp= function(event){
      if(event.keyCode === 81 || event.keyCode === 80){
        this._hitSoundUp(this.instrument);
      }
    }
    this.drumHitUpHandler = this.drumHitUp.bind(this);
    this.crashFlag = 0;
    this.points=0;
    this.rhythmIndex=0;
    this.accomplished=[];
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
    for (const proptAccents in this.rhythm.accents[this.rhythmIndex]){
      for (const proptColors in this.rhythm.colors){
        if ( proptColors === proptAccents){
          this.ctx.fillStyle=this.rhythm.colors[proptColors];
        }
        this.rhythm.accents[this.rhythmIndex][proptAccents].forEach(accentPosition => {
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

  
  
  _crash(instrument){
    const audio = new Audio(soundsSrc[instrument]);
    if (this.timeLine.intervalId && this.timeLine.position < this.ctx.canvas.width - this.columnWidth){
      for (const propt in this.rhythm.accents[this.rhythmIndex]){
        if (propt === instrument){
          this.rhythm.accents[this.rhythmIndex][propt].forEach(accentPosition => {
            if (
              this.timeLine.position >= Math.ceil(this.columnWidth * (accentPosition)) &&
              this.timeLine.position <= Math.ceil(this.columnWidth * (accentPosition+1)) &&
              this.timeLine.position >= this.crashFlag
              ){
              this.crashFlag = this.timeLine.position + this.columnWidth+2;
              audio.play();
            }
          });
          
        }
      }
    }
    else {
      this.crashFlag = 0;
    }
  }

  _checkIfMomentOk(tlPosition, instrument){
    let flag=false;
    for (const propt in this.rhythm.accents[this.rhythmIndex]){
      if (propt === instrument){
        this.rhythm.accents[this.rhythmIndex][propt].forEach(accentPosition => {
          if (
            tlPosition >= Math.ceil(this.columnWidth * accentPosition) &&
            tlPosition <= Math.ceil(this.columnWidth * (accentPosition+1))
            ){
            flag=true;
            this.points < 50 ? this.points+=10 : this._win(instrument);
            console.log(this.points);
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
    const audio = new Audio(soundsSrc[type]);
    audio.play();
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

  _clean(){
    this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);
  };
  
  _gameOver(){
    this._reset();
    document.querySelector('.select-container h1').innerText = "Game Over";
    document.querySelector('.select-container p').innerText = "Try again with same or other instrument";
    document.querySelector('.select-container').classList.remove('display-none');
  };

  _win(instrument){
    this._reset();
    if (!this.accomplished.includes(instrument)) {this.accomplished.push(instrument)};
    let isRhythmDone = ['high','base','ctp'].every((val) => this.accomplished.includes(val));
    if (!isRhythmDone){
      document.querySelector('.select-container h1').innerText = `You got the ${instrument} groove`;
      document.querySelector('.select-container p').innerText = "Try with remaining instruments";
      document.querySelector(`.select-container #${instrument}`).disabled = true;
    } else {
      this.rhythmIndex = this.rhythmIndex < this.rhythm.accents.length - 1 
        ? this.rhythmIndex+1 
        : 0;
      this.accomplished=[];
      this._clean();
      this._drawBoard()
      this._drawAccents();
      const disabledButtons = document.querySelectorAll('.select-container button');
      for (let i = 0; i < disabledButtons.length; ++i) {
        disabledButtons[i].disabled=false;
      }
      document.querySelector('.select-container h1').innerText = "Play this new rhythm";
      document.querySelector('.select-container p').innerText = "Try again with all the instruments";
      confettiLoop();
    }
    document.querySelector('.select-container').classList.remove('display-none');
    
  }

  _reset(){
    this.timeLine._stop();
    this.interval = undefined;
    this.failCounter = 0;
    this.points=0;
    document.querySelector('.fail-container').classList.add('display-none');
    document.querySelector('.fail-1').classList.add('display-none');
    document.querySelector('.fail-2').classList.add('display-none');
    document.querySelector('.fail-3').classList.add('display-none');
    document.removeEventListener('keydown', this.drumHitDownHandler);  
    document.removeEventListener('keyup', this.drumHitUpHandler); 
    const hits = document.querySelectorAll('.is-hit');
    for (let i = 0; i < hits.length; ++i) {
      hits[i].classList.remove('is-hit');
    }
  }

  _selectInstrument(e){
    this.instrument = e.currentTarget.id;
    document.querySelector('.select-container').classList.add('display-none');
    document.querySelector('.start-container').classList.remove('display-none');
  }

  init(){
    if (this.interval === undefined){
      clearConfetti()
      document.querySelector('.start-container').classList.add('display-none');
      document.querySelector('.fail-container').classList.remove('display-none');
      this.interval = window.requestAnimationFrame(this._update.bind(this));
      document.addEventListener('keydown', this.drumHitDownHandler);  
      document.addEventListener('keyup', this.drumHitUpHandler); 
      this._drawBoard();
      this._drawAccents();
      this.timeLine._move();
    }
  };
}