// transpose a given note by interval in half steps
'use strict'

let _ = require('underscore')

let a = 440
let constant = Math.pow(2, 1/12)

function transpose(freq,base,halfSteps,direction) {
   freq = a
   let result = 'Nan'
   while (halfSteps >= 12 ) {
      base += 1;
      halfSteps-=12;
   }
   if (base >= 5) {
      console.log(base,halfSteps,direction);
   }
   let power = Math.abs(4-base)
   // transpose by octave
   switch (base) {
      case 0:
      case 1:
      case 2:
      case 3:
         freq = freq / Math.pow(2, power)
         break;
      case 4:
         break;
      case 5:
      case 6:
      case 7:
      case 8:
         freq = freq * Math.pow(2, power)
         break;
      default:
   }
   // transpose by half step
   if (halfSteps != 0){
      halfSteps = (direction == 'down') ? halfSteps * -1 : halfSteps;
      result = freq * Math.pow(constant, halfSteps);
   } else {
      result = freq;
   }
   console.log('raw result is: '+result+', truncated = '+truncate(result));
   return truncate(result);
}

function transposeOct(freq,amount,direction) {
   for (var i = 1; i <= amount; i++){
      if (direction == 'up') {
         freq = freq * 2
      } else if (direction == 'down') {
         freq = freq / 2
      }
   }
   return truncate(freq);
}

// middle C is 261.6
// a0 = 25.96 (lowest note on piano)

function getInterval(freq,base,steps){
   let note = transposeOct(freq,base,'up');
   note = transposeSteps(note,steps,'up')

   return truncate(note)
}

function truncate(raw) {
   if (raw < 100) {
      return Math.round(raw * 100) / 100
   } else if (raw < 1000 ) {
      return Math.round(raw * 10) / 10
   } else {
      return Math.round(raw)
   }
}

function pitchesBeCrazy(aIsWhat){
   let   tuning = aIsWhat,
          notes = [],

        octaves = '012345678'.split(''),
      direction = 'down'

   // let start = transpose(a,0,4,'down')

   for (var oct = 0; oct < octaves.length; oct++){
      let steps = 0;
      let direction = 'test'
      let letterNames = 'C,C#/Db,D,D#/Eb,E,F,F#/Gb,G,G#/Ab,A,A#/Bb,B'.split(',');
      for (var letter = 0; letter < letterNames.length; letter++){
         switch (letterNames[letter]) {
            case 'C':
               steps = 9
               direction = 'down'
               break;
            case 'C#/Db':
               steps = 8
               break;
            case 'D':
               steps = 7
               break;
            case 'D#/Eb':
               steps = 6
               break;
            case 'E':
               steps = 5
               break;
            case 'F':
               steps = 4
               break;
            case 'F#/Gb':
               steps = 3
               break;
            case 'G':
            case 'B':
               steps = 2
               break;
            case 'G#/Ab':
            case 'A#/Bb':
               steps = 1
               break;
            case 'A':
               steps = 0;
               direction = 'up';
            default:
               break;
         }

         let freq = transpose(tuning,oct,steps,direction);
         let name = '';
         // separate sharps and flats
         if (letterNames[letter].indexOf('/') !== -1) {
            letterNames[letter] = letterNames[letter].split('/');
            letterNames = _.flatten(letterNames)
         }
         name = letterNames[letter] + octaves[oct]
         freq = freq.toFixed(2);
         // let newNote = new Note(name,freq)

         notes.push({[freq]: name});
      }
   }
   console.log(notes);
}

pitchesBeCrazy(440)

// function Note(name,frequency,duration,instrument){
function Note(name,frequency){
   this.name = name,
   this.frequency = frequency
}
