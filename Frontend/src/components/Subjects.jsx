import React, { useState, useEffect } from 'react';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');

  // Function to fetch subjects
  const fetchSubjects = () => {
    fetch('http://localhost:5000/subjects')
      .then(response => response.json())
      .then(data => setSubjects(data))
      .catch(error => console.error('Error fetching subjects:', error));
  };

  // Fetch subjects when the component first loads
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const newSubject = {
      name: subjectName,
      code: subjectCode,
    };

    fetch('http://localhost:5000/subjects/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newSubject),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Clear the form fields
      setSubjectName('');
      setSubjectCode('');
      // Re-fetch the subjects list to show the new one
      fetchSubjects();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Subject Management</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Subject</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Name</label>
            <input 
              type="text" 
              value={subjectName} 
              onChange={e => setSubjectName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject Code</label>
            <input 
              type="text" 
              value={subjectCode} 
              onChange={e => setSubjectCode(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Add Subject
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Subjects</h2>
        <div className="space-y-2">
          {subjects.map(subject => (
            <div key={subject._id} className="bg-gray-100 p-3 rounded-lg flex justify-between items-center">
              <span>
                <strong className="font-medium">{subject.name}</strong> ({subject.code})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Subjects;