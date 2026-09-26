import { BusSearchResult, BusSeat } from './types';
import { isDemoModeEnabled, LIVE_DATA_UNAVAILABLE_MESSAGES } from './apiConfig';

export interface BusSearchParams {
  fromCity: string;
  toCity: string;
  journeyDate: string;
  passengers?: number;
}

const DEMO_BUSES: BusSearchResult[] = [
  {
    id: 'bus_101',
    operatorName: 'Shree Mahavira Travels (Jain Special AC Sleeper)',
    busType: '2+1 BharatBenz Premium AC Sleeper',
    fromCity: 'Indore',
    toCity: 'Sammed Shikharji (Madhuban)',
    boardingPoint: 'Chhotigwaltoli / Pipliyahana Square (17:30)',
    droppingPoint: 'Madhuban Main Bus Stand (10:30 next day)',
    departureTime: '17:30',
    arrivalTime: '10:30',
    duration: '17h 00m',
    totalSeats: 36,
    availableSeats: 14,
    fareStartingFrom: 1850,
    rating: 4.8,
    jainMealFacility: true,
    amenities: ['Chovisi Sunset Dinner Stop', 'Blanket & Pillow', 'Charging Port', 'Emergency SOS', 'Reading Light'],
    nearTirth: 'Sammed Shikharji Mahateerth',
    isDemo: true,
  },
  {
    id: 'bus_102',
    operatorName: 'Anandji Kalyanji Yatra Volvo Lines',
    busType: 'Volvo 9600 Multi-Axle AC Sleeper',
    fromCity: 'Mumbai (Borivali)',
    toCity: 'Palitana (Taleti)',
    boardingPoint: 'Borivali IC Colony / Dadar Swami Narayan (20:30)',
    droppingPoint: 'Palitana Taleti Dharamshala Road (07:30)',
    departureTime: '20:30',
    arrivalTime: '07:30',
    duration: '11h 00m',
    totalSeats: 40,
    availableSeats: 9,
    fareStartingFrom: 1600,
    rating: 4.9,
    jainMealFacility: true,
    amenities: ['Navkarsi Morning Breakfast Stop', 'Free Water Bottle', 'Live GPS Tracking', 'Individual USB Port'],
    nearTirth: 'Shatrunjay Giriraj Palitana',
    isDemo: true,
  },
  {
    id: 'bus_103',
    operatorName: 'Paras Pilgrim Transport',
    busType: 'AC Sleeper 2+1 (Air Suspension)',
    fromCity: 'Ahmedabad (Paldi)',
    toCity: 'Girnarji (Junagadh)',
    boardingPoint: 'Paldi Cross Road / Iscon Cross Road (22:00)',
    droppingPoint: 'Bhavnath Taleti / Junagadh Bypass (06:00)',
    departureTime: '22:00',
    arrivalTime: '06:00',
    duration: '8h 00m',
    totalSeats: 32,
    availableSeats: 18,
    fareStartingFrom: 850,
    rating: 4.7,
    jainMealFacility: true,
    amenities: ['Direct Taleti Drop', 'Luggage Assistance', 'Clean Linens'],
    nearTirth: 'Shree Girnarji Tirth',
    isDemo: true,
  },
  {
    id: 'bus_104',
    operatorName: 'Digambar Tirth Yatra Travels',
    busType: 'Scania Metrolink HD Sleeper',
    fromCity: 'Bhopal',
    toCity: 'Kundalpur / Damoh',
    boardingPoint: 'Habibganj / ISBT Bhopal (21:00)',
    droppingPoint: 'Kundalpur Bade Baba Complex (04:30)',
    departureTime: '21:00',
    arrivalTime: '04:30',
    duration: '7h 30m',
    totalSeats: 36,
    availableSeats: 22,
    fareStartingFrom: 720,
    rating: 4.8,
    jainMealFacility: true,
    amenities: ['Bade Baba Temple Entry Gate Drop', 'Comfort Air-Ride'],
    nearTirth: 'Kundalpur Mahateerth (Bade Baba)',
    isDemo: true,
  }
];

export const busService = {
  async searchBuses(params: BusSearchParams): Promise<{
    results: BusSearchResult[];
    isDemo: boolean;
    message?: string;
  }> {
    const isDemo = isDemoModeEnabled();

    if (!isDemo) {
      return {
        results: [],
        isDemo: false,
        message: LIVE_DATA_UNAVAILABLE_MESSAGES.bus
      };
    }

    let filtered = DEMO_BUSES;
    if (params.fromCity && params.toCity) {
      const f = params.fromCity.toLowerCase();
      const t = params.toCity.toLowerCase();
      const matches = DEMO_BUSES.filter(b => 
        b.fromCity.toLowerCase().includes(f) && 
        (b.toCity.toLowerCase().includes(t) || (b.nearTirth && b.nearTirth.toLowerCase().includes(t)))
      );
      if (matches.length > 0) {
        filtered = matches;
      }
    }

    return {
      results: filtered,
      isDemo: true,
      message: 'Demo Data — Not Live (Simulated Bus Schedules & Fares)'
    };
  },

  generateSeatLayout(busId: string, basePrice: number): { lowerDeck: BusSeat[]; upperDeck: BusSeat[] } {
    const lowerDeck: BusSeat[] = [];
    const upperDeck: BusSeat[] = [];

    // 12 Sleeper Berths Lower Deck (Single Left, Double Right)
    for (let row = 1; row <= 6; row++) {
      // Single Window
      lowerDeck.push({
        seatNo: `L${row}A`,
        deck: 'lower',
        row,
        col: 1,
        type: 'sleeper',
        isAvailable: (row + parseInt(busId.slice(-1) || '1')) % 3 !== 0,
        price: basePrice,
      });
      // Double Aisle & Window
      lowerDeck.push({
        seatNo: `L${row}B`,
        deck: 'lower',
        row,
        col: 2,
        type: 'sleeper',
        isAvailable: row % 2 === 0,
        price: basePrice,
      });
      lowerDeck.push({
        seatNo: `L${row}C`,
        deck: 'lower',
        row,
        col: 3,
        type: 'sleeper',
        isAvailable: (row + 1) % 2 === 0,
        price: basePrice,
      });
    }

    // 12 Sleeper Berths Upper Deck
    for (let row = 1; row <= 6; row++) {
      upperDeck.push({
        seatNo: `U${row}A`,
        deck: 'upper',
        row,
        col: 1,
        type: 'sleeper',
        isAvailable: row !== 1,
        price: basePrice + 100,
      });
      upperDeck.push({
        seatNo: `U${row}B`,
        deck: 'upper',
        row,
        col: 2,
        type: 'sleeper',
        isAvailable: true,
        price: basePrice + 100,
      });
      upperDeck.push({
        seatNo: `U${row}C`,
        deck: 'upper',
        row,
        col: 3,
        type: 'sleeper',
        isAvailable: row % 3 !== 0,
        price: basePrice + 100,
      });
    }

    return { lowerDeck, upperDeck };
  }
};
