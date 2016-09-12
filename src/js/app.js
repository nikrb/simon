import React from 'react';
import ReactDOM from 'react-dom';
import style from '../scss/app.scss';

class Pad extends React.Component {
  constructor( props){
    super( props);
    this.bright = new Image();
    this.bright.src = this.props.padSrcBright;
    this.bright.onLoad = this.handleLoad;
    this.bright.onError = this.handleError;
    this.dull = new Image();
    this.dull.src = this.props.padSrcDull;
    this.dull.onLoad = this.handleLoad;
    this.dull.onError = this.handleError;
    this.load_count = 0;
    this.state = {
      litup : false,
      loaded : false
    };
  }
  handleLoad( e){
    this.load_count += 1;
    if( this.load_count === 2){
      this.setState( { loaded: true});
    }
  }
  handleError( e){
    console.log( "pad image load error:", e);
  }
  setBright( bright){
    console.log( "set pad bright:", bright);
    this.setState( { litup : bright});
  }

  getPixel(imgData, index) {
    var i = index*4, d = imgData.data;
    return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
  }
  getPixelXY( imgData, x, y){
    return getPixel(imgData, y*imgData.width+x);
  }
  getImageDataCrossOriginError(){
    const cvs = document.createElement('canvas')
    const img = this.bright;
    cvs.width = img.width;
    cvs.height = img.height;
    const ctx = cvs.getContext("2d");
    ctx.drawImage( img, 0, 0, cvs.width, cvs.height);
    const image_data = ctx.getImageData( 0,0,cvs.width, cvs.height);
    const pd = getPixelXY( image_data, e.pageX, e.pageY);
    console.log( "pix alpha:", pd[3]);
  }
  padClicked( e){
    console.log( "pad clicked:", this.props.padNdx);
    this.setBright( true);
    setTimeout( ()=>{ this.setBright( false)}, 250);
    this.props.padClick( this.props.padNdx);
  }
  render(){
    let padStyle = {
      cursor: "pointer",
      width: "50%",
      position: "absolute",
      zIndex: "102",
      // FIXME: ... this.props.padStyle
    };
    if( this.props.padStyle.top) padStyle.top = this.props.padStyle.top;
    if( this.props.padStyle.left) padStyle.left = this.props.padStyle.left;
    if( this.props.padStyle.bottom) padStyle.bottom = this.props.padStyle.bottom;
    if( this.props.padStyle.right) padStyle.right = this.props.padStyle.right;
    console.log( "pad render litup:", this.state.litup);
    return (
      <img style={padStyle} src={(this.state.litup) ? this.props.padSrcBright : this.props.padSrcDull} onClick={this.padClicked.bind(this)} />
    );
  }
}

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
        <img id="simonMainImage" src="/img/simonBase.png" />
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
