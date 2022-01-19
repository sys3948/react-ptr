import React, {Component} from 'react';

class Try extends Component {
  render(){
    return(
      /* 자식이 props로 받을려면 아래와 같이 사용하면 된다. */
      <li>
        <div>{this.props.tryInfo.try}</div>
        <div>{this.props.tryInfo.result}</div>
      </li>
    )
  }
}

export default Try;