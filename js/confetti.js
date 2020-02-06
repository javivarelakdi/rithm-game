const canvasEl = document.querySelector('#confetti');

const w = canvasEl.clientWidth;
const h = canvasEl.height = window.innerHeight;
let confettiInterval = undefined;

function confettiLoop() {
  if (confettiInterval) {confettiInterval = requestAnimationFrame(confettiLoop);}
	canvasCtx.clearRect(0,0,w,h);
  confs.forEach((conf) => {
    conf.update();
    conf.draw();
  })
}

function clearConfetti(){
  confettiInterval = undefined;
  canvasCtx.clearRect(0,0,w,h);
}

function Confetti () {
  //construct confetti
  const colours = ['#fde132', '#009bde', '#ff6b00'];
  
  this.x = Math.round(Math.random() * w);
  this.y = Math.round(Math.random() * h)-(h/2);
  this.rotation = Math.random()*360;

  const size = Math.random()*(w/60);
  this.size = size < 15 ? 15 : size;

  this.color = colours[Math.floor(colours.length * Math.random())];

  this.speed = this.size/7;
  
  this.opacity = Math.random();

  this.shiftDirection = Math.random() > 0.5 ? 1 : -1;
}

Confetti.prototype.border = function() {
  if (this.y >= h) {
    this.y = h;
  }
}

Confetti.prototype.update = function() {
  this.y += this.speed;
  
  if (this.y <= h) {
    this.x += this.shiftDirection/3;
    this.rotation += this.shiftDirection*this.speed/100;
  }

  if (this.y > h) this.border();
};

Confetti.prototype.draw = function() {
  canvasCtx.beginPath();
  canvasCtx.arc(this.x, this.y, this.size, this.rotation, this.rotation+(Math.PI/2));
  canvasCtx.lineTo(this.x, this.y);
  canvasCtx.closePath();
  canvasCtx.globalAlpha = this.opacity;
  canvasCtx.fillStyle = this.color;
  canvasCtx.fill();
};

const canvasCtx = canvasEl.getContext('2d');
const confNum = Math.floor(w / 4);
const confs = new Array(confNum).fill().map(_ => new Confetti());