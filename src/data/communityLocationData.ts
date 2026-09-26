// Master data lists for Jain Vivah dropdowns, filters, and validation
// Note: These are lookup catalogues and do NOT contain fake profiles.

export const MADHYA_PRADESH_CITIES = [
  'Sagar',
  'Damoh',
  'Jabalpur',
  'Bhopal',
  'Indore',
  'Ujjain',
  'Vidisha',
  'Chhatarpur',
  'Tikamgarh',
  'Narsinghpur',
  'Gwalior',
  'Bina',
  'Lalitpur / Bundelkhand Border',
  'Katni',
  'Satna',
  'Panna',
  'Rewa',
  'Khargone',
  'Khandwa',
  'Ratlam',
  'Mandsaur',
  'Neemuch',
  'Dewas',
  'Sehore',
  'Hoshangabad / Narmadapuram',
  'Itarsi',
  'Betul',
  'Guna',
  'Ashoknagar',
  'Shivpuri',
  'Datia',
  'Bhind',
  'Morena',
  'Seoni',
  'Balaghat',
  'Chhindwara',
  'Mandla',
  'Dindori',
  'Umaria',
  'Shahdol',
  'Anuppur',
  'Sidhi',
  'Singrauli',
  'Raisen',
  'Rajgarh',
  'Shajapur',
  'Agar Malwa',
  'Alirajpur',
  'Jhabua',
  'Dhar',
  'Barwani',
  'Burhanpur',
  'Harda',
  'Sheopur'
];

export const OTHER_MAJOR_INDIAN_CITIES = [
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Nashik', state: 'Maharashtra' },
  { city: 'Aurangabad / Chhatrapati Sambhajinagar', state: 'Maharashtra' },
  { city: 'Kolhapur', state: 'Maharashtra' },
  { city: 'Solapur', state: 'Maharashtra' },
  { city: 'Delhi NCR', state: 'Delhi' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Udaipur', state: 'Rajasthan' },
  { city: 'Jodhpur', state: 'Rajasthan' },
  { city: 'Kota', state: 'Rajasthan' },
  { city: 'Ajmer', state: 'Rajasthan' },
  { city: 'Bhilwara', state: 'Rajasthan' },
  { city: 'Bikaner', state: 'Rajasthan' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Surat', state: 'Gujarat' },
  { city: 'Vadodara', state: 'Gujarat' },
  { city: 'Rajkot', state: 'Gujarat' },
  { city: 'Bhavnagar', state: 'Gujarat' },
  { city: 'Lalitpur', state: 'Uttar Pradesh' },
  { city: 'Jhansi', state: 'Uttar Pradesh' },
  { city: 'Agra', state: 'Uttar Pradesh' },
  { city: 'Kanpur', state: 'Uttar Pradesh' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Hubli', state: 'Karnataka' },
  { city: 'Belagavi', state: 'Karnataka' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Raipur', state: 'Chhattisgarh' },
  { city: 'Bilaspur', state: 'Chhattisgarh' },
  { city: 'Durg-Bhilai', state: 'Chhattisgarh' }
];

export const JAIN_COMMUNITIES = [
  { id: 'golapurv', labelEn: 'Golapurv (गोलापूर्व)', labelHi: 'गोलापूर्व दिगंबर जैन', category: 'Digambar' },
  { id: 'parwar', labelEn: 'Parwar (परवार)', labelHi: 'परवार दिगंबर जैन', category: 'Digambar' },
  { id: 'khandelwal', labelEn: 'Khandelwal (खंडेलवाल)', labelHi: 'खंडेलवाल दिगंबर जैन', category: 'Digambar' },
  { id: 'oswal', labelEn: 'Oswal (ओसवाल)', labelHi: 'ओसवाल जैन', category: 'Swetambar / Digambar' },
  { id: 'porwal', labelEn: 'Porwal / Podwal (पोड़वाल)', labelHi: 'पोड़वाल जैन', category: 'Digambar / Swetambar' },
  { id: 'humad', labelEn: 'Humad (हुम्मड़)', labelHi: 'हुम्मड़ दिगंबर जैन', category: 'Digambar' },
  { id: 'saitwal', labelEn: 'Saitwal (सैतवाल)', labelHi: 'सैतवाल दिगंबर जैन', category: 'Digambar' },
  { id: 'jaiswal', labelEn: 'Jaiswal (जायसवाल)', labelHi: 'जायसवाल दिगंबर जैन', category: 'Digambar' },
  { id: 'agarwal_jain', labelEn: 'Agarwal Jain (अग्रवाल जैन)', labelHi: 'अग्रवाल दिगंबर जैन', category: 'Digambar' },
  { id: 'shrimal', labelEn: 'Shrimal (श्रीमाल)', labelHi: 'श्रीमाल श्वेतांबर जैन', category: 'Swetambar' },
  { id: 'bhavsar', labelEn: 'Bhavsar Jain', labelHi: 'भावसार जैन', category: 'Digambar' },
  { id: 'other_jain', labelEn: 'Other Jain Sub-caste (अन्य जैन उपजाति)', labelHi: 'अन्य जैन उपजाति', category: 'General' }
];

export const JAIN_GOTRAS = [
  'Gautam (गौतम)',
  'Kashyap (कश्यप)',
  'Vatsa (वत्स)',
  'Shandilya (शांडिल्य)',
  'Bharadwaj (भारद्वाज)',
  'Parashar (पाराशर)',
  'Garg (गर्ग)',
  'Koushik (कौशिक)',
  'Vashishtha (वशिष्ठ)',
  'Agastya (अगस्त्य)',
  'Upamanyu (उपमन्यु)',
  'Katyayan (कात्यायन)',
  'Harita (हारीत)',
  'Jamadagni (जमदग्नि)',
  'Atri (अत्रि)',
  'Vishwamitra (विश्वामित्र)',
  'Mudgal (मुद्गल)',
  'Angiras (अंगिरस)',
  'Other / Don’t Know (अन्य / ज्ञात नहीं)'
];

export const EDUCATION_LEVELS = [
  'B.Tech / B.E. / Engineering',
  'M.Tech / M.E. / M.S.',
  'Chartered Accountant (CA)',
  'MBBS / M.D. / M.S. / Medical Specialist',
  'BDS / MDS (Dental)',
  'MBA / PGDM (Finance, Marketing, HR, Ops)',
  'Civil Services / MPPSC / UPSC Officer',
  'MCA / BCA / Computer Applications',
  'B.Arch / M.Arch (Architecture)',
  'Law (LLB / LLM / Advocate)',
  'B.Pharma / M.Pharma',
  'Post Graduate (M.Sc, M.Com, M.A.)',
  'Graduate (B.Com, B.Sc, B.A., BBA)',
  'Ph.D. / Doctorate / Researcher',
  'Higher Secondary / Diploma',
  'Other Professional Degree'
];

export const OCCUPATIONS = [
  'Software Engineer / IT Professional',
  'Chartered Accountant / Financial Consultant',
  'Doctor / Medical Specialist',
  'Government Officer (State / Central)',
  'Bank Officer / Manager',
  'Established Business / Industrialist',
  'Grain / Mandi / Agro Commodity Merchant',
  'Jewelry / Gemstone Business',
  'Civil Engineer / Builder / Developer',
  'Lawyer / Legal Advisor',
  'Professor / Lecturer / Teacher',
  'Architect / Interior Designer',
  'Pharma / Medicine Wholesale / Retail',
  'Executive / Corporate Manager',
  'Self Employed Professional',
  'Other Business / Service'
];

// Server-side / helper DOB to Age calculation
export function calculateAgeFromDob(dobString: string): number {
  if (!dobString) return 0;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return 0;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}
