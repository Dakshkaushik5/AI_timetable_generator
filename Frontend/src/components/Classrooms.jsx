import React, { useState, useEffect } from 'react';

function Classrooms() {
  const [classrooms, setClassrooms] = useState([]);
  const [form, setForm] = useState({ name: '', capacity: 30 });

  const fetchClassrooms = () => {
    fetch('http://localhost:5000/classrooms/')
      .then(res => res.json())
      .then(data => setClassrooms(data));
  };

  useEffect(() => fetchClassrooms(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/classrooms/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(() => {
      fetchClassrooms();
      setForm({ name: '', capacity: 30 });
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* FORM */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-600 p-2 rounded-lg">🏫</span>
            Add Classroom
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Room Name/Number</label>
              <input 
                type="text" 
                placeholder="e.g. Room 101"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
              <input 
                type="number" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={form.capacity}
                onChange={e => setForm({...form, capacity: Number(e.target.value)})}
                min="1"
              />
            </div>
            <button className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/20">
              Save Room
            </button>
          </form>
        </div>
      </div>

      {/* LIST */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
           <h3 className="font-bold text-slate-700 mb-4">Available Rooms</h3>
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             {classrooms.map((c) => (
               <div key={c._id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center hover:bg-indigo-50 hover:border-indigo-100 transition">
                 <div className="text-2xl mb-1">🚪</div>
                 <div className="font-bold text-slate-800">{c.name}</div>
                 <div className="text-xs text-slate-500 mt-1">Cap: {c.capacity}</div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
}

export default Classrooms;