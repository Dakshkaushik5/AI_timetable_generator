import React, { useState } from 'react';
import Subjects from './components/Subjects.jsx';
import Teachers from './components/Teachers.jsx';
import Classrooms from './components/Classrooms.jsx';
import TimetableDisplay from './components/TimetableDisplay.jsx';

function App() {
  const [solverResponse, setSolverResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('timetable'); // 'timetable', 'subjects', 'teachers', 'classrooms'

  const handleGenerateTimetable = () => {
    setLoading(true);
    setSolverResponse(null);

    fetch('http://localhost:5000/generate-timetable', {
      method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
      setSolverResponse(data);
      setLoading(false);
      setActiveTab('timetable'); // Switch to results view automatically
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Error connecting to backend.');
      setLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- TOP NAVIGATION BAR --- */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-800">TimetableAI</span>
            </div>
            <div className="flex items-center space-x-4">
              {['timetable', 'subjects', 'teachers', 'classrooms'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* HERO / GENERATE SECTION */}
        {activeTab === 'timetable' && (
          <div className="space-y-10">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Intelligent Scheduling <span className="text-blue-600">Simplified</span>
              </h1>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Generate clash-free, optimized school timetables in seconds using our Python-powered AI engine.
              </p>
              
              <div className="pt-4">
                <button 
                  onClick={handleGenerateTimetable}
                  disabled={loading}
                  className={`
                    inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-1
                    ${loading ? 'bg-slate-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                  `}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Thinking...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      Generate Timetable
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* RESULTS DISPLAY */}
            {solverResponse && (
              <div className="animate-fade-in-up">
                 <TimetableDisplay timetableData={solverResponse} />
              </div>
            )}
            
            {!solverResponse && !loading && (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                <p className="text-slate-400">No timetable generated yet. Click the button above to start.</p>
              </div>
            )}
          </div>
        )}

        {/* DATA MANAGEMENT TABS */}
        {activeTab === 'subjects' && <Subjects />}
        {activeTab === 'teachers' && <Teachers />}
        {activeTab === 'classrooms' && <Classrooms />}

      </main>
    </div>
  );
}

export default App;