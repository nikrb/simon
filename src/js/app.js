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
    // max sequence length, win condition
    this.full_sequence_length = 20;
    // the current sequence the user is following, 1 to full_sequence_length
    this.current_sequence_length = 1;
    // current sequence user has to copy to get right
    this.current_sequence = [];
    // keeps track of current sequence element for playback and user guesses
    this.current_sequence_ndx = 0;
    this.pads = [];
    this.counterControl = null;
    this.state = {
      pads_enabled : false,
      strict_mode : false,
      display_count : "--"
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
  startSequencePlayback = () => {
    this.current_sequence_ndx = 0;
    this.setState( { pads_enabled : false});
    this.nextSequence();
  }
  // light up next colour pad in sequence
  nextSequence = () => {
    const colour_ndx = this.current_sequence[this.current_sequence_ndx];
    this.pads[colour_ndx].play();
    setTimeout( this.turnPadOff, 700);
  }
  // turn pad light off then move to next after a short delay
  turnPadOff = () => {
    const colour_ndx = this.current_sequence[this.current_sequence_ndx];
    this.pads[colour_ndx].stop();
    this.current_sequence_ndx += 1;
    if( this.current_sequence_ndx < this.current_sequence_length){
      setTimeout( this.nextSequence, 250);
    } else {
      // sequence playback finished so zero sequence ready for user guesses
      this.current_sequence_ndx = 0;
      this.setState( { pads_enabled : true});
    }
  }
  showWinDlg(){
    alert( "You Won!");
  }
  errorFinished = () => {
    if( this.state.strict_mode){
      this.startFreshSequence();
    } else {
      setTimeout( this.startNextSequence, 250);
    }
  }

  // TODO: this should be padRelease
  padClick = ndx => {
    // FIXME: we shouldn't need this
    if( this.state.pads_enabled){
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
        this.counterControl.startFlashError();
      }
    }
  }

  // start next sequence of pad colours
  startNextSequence = () => {
    this.setState( { display_count: ""+this.current_sequence_length});
    setTimeout( this.startSequencePlayback, 500);
  }
  startClicked = e => {
    console.log( "start button clicked");
    this.startFreshSequence();
  }
  startFreshSequence(){
    this.current_sequence = this.generateSequence();
    console.log( "sequence:", this.current_sequence);
    this.current_sequence_length = 1;
    this.startNextSequence();
  }
  strictClicked = e => {
    const on = !this.state.strict_mode;
    this.setState( { strict_mode : on});
  }
  render() {
    const img_style = {
      width : "100%"
    };

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
        <img style={img_style} src="/img/simonBase.png" />
        <Pad ref={(pad) => { this.pads[0] = pad}}
          sound="https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"
          padStyle={padGreen} padNdx={0} padClick={this.padClick}
          padEnabled={this.state.pads_enabled}
          padSrcDull="/img/padGreenDull.png" padSrcBright="/img/padGreenBright.png" />
        <Pad  ref={(pad) => { this.pads[1] = pad}}
          sound="https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"
          padStyle={padRed} padNdx={1} padClick={this.padClick}
          padEnabled={this.state.pads_enabled}
          padSrcDull="/img/padRedDull.png" padSrcBright="/img/padRedBright.png"/>
        <Pad  ref={(pad) => { this.pads[2] = pad}}
          sound="https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"
          padStyle={padYellow} padNdx={2} padClick={this.padClick}
          padEnabled={this.state.pads_enabled}
          padSrcDull="/img/padYellowDull.png" padSrcBright="/img/padYellowBright.png" />
        <Pad  ref={(pad) => { this.pads[3] = pad}}
          sound="https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"
          padStyle={padBlue} padNdx={3} padClick={this.padClick}
          padEnabled={this.state.pads_enabled}
          padSrcDull="/img/padBlueDull.png" padSrcBright="/img/padBlueBright.png"/>
        <ControlButton top="53%" left="48.5%" clicked={this.startClicked}
          buttonSrc="/img/buttonRed.png" />
        <ControlButton top="53%" left="60%" clicked={this.strictClicked}
          buttonSrc="/img/buttonYellow.png" />
        <ControlLight top="50%" left="61.5%" lightOn={this.state.strict_mode} lightSrcOff="/img/buttonYellow.png"
          lightSrcOn="/img/buttonRed.png" />
        <ControlCounter ref={(counter) => { this.counterControl = counter}}
          errorDisplayFinished={this.errorFinished}
          sound="/audio/wrong.mp3"
          top="53%" left="38%" display_count={this.state.display_count} />
      </div>
    );
  }
}

/*
 * Render the above component into the div#app
 */
ReactDOM.render(<Application />, document.getElementById('app'));
