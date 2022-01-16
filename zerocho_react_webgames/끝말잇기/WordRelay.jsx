const React = require('react'); // npm에서 react를 불러와야지 하나의 html 파일에서 컴포넌트를 생성 하는 것이 아닌 여러개의 jsx or js 파일로 컴포넌트를 생성할 수 있다.
const {Component} = React;

class WordRelay extends Component{
  state = {
    word : '윤',
    value : '',
    result : '',
  };

  onChange = (e) => {
    this.setState({
        value : e.target.value,
    });
  }

  InputRef = (c) => {
    this.input = c;
  }

  onSubmit = (e) => {
    e.preventDefault();
    if(this.state.word[this.state.word.length - 1] === this.state.value[0]){
      this.setState({
        result : '정답!',
        word : this.state.value,
        value : ''
      });
      this.input.focus();
    } else {
      this.setState({
        result : '땡!',
        value : ''
      });
      this.input.focus();
    }
  }

  input;

  render(){
    return (
      <>
        <div>{this.state.word}</div>
        <form onSubmit={this.onSubmit}>
          <input ref={this.InputRef} value={this.state.value} onChange={this.onChange} />
          <input type="submit" value="입력" / >
        </form>
        <div>{this.state.result}</div>
      </>  
    )
  };
}

module.exports = WordRelay; // node의 module system으로 외부에서 WordRelay 컴포넌트를 load하기 위해서 작성해줘야한다.