import React, { useState, useEffect } from 'react';

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [name, setName] = useState('');

  const fetchTeachers = () => {
    fetch('http://localhost:5000/teachers/')
      .then(res => res.json())
      .then(data => setTeachers(data));
  };

  useEffect(() => fetchTeachers(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/teachers/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    })
    .then(() => {
      fetchTeachers();
      setName('');
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* FORM */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-600 p-2 rounded-lg">👨‍🏫</span>
            Add Teacher
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input 
                type="text" 
                placeholder="e.g. Dr. Sarah Smith"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20">
              Add Teacher
            </button>
          </form>
        </div>
      </div>

      {/* LIST */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          <h3 className="font-bold text-slate-700 mb-4">Faculty List</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map((t) => (
              <div key={t._id} className="flex items-center p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition">
                <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold mr-4">
                  {t.name.charAt(0)}
                </div>
                <span className="font-semibold text-slate-700">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Teachers;