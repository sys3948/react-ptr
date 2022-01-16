const React = require('react')

class GuGuDan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      first : Math.ceil(Math.random() * 9),
      second : Math.ceil(Math.random() * 9),
      input_value : '',
      result_value : '',
    };
  }

  onChange = (e) => {
    this.setState({input_value : e.target.value});
  }

  onSubmit = (e) => {
    e.preventDefault();
    if(parseInt(this.state.input_value) === this.state.first * this.state.second){
      this.setState((prevState) => {
        return {
          result_value : prevState.first + " x " + prevState.second + " = " + parseInt(prevState.input_value) + " 정답!",
          first : Math.ceil(Math.random() * 9),
          second : Math.ceil(Math.random() * 9),
          input_value : '',
        }
      });

      this.input.focus();
    }else {
      this.setState({
        result_value : "땡",
        input_value : '',
      });
      this.input.focus();
    }
  }

  onFouce = (c) => {this.input = c};

  input;

  render(){
    return (
      <>
        <div>{this.state.first} 곱하기 {this.state.second}는?</div>
        <form onSubmit={this.onSubmit}>
          <input ref={this.onFouce} type="number" value = {this.state.input_value} onChange={this.onChange} />
          <button type="submit">입력!</button>
        </form>
        <div>{this.state.result_value}</div>
      </>
    );
  }
}


module.exports = GuGuDan;