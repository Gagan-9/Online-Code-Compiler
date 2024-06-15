// import axios from 'axios';
// import './App.css';
// import React, { useState } from 'react';

// function App() {
//   const [code, setCode] = useState("");
//   const [language, setLanguage] = useState("cpp");
//   const [output, setOutput] = useState("");

//   const handleSubmit = async () => {
//     const payload = {
//       language: language,
//       code: code
//     };
//     try {
//       const response = await axios.post("http://localhost:5000/run", payload);
//       if (response && response.data && response.data.output) {
//         setOutput(response.data.output);
//       } else {
//         setOutput("No output received from server");
//       }
//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.error) {
//         setOutput(error.response.data.error);
//       } else {
//         setOutput("Error Connecting to server!");
//       }
//     }
//   };

//   return (
//     <div className="App">
//       <h1>Online Code Compiler</h1>
//       <div>
//         <label>Language: </label>
//         <select
//           value={language}
//           onChange={(e) => {
//             setLanguage(e.target.value);
//             console.log(e.target.value);
//           }}
//         >
//           <option value="cpp">C++</option>
//           <option value="py">Python</option>
//         </select>
//       </div>
//       <br />
//       <textarea rows="30" cols="85" value={code} onChange={(e) => { setCode(e.target.value) }}></textarea>
//       <br />
//       <button onClick={handleSubmit}>Submit</button>
//       <p>{typeof output === 'object' ? JSON.stringify(output) : output}</p>
//     </div>
//   );
// }

// export default App;

/*
import axios from 'axios';
import './App.css';
import React, { useState } from 'react';

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("py");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");

  const handleSubmit = async () => {
    const payload = {
      language: language,
      code: code
    };
    try {
      setJobId("");
      setStatus("");
      setOutput("");
      const response = await axios.post("http://localhost:5000/run", payload);
      console.log("Response from server:", response); // Log the response object
      if (response && response.data && response.data.output) {
        setJobId(response.data.jobId);
        let intervalId;

        intervalId = setInterval(async() =>{

          const {data: dataRes} = await axios.get("http://localhost:5000/status", {params: {id: response.data.jobId}} );

          const {success, job, error} = dataRes;
          console.log(dataRes);

          if(success) {

            const {status: jobStatus, output: jobOutput} = job;
            setStatus(jobStatus);
            if(jobStatus === "pending") return;
            setOutput(jobOutput);
            clearInterval(intervalId);

          } else {
            setStatus("Error: Please retry!");
            console.error(error);
            clearInterval(intervalId);
            setOutput(error);
          }

          console.log(dataRes)

        }, 1000);


      } else {
        setOutput("No output received from server");
      }
    } catch (error) {
      console.error("Error:", error); // Log the error object
      if (error.response && error.response.data && error.response.data.error) {
        setOutput(error.response.data.error);
      } else {
        setOutput("Error Connecting to server!");
      }
    }
  };
  

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            console.log(e.target.value);
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <div className="code-container">
        <textarea rows="30" cols="85" value={code} onChange={(e) => { setCode(e.target.value) }}></textarea>
      </div>
      <div className="output-container">
        <button onClick={handleSubmit} className="submit-button">Submit</button>
        <p>{status}</p>
        <p>{jobId && `JobID: ${jobId}`}</p>
        <p className='output'>{typeof output === 'object' ? JSON.stringify(output) : output}</p>
      </div>
    </div>
  );
  
}

export default App;
*/

/*
import axios from "axios";
import "./App.css";
import React, { useState, useEffect } from "react";
import stubs from "./defaultStubs";
import Navbar from "./Components/Navbar";
import moment from "moment";

function Compiler() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("py");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let result = "";
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString();
    result += `Submitted At: ${submittedAt}`;
    if (!completedAt || !startedAt) {
      return result;
    }

    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, "seconds", true);
    result += ` Execution Time: ${executionTime}s`;
    return result;
  };

  const handleSubmit = async () => {
    setJobId("");
    setStatus("");
    setOutput("");
    setJobDetails(null);

    const payload = {
      language: language,
      code: code,
    };

    try {
      const response = await axios.post("http://localhost:5000/run", payload);
      if (response && response.data && response.data.jobId) {
        setJobId(response.data.jobId);

        const intervalId = setInterval(async () => {
          const { data } = await axios.get("http://localhost:5000/status", {
            params: { id: response.data.jobId },
          });
          const { success, job, error } = data;

          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);

            if (jobStatus !== "pending") {
              setOutput(jobOutput);
              clearInterval(intervalId);
            }
          } else {
            setStatus("Error: Please retry!");
            console.error(error);
            clearInterval(intervalId);
            setOutput(error);
          }
        }, 1000);
      } else {
        setOutput("No output received from server");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setOutput(error.response.data.error);
      } else {
        setOutput("Error connecting to server!");
      }
    }
  };

  return (
    <div className="App">
      <Navbar
        userLang={userLang} setUserLang={setUserLang}
        userTheme={userTheme} setUserTheme={setUserTheme}
        fontSize={fontSize} setFontSize={setFontSize}
      />
      <div className="main">
        <div className="left-container">
          <Editor
            options={options}
            height="calc(100vh - 50px)"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultValue="# Enter your code here"
            onChange={(value) => { setUserCode(value); }}
          />
          <button className="submit-button" onClick={() => output()}>
            Run
          </button>
          </div>
        
    <div className="App">
      <h1>Online Code Compiler</h1>
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => {
            let response = window.confirm(
              "WARNING: Switching the language, will remove your current code. Do you wish to proceed? "
            );
            if (response) {
              setLanguage(e.target.value);
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <div className="code-container">
        <textarea
          rows="30"
          cols="85"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        ></textarea>
      </div>
      <div className="output-container">
        <button onClick={handleSubmit} className="submit-button">
          Submit
        </button>
        <p>{status}</p>
        <p>{jobId && `Job ID: ${jobId}`}</p>
        <p>{renderTimeDetails()}</p>
        <p className="output">{output}</p>
      </div>
    </div>
  );
}

export default Compiler;
*/


/*
import axios from 'axios';
import './App.css';
import React, { useState, useEffect } from 'react';
import stubs from "./defaultStubs";
import moment from 'moment';
import NavigationBar from './NavigationBar';


function Compiler() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("py");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobDetails, setJobDetails] = useState(null);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  const renderTimeDetails = () => {
   if(!jobDetails) {
    return "";
   }
   let result = '';
   let {submittedAt, completedAt, startedAt} = jobDetails;
   submittedAt = moment(submittedAt).toString()
   result += `Submitted At: ${submittedAt}`
   if(!completedAt || !startedAt) {
     return result;
   }

  const start = moment(startedAt);
  const end = moment(completedAt);
  const executionTime = end.diff(start, 'seconds', true);
  result += ` Execution Time: ${executionTime}s`
  return result;
  }

  const handleSubmit = async () => {
      // Send code to backend to store in database
      try {
        await axios.post("http://localhost:5000/submit-code", { code });
        console.log("Code submitted to database successfully");
      } catch (error) {
        console.error("Error submitting code to database:", error);
      }
    setJobId("");
    setStatus("");
    setOutput("");
    setJobDetails(null);

    const payload = {
      language: language,
      code: code
    };

    try {
      const response = await axios.post("http://localhost:5000/run", payload);
      if (response && response.data && response.data.jobId) {
        setJobId(response.data.jobId);

        const intervalId = setInterval(async () => {
          const { data } = await axios.get("http://localhost:5000/status", { params: { id: response.data.jobId } });
          const { success, job, error } = data;

          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);

            if (jobStatus !== "pending") {
              setOutput(jobOutput);
              clearInterval(intervalId);
            }
          } else {
            setStatus("Error: Please retry!");
            console.error(error);
            clearInterval(intervalId);
            setOutput(error);
          }
        }, 1000);
      } else {
        setOutput("No output received from server");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setOutput(error.response.data.error);
      } else {
        setOutput("Error connecting to server!");
      }
    }
  }; 

  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      <NavigationBar /> {/* Include NavigationBar component 
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => { 
            let response = window.confirm(
              "WARNING: Switching the language, will remove your current code. Do you wish to proceed? "
            );
            if(response) {
            setLanguage(e.target.value);
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <div className="code-container">
        <textarea rows="30" cols="85" value={code} onChange={(e) => setCode(e.target.value)}></textarea>
      </div>
      <div className="output-container">
        <button onClick={handleSubmit} className="submit-button">Submit</button>
        <p>{status}</p>
        <p>{jobId && `Job ID: ${jobId}`}</p>
        <p>{renderTimeDetails()}</p>
        <p className="output">{output}</p>
      </div>
    </div>
  );
}

export default Compiler;
*/


// Compiler.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import stubs from "./defaultStubs";
import moment from 'moment';
import './Compiler.css';


// function Compiler({ codeHistory, setCodeHistory }) {
function Compiler() {
  axios.defaults.withCredentials = true;
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("py");
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [jobId, setJobId] = useState("");
  const [codeHistory, setCodeHistory] = useState([]);

  const [jobDetails, setJobDetails] = useState(null);
  useEffect(() => {
    axios.get('http://localhost:5000/compiler')
    .then(result => {console.log(result)
      if(result.data.message !== "Success") {
        // navigate('/login')
      }
    })
    .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  const renderTimeDetails = () => {
    if (!jobDetails) {
      return "";
    }
    let result = '';
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString()
    result += `Submitted At: ${submittedAt}`
    if (!completedAt || !startedAt) {
      return result;
    }

    const start = moment(startedAt);
    const end = moment(completedAt);
    const executionTime = end.diff(start, 'seconds', true);
    result += ` Execution Time: ${executionTime}s`
    return result;
  }

  const handleSubmit = async () => {
    const payload = {
      language: language,
      code: code
    };

    try {
      await axios.post("http://localhost:5000/submit-code", { code });
      console.log("Code submitted to database successfully");
    } catch (error) {
      console.error("Error submitting code to database:", error);
    }

    try {
      const response = await axios.post("http://localhost:5000/run", payload);
      if (response && response.data && response.data.jobId) {
        setJobId(response.data.jobId);

        const intervalId = setInterval(async () => {
          const { data } = await axios.get("http://localhost:5000/status", { params: { id: response.data.jobId } });
          const { success, job, error } = data;

          if (success) {
            const { status: jobStatus, output: jobOutput } = job;
            setStatus(jobStatus);
            setJobDetails(job);

            if (jobStatus !== "pending") {
              setOutput(jobOutput);
              clearInterval(intervalId);
              // Update code history state
              setCodeHistory(prevCodeHistory => [...prevCodeHistory, code]);
            }
          } else {
            setStatus("Error: Please retry!");
            console.error(error);
            clearInterval(intervalId);
            setOutput(error);
          }
        }, 1000);
      } else {
        setOutput("No output received from server");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setOutput(error.response.data.error);
      } else {
        setOutput("Error connecting to server!");
      }
    }
  };

  // Rest of your component code...
  
  return (
    <div className="App">
      <h1>Online Code Compiler</h1>
      
      <div>
        <label>Language: </label>
        <select
          value={language}
          onChange={(e) => { 
            let response = window.confirm(
              "WARNING: Switching the language, will remove your current code. Do you wish to proceed? "
            );
            if(response) {
            setLanguage(e.target.value);
            }
          }}
        >
          <option value="cpp">C++</option>
          <option value="py">Python</option>
        </select>
      </div>
      <div className="code-container">
        <textarea rows="30" cols="70" value={code} onChange={(e) => setCode(e.target.value)}></textarea>
      </div>
      <div className="output-container">
        <button onClick={handleSubmit} className="submit-button">Submit</button>
        <p>{status}</p>
        <p>{jobId && `Job ID: ${jobId}`}</p>
        <p>{renderTimeDetails()}</p>
        <p className="output">{output}</p>
      </div>
    </div>
  
  );
}



export default Compiler;
