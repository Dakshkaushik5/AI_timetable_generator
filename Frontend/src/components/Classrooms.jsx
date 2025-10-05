import React, { useState, useEffect } from 'react';

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [classroomName, setClassroomName] = useState('');
  const [classroomCapacity, setClassroomCapacity] = useState('');

  const fetchClassrooms = () => {
    fetch('http://localhost:5000/classrooms')
      .then(response => response.json())
      .then(data => setClassrooms(data))
      .catch(error => console.error('Error fetching classrooms:', error));
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const newClassroom = { name: classroomName, capacity: classroomCapacity };

    fetch('http://localhost:5000/classrooms/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newClassroom),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setClassroomName('');
      setClassroomCapacity('');
      fetchClassrooms();
    })
    .catch(error => console.error('Error:', error));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Classroom Management</h1>

      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Add New Classroom</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Classroom Name/Number</label>
            <input 
              type="text" 
              value={classroomName} 
              onChange={e => setClassroomName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Capacity</label>
            <input 
              type="number" 
              value={classroomCapacity} 
              onChange={e => setClassroomCapacity(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            Add Classroom
          </button>
        </form>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Existing Classrooms</h2>
        <div className="space-y-2">
          {classrooms.map(classroom => (
            <div key={classroom._id} className="bg-gray-100 p-3 rounded-lg">
              <strong className="font-medium">{classroom.name}</strong> - Capacity: {classroom.capacity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Classrooms;