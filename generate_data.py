import random
import json
from datetime import datetime, timedelta
import pandas as pd

def generate_synthetic_data(num_records=10000):
    ranks = ["Pilot", "Engineer", "Admin", "Medical", "Ground_Staff"]
    units = ["Airbase1", "Airbase2", "Airbase3", "Airbase4", "Airbase5"]
    skills_pool = ["fighter_jets", "radar_ops", "cyber_defense", "maintenance", "logistics", "medical", "admin"]
    
    data = []
    
    for i in range(num_records):
        years_service = random.randint(1, 30)
        age = 22 + years_service + random.randint(-2, 5)
        
        # Generate skills based on rank
        rank = random.choice(ranks)
        if rank == "Pilot":
            skills = random.sample(["fighter_jets", "radar_ops"], random.randint(1, 2))
        elif rank == "Engineer":
            skills = random.sample(["maintenance", "cyber_defense", "radar_ops"], random.randint(1, 3))
        else:
            skills = random.sample(skills_pool, random.randint(1, 2))
        
        # Generate training history
        training_history = []
        for _ in range(random.randint(2, 8)):
            training_history.append({
                "course": f"Course_{random.randint(1, 20)}",
                "date": (datetime.now() - timedelta(days=random.randint(30, 1095))).isoformat(),
                "score": random.randint(60, 100)
            })
        
        # Calculate derived metrics
        fitness_score = random.randint(60, 100)
        stress_index = random.randint(10, 80)
        mission_success_rate = random.uniform(0.7, 1.0) if rank == "Pilot" else random.uniform(0.8, 1.0)
        
        # Attrition risk factors
        engagement_score = random.randint(40, 100)
        disciplinary_actions = random.randint(0, 3)
        
        # Calculate attrition risk
        attrition_risk = 0
        if engagement_score < 60 or disciplinary_actions > 1 or years_service > 25:
            attrition_risk = 1 if random.random() > 0.7 else 0
        
        # Leadership potential
        leadership_score = random.randint(3, 10)
        peer_review_score = random.randint(5, 10)
        leadership_potential = "high" if leadership_score >= 8 and peer_review_score >= 8 else \
                             "medium" if leadership_score >= 6 else "low"
        
        # Readiness score
        readiness_score = int((fitness_score * 0.3 + 
                             (100 - stress_index) * 0.2 + 
                             mission_success_rate * 100 * 0.3 + 
                             engagement_score * 0.2))
        
        record = {
            "id": f"IAF_{i+1:06d}",
            "name": f"Officer_{i+1}",
            "rank": rank,
            "unit": random.choice(units),
            "years_of_service": years_service,
            "age": age,
            "skills": skills,
            "training_history": training_history,
            "certifications": [f"Cert_{random.randint(1, 10)}" for _ in range(random.randint(1, 4))],
            "fitness_score": fitness_score,
            "injury_history": [f"Injury_{random.randint(1, 5)}" for _ in range(random.randint(0, 2))],
            "last_medical_check": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
            "stress_index": stress_index,
            "missions_participated": random.randint(5, 100),
            "mission_success_rate": round(mission_success_rate, 2),
            "peer_review_score": peer_review_score,
            "leadership_score": leadership_score,
            "current_posting": random.choice(units),
            "leave_records": random.randint(15, 45),
            "disciplinary_actions": disciplinary_actions,
            "complaints": random.randint(0, 2),
            "engagement_score": engagement_score,
            "attrition_risk": attrition_risk,
            "leadership_potential": leadership_potential,
            "readiness_score": readiness_score
        }
        
        data.append(record)
    
    return data

if __name__ == "__main__":
    data = generate_synthetic_data()
    
    # Save as JSON
    with open('personnel_data.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    # Save as CSV for ML
    df = pd.DataFrame(data)
    df.to_csv('personnel_data.csv', index=False)
    
    print(f"Generated {len(data)} records")
    print(f"Sample record: {json.dumps(data[0], indent=2)}")
