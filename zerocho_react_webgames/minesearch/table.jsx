import React, { useContext, memo } from 'react';
import Tr from './tr';
import { TableContext } from './minesearch';

const Table = memo(() => {
  const { tableData } = useContext(TableContext);
  return (
    <table>
      {Array(tableData.length).fill().map((tr, i) => <Tr rowIndex={i} />)}
    </table>
  )
});

export default Table;