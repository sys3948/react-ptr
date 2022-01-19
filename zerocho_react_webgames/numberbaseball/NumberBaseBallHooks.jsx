import React, {useState} from 'react';
import Try from './TryHooks';

function getNumbers(){ // this를 사용하지 않는 함수일 경우 컴포넌트 밖으로 뺄 수 있다.
  const caniddate = [1, 2, 3, 4, 5, 6,7, 8, 9];
  const array = [];
  for(let i = 0; i < 4; i++){
    const chosen = caniddate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
    array.push(chosen);
  }
  return array;
}


const NumberBaseBall = () => {
  const [result, setResult] = useState('');
  const [value, setValue] = useState('');
  const [answer, setAnswer] = useState(getNumbers());
  const [tries, setTries] = useState([]);

  const onSubmitForm = (e) => {
    e.preventDefault();
    if(value === answer.join('')){
      setResult('홈런!');
      setTries([...tries, {try : value, result : '홈런!'}]);
      alert('게임을 다시 시작합니다!');
      setValue('');
      setAnswer(getNumbers());
      setTries([]);
    }else{
      const answerArray = value.split('').map((v) => parseInt(v));
      let strike = 0;
      let ball = 0;
      if (tries.length >= 9){
        setResult(`10번 넘게 틀려서 실패! 답은 ${answer.join(',')}였습니다.`);
        alert('게임을 다시 시작합니다!');
        setValue('');
        setAnswer(getNumbers());
        setTries([]);
      } else {
        for (let i = 0; i < 4; i++){
          if (answerArray[i] == answer[i]){
            strike++;
          } else if (answer.includes(answerArray[i])){
            ball++;
          }
        }
        setValue('');
        setTries([...tries, { try : value, result : `${strike} 스크라이크, ${ball} 볼`}]);
      }
    }
  }

  const onChangeInput = (e) => {
    console.log(answer);
    setValue(e.target.value);
  }


  return (
    <>
      <h1>{result}</h1>
      <form onSubmit={onSubmitForm}>
        <input type="test" maxLength={4} value={value} onChange={onChangeInput} />
      </form>
      <div>시도 : {tries.length}</div>
      <ul>
        {tries.map((v, i) => {
          return(<Try key={`${i + 1}차 시도 :`} tryInfo = {v} />)
        })}
      </ul>
    </>
  )
}

export default NumberBaseBall;