import React, { useReducer, createContext, useMemo } from 'react';
import Form from './form';
import Table from './table';

export const CODE = {
  MINE : -7,
  NORMAL : -1,
  QUESTION : -2,
  FLAG : -3,
  QUESTION_MINE : -4,
  FLAG_MINE : -5,
  CLICKED_MINE : -6,
  OPENED : 0,
}

export const TableContext = createContext({
  tableData : [],
  dispatch : () => {},
});

const initialState = {
  tableData : [],
  timer : 0,
  result : '',
  halted : false,
};

const plantMine =(row, cell, mine) => {
  console.log(row, cell, mine);
  const candidate = Array(row * cell).fill().map((arr, i) => {
    return i;
  });

  const shuffle = [];
  while (candidate.length > row * cell - mine){
    const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
    shuffle.push(chosen);
  }

  const data = [];
  for (let i = 0; i < row; i++){
    const rowData = [];
    data.push(rowData);
    for(let j = 0; j < cell; j++){
      rowData.push(CODE.NORMAL);
    }
  }

  for (let k = 0; k < shuffle.length; k++){
    const ver = Math.floor(shuffle[k] / cell);
    const hor = shuffle[k] % cell;
    data[ver][hor] = CODE.MINE;
  }

  return data;
}

export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const FLAG_CELL = 'FLAG_CELL';
export const QUESTION_CELL = 'QUESTION_CELL';
export const NORMALIZE_CELL = 'NORMALIZE_CELL';

const reducer = (state, action) => {
  switch (action.type){
    case START_GAME:
      return {
        ...state,
        tableData : plantMine(action.row, action.cell, action.mine),
        halted : false,
      }
    case OPEN_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      // tableData[action.row][action.cell] = CODE.OPENED;
      let around = [];
      if (tableData[action.row -1]){
        around = around.concat(
          tableData[action.row - 1][action.cell - 1],
          tableData[action.row - 1][action.cell],
          tableData[action.row - 1][action.cell + 1],
        );
      }
      around = around.concat(
        tableData[action.row][action.cell - 1],
        tableData[action.row][action.cell + 1],
      );
      if(tableData[action.row + 1]){
        around = around.concat(
          tableData[action.row + 1][action.cell - 1],
          tableData[action.row + 1][action.cell],
          tableData[action.row + 1][action.cell + 1],
        );
      }
      const count = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
      tableData[action.row][action.cell] = count;
      return {
        ...state,
        tableData,
      }
    }
    case CLICK_MINE: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      tableData[action.row][action.cell] = CODE.CLICKED_MINE;
      return {
        ...state,
        tableData,
        halted : true,
      }
    }
    case FLAG_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if(tableData[action.row][action.cell] === CODE.MINE){
        tableData[action.row][action.cell] = CODE.FLAG_MINE;
      }else{
        tableData[action.row][action.cell] = CODE.FLAG;
      }
      return {
        ...state,
        tableData,
      }
    }
    case QUESTION_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if(tableData[action.row][action.cell] === CODE.FLAG_MINE){
        tableData[action.row][action.cell] = CODE.QUESTION_MINE;
      }else{
        tableData[action.row][action.cell] = CODE.QUESTION;
      }
      return {
        ...state,
        tableData,
      }
    }
    case NORMALIZE_CELL: {
      const tableData = [...state.tableData];
      tableData[action.row] = [...state.tableData[action.row]];
      if(tableData[action.row][action.cell] === CODE.QUESTION_MINE){
        tableData[action.row][action.cell] = CODE.MINE;
      }else{
        tableData[action.row][action.cell] = CODE.NORMAL;
      }
      return {
        ...state,
        tableData,
      }
    }
    default :
      return state
  }
}

const MineSearch = () => {
  const [state, dispacth] = useReducer(reducer, initialState);

  const value = useMemo(() => ({ tableData : state.tableData, halted : state.halted, dispacth }), [state.tableData, state.halted]);

  return(
    /*
      위에서 생성한 Context API를 호출할려면 
      다음과 같이 Provider method로 호출하여 Context API에 해당되는 Elements를 Context로 감싸야한다.
      전송할 Data들은 value 속성으로 넘겨줘야한다.

      Context API가 성능 최적화 하기 많이 힘들다. 이유는 value의 값으로 initialState를 주었을 때
      MineSearch가 새로 ReRendering할 시 value에 속한 initialState도 새로 생겨서 Context API를 사용하는
      자식 객체들도 RERendering하기 때문이다.
      Context로 전송할 Data들은 line 26과 같이 useMemo를 사용하여 해당 Data들을 캐싱해준다.
    */
    <TableContext.Provider value={value}>
      <Form />
      <div>{state.timer}</div>
      <Table />
      <div>{state.result}</div>
    </TableContext.Provider>
  )
};

export default MineSearch; 