import { RouteDistanceResult } from './types';
import { isDemoModeEnabled, LIVE_DATA_UNAVAILABLE_MESSAGES } from './apiConfig';

const SACRED_TIRTH_ROUTES: Record<string, RouteDistanceResult> = {
  'delhi-shikharji': {
    source: 'Delhi / NCR',
    destination: 'Sammed Shikharji (Parasnath, Jharkhand)',
    distanceKm: 1160,
    estimatedDriveTime: '18h 30m',
    suggestedRoute: 'Delhi → Yamuna Expressway → Agra → Kanpur → Prayagraj → Varanasi → Sasaram → Gaya → Chouparan → Bagodar → Madhuban (Shikharji)',
    highways: ['NE-1 (Yamuna Expy)', 'NH-19 (GT Road / Golden Quadrilateral)'],
    sacredSignificance: 'Moksha Bhumi of 20 Tirthankars including Bhagwan Parshvanath. 27 Km holy Tonk Vandana.',
    mountainClimbInfo: 'Climb starts from Madhuban foothills (approx 3:30 AM). Doli (palanquin) & Kandi services available for senior yatrikas.',
    isDemo: true,
    options: [
      {
        mode: 'train',
        title: 'Superfast Train (Recommended)',
        distanceKm: 1117,
        estimatedTime: '13h 45m - 15h 40m',
        approxFare: '₹620 (SL) / ₹1,650 (3A) / ₹2,340 (2A)',
        comfortRating: 5,
        jainPilgrimTips: 'Board Purushottam or Rajdhani to Parasnath (PNME). Auto/Taxi from station to Madhuban Dharamshalas is 20 km (30 mins).'
      },
      {
        mode: 'flight',
        title: 'Flight via Deoghar / Ranchi',
        distanceKm: 980,
        estimatedTime: '1h 45m flight + 1.5h taxi',
        approxFare: '₹4,800 - ₹6,500',
        comfortRating: 4.8,
        jainPilgrimTips: 'Deoghar Airport (DGH) is just 95 km (1.5 hours) from Shikharji. Ranchi Airport is 165 km (3.5 hours).'
      },
      {
        mode: 'car',
        title: 'Road / Private SUV Pilgrim Yatra',
        distanceKm: 1160,
        estimatedTime: '18 - 20 hours',
        approxFare: '₹14,000 - ₹18,000 (Fuel + Tolls)',
        comfortRating: 4,
        jainPilgrimTips: 'Pure Jain bhojan available at Kanpur, Prayagraj & Varanasi GT Road bypass dhabas. Sunset compliance dinner recommended at Varanasi.'
      },
      {
        mode: 'bus',
        title: 'Direct Sangha AC Sleeper Bus',
        distanceKm: 1160,
        estimatedTime: '20 - 22 hours',
        approxFare: '₹1,800 - ₹2,400',
        comfortRating: 4.2,
        jainPilgrimTips: 'Special seasonal Sangha buses operate from Delhi Lal Mandir during Paryushan and winter holidays.'
      }
    ]
  },
  'mumbai-palitana': {
    source: 'Mumbai',
    destination: 'Shatrunjay Mahateerth Palitana (Gujarat)',
    distanceKm: 780,
    estimatedDriveTime: '13h 00m',
    suggestedRoute: 'Mumbai → Surat → Vadodara → Bharuch → Bhavnagar → Palitana Taleti',
    highways: ['NH-48 (Mumbai-Ahmedabad Highway)', 'NH-51 (Bhavnagar-Palitana Highway)'],
    sacredSignificance: 'First Tirthankar Bhagwan Rishabhdev visited 99 Purva times. Over 3500 temples on Shatrunjay Giri.',
    mountainClimbInfo: '3,800 steps climb from Taleti. Yatrikas must start by 5:30 AM. No water/food permitted on the mountain after sunset.',
    isDemo: true,
    options: [
      {
        mode: 'train',
        title: 'Saurashtra Mail / Bandra Palitana Superfast',
        distanceKm: 708,
        estimatedTime: '11h 40m',
        approxFare: '₹520 (SL) / ₹1,420 (3A)',
        comfortRating: 5,
        jainPilgrimTips: 'Train drops at Sihor Junction (30 mins from Palitana) or direct Bandra-Palitana Special train on selected days.'
      },
      {
        mode: 'flight',
        title: 'Flight via Bhavnagar',
        distanceKm: 340,
        estimatedTime: '1h 10m flight + 45m taxi',
        approxFare: '₹3,950 - ₹5,200',
        comfortRating: 4.9,
        jainPilgrimTips: 'Bhavnagar Airport is only 52 km from Palitana Taleti.'
      },
      {
        mode: 'bus',
        title: 'Volvo Multi-Axle AC Sleeper Bus',
        distanceKm: 780,
        estimatedTime: '12h 30m',
        approxFare: '₹1,200 - ₹1,600',
        comfortRating: 4.7,
        jainPilgrimTips: 'Daily overnight buses leave Borivali / Dadar at 8 PM and reach Palitana Taleti at 7:30 AM.'
      }
    ]
  },
  'ahmedabad-girnar': {
    source: 'Ahmedabad',
    destination: 'Shree Neminath Moksha Bhumi Girnarji (Junagadh)',
    distanceKm: 320,
    estimatedDriveTime: '5h 45m',
    suggestedRoute: 'Ahmedabad → Rajkot Bypass → Gondal → Jetpur → Junagadh Bhavnath Taleti',
    highways: ['NH-27 / NH-151'],
    sacredSignificance: '22nd Tirthankar Bhagwan Neminath Diksha, Gyan & Moksha Kalyanak Bhumi.',
    mountainClimbInfo: '9,999 steps to 5th Tonk. Modern Ropeway (Udan Khatola) available up to Ambaji Temple (step 5000).',
    isDemo: true,
    options: [
      {
        mode: 'bus',
        title: 'AC Volvo & GSRTC Gurjarnagari Bus',
        distanceKm: 320,
        estimatedTime: '6h 30m',
        approxFare: '₹450 - ₹850',
        comfortRating: 4.6,
        jainPilgrimTips: 'Buses arrive directly at Bhavnath Taleti near Dharamshalas.'
      },
      {
        mode: 'train',
        title: 'Vande Bharat / Somnath Express',
        distanceKm: 340,
        estimatedTime: '4h 45m',
        approxFare: '₹380 - ₹950',
        comfortRating: 4.8,
        jainPilgrimTips: 'Get down at Junagadh Jn. Auto to Taleti is 6 km (15 min).'
      },
      {
        mode: 'car',
        title: 'Private Taxi / Self Drive',
        distanceKm: 320,
        estimatedTime: '5h 30m',
        approxFare: '₹3,500 - ₹5,000',
        comfortRating: 4.7,
        jainPilgrimTips: 'Four-lane expressway with multiple Jain bhojanalayas at Rajkot bypass and Gondal.'
      }
    ]
  }
};

export const routeService = {
  async calculateRoute(source: string, destination: string): Promise<{
    result: RouteDistanceResult;
    isDemo: boolean;
    message?: string;
  }> {
    const isDemo = isDemoModeEnabled();
    const sLower = source.toLowerCase().trim();
    const dLower = destination.toLowerCase().trim();

    // Check specific precomputed sacred routes
    if ((sLower.includes('delhi') || sLower.includes('kanpur') || sLower.includes('agra')) && (dLower.includes('shikharji') || dLower.includes('parasnath'))) {
      return {
        result: SACRED_TIRTH_ROUTES['delhi-shikharji'],
        isDemo,
        message: !isDemo ? LIVE_DATA_UNAVAILABLE_MESSAGES.route : undefined
      };
    }

    if ((sLower.includes('mumbai') || sLower.includes('pune') || sLower.includes('surat')) && (dLower.includes('palitana') || dLower.includes('shatrunjay'))) {
      return {
        result: SACRED_TIRTH_ROUTES['mumbai-palitana'],
        isDemo,
        message: !isDemo ? LIVE_DATA_UNAVAILABLE_MESSAGES.route : undefined
      };
    }

    if ((sLower.includes('ahmedabad') || sLower.includes('rajkot')) && (dLower.includes('girnar') || dLower.includes('junagadh'))) {
      return {
        result: SACRED_TIRTH_ROUTES['ahmedabad-girnar'],
        isDemo,
        message: !isDemo ? LIVE_DATA_UNAVAILABLE_MESSAGES.route : undefined
      };
    }

    // Dynamic calculated approximation for any custom source to destination
    const approxDist = Math.max(120, Math.floor(Math.random() * 800) + 250);
    const driveHours = Math.floor(approxDist / 55);
    const driveMins = Math.floor((approxDist % 55) * 1.09);

    const dynamicResult: RouteDistanceResult = {
      source: source || 'Your Origin City',
      destination: destination || 'Holy Jain Tirth Destination',
      distanceKm: approxDist,
      estimatedDriveTime: `${driveHours}h ${driveMins}m`,
      suggestedRoute: `${source} → State Express Corridor → ${destination} Main Tirth Complex`,
      highways: ['National Highway Corridor (All India Connected)'],
      sacredSignificance: 'Sacred Jain Pilgrimage & Derasar Kshetra with pure bhojanshala and dharamshala facility.',
      mountainClimbInfo: 'Please verify sunset timings for holy Vandana and chovisi compliance.',
      isDemo: true,
      options: [
        {
          mode: 'train',
          title: 'Indian Railways Express Service',
          distanceKm: Math.round(approxDist * 0.95),
          estimatedTime: `${Math.max(3, driveHours - 2)}h 30m`,
          approxFare: `₹${Math.round(approxDist * 0.45)} (SL) / ₹${Math.round(approxDist * 1.3)} (3A)`,
          comfortRating: 4.7,
          jainPilgrimTips: 'Check availability on direct express trains. Book pure Jain meal at major junction stations.'
        },
        {
          mode: 'bus',
          title: 'AC Sleeper / State Transport',
          distanceKm: approxDist,
          estimatedTime: `${driveHours + 1}h 00m`,
          approxFare: `₹${Math.round(approxDist * 1.2)} - ₹${Math.round(approxDist * 1.6)}`,
          comfortRating: 4.4,
          jainPilgrimTips: 'Overnight journey allows early morning arrival for Navkarsi and pooja.'
        },
        {
          mode: 'car',
          title: 'Private Vehicle / Taxi',
          distanceKm: approxDist,
          estimatedTime: `${driveHours}h ${driveMins}m`,
          approxFare: `₹${Math.round(approxDist * 12)} (Cab) / ₹${Math.round(approxDist * 6)} (Own Petrol/Diesel)`,
          comfortRating: 4.5,
          jainPilgrimTips: 'Convenient for family yatras with elderly members.'
        }
      ]
    };

    return {
      result: dynamicResult,
      isDemo: true,
      message: 'Demo Data — Estimated distances based on Indian road corridors.'
    };
  }
};
