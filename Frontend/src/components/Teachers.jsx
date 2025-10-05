import React, { useState, useEffect } from 'react';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [teacherName, setTeacherName] = useState('');

  const fetchTeachers = () => {
    fetch('http://localhost:5000/teachers')
      .then(response => response.json())
      .then(data => setTeachers(data))
      .catch(error => console.error('Error fetching teachers:', error));
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newTeacher = { name: teacherName };

    fetch('http://localhost:5000/teachers/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTeacher),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setTeacherName('');
      fetchTeachers(); // Re-fetch to show the new teacher
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Teacher</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
            <input 
              type="text" 
              value={teacherName} 
              onChange={e => setTeacherName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Add Teacher
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Teachers</h2>
        <div className="space-y-2">
          {teachers.map(teacher => (
            <div key={teacher._id} className="bg-gray-100 p-3 rounded-lg">
              <strong className="font-medium">{teacher.name}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Teachers;