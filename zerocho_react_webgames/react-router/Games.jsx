import React from 'react';
import {BrowserRouter, HashRouter, Route, Link} from 'react-router-dom'
import GuGuDan from '../gugudan/gugudan';
import LottoHooks from '../lotto/lotto';
import NumberBaseball from '../numberbaseball/NumberBaseball';
import TicTacTeo from '../tictactoe/tictacteo';
import MineSearch from '../minesearch/minesearch'

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
            <Link to="/gugudan" >구구단</Link>
          </li>
          <li>
            <Link to="/lotto" >로또번호 출력</Link>
          </li>
          <li>
            <Link to="/numberbaseball" >숫자 야구</Link>
          </li>
          <li>
            <Link to="/tictactoe" >틱택토</Link>
          </li>
          <li>
            <Link to="/minesearch" >지뢰찾기</Link>
          </li>
        </ul>
      </div>
      <div>
        {/* 화면이 변경되는 부분 */}
        {/* react-router-dom의 Route는 가상의 URL(path)을 만들어서 각 URL에 해당되는 Component를 연결해준다. 그렇기에 React Route는 눈속임이다. */}
        <Route path="/gugudan" component={GuGuDan} />
        <Route path="/lotto" component={LottoHooks} />{/* Hooks로 load할 때 React package가 두 번 import하기 때문에 Error가 발생한다. 그렇기에 Hooks로 load가 아니라 class로 load해야한다. */}
        <Route path="/numberbaseball" component={NumberBaseball} />
        <Route path="/tictactoe" component={TicTacTeo} />
        <Route path="/minesearch" component={MineSearch} />
      </div>
    </BrowserRouter>
  )
};

export default Games;  