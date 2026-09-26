import { FlightSearchResult } from './types';
import { isDemoModeEnabled, LIVE_DATA_UNAVAILABLE_MESSAGES } from './apiConfig';

export interface FlightSearchParams {
  tripType: 'oneWay' | 'roundTrip';
  fromAirport: string;
  toAirport: string;
  departDate: string;
  returnDate?: string;
  passengers?: number;
  cabinClass?: string;
}

const DEMO_FLIGHTS: FlightSearchResult[] = [
  {
    id: 'fl_601',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-2041',
    fromAirportCode: 'DEL',
    fromAirportName: 'Indira Gandhi Int Airport, Delhi',
    toAirportCode: 'DGH',
    toAirportName: 'Deoghar Airport (Shikharji Link)',
    departureTime: '11:15',
    arrivalTime: '13:00',
    duration: '1h 45m',
    stops: 0,
    fare: 4850,
    cabinClass: 'Economy',
    baggage: '15 Kg Check-in + 7 Kg Cabin',
    jainMealAvailable: true,
    nearTirth: 'Shree Sammed Shikharji (1.5 hr drive from Deoghar Airport)',
    isDemo: true,
  },
  {
    id: 'fl_602',
    airline: 'Air India Express',
    airlineCode: 'IX',
    flightNumber: 'IX-782',
    fromAirportCode: 'BOM',
    fromAirportName: 'Chhatrapati Shivaji Maharaj Int Airport, Mumbai',
    toAirportCode: 'IXR',
    toAirportName: 'Birsa Munda Airport, Ranchi',
    departureTime: '06:40',
    arrivalTime: '09:05',
    duration: '2h 25m',
    stops: 0,
    fare: 6200,
    cabinClass: 'Economy',
    baggage: '15 Kg Check-in + 7 Kg Cabin',
    jainMealAvailable: true,
    nearTirth: 'Shree Sammed Shikharji (3.5 hr taxi from Ranchi Airport)',
    isDemo: true,
  },
  {
    id: 'fl_603',
    airline: 'SpiceJet',
    airlineCode: 'SG',
    flightNumber: 'SG-3012',
    fromAirportCode: 'BOM',
    fromAirportName: 'Mumbai (BOM)',
    toAirportCode: 'BHU',
    toAirportName: 'Bhavnagar Airport (Palitana Gateway)',
    departureTime: '08:20',
    arrivalTime: '09:30',
    duration: '1h 10m',
    stops: 0,
    fare: 3950,
    cabinClass: 'Economy',
    baggage: '15 Kg Check-in + 7 Kg Cabin',
    jainMealAvailable: true,
    nearTirth: 'Shree Shatrunjay Mahateerth Palitana (45 min drive)',
    isDemo: true,
  },
  {
    id: 'fl_604',
    airline: 'IndiGo',
    airlineCode: '6E',
    flightNumber: '6E-458',
    fromAirportCode: 'DEL',
    fromAirportName: 'Delhi (DEL)',
    toAirportCode: 'UDR',
    toAirportName: 'Maharana Pratap Airport, Udaipur',
    departureTime: '14:10',
    arrivalTime: '15:35',
    duration: '1h 25m',
    stops: 0,
    fare: 4200,
    cabinClass: 'Economy',
    baggage: '15 Kg Check-in + 7 Kg Cabin',
    jainMealAvailable: true,
    nearTirth: 'Ranakpur Chaumukha & Delwara Abu Tirth',
    isDemo: true,
  },
  {
    id: 'fl_605',
    airline: 'Air India',
    airlineCode: 'AI',
    flightNumber: 'AI-635',
    fromAirportCode: 'DEL',
    fromAirportName: 'Delhi (DEL)',
    toAirportCode: 'IDR',
    toAirportName: 'Devi Ahilya Bai Holkar Airport, Indore',
    departureTime: '17:00',
    arrivalTime: '18:25',
    duration: '1h 25m',
    stops: 0,
    fare: 3800,
    cabinClass: 'Economy',
    baggage: '20 Kg Check-in + 7 Kg Cabin',
    jainMealAvailable: true,
    nearTirth: 'Gommatgiri, Mohankheda & Pushpagiri',
    isDemo: true,
  }
];

export const flightService = {
  async searchFlights(params: FlightSearchParams): Promise<{
    results: FlightSearchResult[];
    isDemo: boolean;
    message?: string;
  }> {
    const isDemo = isDemoModeEnabled();

    if (!isDemo) {
      return {
        results: [],
        isDemo: false,
        message: LIVE_DATA_UNAVAILABLE_MESSAGES.flight
      };
    }

    let filtered = DEMO_FLIGHTS;
    if (params.fromAirport && params.toAirport) {
      const f = params.fromAirport.toLowerCase();
      const t = params.toAirport.toLowerCase();
      const matches = DEMO_FLIGHTS.filter(fl => 
        (fl.fromAirportCode.toLowerCase().includes(f) || fl.fromAirportName.toLowerCase().includes(f)) &&
        (fl.toAirportCode.toLowerCase().includes(t) || fl.toAirportName.toLowerCase().includes(t) || (fl.nearTirth && fl.nearTirth.toLowerCase().includes(t)))
      );
      if (matches.length > 0) {
        filtered = matches;
      }
    }

    return {
      results: filtered,
      isDemo: true,
      message: 'Demo Data — Not Live (Simulated Airline Schedules & Fares)'
    };
  }
};
