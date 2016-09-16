import React, {Component} from 'react';

export default class ControlButton extends Component {
  render(){
    let style = {
      color: "red",
      fontSize: "150%",
      position: "absolute",
      zIndex: "105"
    };
    style.top = this.props.top;
    style.left = this.props.left;
    return (
      <span style={style}>{this.props.display_count}</span>
    );
  }
}
