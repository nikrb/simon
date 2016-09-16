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
    this.load_count = 0;
    // either move litup to parent or maybe add an enabled flag
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
  getXY( e){
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - rect.left;
    const y = e.pageY - rect.top;
    return { x, y};
  }
  padClicked( e){
    const pt = this.getXY( e);
    const alpha = getTransparencyAtXY( this.dull, pt);
    if( this.props.padEnabled && alpha > 0){
      this.setBright( true);
    }
  }
  padReleased( e){
    if( this.state.litup){
      this.setBright( false);
      const alpha = getTransparencyAtXY( this.dull, this.getXY( e));
      if( alpha ){
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
      <img id={this.props.padSrcDull} style={padStyle} src={(this.state.litup || this.props.bright) ?
          this.props.padSrcBright : this.props.padSrcDull}
          onMouseDown={this.padClicked.bind(this)} onMouseUp={this.padReleased.bind(this)} />
    );
  }
}
