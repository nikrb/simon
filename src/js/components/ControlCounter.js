import React, {Component} from 'react';

export default class ControlButton extends Component {
  render(){
    let style = {
      color: "red",
      fontSize: "1.5em",
      position: "absolute",
      zIndex: "105"
    };
    style.top = this.props.top;
    style.left = this.props.left;
    return (
      <span style={style}>{this.props.current_count}</span>
    );
  }
}
