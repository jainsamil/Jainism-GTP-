import { PnrStatusResult } from './types';
import { isDemoModeEnabled, LIVE_DATA_UNAVAILABLE_MESSAGES } from './apiConfig';

const DEMO_PNR_DATABASE: Record<string, PnrStatusResult> = {
  '2458963214': {
    pnrNumber: '2458963214',
    trainNumber: '12802',
    trainName: 'Purushottam Superfast Express',
    dateOfJourney: '2026-09-18',
    fromStation: 'New Delhi (NDLS)',
    toStation: 'Parasnath - Sammed Shikharji (PNME)',
    boardingStation: 'New Delhi (NDLS)',
    chartPrepared: true,
    classCode: '3A',
    className: 'AC 3 Tier (3A)',
    quota: 'General (GN)',
    isDemo: true,
    notes: 'Demo Record — 100% Pure Jain Chovisi Meal pre-booked on berth.',
    passengers: [
      {
        passengerNo: 1,
        bookingStatus: 'CNF / B3 / 24 / LB',
        currentStatus: 'CNF / B3 / 24',
        berthType: 'Lower Berth (LB)',
        coach: 'B3',
        berthNo: '24'
      },
      {
        passengerNo: 2,
        bookingStatus: 'CNF / B3 / 27 / MB',
        currentStatus: 'CNF / B3 / 27',
        berthType: 'Middle Berth (MB)',
        coach: 'B3',
        berthNo: '27'
      }
    ]
  },
  '8745219630': {
    pnrNumber: '8745219630',
    trainNumber: '22945',
    trainName: 'Saurashtra Mail Superfast',
    dateOfJourney: '2026-10-05',
    fromStation: 'Mumbai Central (MMCT)',
    toStation: 'Sihor Jn / Palitana (SOJN)',
    boardingStation: 'Borivali (BVI)',
    chartPrepared: false,
    classCode: '2A',
    className: 'AC 2 Tier (2A)',
    quota: 'Tatkal (CK)',
    isDemo: true,
    notes: 'Demo Record — Charting opens 4 hours before train departure.',
    passengers: [
      {
        passengerNo: 1,
        bookingStatus: 'RLWL / 2',
        currentStatus: 'CNF / A1 / 18',
        berthType: 'Side Lower (SL)',
        coach: 'A1',
        berthNo: '18'
      }
    ]
  }
};

export const pnrService = {
  async checkPnrStatus(pnr: string): Promise<{
    result: PnrStatusResult | null;
    isDemo: boolean;
    error?: string;
  }> {
    const cleanPnr = pnr.trim().replace(/\D/g, '');

    if (cleanPnr.length !== 10) {
      return {
        result: null,
        isDemo: false,
        error: 'Please enter a valid 10-digit Indian Railways PNR number.'
      };
    }

    const isDemo = isDemoModeEnabled();

    if (!isDemo) {
      // In Live Production without an authorized PNR provider key
      return {
        result: null,
        isDemo: false,
        error: LIVE_DATA_UNAVAILABLE_MESSAGES.pnr
      };
    }

    // Demo Mode lookup
    if (DEMO_PNR_DATABASE[cleanPnr]) {
      return {
        result: DEMO_PNR_DATABASE[cleanPnr],
        isDemo: true
      };
    }

    // Default simulated PNR response for any valid 10-digit test input in Demo Mode
    const simulatedDemoPnr: PnrStatusResult = {
      pnrNumber: cleanPnr,
      trainNumber: '12802',
      trainName: 'Purushottam Express (Pilgrim Special)',
      dateOfJourney: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      fromStation: 'New Delhi (NDLS)',
      toStation: 'Parasnath (PNME) - Sammed Shikharji',
      boardingStation: 'New Delhi (NDLS)',
      chartPrepared: true,
      classCode: '3A',
      className: 'AC 3 Tier',
      quota: 'General',
      isDemo: true,
      notes: 'Demo Data — Simulated status for testing UI. Connect real IRCTC/Rail API in production.',
      passengers: [
        {
          passengerNo: 1,
          bookingStatus: 'CNF / B2 / 33 / LB',
          currentStatus: 'CNF / B2 / 33',
          berthType: 'Lower Berth',
          coach: 'B2',
          berthNo: '33'
        }
      ]
    };

    return {
      result: simulatedDemoPnr,
      isDemo: true
    };
  }
};
