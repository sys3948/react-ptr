import React, { Component } from "react";
import{ withRouter } from 'react-router-dom'; // Route와 연결되지 않는 상태에서 Route에서 보내는 location, history, match에 대한 정보를 얻을 때 사용하는 module이다.

/*
  history : url에 대한 이동 기록(React Router는 눈속임이다. 그런 눈속임용 정보들이 들어있다.)
  location : url의 이름(pathname), hash, search 정보가 들어있는 객체이다.
  match : 이동 되는 url(동적 주소 정보)에 대한 정보가 담겨져있다. ex) /game/:name -> :name의 정보(params)가 존재한다.
 */

import GuGuDan from '../gugudan/gugudan';
import LottoHooks from '../lotto/lotto';
import NumberBaseball from '../numberbaseball/NumberBaseball';
import TicTacTeo from '../tictactoe/tictacteo';
import MineSearch from '../minesearch/minesearch'

class GameMatcher extends Component {
    render(){
        console.log(this.props);
        if(this.props.match.params.name === 'gugudan'){
            return <GuGuDan />
        } else if(this.props.match.params.name === 'lotto'){
            return <LottoHooks />
        } else if(this.props.match.params.name === 'numberbaseball'){
            return <NumberBaseball />
        } else if(this.props.match.params.name === 'tictactoe'){
            return <TicTacTeo />
        } else if(this.props.match.params.name === 'minesearch'){
            return <MineSearch />
        }
        return (
          <div>일치한 게임이 없습니다.</div>
        )
    }
}

export default GameMatcher;