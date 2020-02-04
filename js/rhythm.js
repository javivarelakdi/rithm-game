class Rhythm {
  constructor() {
    this.accents = [
      {high:[0,3,7,10,12],base:[0,4,8,12],ctp:[6,13,14]},
      {high:[1,3,6,8,11,14],base: [0,4,8,12],ctp: [5,7,13,15]},
      {high: [2,3,6,9,10,11,14],base: [0,4,8,12],ctp: [0,3,6,8,11,14]}
    ]
    this.colors = {
      high:'#d29803',
      base:'#2F4D50',
      ctp: 'green'
    }
  }
}