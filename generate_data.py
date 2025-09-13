import random
import json
from datetime import datetime, timedelta
import pandas as pd
from faker import Faker

fake = Faker('en_IN')

def generate_synthetic_data(num_records=10000):
    # Realistic IAF ranks and hierarchy
    ranks = {
        "Air Chief Marshal": {"weight": 1, "min_service": 30, "leadership_base": 95},
        "Air Marshal": {"weight": 2, "min_service": 25, "leadership_base": 90},
        "Air Vice Marshal": {"weight": 5, "min_service": 22, "leadership_base": 85},
        "Air Commodore": {"weight": 10, "min_service": 18, "leadership_base": 80},
        "Group Captain": {"weight": 20, "min_service": 15, "leadership_base": 75},
        "Wing Commander": {"weight": 40, "min_service": 12, "leadership_base": 70},
        "Squadron Leader": {"weight": 80, "min_service": 8, "leadership_base": 65},
        "Flight Lieutenant": {"weight": 120, "min_service": 4, "leadership_base": 60},
        "Flying Officer": {"weight": 100, "min_service": 2, "leadership_base": 55},
        "Pilot Officer": {"weight": 80, "min_service": 0, "leadership_base": 50}
    }
    
    # Real IAF bases and commands
    units = [
        "Western Air Command", "Eastern Air Command", "Central Air Command", "Southern Air Command",
        "South Western Air Command", "Training Command", "Maintenance Command",
        "Hindon Air Force Station", "Palam Air Force Station", "Kalaikunda Air Force Station",
        "Tezpur Air Force Station", "Jorhat Air Force Station", "Bagdogra Air Force Station",
        "Pune Air Force Station", "Lohegaon Air Force Station", "Bidar Air Force Station",
        "Yelahanka Air Force Station", "Sulur Air Force Station", "Thanjavur Air Force Station",
        "Jamnagar Air Force Station", "Bhuj Air Force Station", "Jodhpur Air Force Station"
    ]
    
    # Comprehensive skills based on IAF specializations
    skills_by_branch = {
        "Flying": ["Fighter Aircraft", "Transport Aircraft", "Helicopter Operations", "Navigation", "Air Combat", "Formation Flying"],
        "Technical": ["Aircraft Maintenance", "Avionics", "Radar Systems", "Communication Systems", "Weapon Systems", "Ground Equipment"],
        "Ground Duty": ["Administration", "Logistics", "Intelligence", "Meteorology", "Air Traffic Control", "Security"],
        "Medical": ["Aviation Medicine", "Emergency Medicine", "Preventive Medicine", "Dental Care", "Psychology"],
        "Education": ["Training", "Simulation", "Technical Education", "Leadership Development"]
    }
    
    # Training courses
    training_courses = [
        "Basic Flying Training", "Advanced Flying Training", "Fighter Training", "Transport Training",
        "Technical Training Course", "Staff Course", "Higher Command Course", "War College",
        "Cyber Security Course", "Leadership Development Program", "International Training Exchange",
        "Weapon Systems Course", "Maintenance Management", "Air Traffic Control Course"
    ]
    
    # Medical conditions and injuries
    medical_conditions = [
        "Hypertension", "Diabetes", "Back Pain", "Knee Injury", "Shoulder Injury",
        "Vision Correction", "Hearing Loss", "Stress Disorder", "Sleep Apnea"
    ]
    
    # Create weighted rank distribution
    rank_list = []
    for rank, info in ranks.items():
        rank_list.extend([rank] * info["weight"])
    
    data = []
    
    for i in range(num_records):
        # Select rank and determine service years
        rank = random.choice(rank_list)
        rank_info = ranks[rank]
        min_service = rank_info["min_service"]
        years_service = random.randint(min_service, min_service + 8)
        age = 22 + years_service + random.randint(-1, 3)
        
        # Determine branch and skills
        if "Marshal" in rank or "Commodore" in rank or "Captain" in rank:
            branch = random.choice(["Flying", "Technical", "Ground Duty"])
        elif "Commander" in rank or "Leader" in rank:
            branch = random.choices(["Flying", "Technical", "Ground Duty"], weights=[50, 30, 20])[0]
        else:
            branch = random.choices(["Flying", "Technical", "Ground Duty", "Medical", "Education"], 
                                  weights=[40, 25, 20, 10, 5])[0]
        
        skills = random.sample(skills_by_branch[branch], random.randint(2, 4))
        
        # Generate realistic name
        gender = random.choice(["Male", "Female"])
        if gender == "Male":
            name = fake.name_male()
        else:
            name = fake.name_female()
        
        # Training history based on rank and service
        training_history = []
        num_courses = min(years_service // 2 + random.randint(1, 3), 8)
        for _ in range(num_courses):
            max_days = max(30, years_service * 365)
            course_date = datetime.now() - timedelta(days=random.randint(30, max_days))
            training_history.append({
                "course": random.choice(training_courses),
                "date": course_date.isoformat(),
                "score": random.randint(65, 98),
                "duration_days": random.randint(30, 365)
            })
        
        # Physical and mental health metrics
        base_fitness = 85 - (age - 25) * 0.5 + random.randint(-10, 15)
        fitness_score = max(60, min(100, int(base_fitness)))
        
        stress_factors = 0
        if years_service > 20: stress_factors += 10
        if branch == "Flying": stress_factors += 5
        if "Marshal" in rank: stress_factors += 15
        
        stress_index = max(10, min(80, 20 + stress_factors + random.randint(-10, 20)))
        
        # Mission and performance metrics
        if branch == "Flying":
            missions_participated = random.randint(years_service * 5, years_service * 15)
            mission_success_rate = random.uniform(0.85, 0.98)
        else:
            missions_participated = random.randint(years_service * 2, years_service * 8)
            mission_success_rate = random.uniform(0.88, 0.99)
        
        # Leadership and engagement
        leadership_base = rank_info["leadership_base"]
        leadership_score = max(1, min(10, int(leadership_base/10 + random.randint(-2, 2))))
        peer_review_score = max(1, min(10, leadership_score + random.randint(-1, 1)))
        
        engagement_factors = 70
        if years_service < 5: engagement_factors += 10
        if years_service > 25: engagement_factors -= 15
        if fitness_score > 85: engagement_factors += 5
        if stress_index > 60: engagement_factors -= 10
        
        engagement_score = max(30, min(100, engagement_factors + random.randint(-15, 15)))
        
        # Disciplinary and leave records
        disciplinary_actions = 0
        if engagement_score < 60:
            disciplinary_actions = random.randint(0, 3)
        elif engagement_score < 80:
            disciplinary_actions = random.randint(0, 1)
        
        leave_records = random.randint(20, 45)
        complaints = random.randint(0, 2) if disciplinary_actions > 0 else 0
        
        # Calculate attrition risk
        attrition_factors = 0
        if engagement_score < 60: attrition_factors += 30
        if years_service > 25: attrition_factors += 25
        if disciplinary_actions > 1: attrition_factors += 20
        if stress_index > 65: attrition_factors += 15
        if fitness_score < 70: attrition_factors += 10
        
        attrition_risk = 1 if attrition_factors > 40 and random.random() > 0.6 else 0
        
        # Leadership potential
        if leadership_score >= 8 and peer_review_score >= 8 and years_service >= 8:
            leadership_potential = "high"
        elif leadership_score >= 6 and peer_review_score >= 6:
            leadership_potential = "medium"
        else:
            leadership_potential = "low"
        
        # Overall readiness score
        readiness_components = {
            "fitness": fitness_score * 0.25,
            "stress": (100 - stress_index) * 0.20,
            "mission_success": mission_success_rate * 100 * 0.25,
            "engagement": engagement_score * 0.20,
            "leadership": leadership_score * 10 * 0.10
        }
        
        readiness_score = int(sum(readiness_components.values()))
        
        # Medical history
        injury_history = []
        if random.random() < 0.3:  # 30% have some medical history
            injury_history = random.sample(medical_conditions, random.randint(1, 2))
        
        # Certifications based on branch and rank
        certifications = []
        if branch == "Flying":
            certifications.extend(["Pilot License", "Instrument Rating"])
        if branch == "Technical":
            certifications.extend(["Technical Certification", "Maintenance Authorization"])
        if "Marshal" in rank or "Commodore" in rank:
            certifications.append("Command Certification")
        
        # Additional random certifications
        additional_certs = ["ISO 9001", "Six Sigma", "Project Management", "Cyber Security", "Quality Assurance"]
        certifications.extend(random.sample(additional_certs, random.randint(0, 2)))
        
        record = {
            "id": f"IAF_{i+1:06d}",
            "name": name,
            "gender": gender,
            "rank": rank,
            "branch": branch,
            "unit": random.choice(units),
            "years_of_service": years_service,
            "age": age,
            "skills": skills,
            "training_history": training_history,
            "certifications": certifications,
            "fitness_score": fitness_score,
            "injury_history": injury_history,
            "last_medical_check": (datetime.now() - timedelta(days=random.randint(1, 365))).isoformat(),
            "stress_index": stress_index,
            "missions_participated": missions_participated,
            "mission_success_rate": round(mission_success_rate, 3),
            "peer_review_score": peer_review_score,
            "leadership_score": leadership_score,
            "current_posting": random.choice(units),
            "leave_records": leave_records,
            "disciplinary_actions": disciplinary_actions,
            "complaints": complaints,
            "engagement_score": engagement_score,
            "attrition_risk": attrition_risk,
            "leadership_potential": leadership_potential,
            "readiness_score": readiness_score,
            "salary_grade": random.randint(1, 10),
            "family_status": random.choice(["Single", "Married", "Married with Children"]),
            "education_level": random.choice(["Graduate", "Post Graduate", "Professional Degree", "PhD"]),
            "specialization": random.choice(skills) if skills else "General",
            "deployment_status": random.choice(["Home Base", "Field Posting", "Training", "Deputation"]),
            "security_clearance": random.choice(["Confidential", "Secret", "Top Secret"]),
            "performance_rating": random.choice(["Outstanding", "Excellent", "Very Good", "Good", "Average"]),
            "next_promotion_due": (datetime.now() + timedelta(days=random.randint(180, 1095))).isoformat(),
            "retirement_date": (datetime.now() + timedelta(days=(60-age)*365)).isoformat()
        }
        
        data.append(record)
    
    return data

if __name__ == "__main__":
    print("Generating comprehensive IAF personnel dataset...")
    data = generate_synthetic_data()
    
    # Save as JSON
    with open('personnel_data.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    # Save as CSV for ML
    df = pd.DataFrame(data)
    
    # Handle list columns for CSV
    df['skills_str'] = df['skills'].apply(lambda x: ','.join(x) if x else '')
    df['certifications_str'] = df['certifications'].apply(lambda x: ','.join(x) if x else '')
    df['injury_history_str'] = df['injury_history'].apply(lambda x: ','.join(x) if x else '')
    
    df.to_csv('personnel_data.csv', index=False)
    
    # Generate summary statistics
    print(f"\n=== Dataset Summary ===")
    print(f"Total Records: {len(data)}")
    print(f"\nRank Distribution:")
    rank_dist = df['rank'].value_counts()
    for rank, count in rank_dist.head(10).items():
        print(f"  {rank}: {count}")
    
    print(f"\nBranch Distribution:")
    branch_dist = df['branch'].value_counts()
    for branch, count in branch_dist.items():
        print(f"  {branch}: {count}")
    
    print(f"\nKey Metrics:")
    print(f"  Average Age: {df['age'].mean():.1f}")
    print(f"  Average Service Years: {df['years_of_service'].mean():.1f}")
    print(f"  Average Readiness Score: {df['readiness_score'].mean():.1f}")
    print(f"  High Attrition Risk: {df['attrition_risk'].sum()} ({df['attrition_risk'].mean()*100:.1f}%)")
    print(f"  High Leadership Potential: {len(df[df['leadership_potential'] == 'high'])} ({len(df[df['leadership_potential'] == 'high'])/len(df)*100:.1f}%)")
    
    print(f"\nSample record saved to personnel_data.json and personnel_data.csv")
    print(f"First record preview:")
    sample = {k: v for k, v in data[0].items() if k not in ['training_history']}
    print(json.dumps(sample, indent=2, default=str))
