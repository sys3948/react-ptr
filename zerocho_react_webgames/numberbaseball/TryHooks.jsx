import React, {memo} from "react";

/* hooks에서의 props 받는 방법은 아래와 같이 함수 인자로 받으면 된다. */
/* 인자 형태는 아래와 같이 {}로 감싸야 한다. {}로 감싸지 않으면 Object로 받게 된다. */
/* memo는 Class Commponent의 PureComponent와 같은 기능을 하는 함수다. */

const Try = memo(({tryInfo}) => {
  return (
    <li>
      <div>{tryInfo.try}</div>
      <div>{tryInfo.result}</div>
    </li>
  )
})

export default Try;