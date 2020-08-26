import React from 'react';
import './style/App.css';

import GithubCorner from 'react-github-corner'
import Form from './Components/Form'

function App() {
  return (
    <div className="App">
      <GithubCorner href='https://github.com/bmai53/reddit-search' direction='left'/>
      {/* <Header /> */}
      <Form />
      {/* <Footer /> */}
    </div>
  );
}

export default App;
