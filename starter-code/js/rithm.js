class Rithm {
  constructor(rithm) {
    this.ctx = rithm.ctx,
    this.name = rithm.name;
    this.accents = rithm.accents;
    this.colors = rithm.colors;
  }

  
  _sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
    return this.sound;    
  }
}