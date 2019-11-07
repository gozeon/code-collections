import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [fullName, setFullName] = useState({ name: 'name', familyName: 'family' });
  const [title, setTitle] = useState('');

  useEffect(() => {
    console.log('useEffect has been called!')
    setFullName({name:'Marco',familyName: 'Shaw'})
  }, [])

  return (
    <div>
      <h1>Title: {title}</h1>
      <h3>Name: {fullName.name}</h3>
      <h3>Family Name: {fullName.familyName}</h3>
      <button onClick={() => setTitle('asd')}>click</button>
    </div>
  );
}

export default App;
