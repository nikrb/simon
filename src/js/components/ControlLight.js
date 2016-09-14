import React, {Component} from 'react';

export default class ControlButton extends Component {
  render(){
    let button_style = {
      width: "2%",
      cursor: "pointer",
      position: "absolute",
      zIndex: "105"
    };
    button_style.top = this.props.top;
    button_style.left = this.props.left;
    return (
      <img src={this.props.lightOn ? this.props.lightSrcOn : this.props.lightSrcOff} style={button_style} />
    );
  }
}
