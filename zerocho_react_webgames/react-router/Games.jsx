import React from 'react';
import {BrowserRouter, HashRouter, Route, Link} from 'react-router-dom'
import GuGuDan from '../gugudan/gugudan';
import LottoHooks from '../lotto/lotto';
import NumberBaseball from '../numberbaseball/NumberBaseball';
import TicTacTeo from '../tictactoe/tictacteo';
import MineSearch from '../minesearch/minesearch'
import GameMatcher from './GameMatcher';

const Games = () => {
  return(
    /* 
      HashRouter는 URL에 Hash(#)이 붙여서 나온다. 
      BrowserRouter와 HashRouter의 차이는
      BrowserRouter는 Server에서 알지만(Server쪽에 Setting을 해줘야하며, 검색엔진에서 인식된다.)
      HashRouter는 Server가 알지 못하고 Browser만 안다는 점(Browser에서만 동작한다. 검색엔진에서 인식되지 않는다.)이다.
    */
    <BrowserRouter>{/* react-router-dom의 BrowserRouter와 HashRouter는 최상위에 존재해야한다.  */}
      {/* Link는 a element와 유사해보이지만 정확히 Route Component와 연결되어있다. */}
      <div>
        {/* 공통적인 부분(layout) */}
        <ul>
          <li>
            <Link to="/game/gugudan" >구구단</Link>
          </li>
          <li>
            <Link to="/game/lotto" >로또번호 출력</Link>
          </li>
          <li>
            <Link to="/game/numberbaseball" >숫자 야구</Link>
          </li>
          <li>
            <Link to="/game/tictactoe" >틱택토</Link>
          </li>
          <li>
            <Link to="/game/minesearch" >지뢰찾기</Link>
          </li>
          <li>
            <Link to="/game/index" >게임매쳐</Link>
          </li>
        </ul>
      </div>
      <div>
        {/* 화면이 변경되는 부분 */}
        {/* react-router-dom의 Route는 가상의 URL(path)을 만들어서 각 URL에 해당되는 Component를 연결해준다. 그렇기에 React Route는 눈속임이다. */}
        {/* <Route path="/gugudan" component={GuGuDan} /> */}
        {/* <Route path="/lotto" component={LottoHooks} />Hooks로 load할 때 React package가 두 번 import하기 때문에 Error가 발생한다. 그렇기에 Hooks로 load가 아니라 class로 load해야한다. */}
        {/* <Route path="/numberbaseball" component={NumberBaseball} /> */}
        {/* <Route path="/tictactoe" component={TicTacTeo} /> */}
        {/* <Route path="/minesearch" component={MineSearch} /> */}
        <Route path="/game/:name" component={GameMatcher} />
        {/*
          line 51에서 component 인자 값으로 GameMatcher가 Class가 아닌 Hooks였다면 넘기는 방법은 두 가지다.
            1. 화살 함수로 return 하기.
              ex) <Route path="/game/:name" component={() => <GameMatcher props="123" />} />
            2. component 대신 render 사용하기.
              ex) <Route path="/game/:name" render={(props) => <GameMatcher props={props.abc} />} />

          위 Route가 복수개일 경우 path가 일치한다면 하나의 Route가 출력되는 것이 아닌 일치되는 Route들이 출력된다.
          이러한 문제를 해결하기 위해 Switch가 존재한다.
          Switch는 의미 그대로 스위치로서 전등을 키는 스위치와 동일한 개념으로 
          첫 번째 하나의 Route가 일치하면 다른 Route들은 종료된다.

          Switch가 되지 않을 경우 exact 속성이 있다.
          exact 속성은 Switch와 다르게 첫 번째 하나의 Route가 맞는 것을 찾는게 아닌 
          path가 100% 일치할 경우 실행하는 속성이다.
         */}
      </div>
    </BrowserRouter>
  )
};

export default Games;  