# rithm-game
a game to learn rithms
The purpose of the game is to click on the right moment when performing a rithm 16 times long (4x4 structure).
Rithm moment is marked with a color, so the player knows when to click.
Player should click when the accents in a rithm.
A rithm is based in 3 instruments with different tunes each... so it´s possible to play any of the instruments.
Game screen is static but there is a timeline moving through the rithm structure. 
Time line speed is configurable... so it´s possible to play in 3 difficulty levels.
Stage is passed when player has played correctly all the instrumnents of a rithmn.
* * *
## MVP
### Technique
Html5 __Canvas__ __DOM manipulation__ and Vanilla __Javascript__
### Game states
* __Start Screen__
  * Title
  * Play button
  * Extra for Backlog: animated characters playing a rithm
* __Game Screen__
  * Canvas for the timeline with three instruments (three timelines really)
  * Extra for Backlog: Dom for the characters
* __Game Over Screen__
  * Play again button
  * Go to start screen button
  Extra for Backlog: Dom Animation for the characters
### Game
* Create Board with 3 instruments 
* Add accent colors
* Create Time line
* Add sound interaction with key buttons
* If fale -> Game Over -> Show Game Over Screen
* Extra: create characters and animation triggered by key buttons
* * *
## BACK LOG
### Speed
* 3 levels of speed for difficulty
### Score
* Add panel with all rithms user has learnt
### Music
* Add music to Start screen and game over.
### Levels
* Create different rithms
### Different rithmns
* Every time user pass a level... new start game performing following rithm.
### Character animation
* DOM with characters performing rithms according to player interaction
* * *
## Data structure
__main.js__
````
createStartScreen(id);
createGameScreen(id);
createGameOverScreen(id);
destroyStartScreen();
destroyGameScreen();
destroyGameOverScreen();
var board = new Board({
    this.columns,
    ctx: ctx,
    this.instrument
  });
game.init();
````
__Board.js__
````
function Board(options){
 this.columns,
 ctx: ctx,
 this.instrument
};
Game.drawBoard();
Game.drawAccentPosition();
Game.gameOver();
Game.init();;
````
__TimeLine.js__
````
function TimeLine(options){};
TimeLine.move();
````
__Instrument.js__
````
function Instrument(){
  this.sound;
  this.accentPosition;
  this.color;
};
````
## Links
[rithm game Trello](https://trello.com/b/rSxjIfLj/rithm-game)
[Github](https://github.com/javivarelakdi/rithm-game)
[Slides] (https://docs.google.com/presentation/d/1g5MQuKaLwajo-iptv96epxe3uQ-IjEgiDtn1i9VZu-E/edit?usp=sharing)
[Github pages] ( https://javivarelakdi.github.io/rithm-game/starter-code)
