import React, {Component} from 'react';

export default class ControlButton extends Component {
  constructor( props){
    super( props);
    this.oopsSound = new Audio( "/audio/wrong.mp3");
    // FIXME: do we need this bind?
    this.flashError = this.flashError.bind(this);
    this.flash_count = 0;
    this.flash_visible = false;
    this.show_error = false;
    this.state = {
      display_error: ""
    }
  }
  playOopsSound(){
    this.oopsSound.currentTime = 0;
    this.oopsSound.volume = 0.2;
    this.oopsSound.play();
  }
  startFlashError(){
    this.show_error = true;
    this.flash_error = 4;
    this.flash_visible = false;
    this.flashError();
  }
  flashError(){
    if( this.flash_error > 0){
      this.flash_error -= 1;
      if( this.flash_visible){
        this.flash_visible = false;
        this.setState( { display_error: ""});
        setTimeout( this.flashError, 300);
      } else {
        this.flash_visible = true;
        this.setState( { display_error: "!!"});
        setTimeout( this.flashError, 500);
      }
    } else {
      // TODO: maybe sync this call to end of mistake sound
      this.show_error = false;
      this.props.errorDisplayFinished();
    }
  }

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
      <span style={style}>{ this.show_error ? this.state.display_error : this.props.display_count}</span>
    );
  }
}
