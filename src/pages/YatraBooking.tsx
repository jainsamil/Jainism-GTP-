import JainYatraDashboard from '../components/travel/JainYatraDashboard';

export interface SanghYatra {
  id: string;
  title: string;
  organizer: string;
  destination: string;
  startDate: string;
  durationDays: number;
  modeOfTransport: string;
  foodType: string;
  totalSeats: number;
  bookedSeats: number;
  pricePerYatrik: number;
  imageUrl: string;
  pickupCities: string[];
  description: string;
  contactNo: string;
}

export default function YatraBookingPage() {
  return <JainYatraDashboard />;
}
