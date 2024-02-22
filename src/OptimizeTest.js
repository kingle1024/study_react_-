import React, {useState, useEffect} from 'react';

const CounterA = React.memo(({count}) => {

  useEffect(() => {
    console.log(`CounterA Update - count: ${count}`);
  })

  return <div>{count}</div>
});
const CounterB = ({obj}) => {

  useEffect(() => { // 객체가 주소에 의한 비교인 얕은 비교를 하기 때문에 실행된다. 
    console.log(`CounterB Update - count : ${obj.count}`);
  })
  return <div>{obj.count}</div>
};

const areEqual = (prevProps, nextProps) => {
  return prevProps.obj.count === nextProps.obj.count;
}
const MemorizedCounterB = React.memo(CounterB, areEqual);

const OptiomizeTest = () => {
  const [count, setCount] = useState(1);
  const [obj, setObj] = useState({
    count: 1
  })

  return <div style={{ padding: 50}}>
    <div>
      <h2>Counter A</h2>
      <CounterA count={count} />
      <button onClick={() => setCount(count)}>A button</button>
    </div>
    <div>
      <h2>Counter B</h2>
      <MemorizedCounterB obj={obj} />
      <button
        onClick={() =>
          setObj({
            count: obj.count,
          })
        }
      >
      B button  
      </button>
    </div>
  </div>  
}

export default OptiomizeTest;