import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProblemDetailsPage from './ProblemDetailsPage';
import Compiler from './Compiler';
import './ProblemPage.css';

function ProblemPage() {
    const [problem, setProblem] = useState(null);

    useEffect(() => {
        // Fetch problem data here and update state
        axios.get('http://localhost:5000/problem/1')
            .then(response => {
                setProblem(response.data);
            })
            .catch(error => {
                console.error('Error fetching problem:', error);
            });
    }, []);

    return (
        <div className="container">
            <div className="problem-section">
                {problem && <ProblemDetailsPage problem={problem} />}
            </div>
            <div className="compiler-section">
                <Compiler />
            </div>
        </div>
    );
}

export default ProblemPage;
