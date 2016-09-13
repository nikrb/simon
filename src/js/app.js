import React from 'react';
import ReactDOM from 'react-dom';
import style from '../scss/app.scss';

import Pad from './components/Pad';

class Application extends React.Component {
  padClick( ndx){
    console.log( "click:", ndx);
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
        <img id="simonMainImage" src="/img/simonWithControls.png" />
        <Pad padStyle={padGreen} padNdx={0} padClick={this.padClick.bind(this)}
          padSrcDull="/img/padGreenDull.png" padSrcBright="/img/padGreenBright.png" />
        <Pad padStyle={padRed} padNdx={1} padClick={this.padClick.bind(this)}
          padSrcDull="/img/padRedDull.png" padSrcBright="/img/padRedBright.png"/>
        <Pad padStyle={padYellow} padNdx={2} padClick={this.padClick.bind(this)}
          padSrcDull="/img/padYellowDull.png" padSrcBright="/img/padYellowBright.png" />
        <Pad padStyle={padBlue} padNdx={3} padClick={this.padClick.bind(this)}
          padSrcDull="/img/padBlueDull.png" padSrcBright="/img/padBlueBright.png"/>
      </div>
    );
  }
}

/*
 * Render the above component into the div#app
 */
ReactDOM.render(<Application />, document.getElementById('app'));
