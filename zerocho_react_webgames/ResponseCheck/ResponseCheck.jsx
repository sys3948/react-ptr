import React, { Component, useState, useRef } from 'react';


class ResponseCheck extends Component {
    state = {
        state : 'waiting',
        message : '클릭해서 시작하세요.',
        result : [],
    };

    timeout;
    startTime;
    endTime;

    onClickScreen = () => {
        const {state, message, result} = this.state;
        if(state === 'waiting'){
            this.setState({
                state : 'ready',
                message : '초록색이 되면 클릭하세요.',
            });
            this.timeout = setTimeout(() => {
                this.setState({
                    state : 'now',
                    message : '지금 클릭',
                });
                this.startTime = new Date();
            }, Math.floor(Math.random() * 1000) + 2000);
        } else if(state === 'ready'){
            clearTimeout(this.timeout); // 위 setTimeout() 초기화 해주기.
            this.setState({
                state : 'waiting',
                message : '너무 성급하셨군요. 초록색이 된 후에 클릭하세요.',
            });
        } else if(state === 'now'){
            this.endTime = new Date();
            this.setState((prevState) => {
                return{
                state : 'waiting',
                result : [...prevState.result, this.endTime - this.startTime],
                message : '클릭해서 시작하세요.',}
            });
        }
    }


    onReset = () => {
        this.setState({
            result : [],
        });
    }

    resultScreen = () => {
        return (
            this.state.result.length === 0 ? 
            null : 
            <>
                <div>평균 시간 : {this.state.result.reduce((a, c) => a + c) / this.state.result.length}ms</div>
                <button onClick={this.onReset}>리셋</button>
            </>
        );
    }

    render(){
        return(
            <>
              <div id='screen' className={this.state.state} onClick={this.onClickScreen}>
                  {this.state.message}
              </div>
              {/* React에서의 조건문은 아래와 같이 삼항 연산자 또는 부호 연산자를 사용한다. */}
              {this.resultScreen()}
            </>
        );
    }
}


const ResponseCheckHooks = () => {
    const [state, setState] = useState('waiting');
    const [message, setMessage] = useState('클릭해서 시작하세요.');
    const [result, setResult] = useState([]);

    // Class Component일 때의 Ref는 DOM의 접근할 때 사용한 것이다.
    // Hooks에서의 Ref는 Class의 this의 기능도 가지고 있다.
    // 또한 Hooks의 Ref(useRef)는 Hooks에서 State를 변경하면 Hooks 전체가 다시 렌더링이 되는데
    // Ref부분만 렌더링이 되지 않고 변하는 값만 기록해둔다. 화면에 변환을 주지 않는다.
    // Ref를 사용할 경우 current로 접근해야한다는 것을 잊지 말아야한다.
    const timeout = useRef(null);
    const startTime = useRef();
    const endTime = useRef();

    const onClickScreen = () => {
        if(state === 'waiting'){
            setState('ready');
            setMessage('초록색이 되면 글릭하세요.');
            timeout.current = setTimeout(() => {
                setState('now');
                setMessage('지금 클릭');
                startTime.current = new Date();
            }, Math.floor(Math.random() * 1000) + 2000);
        } else if(state === 'ready'){
            clearTimeout(timeout.current); // 위 setTimeout() 초기화 해주기.
            setState('waiting');
            setMessage('너무 성급하셨군요. 초록색이 된 후에 클릭하세요.');
        } else if(state === 'now'){
            endTime.current = new Date();
            setState('waiting');
            setResult((prevResult) => {
                return([...prevResult, endTime.current - startTime.current]);
            });
            setMessage('클릭해서 시작하세요.');
        }
    }

    const onReset = () => {
        setResult([]);
    }

    const resultScreen = () => {
        return (
            result.length === 0 ? 
            null : 
            <>
                <div>평균 시간 : {result.reduce((a, c) => a + c) / result.length}ms</div>
                <button onClick={onReset}>리셋</button>
            </>
        );
    }

    return(
        <>
            <div id='screen' className={state} onClick={onClickScreen}>
                {message}
            </div>
            {/* React에서의 조건문은 아래와 같이 삼항 연산자 또는 부호 연산자를 사용한다. */}
            {resultScreen()}
        </>
    );
}

export default ResponseCheckHooks;