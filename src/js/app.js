import React from 'react';
import ReactDOM from 'react-dom';
import style from '../scss/app.scss';

class Pad extends React.Component {
  constructor( props){
    super( props);
    this.handleLoad = this.handleLoad.bind(this);
    this.handleError = this.handleError.bind(this);
    this.bright = new Image();
    this.bright.onload = this.handleLoad;
    this.bright.onerror = this.handleError;
    this.bright.src = this.props.padSrcBright;
    this.dull = new Image();
    this.dull.onload = this.handleLoad;
    this.dull.onerror = this.handleError;
    this.dull.src = this.props.padSrcDull;
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
    console.error( "pad image load error:", e);
  }
  setBright( bright){
    this.setState( { litup : bright});
  }

  getPixel(imgData, index) {
    var i = index*4, d = imgData.data;
    return [d[i],d[i+1],d[i+2],d[i+3]] // [R,G,B,A]
  }
  getPixelXY( imgData, x, y){
    return this.getPixel(imgData, y*imgData.width+x);
  }
  getTransparencyAtXY( x, y){
    const cvs = document.createElement('canvas')
    const img = this.dull;
    cvs.width = img.width;
    cvs.height = img.height;
    const ctx = cvs.getContext("2d");
    ctx.drawImage( img, 0, 0, cvs.width, cvs.height);
    const image_data = ctx.getImageData( 0,0,cvs.width, cvs.height);
    const pd = this.getPixelXY( image_data, x, y);
    return pd[3];
  }
  padClicked( e){
    const alpha = this.getTransparencyAtXY( e.pageX - e.currentTarget.offsetLeft, e.pageY - e.currentTarget.offsetTop);
    if( alpha > 127){
      this.setBright( true);
      this.props.padClick( this.props.padNdx);
    }
  }
  padReleased( e){
    this.setBright( false);
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
    return (
      <img style={padStyle} src={(this.state.litup) ?
          this.props.padSrcBright : this.props.padSrcDull}
          onMouseDown={this.padClicked.bind(this)} onMouseUp={this.padReleased.bind(this)} />
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
