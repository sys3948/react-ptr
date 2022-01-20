import React, { Component } from 'react';


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

    resultScreen = () => {
        return (
            this.state.result.length === 0 ? 
            null : <div>평균 시간 : {this.state.result.reduce((a, c) => a + c) / this.state.result.length}ms</div>
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

export default ResponseCheck;