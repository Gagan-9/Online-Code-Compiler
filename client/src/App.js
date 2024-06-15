

//correct code until the history saved
// App.js
/*
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Compiler from './Compiler';
import NavigationBar from './NavigationBar';
import HistoryPage from './HistoryPage';
import ProblemsPage from './ProblemsPage'


function App() {
  const [codeHistory, setCodeHistory] = useState([]);

  return (
    
      <Router>
        <div>
          <NavigationBar />
          <Routes>
            <Route path='/register' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/problems' element={ProblemsPage} />
            <Route path='/compiler' element={<Compiler codeHistory={codeHistory} setCodeHistory={setCodeHistory} />} />
            <Route path='/history' element={<HistoryPage codeHistory={codeHistory} />} />
          </Routes>
        </div>
      </Router>
      
  );
}

export default App;
*/


import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import Login from './Login';
import Compiler from './Compiler';
import NavigationBar from './NavigationBar';
import HistoryPage from './HistoryPage';
import ProblemsPage from './ProblemsPage'
import HomePage from './HomePage';
//import ProblemDetailsPage from './ProblemDetailsPage';
import CompilerCodePage from './CompilerCodePage';
import ProblemPage from './ProblemPage'



function App() {
   const [codeHistory, setCodeHistory] = useState([]);

  return (
    <Router>
      <div>
        <NavigationBar />
       
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route path='/problems' element={<ProblemsPage />} />
          <Route path='/compiler' element={<Compiler codeHistory={codeHistory} setCodeHistory={setCodeHistory} />} />
            <Route path='/history' element={<HistoryPage codeHistory={codeHistory} />} />
            <Route path="/problems/:id" element={<ProblemPage />} />
            <Route path="/compiler" element={<CompilerCodePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
