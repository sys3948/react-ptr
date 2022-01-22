import React, {Component, useState, useEffect, useRef} from 'react';

/*
  class의 라이프 사이클은 : constructor -> render -> ref -> componentDidMount 
  1. setState 또는 props가 변경 되었을 때 : shouldComponentUpdate(return true) -> render -> componentDidUpdate
  2. 컴포넌트를 제거했을 때 -> componentWillUnmount -> 소멸.
*/

const rspCoords = {
  바위 : '0',
  가위 : '-142px',
  보 : '-284px',
};

const scores = {
  가위 : 1,
  바위 : 0,
  보 : -1,
};

const computerChoice = (imgCoord) => {
  return Object.entries(rspCoords).find((v) => {
    return v[1] === imgCoord;
  })[0];
};

class RSP extends Component{
  state = {
    result : '',
    score : 0,
    imgCoord : '0',
  };

  interval;

  changeHand = () => {
    console.log('실행');
    const {imgCoord} = this.state;
    console.log(imgCoord);
    if(imgCoord === rspCoords.바위){
      this.setState({
        imgCoord : rspCoords.가위,
      });
    } else if(imgCoord === rspCoords.가위){
      this.setState({
        imgCoord : rspCoords.보,
      });
    } else if(imgCoord === rspCoords.보){
      this.setState({
        imgCoord : rspCoords.바위,
      });
    }
  }

  componentDidMount(){
    /*
      render가 실행하고 나서 처음 실행하는 method로 react에서 지원하는 라이프 사이클 중 하나다.
      state가 변경되었어도 실행 되지 않는 method다.
      react의 라이프 사이클 중 하나로 shouldComponentUpdate가 있다.
      비동기 요청을 많이 사용되는 method.
    */
    this.interval = setInterval(this.changeHand, 1000);
  }

  componentWillUnmount(){
    /*
      컴포넌트가 제거되기 직전에 실행되는 라이프 사이클 method다.
      비동기 요청 정리를 할 때 많이 사용되는 method.
    */
   clearInterval(this.interval);
  }

  componentDidUpdate(){
    /*
      리렌더링(setState) 후에 실행되는 라이프 사이클 method다.
    */
  }

  onClickBtn = (arg) => () =>  {
    // 함수 ()에 연달아 ()를 추가하는 것은 js의 고차함수라고 한다.
    clearInterval(this.interval);
    const {imgCoord} = this.state;
    const myScore = scores[arg];
    const aiScore = scores[computerChoice(imgCoord)];
    const decisionScore = myScore - aiScore;

    if(decisionScore === 0){
      this.setState({
        result : '비겼습니다.',
      });
    } else if([-1, 2].includes(decisionScore)){
      this.setState((prevState) => {
        return {
          result : '이겼습니다.',
          score : prevState.score + 1,
        }
      })
    } else {
      this.setState((prevState) => {
        return {
          result : '졌습니다.',
          score : prevState.score - 1,
        }
      })
    }
    setTimeout(() => {
      this.interval = setInterval(this.changeHand, 1000);
    }, 2000)
  }

  render(){
    return (
      <>
        <div id='computer' style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${this.state.imgCoord} 0` }}></div>
        <div>
            {/* 
              아래 코드 중 onClick 이벤트 함수로 {this.onClickBtn()}으로 작성하면  다음과 같은 에러가 발생한다.
              Maximum update depth exceeded. This can happen when a component repeatedly calls setState inside componentWillUpdate or componentDidUpdate. React limits the number of nested updates to prevent infinite loops.
              에러 발생 이유는 이벤트 설정시 함수 호출을 할 경우(함수에 ()를 붙일 경우) 함수가 호출되기 때문에 무한루프가 발생하여 위와 같은 에러가 발생한다.
              그렇기에 해결하는 방법은 ()를 빼서 호출하지 않거나 또는 이벤트 함수에 매개변수가 필요할 시 아래와 같이 화살 함수를 사용해야한다.
              다른 해결 방법으로는 위에 정의한 함수와 같이 고차함수를 사용하면 된다.
            */}
            <button type='button' id='rock' className='btn' onClick={this.onClickBtn('바위')}>바위</button>
            <button type='button' id='scissor' className='btn' onClick={this.onClickBtn('가위')}>가위</button>
            <button type='button' id='paper' className='btn' onClick={this.onClickBtn('보')}>보</button>
        </div>
        <div>{this.state.result}</div>
        <div>현재 {this.state.score}점</div>
      </>
    )
  }
}


const RSPHooks = () => {
  const [result, setResult] = useState('');
  const [score, setScore] = useState(0);
  const [imgCoord, setImgCoord] = useState('0');
  const interval = useRef();

  useEffect(() => { // componentDidMount, componentDidUpdate 역할을 한다.(1대1 대응은 아니다.)
    interval.current = setInterval(changeHand, 1000);
    return() => {// componentWillUnmount 역할을 한다.
      clearInterval(interval.current);
    }
  }, [ /*
         변경할 state를 정의하는 구간으로 정의한 state가 변경될 때마다 return 부분이 실행된다.
         만약 빈 배열이면 useEffect는 어떤 state가 변화해도 난 신경쓰지 않겠다라는 의미로 렌더링을 실행하지 않는다.
         useEffect는 state마다 다르게 실행하기 때문여 여러번 호출할 수 있다.
       */
      imgCoord
  ]);

  const changeHand = () => {
    if(imgCoord === rspCoords.바위){
      setImgCoord(rspCoords.가위);
    } else if(imgCoord === rspCoords.가위){
      setImgCoord(rspCoords.보);
    } else if(imgCoord === rspCoords.보){
      setImgCoord(rspCoords.바위);
    }
  }

  const onClickBtn = (arg) => () =>  {
    // 함수 ()에 연달아 ()를 추가하는 것은 js의 고차함수라고 한다.
    const myScore = scores[arg];
    const aiScore = scores[computerChoice(imgCoord)];
    const decisionScore = myScore - aiScore;

    if(decisionScore === 0){
      setResult('비겼습니다.');
    } else if([-1, 2].includes(decisionScore)){
      setResult('비겼습니다.');
      setScore((prevScore)=>{
        return(prevScore + 1);
      });
    } else {
      setResult('졌습니다.');
      setScore((prevScore)=>{
        return(prevScore - 1);
      });
    }
    setTimeout(() => {
      interval = setInterval(this.changeHand, 1000);
    }, 2000)
  }

  return (
      <>
        <div id='computer' style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }}></div>
        <div>
            <button type='button' id='rock' className='btn' onClick={onClickBtn('바위')}>바위</button>
            <button type='button' id='scissor' className='btn' onClick={onClickBtn('가위')}>가위</button>
            <button type='button' id='paper' className='btn' onClick={onClickBtn('보')}>보</button>
        </div>
        <div>{result}</div>
        <div>현재 {score}점</div>
      </>
    )
}


export default RSPHooks;