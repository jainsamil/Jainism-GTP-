import { MatrimonialProfile } from '../pages/Matrimonial';

// Real Male Portrait Images for Golapurv Boys
const MALE_PHOTOS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1480429370139-e0132c086e2a?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&q=80&w=400'
];

// Real Female Portrait Images for Golapurv Girls
const FEMALE_PHOTOS = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400'
];

const GOTRA_LIST = [
  'Gautam (गोत्र)', 'Kashyap (गोत्र)', 'Vatsa (गोत्र)', 'Shandilya (गोत्र)', 
  'Bharadwaj (गोत्र)', 'Parashar (गोत्र)', 'Garg (गोत्र)', 'Koushik (गोत्र)', 
  'Vashishtha (गोत्र)', 'Agastya (गोत्र)', 'Upamanyu (गोत्र)', 'Katyayan (गोत्र)', 
  'Harita (गोत्र)', 'Jamadagni (गोत्र)', 'Atri (गोत्र)', 'Vishwamitra (गोत्र)'
];

const CITIES = [
  { city: 'Sagar', state: 'Madhya Pradesh' },
  { city: 'Jabalpur', state: 'Madhya Pradesh' },
  { city: 'Damoh', state: 'Madhya Pradesh' },
  { city: 'Chhatarpur', state: 'Madhya Pradesh' },
  { city: 'Tikamgarh', state: 'Madhya Pradesh' },
  { city: 'Jhansi', state: 'Uttar Pradesh' },
  { city: 'Lalitpur', state: 'Uttar Pradesh' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Kanpur', state: 'Uttar Pradesh' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Gwalior', state: 'Madhya Pradesh' },
  { city: 'Khajuraho', state: 'Madhya Pradesh' },
  { city: 'Panna', state: 'Madhya Pradesh' },
  { city: 'Satna', state: 'Madhya Pradesh' },
  { city: 'Katni', state: 'Madhya Pradesh' },
  { city: 'Bina', state: 'Madhya Pradesh' },
  { city: 'Vidisha', state: 'Madhya Pradesh' },
  { city: 'Delhi NCR', state: 'Delhi' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Bangalore', state: 'Karnataka' }
];

const BOY_FIRST_NAMES = [
  'Rishabh', 'Arpit', 'Shubham', 'Samyak', 'Harsh', 'Tanmay', 'Sarthak', 'Mohit', 'Naman', 
  'Piyush', 'Yash', 'Ronak', 'Ayush', 'Akshat', 'Pranjal', 'Ankit', 'Siddharth', 'Tushar', 
  'Varun', 'Aditya', 'Chetan', 'Aman', 'Pratyush', 'Divyansh', 'Shreyansh', 'Sourabh', 
  'Jinendra', 'Devansh', 'Mayank', 'Abhishek', 'Himanshu', 'Rahul', 'Parth', 'Utkarsh', 
  'Pulkit', 'Chirag', 'Bhavya', 'Deep', 'Jainam', 'Anurag', 'Anuj', 'Ashish', 'Bhavesh', 
  'Deepak', 'Gourav', 'Hemant', 'Ishan', 'Kshitij', 'Lokesh', 'Madhav', 'Neeraj', 'Om', 
  'Pradeep', 'Rohan', 'Sachin', 'Tarun', 'Udit', 'Vikas', 'Vivek', 'Yashwant', 'Alok'
];

const GIRL_FIRST_NAMES = [
  'Ananya', 'Sakshi', 'Pragya', 'Palak', 'Astha', 'Muskan', 'Saloni', 'Devanshi', 'Riya', 
  'Sneha', 'Tanvi', 'Khushi', 'Shreya', 'Divya', 'Mansi', 'Vidhi', 'Priyanka', 'Isha', 
  'Radhika', 'Pooja', 'Garima', 'Nancy', 'Shruti', 'Mehak', 'Drishti', 'Vanshika', 'Nishi', 
  'Arpita', 'Akanksha', 'Ishika', 'Kriti', 'Shikha', 'Mahi', 'Chetna', 'Sanjana', 'Sonam', 
  'Anusha', 'Paridhi', 'Soniya', 'Swati', 'Avani', 'Bhavna', 'Chhavi', 'Deepali', 'Ekta', 
  'Harshita', 'Ishani', 'Janki', 'Juhi', 'Kajal', 'Lavanya', 'Neha', 'Payal', 'Reena', 
  'Richa', 'Seema', 'Teena', 'Urvashi', 'Vanya', 'Yashasvi'
];

const BOY_CAREERS = [
  { edu: 'B.Tech CS (IIT Bombay) & M.S. Software', prof: 'Senior Software Engineer at Google', inc: '₹36 LPA' },
  { edu: 'M.D. Pediatrics (AIIMS New Delhi)', prof: 'Pediatric Specialist Consultant', inc: '₹32 LPA' },
  { edu: 'Chartered Accountant (CA First Attempt)', prof: 'Senior Audit Manager at EY', inc: '₹24 LPA' },
  { edu: 'MPPSC Selected Officer', prof: 'State Tax Officer / Commercial Tax Dept', inc: '₹18 LPA' },
  { edu: 'B.E. Civil & M.Tech Construction', prof: 'Government PWD Executive Engineer', inc: '₹22 LPA' },
  { edu: 'B.Pharma & MBA Healthcare', prof: 'Pharma Wholesale & Distribution Director', inc: '₹28 LPA' },
  { edu: 'MBA Finance (IIM Indore)', prof: 'Assistant Vice President - HDFC Bank', inc: '₹30 LPA' },
  { edu: 'B.Com (Hons) & Law', prof: 'High Court Advocate & Legal Advisor', inc: '₹20 LPA' },
  { edu: 'B.Tech IT (NIT Bhopal)', prof: 'Lead Full Stack Engineer at Amazon', inc: '₹38 LPA' },
  { edu: 'B.Sc Agriculture & M.Sc', prof: 'Agro Seeds & Fertilizer Business Owner', inc: '₹25 LPA' },
  { edu: 'B.Arch (SPA Delhi)', prof: 'Principal Architect & Town Planner', inc: '₹26 LPA' },
  { edu: 'M.Sc Data Science', prof: 'Data Science Specialist at Microsoft', inc: '₹34 LPA' }
];

const GIRL_CAREERS = [
  { edu: 'Chartered Accountant (CA) & B.Com (Hons)', prof: 'Senior Financial Consultant at PwC', inc: '₹22 LPA' },
  { edu: 'M.D. Dermatology (Gold Medalist)', prof: 'Dermatologist Consultant & Clinic Owner', inc: '₹30 LPA' },
  { edu: 'B.Tech Computer Science', prof: 'Software Engineer at TCS Digital', inc: '₹18 LPA' },
  { edu: 'B.D.S. Dental Surgeon', prof: 'Dental Surgeon & Private Practitioner', inc: '₹16 LPA' },
  { edu: 'M.Sc Mathematics & B.Ed', prof: 'Assistant Professor at Govt PG College', inc: '₹14 LPA' },
  { edu: 'MBA Human Resources', prof: 'Senior HR Manager at Infosys', inc: '₹20 LPA' },
  { edu: 'M.Pharm & Biotechnology', prof: 'Quality Assurance Lead at Sun Pharma', inc: '₹19 LPA' },
  { edu: 'B.Arch Architect', prof: 'Senior Interior Architect', inc: '₹21 LPA' },
  { edu: 'M.A. English Literature & B.Ed', prof: 'Lecturer at Higher Secondary School', inc: '₹12 LPA' },
  { edu: 'B.Tech IT (RGPV)', prof: 'Senior QA Automation Engineer at Wipro', inc: '₹17 LPA' },
  { edu: 'B.Com & Fashion Design', prof: 'Boutique Owner & Designer', inc: '₹15 LPA' },
  { edu: 'M.Sc Clinical Nutrition', prof: 'Chief Dietitian & Wellness Consultant', inc: '₹16 LPA' }
];

const FATHER_JOBS = [
  'Established Grain & Agro Business Owner in Mandi',
  'Senior Government Officer in State PWD Dept',
  'Renowned Physician & Nursing Home Director',
  'Jewelry & Gemstone Business Owner',
  'Building Construction Contractor & Developer',
  'Pharma & Wholesale Medicine Distributor',
  'Retired Bank Branch Manager (SBI)',
  'Lecturer / Principal in Higher Secondary School',
  'Electricals & Hardware Showroom Owner',
  'High Court Senior Advocate'
];

const MOTHER_JOBS = [
  'Homemaker (Active in Jinendra Mahila Mandal)',
  'Post Graduate College Lecturer',
  'High School Senior Teacher',
  'Swaadhyaayi Homemaker (Observes Chovisi)',
  'Social Worker & Jain Trust Committee Member',
  'Government School Principal',
  'Boutique Owner & Fashion Designer'
];

// Helper to generate Boys Profiles (ages 18 to 30)
export function generateGolapurvBoys(count = 310): MatrimonialProfile[] {
  const list: MatrimonialProfile[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = BOY_FIRST_NAMES[(i - 1) % BOY_FIRST_NAMES.length];
    const cityObj = CITIES[i % CITIES.length];
    const gotra = GOTRA_LIST[i % GOTRA_LIST.length];
    const career = BOY_CAREERS[i % BOY_CAREERS.length];
    const photo = MALE_PHOTOS[i % MALE_PHOTOS.length];
    const father = FATHER_JOBS[i % FATHER_JOBS.length];
    const mother = MOTHER_JOBS[i % MOTHER_JOBS.length];

    // Age strictly between 18 and 30
    const age = 18 + ((i * 3 + 2) % 13); // ranges from 18 to 30
    const heightFt = 5;
    const heightInches = 6 + (i % 7); // 5'6" to 6'0"
    const score = 30 + (i % 7); // 30 to 36

    list.push({
      id: `golapurv_boy_${i}`,
      fullName: `${firstName} Jain (Golapurv)`,
      gender: 'male',
      age,
      height: `${heightFt}'${heightInches}"`,
      sampraday: 'Digambar',
      subCategory: 'Golapurv (गोलापूर्व)',
      gotra,
      maritalStatus: 'Never Married',
      education: career.edu,
      profession: career.prof,
      annualIncome: career.inc,
      city: cityObj.city,
      state: cityObj.state,
      country: 'India',
      contactPhone: `+91 94${Math.floor(10000000 + (i * 1234567) % 89999999)}`,
      contactEmail: `${firstName.toLowerCase()}.golapurv${i}@gmail.com`,
      photoUrl: photo,
      bio: `Respected Digambar Jain Golapurv family from ${cityObj.city} (${cityObj.state}). Deeply rooted in Jain values, observes daily Dev Darshan & Sunset Chovisi. Looking for a cultured Jain bride.`,
      dietaryHabit: 'Pure Jain (Sunset Chovisi)',
      dailyRituals: 'Daily Dev Darshan, Jinendra Abhishek & Swadhyay',
      manglik: i % 7 === 0 ? 'Partial / Anshik' : 'No',
      gunaMatchScore: score,
      gunaBreakdown: {
        varna: '1/1 Uttam Varna',
        vashya: '2/2 Full Vashya',
        tara: '3/3 Shubha Tara',
        yoni: '4/4 Friend Yoni',
        maitri: '5/5 Graha Maitri',
        gana: '6/6 Dev Gana Match',
        bhakoot: '7/7 Shubha Bhakoot',
        nadi: `${score > 32 ? '8/8' : '6/8'} Nadi Match`
      },
      fatherOccupation: `${father} in ${cityObj.city}`,
      motherOccupation: mother,
      siblings: i % 2 === 0 ? '1 Younger Sister' : '1 Elder Brother (Married)',
      verifiedTrust: true,
      isConfidential: i % 10 === 0
    });
  }

  return list;
}

// Helper to generate Girls Profiles (ages 18 to 30)
export function generateGolapurvGirls(count = 310): MatrimonialProfile[] {
  const list: MatrimonialProfile[] = [];

  for (let i = 1; i <= count; i++) {
    const firstName = GIRL_FIRST_NAMES[(i - 1) % GIRL_FIRST_NAMES.length];
    const cityObj = CITIES[(i + 5) % CITIES.length];
    const gotra = GOTRA_LIST[(i + 3) % GOTRA_LIST.length];
    const career = GIRL_CAREERS[i % GIRL_CAREERS.length];
    const photo = FEMALE_PHOTOS[i % FEMALE_PHOTOS.length];
    const father = FATHER_JOBS[(i + 2) % FATHER_JOBS.length];
    const mother = MOTHER_JOBS[(i + 1) % MOTHER_JOBS.length];

    // Age strictly between 18 and 30
    const age = 18 + ((i * 2 + 1) % 13); // ranges from 18 to 30
    const heightFt = 5;
    const heightInches = 1 + (i % 7); // 5'1" to 5'7"
    const score = 31 + (i % 6); // 31 to 36

    list.push({
      id: `golapurv_girl_${i}`,
      fullName: `${firstName} Jain (Golapurv)`,
      gender: 'female',
      age,
      height: `${heightFt}'${heightInches}"`,
      sampraday: 'Digambar',
      subCategory: 'Golapurv (गोलापूर्व)',
      gotra,
      maritalStatus: 'Never Married',
      education: career.edu,
      profession: career.prof,
      annualIncome: career.inc,
      city: cityObj.city,
      state: cityObj.state,
      country: 'India',
      contactPhone: `+91 98${Math.floor(10000000 + (i * 7654321) % 89999999)}`,
      contactEmail: `${firstName.toLowerCase()}.golapurv${i}@gmail.com`,
      photoUrl: photo,
      bio: `Cultured Digambar Jain Golapurv family from ${cityObj.city} (${cityObj.state}). Values Ahimsa, performs regular Jinendra Stuti, and blends modern education with traditional Jain ethics.`,
      dietaryHabit: 'Pure Jain (Sunset Chovisi)',
      dailyRituals: 'Daily Samayik, Jinendra Stuti & Swadhyay',
      manglik: i % 9 === 0 ? 'Partial / Anshik' : 'No',
      gunaMatchScore: score,
      gunaBreakdown: {
        varna: '1/1 Uttam Varna',
        vashya: '2/2 Full Vashya',
        tara: '3/3 Shubha Tara',
        yoni: '4/4 Friend Yoni',
        maitri: '5/5 Graha Maitri',
        gana: '6/6 Dev Gana Match',
        bhakoot: '7/7 Shubha Bhakoot',
        nadi: `${score > 33 ? '8/8' : '6/8'} Nadi Match`
      },
      fatherOccupation: `${father} in ${cityObj.city}`,
      motherOccupation: mother,
      siblings: i % 3 === 0 ? '1 Elder Brother (M.D. Doctor)' : '1 Younger Sister (Studying)',
      verifiedTrust: true,
      isConfidential: i % 12 === 0
    });
  }

  return list;
}

export const GOLAPURV_BOYS = generateGolapurvBoys(310);
export const GOLAPURV_GIRLS = generateGolapurvGirls(310);
export const ALL_GOLAPURV_PROFILES = [...GOLAPURV_BOYS, ...GOLAPURV_GIRLS];
