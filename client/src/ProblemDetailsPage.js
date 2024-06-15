import React from 'react';

function ProblemDetailsPage({ problem }) {
    return (
        <div className="container">
            <div className="problem-details">
                <h2>{problem?.title}</h2>
                <p>{problem?.description}</p>
                <p>Difficulty: {problem?.difficulty}</p>
                {/* Additional details about the problem */}
            </div>
        </div>
    );
}

export default ProblemDetailsPage;
