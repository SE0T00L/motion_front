import React from 'react'
import './App.css'
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom"
import Home from "./Pages/Home"
import Join from "./Pages/Join"
import Notice from "./Pages/Notice"



function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router exact path="/" component={App}>
          <Route path="/home" component={ Home }/>
          <Route path="/join" component={ Join }/>
          <Route path="/notice" component={ Notice }/>
        </Router>
      </header>
    </div>
  );
}

export default App;
