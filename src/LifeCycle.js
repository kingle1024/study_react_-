import React, { useEffect, useState } from 'react';

const LifeCycle = () => {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    console.log('Mount!');
  }, []);

  useEffect(() => { // 컴포넌트가 업데이트되는 순간에 하고 싶은 일 
    console.log('Update!');
  });

  useEffect(() => {
    console.log(`count is update : ${count}`);
    if(count > 5) {
      alert('count가 5를 넘었습니다. 따라서 1로 초기화합니다.');
      setCount(1);
    }
  }, [count]); // count가 변화하는 순간 호출됨

  useEffect(() => {
    console.log(`text is update : ${text}`);
  }, [text]); // text가 변화하는 순간 호출됨

  return (
    <div style={{padding: 20}}>
        <div>
          {count}
          <button onClick={() => setCount(count +1)}>+</button>
        </div>
        <div>
          <input value={text} onChange={(e) => setText(e.target.value)} />
        </div>
    </div>
  );
}

export default LifeCycle;