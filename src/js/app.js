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
    this.turnPadOff = this.turnPadOff.bind(this);
    this.nextSequence = this.nextSequence.bind(this);
    this.padClick = this.padClick.bind( this);
    this.startNextSequence = this.startNextSequence.bind(this);
    // current sequence user has to copy to get right
    this.current_sequence = [];
    // keeps track of current sequence element for playback and user guesses
    this.current_sequence_ndx = 0;
    this.pads_enabled = false;
    this.state = {
      strict_mode : false,
      display_count : "--",
      pad_litup : [ false, false, false, false]
    };
  }
  generateSequence( len){
    let seq = [];
    for( let i=0; i<len; i++){
      seq.push( parseInt( Math.random()*4));
    }
    return seq;
  }
  startSequence(){
    this.current_sequence_ndx = 0;
    this.pads_enabled = false;
    this.nextSequence();
  }
  nextSequence(){
    // TODO: is it bad practice to use const for litup?
    const litup = this.state.pad_litup.slice(0);
    litup[this.current_sequence[this.current_sequence_ndx]] = true;
    this.setState( { pad_litup : litup});
    setTimeout( this.turnPadOff, 500);
  }
  turnPadOff(){
    this.current_sequence_ndx += 1;
    this.setState( { pad_litup : [false, false, false, false]});
    if( this.current_sequence_ndx < this.current_sequence_length){
      setTimeout( this.nextSequence, 250);
    } else {
      // sequence playback finished so zero sequence ready for user guesses
      this.current_sequence_ndx = 0;
      this.pads_enabled = true;
    }
  }
  turnAllPadsOff(){
    this.setState( { pad_litup : [false, false, false, false]});
  }
  showWinDlg(){
    alert( "You Won!");
  }
  padClick( ndx){
    console.log( "click:", ndx);
    if( this.pads_enabled){
      console.log( "current sequence:", this.current_sequence[this.current_sequence_ndx]);
      if( this.current_sequence[this.current_sequence_ndx] === ndx){
        this.current_sequence_ndx += 1;
        console.log( "next seq ndx:", this.current_sequence_ndx);
        if( this.current_sequence_ndx >= this.current_sequence.length){
          this.pads_enabled = false;
          this.current_sequence_length += 1;
          console.log( "at end of sequence, next seq len:", this.current_sequence_length);
          if( this.current_sequence_length < this.full_sequence_length){
            // give the user a moment before next sequence starts
            setTimeout( this.startNextSequence, 500);
          } else {
            setTimeout( this.showWinDlg, 100);
          }
        }
      } else {
        // play a mistake sound
        this.startSequence();
      }
    }
  }
  startNextSequence(){
    this.current_sequence = this.generateSequence( this.current_sequence_length);
    console.log( "sequence:", this.current_sequence);
    this.setState( { display_count: ""+this.current_sequence_length});
    this.startSequence();
  }
  startClicked( e){
    console.log( "start button clicked");
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
        <img id="simonMainImage" src="/img/simonBase.png" />
        <Pad padStyle={padGreen} padNdx={0} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[0]}
          padSrcDull="/img/padGreenDull.png" padSrcBright="/img/padGreenBright.png" />
        <Pad padStyle={padRed} padNdx={1} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[1]}
          padSrcDull="/img/padRedDull.png" padSrcBright="/img/padRedBright.png"/>
        <Pad padStyle={padYellow} padNdx={2} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[2]}
          padSrcDull="/img/padYellowDull.png" padSrcBright="/img/padYellowBright.png" />
        <Pad padStyle={padBlue} padNdx={3} padClick={this.padClick.bind(this)}
          bright={this.state.pad_litup[3]}
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
