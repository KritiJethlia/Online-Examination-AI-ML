// used for timer in the exam
import React from 'react';
import './Clock.css';
export default class Clock extends React.Component {
  format(time) {
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    minutes = minutes.toString().length === 1 ? "0" + minutes : minutes;
    seconds = seconds.toString().length === 1 ? "0" + seconds : seconds;
    return minutes + ':' + seconds;
  }
  render () {
    const {time} = this.props;
    return (
      <div className="displayedTime">
        <div className="card timer" >
        <h1> {this.format(time)}</h1>
        </div>
      </div>
    )
  }
}
