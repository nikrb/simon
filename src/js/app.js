import React from 'react';
import ReactDOM from 'react-dom';
import style from '../scss/app.scss';

import Pad from './components/Pad';
import ControlButton from './components/ControlButton';
import ControlLight from './components/ControlLight';
import ControlCounter from './components/ControlCounter';

class Application extends React.Component {
  constructor( props){
    super( props);
    this.sounds = [ new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
                    new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
                    new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
                    new Audio( "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3")];
    this.oopsSound = new Audio( "/audio/wrong.mp3");
    // max sequence length, win condition
    this.full_sequence_length = 20;
    this.startSequencePlayback = this.startSequencePlayback.bind(this);
    this.nextSequence = this.nextSequence.bind(this);
    this.startNextSequence = this.startNextSequence.bind(this);
    this.turnPadOff = this.turnPadOff.bind(this);
    this.padClick = this.padClick.bind( this);
    this.flashError = this.flashError.bind(this);
    this.flash_count = 0;
    // the current sequence the user is following, 1 to full_sequence_length
    this.current_sequence_length = 1;
    // current sequence user has to copy to get right
    this.current_sequence = [];
    // keeps track of current sequence element for playback and user guesses
    this.current_sequence_ndx = 0;
    this.state = {
      pads_enabled : false,
      strict_mode : false,
      display_count : "--",
      pad_litup : [ false, false, false, false]
    };
  }
  generateSequence(){
    let seq = [];
    for( let i=0; i<this.full_sequence_length; i++){
      seq.push( parseInt( Math.random()*4));
    }
    return seq;
  }
  // start sequence playback
  startSequencePlayback(){
    this.current_sequence_ndx = 0;
    this.setState( { pads_enabled : false});
    this.nextSequence();
  }
  // light up next colour pad in sequence
  nextSequence(){
    // TODO: is it bad practice to use const for litup?
    const litup = this.state.pad_litup.slice(0);
    const colour_ndx = this.current_sequence[this.current_sequence_ndx];
    litup[colour_ndx] = true;
    this.sounds[colour_ndx].play();
    this.setState( { pad_litup : litup});
    setTimeout( this.turnPadOff, 700);
  }
  // turn pad light off then move to next after a short delay
  turnPadOff(){
    this.current_sequence_ndx += 1;
    this.setState( { pad_litup : [false, false, false, false]});
    if( this.current_sequence_ndx < this.current_sequence_length){
      setTimeout( this.nextSequence, 250);
    } else {
      // sequence playback finished so zero sequence ready for user guesses
      this.current_sequence_ndx = 0;
      this.setState( { pads_enabled : true});
    }
  }
  turnAllPadsOff(){
    this.setState( { pad_litup : [false, false, false, false]});
  }
  showWinDlg(){
    alert( "You Won!");
  }
  padDown( ndx){
    this.sounds[ndx].currentTime = 0;
    this.sounds[ndx].play();
  }
  // TODO: this should be padRelease
  padClick( ndx){
    // FIXME: we shouldn't need this
    if( this.state.pads_enabled){
      this.sounds[ndx].pause;
      if( this.current_sequence[this.current_sequence_ndx] === ndx){
        this.current_sequence_ndx += 1;
        if( this.current_sequence_ndx >= this.current_sequence_length){
          this.setState( { pads_enabled : false});
          this.current_sequence_length += 1;
          if( this.current_sequence_length < this.full_sequence_length){
            // give the user a moment before next sequence starts
            setTimeout( this.startNextSequence, 500);
          } else {
            setTimeout( this.showWinDlg, 100);
          }
        }
      } else {
        this.setState( { pads_enabled: false});
        this.playOopsSound();
        this.startFlashError();
      }
    }
  }
  playOopsSound(){
    this.oopsSound.currentTime = 0;
    this.oopsSound.volume = 0.2;
    this.oopsSound.play();
  }
  startFlashError(){
    this.flash_error = 4;
    this.flash_visible = false;
    this.flashError();
  }
  flashError(){
    if( this.flash_error > 0){
      this.flash_error -= 1;
      if( this.flash_visible){
        this.flash_visible = false;
        this.setState( { display_count: ""});
        setTimeout( this.flashError, 300);
      } else {
        this.flash_visible = true;
        this.setState( { display_count: "!!"});
        setTimeout( this.flashError, 500);
      }
    } else {
      // TODO: maybe sync this call to end of mistake sound
      if( this.state.strict_mode){
        this.startFreshSequence();
      } else {
        setTimeout( this.startNextSequence, 250);
      }
    }
  }
  // start next sequence of pad colours
  startNextSequence(){
    this.setState( { display_count: ""+this.current_sequence_length});
    setTimeout( this.startSequencePlayback, 500);
  }
  startClicked( e){
    console.log( "start button clicked");
    this.startFreshSequence();
  }
  startFreshSequence(){
    this.current_sequence = this.generateSequence();
    console.log( "sequence:", this.current_sequence);
    this.current_sequence_length = 1;
    this.startNextSequence();
  }
  strictClicked( e){
    console.log( "strict button clicked");
    const on = !this.state.strict_mode;
    this.setState( { strict_mode : on});
  }
  render() {
    const padGreen = {
      top: "0px",
      left: "0px"
    };
    const padRed = {
      top: "0px",
      right: "0px"
    };
    const padBlue = {
      bottom: "0px",
      right: "0px"
    };
    const padYellow = {
      bottom: "0px",
      left: "0px"
    };

    return (
      <div id="simon-container">
        <img src="/img/simonBase.png" />
        <Pad padStyle={padGreen} padNdx={0} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[0]} padEnabled={this.state.pads_enabled}
          padDown={this.padDown.bind(this)}
          padSrcDull="/img/padGreenDull.png" padSrcBright="/img/padGreenBright.png" />
        <Pad padStyle={padRed} padNdx={1} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[1]} padEnabled={this.state.pads_enabled}
          padDown={this.padDown.bind(this)}
          padSrcDull="/img/padRedDull.png" padSrcBright="/img/padRedBright.png"/>
        <Pad padStyle={padYellow} padNdx={2} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[2]} padEnabled={this.state.pads_enabled}
          padDown={this.padDown.bind(this)}
          padSrcDull="/img/padYellowDull.png" padSrcBright="/img/padYellowBright.png" />
        <Pad padStyle={padBlue} padNdx={3} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[3]} padEnabled={this.state.pads_enabled}
          padDown={this.padDown.bind(this)}
          padSrcDull="/img/padBlueDull.png" padSrcBright="/img/padBlueBright.png"/>
        <ControlButton top="53%" left="48.5%" clicked={this.startClicked.bind(this)}
          buttonSrc="/img/buttonRed.png" />
        <ControlButton top="53%" left="60%" clicked={this.strictClicked.bind(this)}
          buttonSrc="/img/buttonYellow.png" />
        <ControlLight top="50%" left="61.5%" lightOn={this.state.strict_mode} lightSrcOff="/img/buttonYellow.png"
          lightSrcOn="/img/buttonRed.png" />
        <ControlCounter top="53%" left="38%" display_count={this.state.display_count} />
      </div>
    );
  }
}

/*
 * Render the above component into the div#app
 */
ReactDOM.render(<Application />, document.getElementById('app'));
