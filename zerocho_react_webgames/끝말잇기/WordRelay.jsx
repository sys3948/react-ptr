const React = require('react'); // npm에서 react를 불러와야지 하나의 html 파일에서 컴포넌트를 생성 하는 것이 아닌 여러개의 jsx or js 파일로 컴포넌트를 생성할 수 있다.
const {Component} = React;

class WordRelay extends Component{
    state = {
        text : 'Hello, webpack',
    };

    render(){
        return <h1>{this.state.text}</h1>
    };
}

module.exports = WordRelay; // node의 module system으로 외부에서 WordRelay 컴포넌트를 load하기 위해서 작성해줘야한다.