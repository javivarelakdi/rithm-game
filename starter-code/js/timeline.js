class TimeLine {
  constructor(ctx) {
    this.position = 0;
    this.intervalId = undefined;
    this.ctx = ctx
  }

  _move(){
    this.intervalId = setInterval(function(){
      this.position=(this.position+1)%this.ctx.canvas.width;
    }.bind(this), 5);
  }
}