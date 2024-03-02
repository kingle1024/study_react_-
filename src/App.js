import React, { 
  useCallback, 
  useEffect, 
  useMemo, 
  useReducer, 
  useRef 
} from "react";
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import OptiomizeTest from "./OptimizeTest";

const reducer = (state, action) => {
  switch(action.type) {
    case 'INIT': {
      return action.data;
    }
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      };
      return [newItem, ...state];
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.data);
    }
    case 'EDIT': {
      return state.map((it) => 
        it.id === action.targetId ? 
        {...it, content:action.newContent} : it
      );
    }
    default:
      return state;
  }
}

export const DiaryStateContext = React.createContext();
export const DiaryDispatchContext = React.createContext();
const App = () => {
  const [data, dispatch] = useReducer(reducer, []); // 초깃값을 빈 배열로 전달. reducer 함수 만들어주어야 함.
  const dataId = useRef(0);

  const getData = async() => {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json());    

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5)+1,
        created_date: new Date().getTime(),
        id: dataId.current++
      }
    })

    dispatch({type:'INIT', data:initData});
  };

  useEffect(() => { // mount 되는 시점에 바로 실행됨
    getData();
  }, []);

  const onCreate = useCallback((author, content, emotion) => {
      dispatch({
        type: 'CREATE', 
        data: {author, content, emotion, id:dataId.current}
      });
      dataId.current += 1;
  }, []);

  const onRemove = useCallback((targetId) => {        
    console.log('>>>targetId');
    console.log(targetId);
    dispatch({
      type: 'REMOVE',
      data: targetId
    })    
  }, []);

  const onEdit = (targetId, newContent) => {
    dispatch({
      type: 'EDIT',
      targetId,
      newContent
    })
  }

  const memorizedDispatches = useMemo(() => {
    return {onCreate, onRemove, onEdit}
  },[]) // 재생성되지 않도록 빈 배열으로 전달.

  const getDiaryAnalysis = useMemo( // useMemo는 함수를 전달 받아서 콜백함수가 return 하는 값을 return한다.
    () => {

      const goodCount = data.filter((it) => it.emotion >=3 ).length;
      const badCount = data.length - goodCount;
      const goodRatio = (goodCount / data.length) * 100;

      return {goodCount, badCount, goodRatio};
    }, [data.length] // length가 변환될 때마다 실행된다. 
  );

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis; // useMemo는 함수를 전달 받아서 콜백함수가 return 하는 값을 return한다.

  return (
    <div className="App">
      <DiaryStateContext.Provider value={data}>
        <DiaryDispatchContext.Provider value={memorizedDispatches}>
        <h2>일기장</h2>      
        <OptiomizeTest />
        <DiaryEditor />
        <div>전체 일기 : {data.length}</div>
        <div>기분 좋은 일기 개수 : {goodCount}</div>
        <div>기분 나쁜 일기 개수 : {badCount}</div>
        <div>기분 좋은 일기 비율 : {goodRatio}%</div>
        <DiaryList />
        </DiaryDispatchContext.Provider>
      </DiaryStateContext.Provider>
    </div>
  );
}

export default App;
