import React, {useRef, useEffect, useMemo, memo} from "react";
import Td from './td';


// const Tr = ({rowIndex, rowData, dispatch}) => {
//   const ref = useRef([]);
//   useEffect(() => {
//     console.log(rowIndex === ref.current[0], dispatch === ref.current[2], rowData === ref.current[3]);
//     ref.current = [rowIndex, dispatch, rowData];
//   }, [rowIndex, rowData, dispatch]); // 성능 최적화로 리렌더링을 확인하는 방법
//   return(
//     <tr>
//       {Array(rowData.length).fill().map((td, i) => useMemo(() => <Td rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]} dispatch={dispatch} />, [rowData[i]]))}
//     </tr>
//   );
// }

const Tr = memo(({rowIndex, rowData, dispatch}) => {
  const ref = useRef([]);
  useEffect(() => {
    console.log(rowIndex === ref.current[0], dispatch === ref.current[2], rowData === ref.current[3]);
    ref.current = [rowIndex, dispatch, rowData];
  }, [rowIndex, rowData, dispatch]); // 성능 최적화로 리렌더링을 확인하는 방법
  return(
    <tr>
      {Array(rowData.length).fill().map((td, i) => (<Td rowIndex={rowIndex} cellIndex={i} cellData={rowData[i]} dispatch={dispatch} />))}
    </tr>
  );
})


export default Tr;