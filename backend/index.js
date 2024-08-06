//corrected code fully
const express = require("express");
const cors = require("cors");
const bcrypt = require('bcrypt'); 
const mongoose = require("mongoose");
const EmployeeModel = require("./models/Employee");
const { generateFile } = require("./generateFile");
const { addJobToQueue } = require('./jobQueue');
const Job = require("./models/Job");
const CodeModel = require('./models/Code');
const jwt = require('jsonwebtoken')
const cookierParser = require('cookie-parser')
const Problem = require("./models/Problem"); 
const Codes = require('./models/Code.js')


const app = express();
const PORT = process.env.PORT || 5000;
const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/compilerapp";

mongoose.connect(DB_CONNECTION_STRING, {  
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookierParser())


const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if(!token) {
    return res.json("The token was not available")
  } else {
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
       if(err) return res.json("Token is wrong")
       next();
    })
  }
}

app.get('/compiler', verifyUser, (req, res) => {
      return res.json("Success")
})

// Define route handler for GET /problems
app.get("/problems", async (req, res) => {
  try {
    // Fetch all problems from the database
    const problems = await Problem.find();
    res.json(problems);
  } catch (error) {
    console.error("Error fetching problems:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/history", async (req, res) => {
  try {
    const myHistory = await Codes.find({}).sort({ createdAt: -1 });
    res.json(myHistory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.get('/problem/:id', (req, res) => {
  const problemId = req.params.id; // Extract the problem ID from the URL params

  // Here, you would typically query your database or some other data source
  // to fetch the problem with the specified ID
  // For demonstration purposes, let's just send a dummy response
  res.json({ id: problemId, description: 'Sample problem description' });
});

// Endpoint to handle user login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  EmployeeModel.findOne({email: email})
    .then(user => {
      if (user) {
        bcrypt.compare(password, user.password, (err, response) => {
          if (err) { 
            res.json("the password is incorrect");
          }
          if (response) {
            const token = jwt.sign({email: user.email}, "jwt-secret-key");
            res.cookie("token", token);
            console.log(user);
            res.json({message:"Success", user});
          }
        });
      } else {
        res.json("No record existed");
      }
    });
});

app.post("/register", async (req, res) => {
  const {name, email, password} = req.body;
  bcrypt.hash(password, 10)
    .then(hash => {
      EmployeeModel.create({name, email, password: hash})
        .then(employees => res.json(employees))
        .catch(err => res.json(err));
    })
    .catch(err => console.log(err.message));
});


app.post("/submit-code", async (req, res) => {
  try {
      const { code } = req.body;
      // Assuming you have a CodeModel schema with a 'code' field
      const newCodeEntry = await CodeModel.create({ code });
      res.json(newCodeEntry);
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});



app.get("/status", async (req, res) => {
  const jobId = req.query.id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, error: "Invalid job ID" });
    }
    return res.status(200).json({ success: true, job });
  } catch (error) {
    console.error("Error retrieving job status:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Empty code body!" });
  }

  try {
    const filepath = await generateFile(language, code);
    const job = await new Job({ language, filepath }).save();
    const jobId = job._id;
    addJobToQueue(jobId);
    console.log("Job created:", job);
    return res.status(200).json({ success: true, jobId });
  } catch (error) {
    console.error("Error processing job:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});






// const express = require("express");
// const cors = require("cors");
// const bcrypt = require('bcrypt'); 
// const mongoose = require("mongoose");
// const EmployeeModel = require("./models/Employee");
// const { generateFile } = require("./generateFile");
// const { addJobToQueue } = require('./jobQueue');
// const Job = require("./models/Job");
// const CodeModel = require('./models/Code');
// const jwt = require('jsonwebtoken');
// const cookieParser = require('cookie-parser');
// const Problem = require("./models/Problem");
// const Codes = require('./models/Code.js');
// const { exec } = require('child_process');

// const app = express();
// const PORT = process.env.PORT || 5000;
// const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || "mongodb://127.0.0.1:27017/compilerapp";

// mongoose.connect(DB_CONNECTION_STRING, {  
// }).then(() => {
//   console.log("MongoDB connected successfully");
// }).catch((error) => {
//   console.error("Error connecting to MongoDB:", error);
// });

// app.use(cors({
//   origin: ["http://localhost:3000"],
//   methods: ["GET", "POST"],
//   credentials: true
// }));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// app.use(cookieParser());

// const verifyUser = (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     return res.json("The token was not available");
//   } else {
//     jwt.verify(token, "jwt-secret-key", (err, decoded) => {
//       if (err) return res.json("Token is wrong");
//       next();
//     });
//   }
// };

// app.get('/compiler', verifyUser, (req, res) => {
//   return res.json("Success");
// });

// // Define route handler for GET /problems
// app.get("/problems", async (req, res) => {
//   try {
//     // Fetch all problems from the database
//     const problems = await Problem.find();
//     res.json(problems);
//   } catch (error) {
//     console.error("Error fetching problems:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// app.get("/history", async (req, res) => {
//   try {
//     const myHistory = await Codes.find({}).sort({ createdAt: -1 });
//     res.json(myHistory);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.get('/problem/:id', (req, res) => {
//   const problemId = req.params.id; // Extract the problem ID from the URL params

//   // Here, you would typically query your database or some other data source
//   // to fetch the problem with the specified ID
//   // For demonstration purposes, let's just send a dummy response
//   res.json({ id: problemId, description: 'Sample problem description' });
// });

// // Endpoint to handle user login
// app.post("/login", (req, res) => {
//   const { email, password } = req.body;

//   EmployeeModel.findOne({ email: email })
//     .then(user => {
//       if (user) {
//         bcrypt.compare(password, user.password, (err, response) => {
//           if (err) { 
//             res.json("the password is incorrect");
//           }
//           if (response) {
//             const token = jwt.sign({ email: user.email }, "jwt-secret-key");
//             res.cookie("token", token);
//             console.log(user);
//             res.json({ message: "Success", user });
//           }
//         });
//       } else {
//         res.json("No record existed");
//       }
//     });
// });

// app.post("/register", async (req, res) => {
//   const { name, email, password } = req.body;
//   bcrypt.hash(password, 10)
//     .then(hash => {
//       EmployeeModel.create({ name, email, password: hash })
//         .then(employees => res.json(employees))
//         .catch(err => res.json(err));
//     })
//     .catch(err => console.log(err.message));
// });

// app.post("/submit-code", async (req, res) => {
//   try {
//     const { code } = req.body;
//     // Assuming you have a CodeModel schema with a 'code' field
//     const newCodeEntry = await CodeModel.create({ code });
//     res.json(newCodeEntry);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// app.get("/status", async (req, res) => {
//   const jobId = req.query.id;

//   try {
//     const job = await Job.findById(jobId);
//     if (!job) {
//       return res.status(404).json({ success: false, error: "Invalid job ID" });
//     }
//     return res.status(200).json({ success: true, job });
//   } catch (error) {
//     console.error("Error retrieving job status:", error);
//     return res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });

// // Example of test cases for problems
// const testCases = {
//   "660a9c8b0356a176e308fc71": [   // Two Sum
//     { input: [[2, 7, 11, 15], 9], output: [0, 1] },
//     { input: [[3, 2, 4], 6], output: [1, 2] },
//     { input: [[-1, -2, -3, -4, -5], -8], output: [2, 4] }
//   ],
//   "660a9cdb0356a176e308fc73": [   // Reverse Integer
//     { input: [123], output: 321 },
//     { input: [-123], output: -321 },
//     { input: [120], output: 21 }
//   ],
//   "660a9ce80356a176e308fc75": [   // Palindrome Checker
//     { input: [121], output: true },
//     { input: [-121], output: false },
//     { input: [10], output: false }
//   ],
//   "660a9cf80356a176e308fc77": [   // FizzBuzz
//     { input: [15], output: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] },
//     { input: [5], output: ["1","2","Fizz","4","Buzz"] },
//     { input: [1], output: ["1"] }
//   ],
//   "660a9d090356a176e308fc79": [   // Merge Two Sorted Lists
//     { input: [[1, 2, 4], [1, 3, 4]], output: [1, 1, 2, 3, 4, 4] },
//     { input: [[], [1, 2, 3]], output: [1, 2, 3] },
//     { input: [[-1, 0, 4], [2, 5, 6]], output: [-1, 0, 2, 4, 5, 6] }
//   ]
// };

// app.post("/run", verifyUser, async (req, res) => {
//   try {
//     const { problemId, language = "python", code } = req.body;

//     // Check if problemId or code is missing or empty
//     if (!problemId || !code) {
//       return res.status(400).json({ success: false, error: "Problem ID and code must be provided" });
//     }

//     // Retrieve test cases for the specified problem
//     const problemTestCases = testCases[problemId];

//     if (!problemTestCases) {
//       return res.status(404).json({ success: false, error: "Problem not found or test cases not defined" });
//     }

//     // Initialize an array to store results
//     let results = [];

//     // Execute code against each test case
//     for (let testCase of problemTestCases) {
//       const { input, output } = testCase;
      
//       // Construct the command to execute the code with input
//       const command = `echo '${JSON.stringify(input)}' | ${language} ${code}`;

//       // Execute the command
//       const { stdout, stderr } = await exec(command);

//       // Compare actual output with expected output
//       let passed = false;
//       try {
//         const parsedOutput = JSON.parse(stdout.trim());
//         if (JSON.stringify(parsedOutput) === JSON.stringify(output)) {
//           passed = true;
//         }
//       } catch (error) {
//         console.error("Error parsing output:", error);
//       }

//       results.push({ input, output, passed, stdout, stderr });
//     }

//     // After executing all test cases, generate a new job and add it to the queue
//     try {
//       const filepath = await generateFile(language, code);
//       const job = await new Job({ language, filepath }).save();
//       const jobId = job._id;
//       addJobToQueue(jobId);
//       console.log("Job created:", job);
//       return res.status(200).json({ success: true, jobId, results });
//     } catch (error) {
//       console.error("Error processing job:", error);
//       return res.status(500).json({ success: false, error: "Internal server error" });
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return res.status(500).json({ success: false, error: "Internal server error" });
//   }
// });


      
//       app.listen(PORT, () => {
//         console.log(`Server is running on port ${PORT}`);
//       });
      
