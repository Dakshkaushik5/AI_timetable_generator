import React from 'react';

function TimetableDisplay({ timetableData }) {
  if (!timetableData || !timetableData.timetable || timetableData.timetable.length === 0) {
    // Show error if status is error
    if (timetableData?.status === 'error') {
       return (
         <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h3 className="text-red-800 font-bold text-lg mb-2">Could Not Generate Schedule</h3>
            <p className="text-red-600">{timetableData.message}</p>
         </div>
       )
    }
    return null;
  }

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const schedule = timetableData.timetable;
  const numberOfSlots = schedule[0]?.length || 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <h2 className="text-2xl font-bold text-slate-800">Weekly Schedule</h2>
        <div className="flex gap-2">
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                {days.length} Days
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                {numberOfSlots} Slots
            </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-4 bg-slate-800 text-slate-400 font-medium text-xs uppercase tracking-wider w-20 text-center">
                Slot
              </th>
              {days.map((day) => (
                <th key={day} className="p-4 bg-slate-800 text-white font-semibold text-left min-w-[180px]">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {Array.from({ length: numberOfSlots }).map((_, slotIndex) => {
              const isLunchSlot = slotIndex === 4; 
              return (
                <tr key={slotIndex} className={`group ${isLunchSlot ? 'bg-amber-50/60' : 'hover:bg-slate-50'}`}>
                  {/* Time Slot Label */}
                  <td className="p-4 text-center border-r border-slate-100">
                    <span className={`text-lg font-bold ${isLunchSlot ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {slotIndex + 1}
                    </span>
                  </td>

                  {/* Day Columns */}
                  {schedule.map((dayData, dayIndex) => {
                    const slotEvents = dayData ? dayData[slotIndex] : [];
                    return (
                      <td key={dayIndex} className="p-2 border-r border-slate-100 align-top h-32">
                        {slotEvents && slotEvents.length > 0 ? (
                          <div className="flex flex-col gap-2 h-full">
                            {slotEvents.map((event, evtIdx) => {
                              if (event.event === "Lunch Break") {
                                return (
                                  <div key={evtIdx} className="h-full flex items-center justify-center">
                                    <span className="text-amber-600 font-bold text-xs uppercase tracking-widest border border-amber-200 px-3 py-1 rounded-lg bg-white/50">
                                      Lunch Break
                                    </span>
                                  </div>
                                );
                              }
                              return (
                                <div key={evtIdx} className="bg-white border-l-4 border-blue-500 shadow-sm rounded-r-md p-3 hover:shadow-md transition-all border border-slate-100">
                                  <div className="font-bold text-slate-800 text-sm">{event.subject}</div>
                                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                    {event.teacher}
                                  </div>
                                  <div className="text-xs text-blue-600 font-medium mt-1">
                                     Room: {event.classroom}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center">
                             <span className="text-slate-200 text-2xl font-thin">·</span>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TimetableDisplay;