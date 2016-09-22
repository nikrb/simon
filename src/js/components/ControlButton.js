import React, {Component} from 'react';
import {getTransparencyAtXY} from "./Utils";

export default class ControlButton extends Component {
  constructor( props){
    super( props);
    this.state = {
      pressed : false
    }
  }
  mouseDown = e => {
    this.setState( { pressed : true});
  }
  mouseRelease = e => {
    this.setState( { pressed: false});
    this.props.clicked( e);
  }
  render(){
    const box = this.state.pressed? "0px 0px 0px #888888" : "0px 2px 5px #888888";
    let button_style = {
      borderRadius: "100%",
      boxShadow: box,
      width: "5%",
      cursor: "pointer",
      position: "absolute",
      zIndex: "105"
    };
    button_style.top = this.props.top;
    button_style.left = this.props.left;
    return (
      <img src={this.props.buttonSrc} onMouseDown={this.mouseDown}
        onMouseUp={this.mouseRelease} style={button_style} />
    );
  }
}
