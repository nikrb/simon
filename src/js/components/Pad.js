import React from 'react';
import {getTransparencyAtXY} from "./Utils";

export default class Pad extends React.Component {
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
    this.image_tag = null;
    this.load_count = 0;
    // either move litup to parent or maybe add an enabled flag
    this.state = {
      litup : false,
      loaded : false
    };
    this.sound = null;
  }
  componentWillMount(){
    this.sound = new Audio( this.props.sound);
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
  play( ){
    this.setBright( true);
    this.sound.currentTime = 0;
    this.sound.play();
  }
  stop(){
    this.setBright( false);
    this.sound.pause();
  }
  setBright( bright){
    this.setState( { litup : bright});
  }
  getXY( e){
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    return { x, y};
  }
  padClicked( e){
    const pt = this.getXY( e);
    const box = { width: this.image_tag.width, height: this.image_tag.height};
    const alpha = getTransparencyAtXY( this.dull, box, pt);
    if( this.props.padEnabled && alpha > 0){
      this.setBright( true);
      this.sound.currentTime = 0;
      this.sound.play();
    }
  }
  padReleased( e){
    const litup = this.state.litup;
    this.setBright( false);
    if( litup){
      const box = { width: this.image_tag.width, height: this.image_tag.height};
      const alpha = getTransparencyAtXY( this.dull, box, this.getXY( e));
      if( alpha > 0 ){
        this.props.padClick( this.props.padNdx);
      }
    }
  }
  render(){
    // FIXME: onDragStart doesn't do the trick
    const pad = document.getElementById( this.props.padSrcDull);
    if( pad){
      pad.ondragstart = function() { return false; };
    }
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
      <img id={this.props.padSrcDull} style={padStyle} src={(this.state.litup) ?
          this.props.padSrcBright : this.props.padSrcDull}
          ref={ (imgtag) => { this.image_tag = imgtag}}
          onMouseDown={this.padClicked.bind(this)} onMouseUp={this.padReleased.bind(this)} />
    );
  }
}
