import { TrainSearchResult, TrainTimetableResult } from './types';
import { isDemoModeEnabled, LIVE_DATA_UNAVAILABLE_MESSAGES } from './apiConfig';

export interface TrainSearchParams {
  fromStation: string;
  toStation: string;
  journeyDate: string;
  classType?: string;
  passengers?: number;
}

// Curated Sacred Pilgrim Train Database (Used specifically in Demo Mode)
const DEMO_PILGRIM_TRAINS: TrainSearchResult[] = [
  {
    id: 'tr_12802',
    trainNumber: '12802',
    trainName: 'Purushottam Superfast Express',
    fromStationCode: 'NDLS',
    fromStationName: 'New Delhi',
    toStationCode: 'PNME',
    toStationName: 'Parasnath (Sammed Shikharji)',
    departureTime: '22:40',
    arrivalTime: '14:20',
    duration: '15h 40m',
    runningDays: ['Daily'],
    stopsCount: 18,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 3850, status: 'AVL 08', statusType: 'available' },
      { classCode: '2A', className: 'Second AC', fare: 2340, status: 'AVL 24', statusType: 'available' },
      { classCode: '3A', className: 'Third AC', fare: 1650, status: 'AVL 68', statusType: 'available' },
      { classCode: 'SL', className: 'Sleeper', fare: 620, status: 'RAC 14', statusType: 'rac' },
    ],
    jainMealAvailable: true,
    jainMealType: '100% Pure Jain Chovisi Meal at Mughalsarai / Koderma',
    nearTirth: 'Shree Sammed Shikharji Mahateerth',
    isDemo: true,
  },
  {
    id: 'tr_12314',
    trainNumber: '12314',
    trainName: 'Sealdah Rajdhani Express',
    fromStationCode: 'NDLS',
    fromStationName: 'New Delhi',
    toStationCode: 'PNME',
    toStationName: 'Parasnath (Sammed Shikharji)',
    departureTime: '16:30',
    arrivalTime: '06:15',
    duration: '13h 45m',
    runningDays: ['Daily'],
    stopsCount: 6,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 4620, status: 'AVL 04', statusType: 'available' },
      { classCode: '2A', className: 'Second AC', fare: 2890, status: 'AVL 18', statusType: 'available' },
      { classCode: '3A', className: 'Third AC', fare: 2080, status: 'AVL 45', statusType: 'available' },
    ],
    jainMealAvailable: true,
    jainMealType: 'IRCTC Jain Bhojan Catering (No Onion/Garlic)',
    nearTirth: 'Shree Sammed Shikharji Mahateerth',
    isDemo: true,
  },
  {
    id: 'tr_22945',
    trainNumber: '22945',
    trainName: 'Saurashtra Mail Superfast',
    fromStationCode: 'MMCT',
    fromStationName: 'Mumbai Central',
    toStationCode: 'SOJN',
    toStationName: 'Sihor Junction (Palitana Gateway)',
    departureTime: '21:05',
    arrivalTime: '08:45',
    duration: '11h 40m',
    runningDays: ['Daily'],
    stopsCount: 14,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 3200, status: 'AVL 06', statusType: 'available' },
      { classCode: '2A', className: 'Second AC', fare: 1980, status: 'AVL 32', statusType: 'available' },
      { classCode: '3A', className: 'Third AC', fare: 1420, status: 'AVL 88', statusType: 'available' },
      { classCode: 'SL', className: 'Sleeper', fare: 520, status: 'AVL 110', statusType: 'available' },
    ],
    jainMealAvailable: true,
    jainMealType: 'Gujarat Jain Tiffin Delivery available at Surat & Vadodara',
    nearTirth: 'Shree Shatrunjay Mahateerth Palitana',
    isDemo: true,
  },
  {
    id: 'tr_12957',
    trainNumber: '12957',
    trainName: 'Swarna Jayanti Rajdhani Express',
    fromStationCode: 'ADI',
    fromStationName: 'Ahmedabad Junction',
    toStationCode: 'NDLS',
    toStationName: 'New Delhi',
    departureTime: '17:45',
    arrivalTime: '07:30',
    duration: '13h 45m',
    runningDays: ['Daily'],
    stopsCount: 8,
    classes: [
      { classCode: '1A', className: 'First AC', fare: 4100, status: 'AVL 02', statusType: 'available' },
      { classCode: '2A', className: 'Second AC', fare: 2600, status: 'AVL 14', statusType: 'available' },
      { classCode: '3A', className: 'Third AC', fare: 1850, status: 'WL 06', statusType: 'waitlist' },
    ],
    jainMealAvailable: true,
    jainMealType: 'Special Jain Meal in Rajdhani (Pre-booked)',
    nearTirth: 'Hutheesing Temple / Mehsana Tirth',
    isDemo: true,
  },
  {
    id: 'tr_19323',
    trainNumber: '19323',
    trainName: 'Dr. Ambedkar Nagar (Indore) - Bhopal Express',
    fromStationCode: 'INDB',
    fromStationName: 'Indore Junction',
    toStationCode: 'BPL',
    toStationName: 'Bhopal Junction',
    departureTime: '06:40',
    arrivalTime: '10:55',
    duration: '4h 15m',
    runningDays: ['Daily'],
    stopsCount: 7,
    classes: [
      { classCode: 'CC', className: 'AC Chair Car', fare: 420, status: 'AVL 94', statusType: 'available' },
      { classCode: '2S', className: 'Second Seating', fare: 115, status: 'AVL 180', statusType: 'available' },
    ],
    jainMealAvailable: true,
    jainMealType: 'Indore Jain Shuddh Poha & Snacks at Ujjain',
    nearTirth: 'Gommatgiri & Pushpagiri Tirth',
    isDemo: true,
  },
  {
    id: 'tr_11057',
    trainNumber: '11057',
    trainName: 'Amritsar Express (via Jhansi / Lalitpur)',
    fromStationCode: 'CSMT',
    fromStationName: 'Mumbai CSMT',
    toStationCode: 'LAR',
    toStationName: 'Lalitpur (Kundalpur / Deogarh Link)',
    departureTime: '23:30',
    arrivalTime: '17:25',
    duration: '17h 55m',
    runningDays: ['Daily'],
    stopsCount: 26,
    classes: [
      { classCode: '2A', className: 'Second AC', fare: 2150, status: 'AVL 12', statusType: 'available' },
      { classCode: '3A', className: 'Third AC', fare: 1510, status: 'AVL 40', statusType: 'available' },
      { classCode: 'SL', className: 'Sleeper', fare: 570, status: 'RAC 08', statusType: 'rac' },
    ],
    jainMealAvailable: true,
    jainMealType: 'Deogarh Jain Trust Special Bhojan Box at Lalitpur',
    nearTirth: 'Kundalpur Mahateerth & Deogarh Shantinath Temple',
    isDemo: true,
  }
];

// Sample Timetables for Pilgrim Routes
const DEMO_TIMETABLES: Record<string, TrainTimetableResult> = {
  '12802': {
    trainNumber: '12802',
    trainName: 'Purushottam Superfast Express',
    fromStation: 'New Delhi (NDLS)',
    toStation: 'Puri (via Parasnath / Shikharji)',
    routeType: 'Daily Superfast Pilgrimage Trunk Corridor',
    isDemo: true,
    halts: [
      { srNo: 1, stationCode: 'NDLS', stationName: 'New Delhi', arrival: '--:--', departure: '22:40', haltMinutes: 0, distanceKm: 0, day: 1, platform: '8' },
      { srNo: 2, stationCode: 'CNB', stationName: 'Kanpur Central', arrival: '04:00', departure: '04:05', haltMinutes: 5, distanceKm: 440, day: 2, platform: '4' },
      { srNo: 3, stationCode: 'PRYJ', stationName: 'Prayagraj Junction', arrival: '06:55', departure: '07:00', haltMinutes: 5, distanceKm: 634, day: 2, platform: '4' },
      { srNo: 4, stationCode: 'DDU', stationName: 'Pt. Deen Dayal Upadhyaya Jn', arrival: '09:50', departure: '10:00', haltMinutes: 10, distanceKm: 787, day: 2, platform: '2', nearJainTirth: 'Varanasi Birthplace of 4 Tirthankars' },
      { srNo: 5, stationCode: 'GAYA', stationName: 'Gaya Junction', arrival: '12:35', departure: '12:40', haltMinutes: 5, distanceKm: 992, day: 2, platform: '3', nearJainTirth: 'Pawapuri & Gunavaji Link' },
      { srNo: 6, stationCode: 'KQR', stationName: 'Koderma Junction', arrival: '13:48', departure: '13:50', haltMinutes: 2, distanceKm: 1069, day: 2, platform: '3' },
      { srNo: 7, stationCode: 'PNME', stationName: 'Parasnath (Shikharji Gateway)', arrival: '14:20', departure: '14:25', haltMinutes: 5, distanceKm: 1117, day: 2, platform: '2', nearJainTirth: '⭐⭐ 20 Tirthankar Moksha Bhumi Sammed Shikharji (Madhuban)' },
      { srNo: 8, stationCode: 'GMO', stationName: 'NSCB Jn Gomoh', arrival: '14:48', departure: '14:53', haltMinutes: 5, distanceKm: 1135, day: 2, platform: '2' },
      { srNo: 9, stationCode: 'BKSC', stationName: 'Bokaro Steel City', arrival: '15:45', departure: '15:50', haltMinutes: 5, distanceKm: 1167, day: 2, platform: '1' },
      { srNo: 10, stationCode: 'TATA', stationName: 'Tatanagar Junction', arrival: '19:52', departure: '20:00', haltMinutes: 8, distanceKm: 1318, day: 2, platform: '4' },
    ]
  },
  '22945': {
    trainNumber: '22945',
    trainName: 'Saurashtra Mail Superfast',
    fromStation: 'Mumbai Central (MMCT)',
    toStation: 'Okha (via Sihor / Palitana Gateway)',
    routeType: 'Daily West Coast Pilgrimage Corridor',
    isDemo: true,
    halts: [
      { srNo: 1, stationCode: 'MMCT', stationName: 'Mumbai Central', arrival: '--:--', departure: '21:05', haltMinutes: 0, distanceKm: 0, day: 1, platform: '3' },
      { srNo: 2, stationCode: 'BVI', stationName: 'Borivali', arrival: '21:38', departure: '21:43', haltMinutes: 5, distanceKm: 30, day: 1, platform: '6' },
      { srNo: 3, stationCode: 'ST', stationName: 'Surat', arrival: '01:02', departure: '01:07', haltMinutes: 5, distanceKm: 263, day: 2, platform: '1', nearJainTirth: 'Surat Chintamani Parshvanath Derasar' },
      { srNo: 4, stationCode: 'BRC', stationName: 'Vadodara Junction', arrival: '02:52', departure: '02:57', haltMinutes: 5, distanceKm: 392, day: 2, platform: '3' },
      { srNo: 5, stationCode: 'ADI', stationName: 'Ahmedabad Junction', arrival: '05:00', departure: '05:15', haltMinutes: 15, distanceKm: 492, day: 2, platform: '5', nearJainTirth: 'Hutheesing Jain Temple' },
      { srNo: 6, stationCode: 'SRGT', stationName: 'Surendranagar Gate', arrival: '07:32', departure: '07:34', haltMinutes: 2, distanceKm: 623, day: 2, platform: '1' },
      { srNo: 7, stationCode: 'SOJN', stationName: 'Sihor Junction (Palitana Link)', arrival: '08:45', departure: '08:50', haltMinutes: 5, distanceKm: 708, day: 2, platform: '2', nearJainTirth: '⭐⭐ Shree Shatrunjay Mahateerth Palitana (30 min drive)' },
      { srNo: 8, stationCode: 'RJT', stationName: 'Rajkot Junction', arrival: '10:45', departure: '10:55', haltMinutes: 10, distanceKm: 739, day: 2, platform: '2' },
      { srNo: 9, stationCode: 'JND', stationName: 'Junagadh Junction', arrival: '12:40', departure: '12:45', haltMinutes: 5, distanceKm: 842, day: 2, platform: '1', nearJainTirth: '⭐⭐ Neminath Bhagwan Moksha Bhumi Girnarji' },
    ]
  }
};

/**
 * Service Provider Interface for Trains
 * When an official IRCTC / Indian Railway API partner is integrated,
 * replace the internal provider implementation here.
 */
export const trainService = {
  async searchTrains(params: TrainSearchParams): Promise<{
    results: TrainSearchResult[];
    isDemo: boolean;
    message?: string;
  }> {
    const isDemo = isDemoModeEnabled();

    if (!isDemo) {
      // In Live production without an authorized API key
      return {
        results: [],
        isDemo: false,
        message: LIVE_DATA_UNAVAILABLE_MESSAGES.train
      };
    }

    // Demo Mode: Filter or return curated demo trains based on query
    let filtered = DEMO_PILGRIM_TRAINS;
    if (params.fromStation && params.toStation) {
      const fromLower = params.fromStation.toLowerCase();
      const toLower = params.toStation.toLowerCase();
      const matches = DEMO_PILGRIM_TRAINS.filter(t => 
        (t.fromStationName.toLowerCase().includes(fromLower) || t.fromStationCode.toLowerCase().includes(fromLower)) &&
        (t.toStationName.toLowerCase().includes(toLower) || t.toStationCode.toLowerCase().includes(toLower) || (t.nearTirth && t.nearTirth.toLowerCase().includes(toLower)))
      );
      if (matches.length > 0) {
        filtered = matches;
      }
    }

    return {
      results: filtered,
      isDemo: true,
      message: 'Demo Data — Not Live (Simulated Railway Timetable & Availability)'
    };
  },

  async getTrainTimetable(trainNumberOrName: string): Promise<{
    timetable: TrainTimetableResult | null;
    isDemo: boolean;
    message?: string;
  }> {
    const isDemo = isDemoModeEnabled();

    if (!isDemo) {
      return {
        timetable: null,
        isDemo: false,
        message: LIVE_DATA_UNAVAILABLE_MESSAGES.timetable
      };
    }

    const cleanNumber = trainNumberOrName.trim();
    if (DEMO_TIMETABLES[cleanNumber]) {
      return {
        timetable: DEMO_TIMETABLES[cleanNumber],
        isDemo: true,
      };
    }

    // Default fallback to 12802 if search term is generic
    const firstKey = Object.keys(DEMO_TIMETABLES)[0];
    return {
      timetable: DEMO_TIMETABLES[firstKey],
      isDemo: true,
      message: `Showing demo route for Train #${DEMO_TIMETABLES[firstKey].trainNumber}`
    };
  },

  getPopularPilgrimTrains(): TrainSearchResult[] {
    return DEMO_PILGRIM_TRAINS;
  }
};
