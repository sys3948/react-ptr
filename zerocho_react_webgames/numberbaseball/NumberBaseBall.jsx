import React, {Component} from 'react';
import Try from './Try';

function getNumbers(){ // this를 사용하지 않는 함수일 경우 컴포넌트 밖으로 뺄 수 있다.
  const caniddate = [1, 2, 3, 4, 5, 6,7, 8, 9];
  const array = [];
  for(let i = 0; i < 4; i++){
    const chosen = caniddate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
}

class NumberBaseball extends Component{
  state = {
    result : '',
    value : '',
    answer : getNumbers(),
    tries : [],
  }


  onSubmitForm = (e) => {
    e.preventDefault();
    if(this.state.value === this.state.answer.join('')){
      this.setState({
        result : '홈런!',
        tries : [...this.state.tries, {try : this.state.value, result : '홈런!'}],
      });
      alert('게임을 다시 시작합니다!');
        this.setState({
          value : '',
          answer : getNumbers(),
          tries : [],
        });
    }else{
      const answerArray = this.state.value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if (this.state.tries.length >= 9){
        this.setState({
          result : `10번 넘게 틀려서 실패! 답은 ${this.state.answer.jsoin(',')}였습니다.`,
        });
        alert('게임을 다시 시작합니다!');
        this.setState({
          value : '',
          answer : getNumbers(),
          tries : [],
        });
      } else {
        for (let i = 0; i < 4; i++){
          if (answerArray[i] == this.state.answer[i]){
            strike++;
          } else if (this.state.answer.includes(answerArray[i])){
            ball++;
          }
        }
        this.setState({
          tries : [...this.state.tries, { try : this.state.value, result : `${strike} 스크라이크, ${ball} 볼`}],
          value : '',
        })
      }
    }
  }

  onChangeInput = (e) => {
    console.log(this.state.answer);
    this.setState({
      value: e.target.value,
    });
  };


  render(){
    return (
      <>
        <h1>{this.state.result}</h1>
        <form onSubmit={this.onSubmitForm}>
          <input type="test" maxLength={4} value={this.state.value} onChange={this.onChangeInput} />
        </form>
        <div>시도 : {this.state.tries.length}</div>
        <ul>
          {this.state.tries.map((v, i) => {
            /*아래는 React에서의 props로 부모 state를 자식에게 넘겨줄 수 있는 속성이다.*/
            return(<Try key={`${i + 1}차 시도 :`} tryInfo = {v} />)
          })}
        </ul>
      </>
    )
  }
}


export default NumberBaseball;
