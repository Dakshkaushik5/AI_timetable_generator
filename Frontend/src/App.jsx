import React, { useState } from 'react';
import Subjects from './components/Subjects.jsx';
import Teachers from './components/Teachers.jsx';
import Classrooms from './components/Classrooms.jsx';

function App() {
  const [solverResponse, setSolverResponse] = useState('');

  // This function will be called when the button is clicked
  const handleGenerateTimetable = () => {
    setSolverResponse('Sending data to solver...');

    // This makes a request to our Node.js backend
    fetch('http://localhost:5000/generate-timetable', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      console.log('Response from backend:', data);
      // Display the response from the Python service
      setSolverResponse(JSON.stringify(data, null, 2));
    })
    .catch(error => {
      console.error('Error:', error);
      setSolverResponse('Error communicating with backend.');
    });
  };

  return (
    <div className="App p-8 bg-gray-50 min-h-screen">
      {/* --- NEW HEADER AND BUTTON --- */}
      <div className="max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl font-bold text-center mb-4">AI Timetable Generator</h1>
        <button 
          onClick={handleGenerateTimetable}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 font-semibold text-lg"
        >
          Generate Timetable
        </button>
        {solverResponse && (
          <div className="mt-4 p-4 bg-black text-white rounded-md font-mono text-sm whitespace-pre-wrap">
            {solverResponse}
          </div>
        )}
      </div>
      {/* --------------------------- */}

      <Subjects />
      <hr className="my-12 border-t-2 border-gray-200" />
      <Teachers />
      <hr className="my-12 border-t-2 border-gray-200" />
      <Classrooms />
    </div>
  );
}

export default App;

