import React, { useState, useEffect } from 'react';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [lecturesPerWeek, setLecturesPerWeek] = useState(1); // <-- ADDED
  const [error, setError] = useState(null);

  // Fetch all subjects
  const fetchSubjects = () => {
    fetch('http://localhost:5000/subjects/')
      .then(response => response.json())
      .then(data => setSubjects(data))
      .catch(err => console.log('Error fetching subjects: ', err));
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const newSubject = {
      name: subjectName,
      code: subjectCode,
      lectures_per_week: lecturesPerWeek // <-- ADDED
    };

    fetch('http://localhost:5000/subjects/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSubject)
    })
    .then(res => res.json())
    .then(data => {
      if (data.includes('Error')) {
        setError(data);
      } else {
        fetchSubjects(); // Refresh list
        setSubjectName('');
        setSubjectCode('');
        setLecturesPerWeek(1); // <-- ADDED
      }
    })
    .catch(err => {
      setError('Error connecting to server.');
      console.log(err);
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Manage Subjects</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold mb-4">Add New Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Subject Name (e.g., Mathematics)"
            className="p-2 border rounded"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject Code (e.g., MATH101)"
            className="p-2 border rounded"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
          />
          
          {/* --- NEW INPUT FIELD --- */}
          <input
            type="number"
            placeholder="Lectures per Week"
            className="p-2 border rounded"
            value={lecturesPerWeek}
            onChange={(e) => setLecturesPerWeek(Number(e.target.value))}
            min="1"
          />
          {/* ----------------------- */}

        </div>
        <button type="submit" className="mt-4 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
          Add Subject
        </button>
      </form>

      {/* List Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4">Current Subjects</h3>
        <ul className="space-y-2">
          {subjects.map(subject => (
            <li key={subject._id} className="p-3 bg-gray-50 rounded-md flex justify-between items-center">
              <div>
                <span className="font-semibold">{subject.name}</span>
                <span className="text-gray-600 ml-2">({subject.code})</span>
              </div>
              {/* --- DISPLAY THE NEW FIELD --- */}
              <span className="text-gray-700 font-medium">
                {subject.lectures_per_week} lectures/week
              </span>
              {/* --------------------------- */}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Subjects;