import React, {PureComponent, Component} from 'react';


class Ball extends PureComponent{
  render(){
    let background;
    if(this.props.number <= 10){
      background = 'red';
    } else if(this.props.number <= 20){
      background = 'orange';
    } else if(this.props.number <= 30){
      background = 'yellow';
    } else if(this.props.number <= 40){
      background = 'blue';
    } else{
      background = 'green';
    }

    return(
      <div className='ball' style={{background}}>{this.props.number}</div>
    );
  }
}

export default Ball;