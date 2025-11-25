from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
from ortools.sat.python import cp_model

app = FastAPI()

# --- 1. Pydantic Models (The Data We Receive) ---
class Subject(BaseModel):
    name: str
    code: str
    lectures_per_week: int

class Teacher(BaseModel):
    name: str

class Classroom(BaseModel):
    name: str
    capacity: int

class TimetableInput(BaseModel):
    subjects: List[Subject]
    teachers: List[Teacher]
    classrooms: List[Classroom]

# --- 2. The Main Solver Logic ---

@app.post("/generate")
def generate_timetable(data: TimetableInput):
    
    # --- A. DEFINE THE SCHEDULE ---
    num_days = 5
    num_slots_per_day = 8
    lunch_slot_index = 4 # Slot 4 is the 5th slot (0-indexed)

    # --- B. PREPARE THE DATA ---
    all_subjects = data.subjects
    all_teachers = data.teachers
    all_classrooms = data.classrooms

    # --- C. CREATE THE CP-SAT MODEL ---
    model = cp_model.CpModel()

    # --- D. CREATE VARIABLES ---
    # schedule_vars[(subject_code, teacher_name, room_name, day, slot)] = BoolVar
    schedule_vars = {}
    
    for s in all_subjects:
        for t in all_teachers:
            for c in all_classrooms:
                for d in range(num_days):
                    for sl in range(num_slots_per_day):
                        schedule_vars[(s.code, t.name, c.name, d, sl)] = model.NewBoolVar(
                            f"schedule_{s.code}_{t.name}_{c.name}_{d}_{sl}"
                        )

    # --- E. DEFINE THE CONSTRAINTS (THE RULES) ---

    # Rule 1: Lecture Frequency
    # A subject must be taught exactly `lectures_per_week` times across the week.
    for s in all_subjects:
        model.Add(
            sum(
                schedule_vars[(s.code, t.name, c.name, d, sl)]
                for t in all_teachers
                for c in all_classrooms
                for d in range(num_days)
                for sl in range(num_slots_per_day)
            ) == s.lectures_per_week
        )

    # Rule 2: Teacher Clash Prevention
    # A teacher can be in at most one place per slot.
    for t in all_teachers:
        for d in range(num_days):
            for sl in range(num_slots_per_day):
                model.Add(
                    sum(
                        schedule_vars[(s.code, t.name, c.name, d, sl)]
                        for s in all_subjects
                        for c in all_classrooms
                    ) <= 1
                )

    # Rule 3: Classroom Clash Prevention
    # A classroom can host at most one class per slot.
    for c in all_classrooms:
        for d in range(num_days):
            for sl in range(num_slots_per_day):
                model.Add(
                    sum(
                        schedule_vars[(s.code, t.name, c.name, d, sl)]
                        for s in all_subjects
                        for t in all_teachers
                    ) <= 1
                )

    # Rule 4: Lunch Break
    # No classes allowed in the lunch slot (index 4).
    for s in all_subjects:
        for t in all_teachers:
            for c in all_classrooms:
                for d in range(num_days):
                    model.Add(
                        schedule_vars[(s.code, t.name, c.name, d, lunch_slot_index)] == 0
                    )

    # Rule 5: Teacher Cool-Down (No Back-to-Back)
    
    # 5a. Create helper variables: is_busy[teacher, day, slot]
    is_teacher_busy = {}
    for t in all_teachers:
        for d in range(num_days):
            for sl in range(num_slots_per_day):
                # Variable is True if teacher is teaching ANY class in this slot
                is_busy = model.NewBoolVar(f"busy_{t.name}_{d}_{sl}")
                is_teacher_busy[(t.name, d, sl)] = is_busy
                
                # Calculate if teacher is actually teaching in this slot
                # The sum will be either 0 (free) or 1 (busy) because of Rule 2
                classes_in_slot = sum(
                    schedule_vars[(s.code, t.name, c.name, d, sl)]
                    for s in all_subjects
                    for c in all_classrooms
                )
                
                # If sum == 1, is_busy MUST be True
                model.Add(classes_in_slot == 1).OnlyEnforceIf(is_busy)
                # If sum == 0, is_busy MUST be False
                model.Add(classes_in_slot == 0).OnlyEnforceIf(is_busy.Not())

    # 5b. Apply the restriction
    # If is_busy is True at slot `sl`, it implies is_busy must be False at `sl+1`
    for t in all_teachers:
        for d in range(num_days):
            for sl in range(num_slots_per_day - 1):
                busy_current = is_teacher_busy[(t.name, d, sl)]
                busy_next = is_teacher_busy[(t.name, d, sl + 1)]
                
                # "If busy now, then NOT busy next"
                model.Add(busy_next == 0).OnlyEnforceIf(busy_current)


    # --- F. SOLVE THE MODEL ---
    solver = cp_model.CpSolver()
    status = solver.Solve(model)

    # --- G. RETURN THE RESULT ---
    if status == cp_model.OPTIMAL or status == cp_model.FEASIBLE:
        # Reconstruct the schedule from the solver's variables
        solution = []
        for d in range(num_days):
            day_schedule = []
            for sl in range(num_slots_per_day):
                slot_info = []
                
                # Check for Lunch (Corrected logic: check SLOT index, not DAY index)
                if sl == lunch_slot_index:
                    slot_info.append({"event": "Lunch Break"})
                
                # Check for Classes
                for s in all_subjects:
                    for t in all_teachers:
                        for c in all_classrooms:
                            if solver.Value(schedule_vars[(s.code, t.name, c.name, d, sl)]) == 1:
                                slot_info.append({
                                    "subject": s.name,
                                    "teacher": t.name,
                                    "classroom": c.name
                                })
                day_schedule.append(slot_info)
            solution.append(day_schedule)
        
        return {
            "status": "success",
            "message": "Timetable generated successfully!",
            "timetable": solution
        }
    else:
        return {
            "status": "error",
            "message": "No solution found. Try reducing lectures or adding more teachers."
        }

@app.get("/")
def read_root():
    return {"message": "AI Solver Service is running!"}