import { useEffect, useMemo, useRef, useState } from "react";
import logo from './logo.svg';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
import OptiomizeTest from "./OptimizeTest";

const App = () => {
  const [data, setData] = useState([]);
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

    setData(initData);
  };

  useEffect(() => { // mount 되는 시점에 바로 실행됨
    getData();
  }, []);

  const onCreate = (author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData([newItem, ...data]);
  };

  const onRemove = (targetId) => {
    console.log(`${targetId}가 삭제되었습니다.`);
    const newDiaryList = data.filter((it) => it.id !== targetId);
    console.log(newDiaryList);
    setData(newDiaryList);
  };

  const onEdit = (targetId, newContent) => {
    // filter 해서 찾음 
    setData(      
      data.map((it) => 
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  }

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
      <h2>일기장</h2>      
      <OptiomizeTest />
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}%</div>
      <DiaryList onRemove={onRemove} onEdit={onEdit} diaryList={data} />
    </div>
  );
}

export default App;
