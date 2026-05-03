export interface FestivalItem {
  id: string;
  name: { en: string; hi: string };
  date: { en: string; hi: string };
  details: { en: string; hi: string };
}

export const festivalData: FestivalItem[] = [
  {
    id: '1',
    name: { en: 'Paryushana Parva', hi: 'पर्युषण पर्व' },
    date: { en: 'August/September', hi: 'अगस्त/सितंबर' },
    details: {
      en: 'The most important annual holy event for Jains, focused on repentance, forgiveness, and spiritual purification.',
      hi: 'जैनों के लिए सबसे महत्वपूर्ण वार्षिक पवित्र आयोजन, जो पश्चाताप, क्षमा और आध्यात्मिक शुद्धि पर केंद्रित है।'
    }
  },
  {
    id: '2',
    name: { en: 'Mahavir Janma Kalyanak', hi: 'महावीर जन्म कल्याणक' },
    date: { en: 'March/April', hi: 'मार्च/अप्रैल' },
    details: {
      en: 'The birth anniversary of Lord Mahavira, celebrated with grand processions and religious activities.',
      hi: 'भगवान महावीर की जयंती, जिसे भव्य जुलूसों और धार्मिक गतिविधियों के साथ मनाया जाता है।'
    }
  }
];
