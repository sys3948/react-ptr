import React, {Component, useState, useRef, useEffect, useMemo} from 'react';
import Ball from './ball';

function getWinNumbers() {
  const candidate = Array(45).fill().map((v, i) => i + 1);
  const shuffle = [];
  while (candidate.length > 0){
    shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
  }
  const bonusNumber = shuffle[shuffle.length - 1];
  const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);
  return [...winNumbers, bonusNumber];
}

class Lotto extends Component{
  state = {
    windNumbers : getWinNumbers(),
    winBalls : [],
    bouns : null,
    redo : false,
  };

  timeouts = [];

  runTimeouts = () => {
    for(let i = 0; i < this.state.windNumbers.length - 1; i++){
      this.timeouts[i] = setTimeout(() => {
        this.setState((prevState) => {
          return{
            winBalls : [...prevState.winBalls, this.state.windNumbers[i]],
          }
        });
      }, (i + 1) * 1000);
    }
    this.timeouts[6] = setTimeout(() => {
      this.setState({
        bouns : this.state.windNumbers[6],
        redo : true,
      });
    }, 7000);
  }

  componentDidMount(){
    this.runTimeouts();
  }

  componentWillUnmount(){
    this.timeouts.forEach((v) => {
      clearTimeout(v);
    });
  }

  componentDidUpdate(prevProps, prevState){
    if(this.state.winBalls.length === 0){
      this.runTimeouts();
    }
  }

  onClickRedo = () => {
    this.setState({
      windNumbers : getWinNumbers(),
      winBalls : [],
      bouns : null,
      redo : false,
    });
    this.timeouts = [];
  }

  render(){
    return(
      <>
        <div>당첨 숫자</div>
        <div id='결과창'>
          {this.state.winBalls.map((v) => <Ball key={v} number={v} />)}
        </div>
        <div>보너스</div>
        {this.state.bouns && <Ball number={this.state.bouns} />}
        {this.state.redo && <button type='button' onClick={this.state.redo ? this.onClickRedo : () => {}}>한 번 더!</button>}
      </>
    );
  }
}


const LottoHooks = () => {
  const lottoNumbers = useMemo(() => getWinNumbers(), []); // useMemo는 두 번째 인자 배열 요소가 바뀌기 전까지는 기억한다. useMemo는 값을 기억하는 거고 useCallback은 함수를 기억한다. 자식 Component에 함수를 props로 보낼 경우 useCallback으로 보내야 된다.
  const [windNumbers, setWindNumbers] = useState(lottoNumbers);
  const [winBalls, setWinBalls] = useState([]);
  const [bouns, setBouns] = useState(null);
  const [redo, setRedo] = useState(false);
  const timeouts = useRef([]);

  const runTimeouts = () => {
    for(let i = 0; i < windNumbers.length - 1; i++){
      timeouts.current[i] = setTimeout(() => {
        setWinBalls((prevWinBalls) => {
          return(
            [...prevWinBalls, windNumbers[i]]
          );
        })
      }, (i + 1) * 1000);
    }
    timeouts.current[6] = setTimeout(() => {
      setBouns(windNumbers[6]);
      setRedo(true);
    }, 7000);
  }

  useEffect(() => {
    runTimeouts();
    return() => {
      timeouts.current.forEach((v) => {
        clearTimeout(v);
      })
    }
  }, [timeouts.current]); // 두 번째 인자가 빈 배열이면 ComponentDidMount와 동일, 배열의 요소가 존재시 ComponentDidMout와 ComponentDidUpdate 동시 수행한다.

  const onClickRedo = () => {
    setWindNumbers(getWinNumbers());
    setWinBalls([]);
    setBouns(null);
    setRedo(false);
    timeouts.current = [];
  }

  return(
    <>
      <div>당첨 숫자</div>
      <div id='결과창'>
        {winBalls.map((v) => <Ball key={v} number={v} />)}
      </div>
      <div>보너스</div>
      {bouns && <Ball number={bouns} />}
      {redo && <button type='button' onClick={redo ? onClickRedo : () => {}}>한 번 더!</button>}
    </>
  );
}


export default LottoHooks;