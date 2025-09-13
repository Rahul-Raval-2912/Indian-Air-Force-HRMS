import json
import re
from datetime import datetime
import pandas as pd
from advanced_ml_models import AdvancedIAFMLModels

class IAFChatbot:
    def __init__(self):
        self.ml_models = AdvancedIAFMLModels()
        self.ml_models.load_data()
        self.current_user_role = None
        self.current_user_id = None
        self.conversation_history = []
        
        # Load pre-trained models
        try:
            self.ml_models.load_models()
        except:
            print("ML models not found. Please train models first.")
        
        # Role-based capabilities
        self.role_capabilities = {
            'commander': {
                'access_level': 'strategic',
                'data_access': ['all_personnel', 'unit_stats', 'readiness', 'operations'],
                'functions': ['unit_analysis', 'strategic_planning', 'resource_allocation', 'mission_planning']
            },
            'hr_manager': {
                'access_level': 'administrative',
                'data_access': ['personnel_records', 'performance', 'training', 'career_development'],
                'functions': ['personnel_management', 'career_planning', 'skill_analysis', 'attrition_analysis']
            },
            'medical_officer': {
                'access_level': 'medical',
                'data_access': ['medical_records', 'fitness_data', 'wellness_metrics'],
                'functions': ['health_analysis', 'fitness_tracking', 'wellness_recommendations', 'medical_clearance']
            },
            'training_officer': {
                'access_level': 'training',
                'data_access': ['training_records', 'skill_gaps', 'performance_metrics'],
                'functions': ['training_analysis', 'skill_development', 'course_recommendations', 'progress_tracking']
            },
            'personnel': {
                'access_level': 'personal',
                'data_access': ['own_records', 'career_path', 'training_opportunities'],
                'functions': ['career_guidance', 'training_requests', 'performance_review', 'wellness_tips']
            }
        }
        
        # Intent patterns for natural language understanding
        self.intent_patterns = {
            'attrition_analysis': [
                r'attrition.*risk', r'who.*might.*leave', r'retention.*analysis',
                r'turnover.*rate', r'personnel.*leaving', r'resignation', r'quit'
            ],
            'readiness_assessment': [
                r'readiness.*score', r'mission.*ready', r'deployment.*status',
                r'operational.*readiness', r'unit.*preparedness', r'combat.*ready'
            ],
            'leadership_evaluation': [
                r'leadership.*potential', r'promote.*candidate', r'succession.*planning',
                r'leadership.*assessment', r'next.*leader', r'command.*position'
            ],
            'career_guidance': [
                r'career.*path', r'promotion.*timeline', r'career.*development',
                r'advancement.*opportunity', r'next.*step', r'rank.*progression'
            ],
            'training_recommendations': [
                r'training.*need', r'skill.*gap', r'course.*recommend',
                r'development.*program', r'training.*plan', r'certification'
            ],
            'health_wellness': [
                r'health.*status', r'fitness.*level', r'wellness.*check',
                r'medical.*clearance', r'stress.*level', r'mental.*health'
            ],
            'mission_assignment': [
                r'mission.*suitable', r'assign.*mission', r'deployment.*ready',
                r'operation.*assignment', r'mission.*capability', r'sortie'
            ],
            'unit_statistics': [
                r'unit.*stats', r'personnel.*count', r'unit.*strength',
                r'department.*overview', r'team.*composition', r'squadron.*info'
            ],
            'iaf_policies': [
                r'policy', r'regulation', r'rule', r'procedure', r'guideline',
                r'air.*force.*order', r'afo', r'manual'
            ],
            'leave_management': [
                r'leave.*balance', r'vacation', r'casual.*leave', r'earned.*leave',
                r'medical.*leave', r'maternity.*leave', r'annual.*leave'
            ],
            'posting_transfer': [
                r'posting', r'transfer', r'station.*change', r'relocation',
                r'new.*assignment', r'base.*change'
            ],
            'pay_allowances': [
                r'salary', r'pay.*scale', r'allowance', r'increment', r'pension',
                r'da.*rate', r'hra', r'flying.*pay'
            ],
            'equipment_aircraft': [
                r'aircraft.*type', r'equipment', r'fighter.*jet', r'helicopter',
                r'transport.*aircraft', r'maintenance.*schedule'
            ]
        }
        
    def set_user_context(self, role, user_id=None):
        """Set the current user's role and context"""
        self.current_user_role = role.lower()
        self.current_user_id = user_id
        
        if role not in self.role_capabilities:
            return False, "Invalid role specified"
        
        return True, f"Welcome! You are now logged in as {role.title()}"
        
    def process_message(self, message):
        """Process user message and generate appropriate response"""
        if not self.current_user_role:
            return "Please specify your role first using set_role command"
        
        # Add to conversation history
        self.conversation_history.append({
            'timestamp': datetime.now(),
            'role': self.current_user_role,
            'message': message,
            'type': 'user'
        })
        
        # Detect intent
        intent = self._detect_intent(message)
        
        # Check role permissions
        if not self._check_permissions(intent):
            response = "You don't have permission to access this information with your current role."
        else:
            # Generate response based on intent and role
            response = self._generate_response(intent, message)
        
        # Add response to history
        self.conversation_history.append({
            'timestamp': datetime.now(),
            'role': 'assistant',
            'message': response,
            'type': 'bot'
        })
        
        return response
        
    def _detect_intent(self, message):
        """Detect user intent from message"""
        message_lower = message.lower()
        
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, message_lower):
                    return intent
        
        return 'general_inquiry'
        
    def _check_permissions(self, intent):
        """Check if current role has permission for the intent"""
        role_caps = self.role_capabilities.get(self.current_user_role, {})
        
        # Define intent-to-capability mapping
        intent_capabilities = {
            'attrition_analysis': ['personnel_management', 'unit_analysis'],
            'readiness_assessment': ['unit_analysis', 'mission_planning', 'training_analysis'],
            'leadership_evaluation': ['personnel_management', 'career_planning'],
            'career_guidance': ['career_planning', 'career_guidance'],
            'training_recommendations': ['training_analysis', 'skill_development'],
            'health_wellness': ['health_analysis', 'wellness_recommendations'],
            'mission_assignment': ['mission_planning', 'unit_analysis'],
            'unit_statistics': ['unit_analysis', 'personnel_management'],
            'iaf_policies': ['personnel_management', 'unit_analysis', 'career_planning'],
            'leave_management': ['personnel_management', 'career_guidance'],
            'posting_transfer': ['personnel_management', 'career_planning'],
            'pay_allowances': ['personnel_management', 'career_guidance'],
            'equipment_aircraft': ['unit_analysis', 'mission_planning']
        }
        
        required_caps = intent_capabilities.get(intent, [])
        user_functions = role_caps.get('functions', [])
        
        return any(cap in user_functions for cap in required_caps) or intent == 'general_inquiry'
        
    def _generate_response(self, intent, message):
        """Generate response based on intent and user role"""
        try:
            if intent == 'attrition_analysis':
                return self._handle_attrition_analysis(message)
            elif intent == 'readiness_assessment':
                return self._handle_readiness_assessment(message)
            elif intent == 'leadership_evaluation':
                return self._handle_leadership_evaluation(message)
            elif intent == 'career_guidance':
                return self._handle_career_guidance(message)
            elif intent == 'training_recommendations':
                return self._handle_training_recommendations(message)
            elif intent == 'health_wellness':
                return self._handle_health_wellness(message)
            elif intent == 'mission_assignment':
                return self._handle_mission_assignment(message)
            elif intent == 'unit_statistics':
                return self._handle_unit_statistics(message)
            elif intent == 'iaf_policies':
                return self._handle_iaf_policies(message)
            elif intent == 'leave_management':
                return self._handle_leave_management(message)
            elif intent == 'posting_transfer':
                return self._handle_posting_transfer(message)
            elif intent == 'pay_allowances':
                return self._handle_pay_allowances(message)
            elif intent == 'equipment_aircraft':
                return self._handle_equipment_aircraft(message)
            else:
                return self._handle_general_inquiry(message)
        except Exception as e:
            return f"I encountered an error processing your request: {str(e)}. Please try rephrasing your question."
            
    def _handle_attrition_analysis(self, message):
        """Handle attrition risk analysis queries"""
        if self.current_user_role == 'commander':
            # High-level attrition analysis
            high_risk_count = len(self.ml_models.df[self.ml_models.df['attrition_risk'] == 1])
            total_personnel = len(self.ml_models.df)
            risk_percentage = (high_risk_count / total_personnel) * 100
            
            response = f"""**IAF Attrition Risk Analysis (Strategic Overview)**
            
📊 **Current Status:**
• High-risk personnel: {high_risk_count} ({risk_percentage:.1f}%)
• Total personnel analyzed: {total_personnel}
• Critical branches: Flying, Technical, Administrative

🎯 **IAF-Specific Risk Factors:**
• **Operational Stress**: High-tempo operations, border tensions
• **Family Separation**: Frequent deployments, remote postings
• **Career Stagnation**: Limited promotion opportunities
• **Civilian Opportunities**: Attractive private sector offers
• **Work-Life Balance**: Irregular schedules, emergency duties

⚠️ **High-Risk Categories:**
• Mid-career officers (8-15 years service)
• Technical specialists with civilian market value
• Personnel in hardship postings (>3 years)
• Officers with family issues/medical problems

💡 **IAF Retention Strategies:**
• **Enhanced Family Welfare**: Better accommodation, schooling
• **Career Progression**: Fast-track promotions for performers
• **Skill Development**: Advanced training, foreign courses
• **Financial Incentives**: Special allowances, retention bonus
• **Posting Flexibility**: Consider family circumstances
• **Recognition Programs**: Gallantry awards, commendations

🎖️ **Command Actions Required:**
• Review posting policies for hardship areas
• Enhance Station Family Welfare programs
• Implement mentorship for junior officers
• Regular interaction with personnel and families
• Address grievances through proper channels"""

        elif self.current_user_role == 'hr_manager':
            # Detailed HR perspective
            response = f"""**IAF Personnel Retention Analysis**
            
📈 **Attrition Trends by Branch:**
• **Flying Branch**: 12% annual attrition (concern level)
• **Technical Branch**: 15% annual attrition (high concern)
• **Administrative**: 8% annual attrition (acceptable)
• **Medical Branch**: 10% annual attrition (moderate)

🎯 **Critical Loss Areas:**
• **Pilots**: Airline industry poaching experienced pilots
• **Engineers**: IT/Defense sector opportunities
• **Specialists**: Cyber security, avionics experts
• **Medical Officers**: Private practice attractions

🔧 **IAF HR Interventions:**
• **Exit Interview Analysis**: 78% cite family reasons
• **Retention Bonus**: ₹10-25 lakhs for critical trades
• **Flexible Service**: Short Service Commission extensions
• **Spouse Employment**: Job assistance programs
• **Children Education**: Quality schools at all stations

📋 **Immediate Actions:**
• **High-Risk Personnel**: 127 officers identified for counseling
• **Family Welfare**: Enhanced support programs
• **Career Counseling**: Individual development plans
• **Grievance Redressal**: Fast-track resolution system

📊 **Success Metrics:**
• Target: Reduce attrition to <10% across all branches
• Retention rate improvement: 15% in last 2 years
• Family satisfaction index: 78% (target: 85%)
• Career progression satisfaction: 72% (target: 80%)"""

        else:
            response = "Attrition analysis is available to Commanders and HR Managers."
            
        return response
        
    def _handle_readiness_assessment(self, message):
        """Handle readiness assessment queries"""
        avg_readiness = self.ml_models.df['readiness_score'].mean()
        high_readiness = len(self.ml_models.df[self.ml_models.df['readiness_score'] > 85])
        
        if self.current_user_role in ['commander', 'training_officer']:
            response = f"""**Operational Readiness Assessment**
            
⚡ **Current Readiness Status:**
• Average readiness score: {avg_readiness:.1f}/100
• Personnel at high readiness (>85): {high_readiness}
• Overall unit status: {'Excellent' if avg_readiness > 80 else 'Good' if avg_readiness > 70 else 'Needs Improvement'}

🎯 **Readiness Factors:**
• Physical fitness levels
• Training completion status
• Equipment proficiency
• Mental preparedness

📊 **Improvement Areas:**
• Focus on personnel below 70% readiness
• Enhance training programs
• Address stress and wellness factors"""

        else:
            response = "Detailed readiness assessments are available to Commanders and Training Officers."
            
        return response
        
    def _handle_leadership_evaluation(self, message):
        """Handle leadership evaluation queries"""
        if self.current_user_role in ['commander', 'hr_manager']:
            high_potential = len(self.ml_models.df[self.ml_models.df['leadership_potential'] == 'high'])
            
            response = f"""**Leadership Assessment Summary**
            
🌟 **Leadership Pipeline:**
• High potential candidates: {high_potential}
• Ready for immediate promotion: {high_potential // 3}
• Developing leaders: {high_potential // 2}

📈 **Development Focus:**
• Succession planning for key positions
• Leadership training programs
• Mentorship opportunities
• Cross-functional experience

🎯 **Recommendations:**
• Accelerate development for high-potential personnel
• Create leadership development tracks
• Implement 360-degree feedback systems"""

        else:
            response = "Leadership evaluations are available to Commanders and HR Managers."
            
        return response
        
    def _handle_career_guidance(self, message):
        """Handle career guidance queries"""
        if self.current_user_role == 'personnel':
            # Personal career guidance
            response = """**Your IAF Career Development Path**
            
🎖️ **Current Status:**
• **Rank**: Squadron Leader (Technical Branch)
• **Service**: 12 years completed
• **Current Posting**: AFS Gwalior (Avionics Specialist)
• **Performance**: Above Average (Last 3 ACRs)

🚀 **Promotion Timeline:**
• **Next Rank**: Wing Commander
• **Eligibility**: Completed (minimum service met)
• **Selection Board**: Due in 8 months
• **Probability**: 75% (based on performance & seniority)

🎯 **Career Enhancement Areas:**
• **Command Experience**: Seek Flight/Squadron command
• **Staff Appointments**: Air HQ/Command HQ exposure
• **Foreign Training**: Apply for advanced courses abroad
• **Higher Education**: Consider M.Tech/MBA programs

📚 **Recommended IAF Courses:**
• **Higher Command Course**: For Wing Commander rank
• **Technical Staff Course**: Specialization enhancement
• **Air War College**: Strategic studies
• **Foreign Courses**: US/UK/France exchange programs

🏆 **Achievement Targets:**
• **Commendation**: Aim for COAS/VCOAS commendation
• **Innovation**: Contribute to technical improvements
• **Leadership**: Mentor junior officers effectively
• **Fitness**: Maintain 'Excellent' grading

📞 **Career Counseling:**
• **Next Session**: Schedule with Career Counseling Cell
• **Mentor**: Connect with senior Wing Commander
• **Family Planning**: Consider posting preferences
• **Long-term Goals**: Plan for Group Captain rank"""

        elif self.current_user_role == 'hr_manager':
            response = """**Career Development Overview**
            
📊 **Career Planning Status:**
• Personnel with defined career paths: 85%
• Promotion-ready candidates: 12%
• Development program participants: 68%

🎯 **Focus Areas:**
• Succession planning for critical roles
• Cross-training initiatives
• Leadership pipeline development

📋 **HR Actions:**
• Update individual development plans
• Schedule career counseling sessions
• Review promotion criteria and timelines"""

        else:
            response = "Career guidance is available through HR Managers or for personal inquiries."
            
        return response
        
    def _handle_training_recommendations(self, message):
        """Handle training recommendation queries"""
        if self.current_user_role in ['training_officer', 'hr_manager', 'personnel']:
            response = """**Training Recommendations**
            
📚 **Priority Training Areas:**
• Leadership Development (High Priority)
• Technical Skills Update (Medium Priority)
• Stress Management (High Priority)
• Communication Skills (Medium Priority)

🎯 **Recommended Programs:**
• Advanced Leadership Course (6 weeks)
• Technical Certification Program (3 months)
• Wellness and Resilience Training (2 weeks)
• Strategic Planning Workshop (1 week)

📅 **Training Schedule:**
• Q1: Leadership and Communication
• Q2: Technical Skills
• Q3: Wellness Programs
• Q4: Specialized Training

💡 **Benefits:**
• Improved performance ratings
• Enhanced promotion prospects
• Better work-life balance
• Increased job satisfaction"""

        else:
            response = "Training recommendations are available to Training Officers, HR Managers, and individual personnel."
            
        return response
        
    def _handle_health_wellness(self, message):
        """Handle health and wellness queries"""
        if self.current_user_role in ['medical_officer', 'personnel']:
            avg_fitness = self.ml_models.df['fitness_score'].mean()
            avg_stress = self.ml_models.df['stress_index'].mean()
            
            response = f"""**Health & Wellness Overview**
            
🏥 **Current Health Metrics:**
• Average fitness score: {avg_fitness:.1f}/100
• Average stress index: {avg_stress:.1f}/100
• Personnel requiring attention: {len(self.ml_models.df[self.ml_models.df['stress_index'] > 70])}

💪 **Wellness Recommendations:**
• Regular fitness assessments
• Stress management programs
• Mental health support services
• Preventive care initiatives

🎯 **Action Items:**
• Schedule medical check-ups
• Implement fitness programs
• Provide stress counseling
• Monitor wellness metrics

📋 **Resources Available:**
• On-base fitness facilities
• Mental health counselors
• Nutrition guidance
• Wellness workshops"""

        else:
            response = "Health and wellness information is available to Medical Officers and individual personnel."
            
        return response
        
    def _handle_mission_assignment(self, message):
        """Handle mission assignment queries"""
        if self.current_user_role == 'commander':
            ready_personnel = len(self.ml_models.df[self.ml_models.df['readiness_score'] > 80])
            
            response = f"""**Mission Assignment Analysis**
            
⚡ **Mission-Ready Personnel:**
• High readiness (>80): {ready_personnel}
• Combat ready: {ready_personnel // 2}
• Support roles: {ready_personnel // 3}

🎯 **Assignment Criteria:**
• Physical fitness requirements
• Technical skill match
• Experience level
• Current stress factors

📊 **Recommendations:**
• Rotate high-stress assignments
• Match skills to mission requirements
• Consider personnel wellness factors
• Maintain operational readiness"""

        else:
            response = "Mission assignment information is available to Commanders."
            
        return response
        
    def _handle_unit_statistics(self, message):
        """Handle unit statistics queries"""
        total_personnel = len(self.ml_models.df)
        avg_experience = self.ml_models.df['years_of_service'].mean()
        
        if self.current_user_role in ['commander', 'hr_manager']:
            response = f"""**Unit Statistics Overview**
            
📊 **Personnel Strength:**
• Total personnel: {total_personnel}
• Average years of service: {avg_experience:.1f}
• Officer to enlisted ratio: 1:4
• Deployment ready: 75%

🏆 **Performance Metrics:**
• Average performance rating: 8.2/10
• Mission success rate: 94%
• Training completion: 88%
• Retention rate: 92%

📈 **Trends:**
• Steady improvement in readiness
• Increased training participation
• Enhanced wellness scores
• Strong leadership pipeline"""

        else:
            response = "Detailed unit statistics are available to Commanders and HR Managers."
            
        return response
        
    def _handle_general_inquiry(self, message):
        """Handle general inquiries"""
        role_specific_help = {
            'commander': """**Commander Dashboard Help**
            
Available commands:
• "Show unit readiness status"
• "Attrition risk analysis"
• "Mission assignment recommendations"
• "Leadership assessment overview"
• "Unit statistics and metrics"

You have access to strategic-level information and can make high-level decisions.""",

            'hr_manager': """**HR Manager Dashboard Help**
            
Available commands:
• "Personnel retention analysis"
• "Career development planning"
• "Training needs assessment"
• "Performance review summaries"
• "Skill gap analysis"

You can access personnel records and manage career development.""",

            'medical_officer': """**Medical Officer Dashboard Help**
            
Available commands:
• "Health and wellness overview"
• "Fitness assessment results"
• "Stress level monitoring"
• "Medical clearance status"
• "Wellness program recommendations"

You have access to medical and wellness data.""",

            'training_officer': """**Training Officer Dashboard Help**
            
Available commands:
• "Training needs analysis"
• "Skill development recommendations"
• "Course completion tracking"
• "Performance improvement plans"
• "Training program effectiveness"

You can manage training programs and skill development.""",

            'personnel': """**Personnel Dashboard Help**
            
Available commands:
• "My career development path"
• "Training opportunities"
• "Performance feedback"
• "Wellness recommendations"
• "Career guidance"

You can access your personal information and development opportunities."""
        }
        
        return role_specific_help.get(self.current_user_role, "Please specify your role to get appropriate help.")
        
    def _handle_iaf_policies(self, message):
        """Handle IAF policies and regulations queries"""
        if self.current_user_role in ['commander', 'hr_manager']:
            response = """**IAF Policies & Regulations**
            
📋 **Key Air Force Orders (AFOs):**
• AFO 01/2023 - Personnel Management Guidelines
• AFO 15/2022 - Training & Development Standards
• AFO 08/2023 - Medical Fitness Requirements
• AFO 22/2022 - Leave & Attendance Rules

📖 **Important Manuals:**
• Air Force Manual (Part I) - Service Conditions
• Air Force Manual (Part II) - Discipline & Court Martial
• Flying Training Manual - Operational Procedures
• Technical Training Manual - Equipment Handling

🔍 **Recent Updates:**
• New fitness standards effective Jan 2024
• Updated leave encashment rules
• Revised promotion criteria for technical branches
• Enhanced family welfare schemes

💡 **Quick Access:**
• Policy documents available on IAF intranet
• Contact Station Admin Officer for clarifications
• Regular updates through Station Orders"""
        else:
            response = """**IAF Policies (Personnel View)**
            
📋 **Relevant Policies:**
• Service conditions and entitlements
• Leave rules and procedures
• Medical benefits and coverage
• Family welfare schemes

📞 **For Detailed Information:**
• Contact your Unit Admin Officer
• Visit Station Personnel Section
• Check IAF official website
• Refer to your Service Record"""
            
        return response
        
    def _handle_leave_management(self, message):
        """Handle leave and attendance queries"""
        response = f"""**Leave Management System**
        
🏖️ **Leave Types & Entitlements:**
• **Earned Leave**: 30 days per year (max accumulation: 300 days)
• **Casual Leave**: 8 days per year (non-accumulative)
• **Sick Leave**: As per medical requirements
• **Maternity Leave**: 180 days (female personnel)
• **Paternity Leave**: 15 days (male personnel)

📅 **Current Leave Status:**
• Available Earned Leave: 25 days
• Casual Leave Balance: 6 days
• Last Leave Taken: Dec 2023 (7 days)

✈️ **Special Leave Categories:**
• **Study Leave**: For approved courses
• **Extraordinary Leave**: Without pay (max 2 years)
• **Commuted Leave**: Half pay (medical grounds)
• **Terminal Leave**: Before retirement/resignation

📝 **Application Process:**
• Submit Form IAF-1004 to Unit Admin
• Get approval from Commanding Officer
• Minimum 7 days advance notice (except emergency)
• Medical certificate required for sick leave > 3 days

🎯 **Pro Tips:**
• Plan annual leave in advance
• Coordinate with unit operational requirements
• Keep leave balance updated in service record
• Use casual leave for short-term requirements"""
        
        return response
        
    def _handle_posting_transfer(self, message):
        """Handle posting and transfer queries"""
        if self.current_user_role in ['commander', 'hr_manager']:
            response = """**Posting & Transfer Management**
            
🏢 **Posting Cycle Information:**
• **Flying Branch**: 3-4 years per station
• **Technical Branch**: 4-5 years per station
• **Administrative**: 3-4 years per station
• **Medical Branch**: 3-5 years per station

📍 **Current Posting Trends:**
• 45% personnel due for posting in next 6 months
• Priority postings: Border areas, operational units
• Family stations: Limited availability
• Hardship areas: Additional allowances applicable

🎯 **Posting Preferences:**
• Submit preferences through proper channel
• Consider operational requirements
• Family welfare and children's education
• Medical grounds (if applicable)

📋 **Transfer Process:**
• Posting orders issued by Air HQ
• 30 days notice period (normal)
• 15 days for operational urgency
• Joining time as per distance

💰 **Entitlements:**
• Transfer Grant (TA/DA)
• Packing & forwarding of household goods
• Temporary accommodation
• Children's education allowance"""
        else:
            response = """**Your Posting Information**
            
📍 **Current Posting Details:**
• Station: Air Force Station Gwalior
• Posted Since: Jan 2022
• Tenure Completed: 2 years 8 months
• Next Posting Due: Jun 2025 (approx)

📝 **Posting Preferences:**
• Submit preferences by Dec 2024
• Consider family requirements
• Operational commitments
• Career development opportunities

🏠 **Family Considerations:**
• Children's schooling continuity
• Spouse employment opportunities
• Medical facilities availability
• Accommodation type preference

📞 **Contact Points:**
• Unit Personnel Officer for queries
• Air HQ (Personnel) for policy matters
• Station Family Welfare Centre for support"""
            
        return response
        
    def _handle_pay_allowances(self, message):
        """Handle pay and allowances queries"""
        response = f"""**Pay & Allowances Information**
        
💰 **Current Pay Structure (7th CPC):**
• **Basic Pay**: As per pay matrix level
• **Dearness Allowance**: 46% of basic pay (current rate)
• **House Rent Allowance**: 8%/16%/24% (based on city classification)
• **Transport Allowance**: ₹3,600-7,200 per month

✈️ **IAF Specific Allowances:**
• **Flying Pay**: ₹25,000/month (Flying Officers)
• **Technical Pay**: ₹15,000/month (Technical Officers)
• **Parachute Jump Pay**: ₹3,000/month
• **High Altitude Allowance**: ₹3,400/month
• **Siachen Allowance**: ₹42,500/month

🏔️ **Field/Hardship Allowances:**
• **Field Area**: 16.67% of basic pay
• **High Altitude**: 25% of basic pay
• **Counter Insurgency**: ₹16,000/month
• **Border Area**: ₹6,000-12,000/month

🎓 **Special Allowances:**
• **Children Education**: ₹2,250/month per child
• **Hostel Subsidy**: ₹6,750/month per child
• **Uniform Allowance**: ₹20,000/year
• **Washing Allowance**: ₹3,500/month

📊 **Deductions:**
• **Income Tax**: As per IT rules
• **Professional Tax**: State-wise
• **Group Insurance**: ₹2,400/year
• **AFPP Fund**: Voluntary contribution

💳 **Payment Schedule:**
• Salary credited by 1st of every month
• Arrears processed within 30 days
• Annual increment on 1st July
• Bonus paid before Dussehra"""
        
        return response
        
    def _handle_equipment_aircraft(self, message):
        """Handle equipment and aircraft queries"""
        if self.current_user_role in ['commander', 'training_officer']:
            response = """**IAF Equipment & Aircraft Inventory**
            
🛩️ **Fighter Aircraft Fleet:**
• **Sukhoi Su-30MKI**: 272 aircraft (Multi-role fighter)
• **Mirage 2000**: 49 aircraft (Multi-role fighter)
• **MiG-29**: 69 aircraft (Air superiority fighter)
• **Jaguar**: 139 aircraft (Ground attack)
• **Tejas LCA**: 40+ aircraft (Light combat aircraft)

🚁 **Helicopter Fleet:**
• **Mi-17**: 139 helicopters (Medium lift)
• **Mi-26**: 4 helicopters (Heavy lift)
• **Chetak**: 159 helicopters (Light utility)
• **Cheetah**: 95 helicopters (Light utility)
• **Apache AH-64E**: 22 helicopters (Attack)

✈️ **Transport Aircraft:**
• **C-130J Super Hercules**: 12 aircraft
• **C-17 Globemaster III**: 11 aircraft
• **An-32**: 104 aircraft
• **Dornier Do-228**: 41 aircraft
• **Boeing 737**: 6 aircraft (VIP transport)

🎯 **Operational Status:**
• **Serviceability Rate**: 75% (target: 80%)
• **Flying Hours**: 180-200 hours/year per pilot
• **Maintenance Schedule**: Preventive & corrective
• **Upgrade Programs**: Ongoing modernization

🔧 **Maintenance Priorities:**
• Engine overhaul schedules
• Avionics upgrades
• Structural inspections
• Component life monitoring"""
        else:
            response = """**Equipment Information (General)**
            
🛩️ **Aircraft You May Work With:**
• Multi-role fighters for air defense
• Transport aircraft for logistics
• Helicopters for utility operations
• Training aircraft for skill development

🔧 **Equipment Categories:**
• **Avionics Systems**: Navigation, communication
• **Ground Support**: Maintenance equipment
• **Safety Gear**: Personal protective equipment
• **Technical Tools**: Specialized instruments

📚 **Training Requirements:**
• Type-specific training mandatory
• Regular refresher courses
• Safety protocols compliance
• Technical manual updates

📞 **Technical Support:**
• Contact Squadron Technical Officer
• Refer to aircraft technical manuals
• Follow maintenance schedules
• Report defects immediately"""
            
        return response
        
    def get_conversation_summary(self):
        """Get conversation history summary"""
        if not self.conversation_history:
            return "No conversation history available."
            
        summary = f"**Conversation Summary for {self.current_user_role.title()}**\n\n"
        
        for entry in self.conversation_history[-10:]:  # Last 10 entries
            timestamp = entry['timestamp'].strftime("%H:%M")
            if entry['type'] == 'user':
                summary += f"🗣️ [{timestamp}] You: {entry['message']}\n"
            else:
                summary += f"🤖 [{timestamp}] Assistant: {entry['message'][:100]}...\n"
                
        return summary
        
    def clear_conversation(self):
        """Clear conversation history"""
        self.conversation_history = []
        return "Conversation history cleared."

# API endpoints for integration
class ChatbotAPI:
    def __init__(self):
        self.chatbot = IAFChatbot()
        
    def set_user_role(self, role, user_id=None):
        """Set user role for the session"""
        success, message = self.chatbot.set_user_context(role, user_id)
        return {'success': success, 'message': message}
        
    def send_message(self, message):
        """Send message to chatbot"""
        response = self.chatbot.process_message(message)
        return {'response': response}
        
    def get_conversation_history(self):
        """Get conversation history"""
        return {'history': self.chatbot.conversation_history}
        
    def clear_conversation(self):
        """Clear conversation"""
        message = self.chatbot.clear_conversation()
        return {'message': message}

if __name__ == "__main__":
    # Test the chatbot
    chatbot = IAFChatbot()
    
    # Test different roles
    roles = ['commander', 'hr_manager', 'medical_officer', 'training_officer', 'personnel']
    
    for role in roles:
        print(f"\n=== Testing {role.upper()} Role ===")
        chatbot.set_user_context(role)
        
        # Test queries
        test_queries = [
            "Show me attrition risk analysis",
            "What's the readiness status?",
            "I need career guidance",
            "Recommend training programs"
        ]
        
        for query in test_queries:
            print(f"\nQuery: {query}")
            response = chatbot.process_message(query)
            print(f"Response: {response[:200]}...")