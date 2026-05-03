export interface HistoryItem {
  id: string;
  title: { en: string; hi: string };
  content: { en: string; hi: string };
  imageUrl?: string;
}

export const historyData: HistoryItem[] = [
  {
    id: '1',
    title: { en: 'Sravanabelagola', hi: 'श्रवणबेलगोला' },
    content: {
      en: 'A historic town in Karnataka, home to the 57-foot Gommateshwara statue, one of the most important Jain pilgrimage sites.',
      hi: 'कर्नाटक का एक ऐतिहासिक शहर, जहाँ 57 फीट की गोमतेश्वर प्रतिमा है, जो सबसे महत्वपूर्ण जैन तीर्थ स्थलों में से एक है।'
    },
    imageUrl: 'https://picsum.photos/seed/sravanabelagola/800/600'
  },
  {
    id: '2',
    title: { en: 'Chandragupta Maurya', hi: 'चंद्रगुप्त मौर्य' },
    content: {
      en: 'The founder of the Maurya Empire who became a Jain monk in his later years and spent his final days in Sravanabelagola.',
      hi: 'मौर्य साम्राज्य के संस्थापक जो अपने अंतिम वर्षों में जैन भिक्षु बन गए और अपने अंतिम दिन श्रवणबेलगोला में बिताए।'
    }
  }
];
