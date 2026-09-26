import { ApiStatusInfo } from './types';

/**
 * System API Configuration and Status Tracker
 * 
 * Free / Open-Architecture Phase:
 * - Live railway, bus, flight, and PNR provider keys are NOT purchased.
 * - This config clearly reports provider integration states (🟢 Live Connected, 🟡 Demo Mode — Not Live, 🔴 Unavailable).
 * - Allows seamless connection of authorized providers later without refactoring.
 */

// Local storage key for testing demo vs live mock modes
const DEMO_MODE_STORAGE_KEY = 'jain_yatra_demo_mode';

export function isDemoModeEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(DEMO_MODE_STORAGE_KEY);
  if (stored !== null) {
    return stored === 'true';
  }
  // Default to Demo Mode for development/preview testing
  return true;
}

export function setDemoModeEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DEMO_MODE_STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('jain-travel-demo-mode-changed', { detail: { enabled } }));
}

export function getApiStatus(): ApiStatusInfo {
  const isDemo = isDemoModeEnabled();

  // Check if live environment credentials exist
  const hasTrainKey = typeof process !== 'undefined' && !!process.env?.TRAIN_API_KEY;
  const hasBusKey = typeof process !== 'undefined' && !!process.env?.BUS_API_KEY;
  const hasFlightKey = typeof process !== 'undefined' && !!process.env?.FLIGHT_API_KEY;
  const hasPnrKey = typeof process !== 'undefined' && !!process.env?.PNR_API_KEY;
  const hasMapKey = typeof process !== 'undefined' && !!process.env?.MAP_API_KEY;

  return {
    train: hasTrainKey ? 'connected' : (isDemo ? 'demo' : 'unavailable'),
    bus: hasBusKey ? 'connected' : (isDemo ? 'demo' : 'unavailable'),
    flight: hasFlightKey ? 'connected' : (isDemo ? 'demo' : 'unavailable'),
    pnr: hasPnrKey ? 'connected' : (isDemo ? 'demo' : 'unavailable'),
    maps: hasMapKey ? 'connected' : (isDemo ? 'demo' : 'unavailable'),
    demoModeActive: isDemo,
    message: isDemo 
      ? 'Demo Mode Active — All search results, seat matrices & timetables are simulated for preview. Live railway & airline APIs will be integrated upon official provider authorization.'
      : 'Live Production Mode Active — No paid live provider connected. System will safely show unavailable states rather than fabricated data.'
  };
}

export const LIVE_DATA_UNAVAILABLE_MESSAGES = {
  train: 'Live train data is currently unavailable. Railway IRCTC API pending integration.',
  timetable: 'Live train timetable is currently unavailable. Official Railway NTES API pending integration.',
  pnr: 'Live PNR information is currently unavailable. Authorized railway PNR API pending integration.',
  bus: 'Live bus operator data is currently unavailable. State RTC & private booking API pending integration.',
  flight: 'Live flight pricing and availability is currently unavailable. GDS airline API pending integration.',
  route: 'External live map satellite routing API is pending integration. Showing curated Jain pilgrim highway corridors.',
};
