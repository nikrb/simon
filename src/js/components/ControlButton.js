import React, {Component} from 'react';
import {getTransparencyAtXY} from "./Utils";

export default class ControlButton extends Component {
  constructor( props){
    super( props);
  }
  render(){
    let button_style = {
      width: "5%",
      cursor: "pointer",
      position: "absolute",
      zIndex: "105"
    };
    button_style.top = this.props.top;
    button_style.left = this.props.left;
    return (
      <img src={this.props.buttonSrc} onClick={this.props.clicked} style={button_style} />
    );
  }
}
