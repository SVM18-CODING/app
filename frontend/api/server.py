from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, date

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# === SUBJECTS DATA ===
SUBJECTS_DATA = {
    "MATHS": {
        "name": "MATHS",
        "color": "#2563eb",
        "image": "https://images.pexels.com/photos/7233188/pexels-photo-7233188.jpeg",
        "units": [
            {"id": "maths-1", "name": "Matrices and Gaussian Elimination", "xp": 100},
            {"id": "maths-2", "name": "Vector Spaces", "xp": 100},
            {"id": "maths-3", "name": "Linear Transformations and Orthogonality", "xp": 100},
            {"id": "maths-4", "name": "Orthogonalization, Eigen Values and Eigen Vectors", "xp": 100},
            {"id": "maths-5", "name": "Singular Value Decomposition", "xp": 100}
        ]
    },
    "PDSP": {
        "name": "PDSP",
        "color": "#9333ea",
        "image": "https://images.pexels.com/photos/18068747/pexels-photo-18068747.png",
        "units": [
            {"id": "pdsp-1", "name": "Discrete Fourier Transform", "xp": 100},
            {"id": "pdsp-2", "name": "Fast Fourier Transform", "xp": 100},
            {"id": "pdsp-3", "name": "Design of IIR Filters", "xp": 100},
            {"id": "pdsp-4", "name": "FIR Filters", "xp": 100}
        ]
    },
    "DVLSI": {
        "name": "DVLSI",
        "color": "#16a34a",
        "image": "https://images.pexels.com/photos/35348462/pexels-photo-35348462.jpeg",
        "units": [
            {"id": "dvlsi-1", "name": "MOS Inverters", "xp": 100},
            {"id": "dvlsi-2", "name": "Fabrication of MOSFETs and Layout", "xp": 100},
            {"id": "dvlsi-3", "name": "Switching Characteristics & Bi-stable Elements", "xp": 100},
            {"id": "dvlsi-4", "name": "Sequential MOS Logic & Memories", "xp": 100}
        ]
    },
    "CONTROL SYSTEM": {
        "name": "CONTROL SYSTEM",
        "color": "#ea580c",
        "image": "https://images.pexels.com/photos/159298/gears-cogs-machine-machinery-159298.jpeg",
        "units": [
            {"id": "control-1", "name": "Mathematical Modelling of Linear Systems", "xp": 100},
            {"id": "control-2", "name": "Performance of Feedback Control Systems", "xp": 100},
            {"id": "control-3", "name": "Stability Analysis", "xp": 100},
            {"id": "control-4", "name": "Frequency Response", "xp": 100}
        ]
    },
    "EMFT": {
        "name": "EMFT",
        "color": "#db2777",
        "image": "https://images.pexels.com/photos/2996279/pexels-photo-2996279.jpeg",
        "units": [
            {"id": "emft-1", "name": "Vectors and Electrostatics", "xp": 100},
            {"id": "emft-2", "name": "Coulomb's Law & Gauss Law", "xp": 100},
            {"id": "emft-3", "name": "Magnetostatics", "xp": 100},
            {"id": "emft-4", "name": "Time Varying Fields and Wave Theory", "xp": 100}
        ]
    }
}

# === ACHIEVEMENTS DATA ===
ACHIEVEMENTS_DATA = [
    # MATHS Achievements
    {"id": "matrix-master", "name": "Matrix Master", "description": "Complete Matrices and Gaussian Elimination", "subject": "MATHS", "unit_id": "maths-1", "icon": "grid-3x3"},
    {"id": "vector-virtuoso", "name": "Vector Virtuoso", "description": "Complete Vector Spaces", "subject": "MATHS", "unit_id": "maths-2", "icon": "move-3d"},
    {"id": "transformation-titan", "name": "Transformation Titan", "description": "Complete Linear Transformations", "subject": "MATHS", "unit_id": "maths-3", "icon": "rotate-3d"},
    {"id": "eigen-explorer", "name": "Eigen Explorer", "description": "Complete Eigen Values and Vectors", "subject": "MATHS", "unit_id": "maths-4", "icon": "compass"},
    {"id": "svd-sage", "name": "SVD Sage", "description": "Complete Singular Value Decomposition", "subject": "MATHS", "unit_id": "maths-5", "icon": "split"},
    
    # PDSP Achievements
    {"id": "dft-decoder", "name": "DFT Decoder", "description": "Complete Discrete Fourier Transform", "subject": "PDSP", "unit_id": "pdsp-1", "icon": "waves"},
    {"id": "fft-fanatic", "name": "FFT Fanatic", "description": "Complete Fast Fourier Transform", "subject": "PDSP", "unit_id": "pdsp-2", "icon": "zap"},
    {"id": "iir-innovator", "name": "IIR Innovator", "description": "Complete Design of IIR Filters", "subject": "PDSP", "unit_id": "pdsp-3", "icon": "filter"},
    {"id": "fir-finisher", "name": "FIR Finisher", "description": "Complete FIR Filters", "subject": "PDSP", "unit_id": "pdsp-4", "icon": "bar-chart-2"},
    
    # DVLSI Achievements
    {"id": "inverter-ace", "name": "Inverter Ace", "description": "Complete MOS Inverters", "subject": "DVLSI", "unit_id": "dvlsi-1", "icon": "flip-vertical"},
    {"id": "fab-fabricator", "name": "Fab Fabricator", "description": "Complete Fabrication of MOSFETs", "subject": "DVLSI", "unit_id": "dvlsi-2", "icon": "cpu"},
    {"id": "switching-specialist", "name": "Switching Specialist", "description": "Complete Switching Characteristics", "subject": "DVLSI", "unit_id": "dvlsi-3", "icon": "toggle-right"},
    {"id": "memory-mogul", "name": "Memory Mogul", "description": "Complete Sequential MOS Logic & Memories", "subject": "DVLSI", "unit_id": "dvlsi-4", "icon": "hard-drive"},
    
    # CONTROL SYSTEM Achievements
    {"id": "modelling-maven", "name": "Modelling Maven", "description": "Complete Mathematical Modelling", "subject": "CONTROL SYSTEM", "unit_id": "control-1", "icon": "function-square"},
    {"id": "feedback-finesse", "name": "Feedback Finesse", "description": "Complete Feedback Control Systems", "subject": "CONTROL SYSTEM", "unit_id": "control-2", "icon": "refresh-cw"},
    {"id": "stability-strategist", "name": "Stability Strategist", "description": "Complete Stability Analysis", "subject": "CONTROL SYSTEM", "unit_id": "control-3", "icon": "scale"},
    {"id": "frequency-finder", "name": "Frequency Finder", "description": "Complete Frequency Response", "subject": "CONTROL SYSTEM", "unit_id": "control-4", "icon": "radio"},
    
    # EMFT Achievements
    {"id": "vector-veteran", "name": "Vector Veteran", "description": "Complete Vectors and Electrostatics", "subject": "EMFT", "unit_id": "emft-1", "icon": "arrow-up-right"},
    {"id": "electrostatic-expert", "name": "Electrostatic Expert", "description": "Complete Coulomb's & Gauss Law", "subject": "EMFT", "unit_id": "emft-2", "icon": "atom"},
    {"id": "magnetostatic-master", "name": "Magnetostatic Master", "description": "Complete Magnetostatics", "subject": "EMFT", "unit_id": "emft-3", "icon": "magnet"},
    {"id": "wave-warrior", "name": "Wave Warrior", "description": "Complete Time Varying Fields", "subject": "EMFT", "unit_id": "emft-4", "icon": "activity"},
    
    # Special Achievements
    {"id": "streak-starter", "name": "Streak Starter", "description": "Maintain a 3-day study streak", "subject": "SPECIAL", "unit_id": None, "icon": "flame"},
    {"id": "week-warrior", "name": "Week Warrior", "description": "Maintain a 7-day study streak", "subject": "SPECIAL", "unit_id": None, "icon": "calendar"},
    {"id": "pomodoro-pro", "name": "Pomodoro Pro", "description": "Complete 10 pomodoro sessions", "subject": "SPECIAL", "unit_id": None, "icon": "timer"},
    {"id": "subject-scholar", "name": "Subject Scholar", "description": "Complete all units of any subject", "subject": "SPECIAL", "unit_id": None, "icon": "award"},
    {"id": "ultimate-achiever", "name": "Ultimate Achiever", "description": "Complete all units of all subjects", "subject": "SPECIAL", "unit_id": None, "icon": "trophy"},
]

# === PYDANTIC MODELS ===
class UnitProgress(BaseModel):
    unit_id: str
    completed: bool = False
    completed_at: Optional[str] = None

class UserProgress(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    completed_units: List[str] = []
    xp: int = 0
    level: int = 1
    streak_days: int = 0
    last_study_date: Optional[str] = None
    pomodoro_sessions: int = 0
    unlocked_achievements: List[str] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class ToggleUnitRequest(BaseModel):
    unit_id: str

class PomodoroSessionRequest(BaseModel):
    duration_minutes: int
    completed: bool

class SubjectResponse(BaseModel):
    name: str
    color: str
    image: str
    units: List[dict]
    completed_units: int
    total_units: int
    progress_percentage: float

class DashboardResponse(BaseModel):
    xp: int
    level: int
    xp_to_next_level: int
    streak_days: int
    total_completed: int
    total_units: int
    overall_progress: float
    subjects: List[SubjectResponse]
    unlocked_achievements: List[str]

# === HELPER FUNCTIONS ===
def calculate_level(xp: int) -> int:
    """Calculate level based on XP (100 XP per level)"""
    return max(1, (xp // 500) + 1)

def xp_to_next_level(xp: int) -> int:
    """Calculate XP needed for next level"""
    current_level = calculate_level(xp)
    next_level_xp = current_level * 500
    return next_level_xp - xp

async def get_or_create_progress() -> dict:
    """Get existing progress or create new one"""
    progress = await db.user_progress.find_one({}, {"_id": 0})
    if not progress:
        new_progress = UserProgress()
        doc = new_progress.model_dump()
        await db.user_progress.insert_one(doc)
        progress = doc
    return progress

async def check_and_unlock_achievements(progress: dict) -> List[str]:
    """Check if any new achievements should be unlocked"""
    newly_unlocked = []
    completed_units = set(progress.get("completed_units", []))
    unlocked = set(progress.get("unlocked_achievements", []))
    
    for achievement in ACHIEVEMENTS_DATA:
        if achievement["id"] in unlocked:
            continue
            
        # Unit-based achievements
        if achievement["unit_id"] and achievement["unit_id"] in completed_units:
            newly_unlocked.append(achievement["id"])
            
        # Streak achievements
        if achievement["id"] == "streak-starter" and progress.get("streak_days", 0) >= 3:
            newly_unlocked.append(achievement["id"])
        if achievement["id"] == "week-warrior" and progress.get("streak_days", 0) >= 7:
            newly_unlocked.append(achievement["id"])
            
        # Pomodoro achievement
        if achievement["id"] == "pomodoro-pro" and progress.get("pomodoro_sessions", 0) >= 10:
            newly_unlocked.append(achievement["id"])
            
        # Subject completion
        if achievement["id"] == "subject-scholar":
            for subject_key, subject_data in SUBJECTS_DATA.items():
                subject_unit_ids = {u["id"] for u in subject_data["units"]}
                if subject_unit_ids.issubset(completed_units):
                    newly_unlocked.append(achievement["id"])
                    break
                    
        # All subjects completion
        if achievement["id"] == "ultimate-achiever":
            all_units = set()
            for subject_data in SUBJECTS_DATA.values():
                all_units.update(u["id"] for u in subject_data["units"])
            if all_units.issubset(completed_units):
                newly_unlocked.append(achievement["id"])
    
    return list(set(newly_unlocked))

# === API ROUTES ===
@api_router.get("/")
async def root():
    return {"message": "Study Tracker API"}

@api_router.get("/subjects")
async def get_subjects():
    """Get all subjects with their units"""
    progress = await get_or_create_progress()
    completed_units = set(progress.get("completed_units", []))
    
    subjects = []
    for subject_key, subject_data in SUBJECTS_DATA.items():
        units = subject_data["units"]
        subject_completed = sum(1 for u in units if u["id"] in completed_units)
        subjects.append({
            "name": subject_data["name"],
            "color": subject_data["color"],
            "image": subject_data["image"],
            "units": units,
            "completed_units": subject_completed,
            "total_units": len(units),
            "progress_percentage": round((subject_completed / len(units)) * 100, 1) if units else 0
        })
    
    return subjects

@api_router.get("/dashboard")
async def get_dashboard():
    """Get dashboard data with overall progress"""
    progress = await get_or_create_progress()
    completed_units = set(progress.get("completed_units", []))
    
    # Calculate totals
    total_units = sum(len(s["units"]) for s in SUBJECTS_DATA.values())
    total_completed = len(completed_units)
    
    subjects = []
    for subject_key, subject_data in SUBJECTS_DATA.items():
        units = subject_data["units"]
        subject_completed = sum(1 for u in units if u["id"] in completed_units)
        subjects.append({
            "name": subject_data["name"],
            "color": subject_data["color"],
            "image": subject_data["image"],
            "units": units,
            "completed_units": subject_completed,
            "total_units": len(units),
            "progress_percentage": round((subject_completed / len(units)) * 100, 1) if units else 0
        })
    
    xp = progress.get("xp", 0)
    
    return {
        "xp": xp,
        "level": calculate_level(xp),
        "xp_to_next_level": xp_to_next_level(xp),
        "streak_days": progress.get("streak_days", 0),
        "total_completed": total_completed,
        "total_units": total_units,
        "overall_progress": round((total_completed / total_units) * 100, 1) if total_units else 0,
        "subjects": subjects,
        "unlocked_achievements": progress.get("unlocked_achievements", []),
        "pomodoro_sessions": progress.get("pomodoro_sessions", 0)
    }

@api_router.post("/units/toggle")
async def toggle_unit_completion(request: ToggleUnitRequest):
    """Toggle a unit's completion status"""
    unit_id = request.unit_id
    
    # Verify unit exists
    unit_found = False
    unit_xp = 100
    for subject_data in SUBJECTS_DATA.values():
        for unit in subject_data["units"]:
            if unit["id"] == unit_id:
                unit_found = True
                unit_xp = unit.get("xp", 100)
                break
        if unit_found:
            break
    
    if not unit_found:
        raise HTTPException(status_code=404, detail="Unit not found")
    
    progress = await get_or_create_progress()
    completed_units = progress.get("completed_units", [])
    current_xp = progress.get("xp", 0)
    
    # Toggle completion
    if unit_id in completed_units:
        completed_units.remove(unit_id)
        current_xp = max(0, current_xp - unit_xp)
        completed = False
    else:
        completed_units.append(unit_id)
        current_xp += unit_xp
        completed = True
    
    # Update streak
    today = date.today().isoformat()
    last_study = progress.get("last_study_date")
    streak = progress.get("streak_days", 0)
    
    if completed:
        if last_study:
            last_date = date.fromisoformat(last_study)
            today_date = date.today()
            diff = (today_date - last_date).days
            if diff == 1:
                streak += 1
            elif diff > 1:
                streak = 1
            # Same day - no change to streak
        else:
            streak = 1
    
    # Check achievements
    temp_progress = {
        "completed_units": completed_units,
        "streak_days": streak,
        "pomodoro_sessions": progress.get("pomodoro_sessions", 0),
        "unlocked_achievements": progress.get("unlocked_achievements", [])
    }
    new_achievements = await check_and_unlock_achievements(temp_progress)
    unlocked_achievements = list(set(progress.get("unlocked_achievements", []) + new_achievements))
    
    # Update database
    await db.user_progress.update_one(
        {},
        {"$set": {
            "completed_units": completed_units,
            "xp": current_xp,
            "level": calculate_level(current_xp),
            "streak_days": streak,
            "last_study_date": today if completed else last_study,
            "unlocked_achievements": unlocked_achievements,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    
    return {
        "unit_id": unit_id,
        "completed": completed,
        "xp": current_xp,
        "level": calculate_level(current_xp),
        "streak_days": streak,
        "new_achievements": new_achievements
    }

@api_router.post("/pomodoro/complete")
async def complete_pomodoro(request: PomodoroSessionRequest):
    """Record a completed pomodoro session"""
    if not request.completed:
        return {"message": "Session not completed"}
    
    progress = await get_or_create_progress()
    sessions = progress.get("pomodoro_sessions", 0) + 1
    
    # Update streak
    today = date.today().isoformat()
    last_study = progress.get("last_study_date")
    streak = progress.get("streak_days", 0)
    
    if last_study:
        last_date = date.fromisoformat(last_study)
        today_date = date.today()
        diff = (today_date - last_date).days
        if diff == 1:
            streak += 1
        elif diff > 1:
            streak = 1
    else:
        streak = 1
    
    # Check achievements
    temp_progress = {
        "completed_units": progress.get("completed_units", []),
        "streak_days": streak,
        "pomodoro_sessions": sessions,
        "unlocked_achievements": progress.get("unlocked_achievements", [])
    }
    new_achievements = await check_and_unlock_achievements(temp_progress)
    unlocked_achievements = list(set(progress.get("unlocked_achievements", []) + new_achievements))
    
    await db.user_progress.update_one(
        {},
        {"$set": {
            "pomodoro_sessions": sessions,
            "streak_days": streak,
            "last_study_date": today,
            "unlocked_achievements": unlocked_achievements,
            "updated_at": datetime.now(timezone.utc).isoformat()
        }},
        upsert=True
    )
    
    return {
        "pomodoro_sessions": sessions,
        "streak_days": streak,
        "new_achievements": new_achievements
    }

@api_router.get("/achievements")
async def get_achievements():
    """Get all achievements with unlock status"""
    progress = await get_or_create_progress()
    unlocked = set(progress.get("unlocked_achievements", []))
    
    achievements = []
    for ach in ACHIEVEMENTS_DATA:
        achievements.append({
            **ach,
            "unlocked": ach["id"] in unlocked
        })
    
    return achievements

@api_router.get("/progress")
async def get_progress():
    """Get raw user progress data"""
    progress = await get_or_create_progress()
    return progress

@api_router.post("/progress/reset")
async def reset_progress():
    """Reset all progress (for testing)"""
    await db.user_progress.delete_many({})
    new_progress = UserProgress()
    doc = new_progress.model_dump()
    await db.user_progress.insert_one(doc)
    return {"message": "Progress reset successfully"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
