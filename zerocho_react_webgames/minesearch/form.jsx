import React, { useState, useCallback, useContext } from 'react';
import { TableContext, START_GAME } from './minesearch';

const Form = () => {

  const [row, setRow] = useState(10);
  const [cell, setCell] = useState(10);
  const [mine, setMine] = useState(20);
  const { dispatch } = useContext(TableContext); // 생성된 Context API를 외부에서 호출하는 방법은 useContext를 이용하면 된다. useContext를 사용하기 위해서는 생성된 Context API는 export를 해줘서 import해서 불러온다.

  const onChangeRow = useCallback((e) => {
    setRow(e.target.value);
  }, [])


  const onChangeCell = useCallback((e) => {
    setCell(e.target.value);
  }, [])


  const onChangeMine = useCallback((e) => {
    setMine(e.target.value);
  }, [])

  const onClickBtn =  useCallback((e) => {
    dispatch({type : START_GAME, row, cell, mine});
  }, [row, cell, mine]);

  return (
    <>
      <input type='number' placeholder='세로' value={row} onChange={onChangeRow} />
      <input type='number' placeholder='가로' value={cell} onChange={onChangeCell} />
      <input type='number' placeholder='지뢰' value={mine} onChange={onChangeMine} />
      <button type='button' onClick={onClickBtn}>시작</button>
    </>
  );
}

export default Form;