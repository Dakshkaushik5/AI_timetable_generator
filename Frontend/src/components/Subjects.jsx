import React, { useState, useEffect } from 'react';

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [form, setForm] = useState({ name: '', code: '', lectures_per_week: 1 });
  const [error, setError] = useState(null);

  const fetchSubjects = () => {
    fetch('http://localhost:5000/subjects/')
      .then(res => res.json())
      .then(data => setSubjects(data))
      .catch(err => console.error(err));
  };

  useEffect(() => fetchSubjects(), []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch('http://localhost:5000/subjects/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    .then(res => res.json())
    .then(() => {
      fetchSubjects();
      setForm({ name: '', code: '', lectures_per_week: 1 });
    })
    .catch(() => setError('Failed to add subject'));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT: FORM */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 p-2 rounded-lg">📚</span>
            Add Subject
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
              <input 
                type="text" 
                placeholder="e.g. Mathematics"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject Code</label>
              <input 
                type="text" 
                placeholder="e.g. MATH101"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition"
                value={form.code}
                onChange={e => setForm({...form, code: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Weekly Lectures</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="1" max="10"
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                  value={form.lectures_per_week}
                  onChange={e => setForm({...form, lectures_per_week: Number(e.target.value)})}
                />
                <span className="font-bold text-blue-600 text-xl w-8">{form.lectures_per_week}</span>
              </div>
            </div>
            <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition shadow-lg">
              Save Subject
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: LIST */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Existing Subjects</h3>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold">
              {subjects.length} Total
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Name</th>
                  <th className="p-4 text-center">Load (Lecs/Wk)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((sub) => (
                  <tr key={sub._id} className="hover:bg-blue-50/50 transition">
                    <td className="p-4 font-mono text-sm text-slate-500">{sub.code}</td>
                    <td className="p-4 font-bold text-slate-800">{sub.name}</td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-md text-xs">
                        {sub.lectures_per_week}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subjects;