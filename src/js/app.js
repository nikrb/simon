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
    this.state = {
      strict_mode : false,
      display_count : "--"
    };
  }
  padClick( ndx){
    console.log( "click:", ndx);
  }
  startClicked( e){
    console.log( "start button clicked");
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
          padSrcDull="/img/padGreenDull.png" padSrcBright="/img/padGreenBright.png" />
        <Pad padStyle={padRed} padNdx={1} padClick={this.padClick.bind(this)}
          padSrcDull="/img/padRedDull.png" padSrcBright="/img/padRedBright.png"/>
        <Pad padStyle={padYellow} padNdx={2} padClick={this.padClick.bind(this)}
          padSrcDull="/img/padYellowDull.png" padSrcBright="/img/padYellowBright.png" />
        <Pad padStyle={padBlue} padNdx={3} padClick={this.padClick.bind(this)}
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
