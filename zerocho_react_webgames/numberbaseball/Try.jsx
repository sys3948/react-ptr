import React, {PureComponent} from 'react';

class Try extends PureComponent {
  render(){
    return(
      /* 자식이 props로 받을려면 아래와 같이 사용하면 된다. */
      /* props는 무조건 부모에서 변경해야한다. */
      /* 만약 변경해야할 상황이 온다면 props를 자식의 state로 변환해주고 그 값을 변경해준다. */
      <li>
        <div>{this.props.tryInfo.try}</div>
        <div>{this.props.tryInfo.result}</div>
      </li>
    )
  }
}

export default Try;