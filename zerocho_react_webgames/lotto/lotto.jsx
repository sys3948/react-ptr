import React, {Component} from 'react';
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


export default Lotto;