export type TravelMode = 'train' | 'bus' | 'flight' | 'route' | 'sangh' | 'car';

export type BookingStatus = 'CONFIRMED' | 'PENDING' | 'WAITLIST' | 'CANCELLED' | 'COMPLETED' | 'UPCOMING';

export type ApiConnectionState = 'connected' | 'demo' | 'unavailable';

export interface ApiStatusInfo {
  train: ApiConnectionState;
  bus: ApiConnectionState;
  flight: ApiConnectionState;
  pnr: ApiConnectionState;
  maps: ApiConnectionState;
  demoModeActive: boolean;
  message: string;
}

export interface TrainClassAvailability {
  classCode: string; // '1A' | '2A' | '3A' | '3E' | 'SL' | 'CC' | '2S'
  className: string;
  fare: number;
  status: string; // 'AVAILABLE 42' | 'RLWL 12' | 'GNWL 5' | 'CURR_AVL 8'
  statusType: 'available' | 'waitlist' | 'rac' | 'regret';
  updatedAt?: string;
}

export interface TrainSearchResult {
  id: string;
  trainNumber: string;
  trainName: string;
  fromStationCode: string;
  fromStationName: string;
  toStationCode: string;
  toStationName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  stopsCount: number;
  classes: TrainClassAvailability[];
  jainMealAvailable: boolean;
  jainMealType: string;
  nearTirth?: string;
  isDemo: boolean;
}

export interface TimetableStationHalt {
  srNo: number;
  stationCode: string;
  stationName: string;
  arrival: string;
  departure: string;
  haltMinutes: number;
  distanceKm: number;
  day: number;
  platform?: string;
  nearJainTirth?: string;
}

export interface TrainTimetableResult {
  trainNumber: string;
  trainName: string;
  fromStation: string;
  toStation: string;
  routeType: string;
  halts: TimetableStationHalt[];
  isDemo: boolean;
}

export interface PnrPassengerStatus {
  passengerNo: number;
  bookingStatus: string;
  currentStatus: string;
  berthType: string;
  coach: string;
  berthNo: string;
}

export interface PnrStatusResult {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  dateOfJourney: string;
  fromStation: string;
  toStation: string;
  boardingStation: string;
  chartPrepared: boolean;
  classCode: string;
  className: string;
  quota: string;
  passengers: PnrPassengerStatus[];
  isDemo: boolean;
  notes?: string;
}

export interface BusSeat {
  seatNo: string;
  deck: 'lower' | 'upper';
  row: number;
  col: number;
  type: 'sleeper' | 'seater';
  isAvailable: boolean;
  isLadiesReserved?: boolean;
  price: number;
  isSelected?: boolean;
}

export interface BusSearchResult {
  id: string;
  operatorName: string;
  busType: string;
  fromCity: string;
  toCity: string;
  boardingPoint: string;
  droppingPoint: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  totalSeats: number;
  availableSeats: number;
  fareStartingFrom: number;
  rating: number;
  jainMealFacility: boolean;
  amenities: string[];
  nearTirth?: string;
  isDemo: boolean;
}

export interface FlightSearchResult {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  fromAirportCode: string;
  fromAirportName: string;
  toAirportCode: string;
  toAirportName: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: number;
  stopDetails?: string;
  fare: number;
  cabinClass: string;
  baggage: string;
  jainMealAvailable: boolean;
  nearTirth?: string;
  isDemo: boolean;
}

export interface RouteTransportOption {
  mode: 'train' | 'bus' | 'car' | 'flight';
  title: string;
  distanceKm: number;
  estimatedTime: string;
  approxFare: string;
  comfortRating: number;
  jainPilgrimTips: string;
}

export interface RouteDistanceResult {
  source: string;
  destination: string;
  distanceKm: number;
  estimatedDriveTime: string;
  suggestedRoute: string;
  highways: string[];
  mountainClimbInfo?: string;
  sacredSignificance?: string;
  options: RouteTransportOption[];
  isDemo: boolean;
}

export interface TravelPassenger {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  berthPreference?: string;
  mealPreference?: 'jain_sunset' | 'jain_navkarsi' | 'none';
  idProofType?: string;
}

export interface TravelTrip {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  tripTitle: string;
  destinationTirth: string;
  travelMode: TravelMode;
  startDate: string;
  endDate?: string;
  passengers: TravelPassenger[];
  status: BookingStatus;
  notes?: string;
  bookingRefId?: string;
  pnrOrTicketNo?: string;
  totalCost?: number;
  createdAt: string;
  isDemoRecord?: boolean;
}

export interface TravelBooking {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  travelType: 'train' | 'bus' | 'flight' | 'sangh';
  serviceName: string;
  serviceNumber: string;
  source: string;
  destination: string;
  journeyDate: string;
  travelClass: string;
  passengers: TravelPassenger[];
  seatNumbers?: string[];
  totalAmount: number;
  status: BookingStatus;
  pnrOrBookingId: string;
  paymentMethod: string;
  jainFoodRequested: boolean;
  createdAt: string;
  isDemo: boolean;
}

export interface TravelSearchLog {
  id?: string;
  userId?: string;
  travelMode: TravelMode;
  source: string;
  destination: string;
  journeyDate: string;
  timestamp: string;
}

export interface TravelProfile {
  userId: string;
  email?: string;
  displayName?: string;
  homeCity?: string;
  favoriteTirths?: string[];
  preferredMode?: TravelMode;
  dietaryPreference?: 'jain_chovisi' | 'jain_navkarsi' | 'jain_general' | 'regular_veg';
  frequentStations?: string[];
  frequentAirports?: string[];
  savedPassengers?: TravelPassenger[];
  frequentPassengers?: TravelPassenger[];
  emergencyContact?: string;
}

// Aliases for convenience
export type UserBookingRecord = TravelBooking;
export type UserTripRecord = TravelTrip;
export type TravelUserProfile = TravelProfile;
