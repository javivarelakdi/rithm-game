const drums = {
  'bass-pedal': 'https://k007.kiwi6.com/hotlink/7q9gj2v6sn/kick002.wav',
  'bass-drum': 'https://k007.kiwi6.com/hotlink/7q9gj2v6sn/kick002.wav',
  'hi-hats': 'https://k007.kiwi6.com/hotlink/1kw3xv7kyd/HiHat_06.wav-9246-Free-Loops.com.mp3',
  'hi-hats-pedal': 'https://k007.kiwi6.com/hotlink/1kw3xv7kyd/HiHat_06.wav-9246-Free-Loops.com.mp3',
  'snare-drum': 'https://k007.kiwi6.com/hotlink/r0nar1h89j/Snare_1.mp3',
  'floor-tom': 'https://k007.kiwi6.com/hotlink/lao8uwkdxk/909_Tom_Low_02-5862-Free-Loops.com.mp3',
  'small-tom': 'https://k007.kiwi6.com/hotlink/8m9wgdzh7y/STOM5.wav',
  'medium-tom': 'https://k007.kiwi6.com/hotlink/am01fvdlqg/808_High_Tom.wav-21939-Free-Loops.com.mp3',
  'ride-cymbal': 'https://k007.kiwi6.com/hotlink/wl7hv6uecm/ride.wav',
  'crash-cymbal': 'https://k007.kiwi6.com/hotlink/pk0gz1h6l9/crash.wav'
}

const drumSoundsCodes = { 
  '9': 'bass-drum',  
  '2': 'hi-hats',  
  '8': 'snare-drum',
  '7': 'floor-tom',
  '5': 'small-tom',
  '6': 'medium-tom',
  '4': 'ride-cymbal',
  '3': 'crash-cymbal'
}

const sounds = Object.values(drums);

// preload all sounds
Promise.all(
  sounds.map(sound => {
    return new Promise((resolve, reject) => {
       const audio = new Audio();
      // once this file loads, it will call loadedAudio()
      // the file will be kept by the browser as cache
      audio.addEventListener('canplaythrough', resolve, false);
      audio.src = sound;
    })
  })
).then(() => console.log("Success.")).catch(err => console.error(err));

const drumKit = document.querySelector('.drum-kit'); 

const drumArr = Object.keys(drums).map(element => document.querySelector(`.${element}`));

const cymbals = Array.from(document.querySelectorAll('.cymbal'));

window.ondragstart = function() {
  return false;
};

drumArr.forEach(element => element.addEventListener('mousedown', playDrumSound));
drumArr.forEach(element => element.addEventListener('mouseover', playDrumSound));
cymbals.forEach(cymbal => cymbal.addEventListener('mousedown', shakeCymbal));
cymbals.forEach(cymbal => cymbal.addEventListener('mouseover', shakeCymbal));
drumArr.forEach(element => element.addEventListener('mouseup', resetHit));
drumArr.forEach(element => element.addEventListener('mouseout', resetHit));
window.addEventListener('keydown', playDrumsOnKey);
window.addEventListener('keyup', resetHitOnKey);
             
function playDrumSound(e) {
  let audio = new Audio(drums[e.target.classList[0]]);
  
  if (detectLeftButton(e)) {
    audio.play();
    e.target.classList.add('is-hit');
  }   
}

function resetHit(e) {
  e.target.classList.remove('is-hit');
}


function playDrumsOnKey(e) {
  let soundName = drumSoundsCodes[e.key.toString()];
  if (Object.keys(drumSoundsCodes).includes(e.key.toString())) {
    let audio = new Audio(drums[soundName]);
    audio.play();
    Array.from(drumKit.children).forEach(element => {
      if (element.classList[0] === soundName) {
        element.classList.add('is-hit')
        if (Array.from(element.classList).includes('cymbal')) {
          element.classList.remove('cymbal-animation');
          void element.offsetWidth;
          element.classList.add('cymbal-animation');
        }      
      }
    })
  }
}

function resetHitOnKey(e) {
   let soundName = drumSoundsCodes[e.key.toString()];
   Array.from(drumKit.children).forEach(element => {
      if (element.classList[0] === soundName) {
        element.classList.remove('is-hit')
      }
    })
}


function detectLeftButton(event) {
    if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return false;        
    } else if ('buttons' in event) {
        return event.buttons === 1;    
    } else if ('which' in event) {
        return event.which === 1; 
    } else {   
      return (event.button == 1 || event.type == 'click');      
    }
}



function shakeCymbal(e) {
  if (detectLeftButton(event)) {
    e.target.classList.remove('cymbal-animation');
    void e.target.offsetWidth;
    e.target.classList.add('cymbal-animation');
  }  
}

const legend = document.querySelector('.legend');

for (let i = 0; i < Object.keys(drumSoundsCodes).length; i++) {
  legend.innerHTML += `<p class='legend-item'>
  Press ${Object.keys(drumSoundsCodes)[i]} 
  for ${Object.values(drumSoundsCodes)[i].replace('-', ' ')} sound
  </p>`
}



Resources