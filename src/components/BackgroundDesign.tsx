import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

interface Spark {
  x: number;
  y: number;
  size: number;
  speedY: number;
  amplitude: number;
  frequency: number;
  phase: number;
  opacity: number;
  maxOpacity: number;
  fadeSpeed: number;
}

interface Globe {
  pctX: number;
  pctY: number;
  radius: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  floatSpeed: number;
  floatAmp: number;
  floatOffset: number;
}

export default function BackgroundDesign() {
  const { theme } = useTheme();
  const location = useLocation();
  const path = location.pathname;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const isDark = theme === 'dark';

  // Dynamic route-based color scheme config with 24+ distinct colors
  const getRouteColors = () => {
    const lowercasePath = path.toLowerCase();
    
    if (lowercasePath === '/' || lowercasePath === '') {
      // 1. Homepage: Pure Auspicious Saffron-Gold
      return {
        sparkLight: '245, 124, 0',
        sparkDark: '255, 183, 77',
        shadow: isDark ? 'rgba(255, 183, 77, 0.8)' : 'rgba(245, 124, 0, 0.6)',
        stroke: '#E65100',
        strokeDark: '#FFE082',
        beam: 'from-[#FF6D00]/15 via-[#FFB300]/04 to-transparent',
        beamDark: 'dark:from-[#FF6D00]/15 dark:via-[#FFD54F]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/chat')) {
      // 2. Jainism GPT Chat: Spiritual Radiant Coral
      return {
        sparkLight: '255, 110, 40',
        sparkDark: '255, 138, 101',
        shadow: isDark ? 'rgba(255, 138, 101, 0.8)' : 'rgba(255, 110, 40, 0.6)',
        stroke: '#FF7043',
        strokeDark: '#FFAB91',
        beam: 'from-[#FF7043]/15 via-[#FFAB91]/04 to-transparent',
        beamDark: 'dark:from-[#FF7043]/15 dark:via-[#FFAB91]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/knowledge')) {
      // 3. Knowledge Center: Deep Amethyst Purple
      return {
        sparkLight: '110, 30, 180',
        sparkDark: '187, 134, 252',
        shadow: isDark ? 'rgba(187, 134, 252, 0.8)' : 'rgba(110, 30, 180, 0.6)',
        stroke: '#6A1B9A',
        strokeDark: '#E040FB',
        beam: 'from-[#6A1B9A]/15 via-[#E040FB]/04 to-transparent',
        beamDark: 'dark:from-[#6A1B9A]/15 dark:via-[#E040FB]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/media')) {
      // 4. Media & Pravachans: Midnight Violet
      return {
        sparkLight: '120, 20, 220',
        sparkDark: '190, 120, 255',
        shadow: isDark ? 'rgba(190, 120, 255, 0.8)' : 'rgba(120, 20, 220, 0.6)',
        stroke: '#7B1FA2',
        strokeDark: '#E1BEE7',
        beam: 'from-[#7B1FA2]/15 via-[#E1BEE7]/04 to-transparent',
        beamDark: 'dark:from-[#7B1FA2]/15 dark:via-[#E1BEE7]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/profile')) {
      // 5. Sadhana Profile: Soft Lavender
      return {
        sparkLight: '140, 80, 220',
        sparkDark: '210, 180, 255',
        shadow: isDark ? 'rgba(210, 180, 255, 0.8)' : 'rgba(140, 80, 220, 0.6)',
        stroke: '#9575CD',
        strokeDark: '#D1C4E9',
        beam: 'from-[#9575CD]/15 via-[#D1C4E9]/04 to-transparent',
        beamDark: 'dark:from-[#9575CD]/15 dark:via-[#D1C4E9]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/panchang')) {
      // 6. Panchang / Tithi: Celestial Midnight Blue
      return {
        sparkLight: '10, 80, 180',
        sparkDark: '0, 191, 255',
        shadow: isDark ? 'rgba(0, 191, 255, 0.8)' : 'rgba(10, 80, 180, 0.6)',
        stroke: '#0288D1',
        strokeDark: '#80DEEA',
        beam: 'from-[#0091EA]/15 via-[#00E5FF]/04 to-transparent',
        beamDark: 'dark:from-[#0091EA]/15 dark:via-[#00E5FF]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/tirthankars')) {
      // 7. 24 Tirthankars: Sacred Golden Saffron
      return {
        sparkLight: '245, 124, 0',
        sparkDark: '255, 183, 77',
        shadow: isDark ? 'rgba(255, 183, 77, 0.8)' : 'rgba(245, 124, 0, 0.6)',
        stroke: '#E65100',
        strokeDark: '#FFE082',
        beam: 'from-[#E65100]/15 via-[#FFE082]/04 to-transparent',
        beamDark: 'dark:from-[#E65100]/15 dark:via-[#FFE082]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/aagams')) {
      // 8. Ancient Scriptures (Agams): Ancient Vermillion Red
      return {
        sparkLight: '220, 40, 20',
        sparkDark: '255, 110, 80',
        shadow: isDark ? 'rgba(255, 80, 40, 0.8)' : 'rgba(220, 30, 10, 0.6)',
        stroke: '#D32F2F',
        strokeDark: '#FF8A80',
        beam: 'from-[#D32F2F]/15 via-[#FF5252]/04 to-transparent',
        beamDark: 'dark:from-[#D32F2F]/15 dark:via-[#FF5252]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/saints')) {
      // 9. Revered Saints: Sandalwood Gold
      return {
        sparkLight: '230, 110, 10',
        sparkDark: '255, 179, 64',
        shadow: isDark ? 'rgba(255, 179, 64, 0.8)' : 'rgba(230, 110, 10, 0.6)',
        stroke: '#F57C00',
        strokeDark: '#FFCC80',
        beam: 'from-[#F57C00]/15 via-[#FFCC80]/04 to-transparent',
        beamDark: 'dark:from-[#F57C00]/15 dark:via-[#FFCC80]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/pathshala')) {
      // 10. Jain Pathshala: Bright Emerald Mint
      return {
        sparkLight: '0, 137, 123',
        sparkDark: '105, 240, 174',
        shadow: isDark ? 'rgba(105, 240, 174, 0.8)' : 'rgba(0, 137, 123, 0.6)',
        stroke: '#00796B',
        strokeDark: '#B9F6CA',
        beam: 'from-[#00796B]/15 via-[#B9F6CA]/04 to-transparent',
        beamDark: 'dark:from-[#00796B]/15 dark:via-[#B9F6CA]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/vichaar')) {
      // 11. Daily Vichaar: Calm Sage Green
      return {
        sparkLight: '50, 130, 100',
        sparkDark: '120, 220, 180',
        shadow: isDark ? 'rgba(120, 220, 180, 0.8)' : 'rgba(50, 130, 100, 0.6)',
        stroke: '#2E7D32',
        strokeDark: '#A5D6A7',
        beam: 'from-[#2E7D32]/15 via-[#A5D6A7]/04 to-transparent',
        beamDark: 'dark:from-[#2E7D32]/15 dark:via-[#A5D6A7]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/history')) {
      // 12. Jain History: Warm Sepia / Antique Bronze
      return {
        sparkLight: '140, 80, 40',
        sparkDark: '220, 160, 110',
        shadow: isDark ? 'rgba(220, 160, 110, 0.8)' : 'rgba(140, 80, 40, 0.6)',
        stroke: '#8D6E63',
        strokeDark: '#D7CCC8',
        beam: 'from-[#8D6E63]/15 via-[#D7CCC8]/04 to-transparent',
        beamDark: 'dark:from-[#8D6E63]/15 dark:via-[#D7CCC8]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/quiz')) {
      // 13. Sadhana Quiz: Electric Cyan / Teal
      return {
        sparkLight: '0, 150, 136',
        sparkDark: '0, 229, 255',
        shadow: isDark ? 'rgba(0, 229, 255, 0.8)' : 'rgba(0, 150, 136, 0.6)',
        stroke: '#00838F',
        strokeDark: '#84FFFF',
        beam: 'from-[#00838F]/15 via-[#84FFFF]/04 to-transparent',
        beamDark: 'dark:from-[#00838F]/15 dark:via-[#84FFFF]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/festivals')) {
      // 14. Jain Festivals: Festive Magenta / Rose
      return {
        sparkLight: '219, 58, 120',
        sparkDark: '244, 143, 177',
        shadow: isDark ? 'rgba(244, 143, 177, 0.8)' : 'rgba(219, 58, 120, 0.6)',
        stroke: '#C2185B',
        strokeDark: '#F48FB1',
        beam: 'from-[#C2185B]/15 via-[#F48FB1]/04 to-transparent',
        beamDark: 'dark:from-[#C2185B]/15 dark:via-[#F48FB1]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/jaap')) {
      // 15. Jaap Counter: Divine Saffron Red
      return {
        sparkLight: '200, 20, 40',
        sparkDark: '255, 82, 82',
        shadow: isDark ? 'rgba(255, 82, 82, 0.8)' : 'rgba(200, 20, 40, 0.6)',
        stroke: '#C62828',
        strokeDark: '#FF8A80',
        beam: 'from-[#C62828]/15 via-[#FF8A80]/04 to-transparent',
        beamDark: 'dark:from-[#C62828]/15 dark:via-[#FF8A80]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/tirth')) {
      // 16. Tirth Yatras: Heavenly Rose Gold / Divine Champagne
      return {
        sparkLight: '190, 140, 30',
        sparkDark: '255, 220, 120',
        shadow: isDark ? 'rgba(255, 220, 120, 0.8)' : 'rgba(190, 140, 30, 0.6)',
        stroke: '#B59410',
        strokeDark: '#FFE57F',
        beam: 'from-[#B59410]/15 via-[#FFE57F]/04 to-transparent',
        beamDark: 'dark:from-[#B59410]/15 dark:via-[#FFE57F]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/fasting')) {
      // 17. Tapasya / Fasting: Pure Lotus Pink
      return {
        sparkLight: '219, 58, 120',
        sparkDark: '244, 143, 177',
        shadow: isDark ? 'rgba(244, 143, 177, 0.8)' : 'rgba(219, 58, 120, 0.6)',
        stroke: '#C2185B',
        strokeDark: '#F48FB1',
        beam: 'from-[#C2185B]/15 via-[#F48FB1]/04 to-transparent',
        beamDark: 'dark:from-[#C2185B]/15 dark:via-[#F48FB1]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/swadhyay')) {
      // 18. Swadhyay Books: Spiritual Sapphire Blue
      return {
        sparkLight: '20, 80, 200',
        sparkDark: '100, 180, 255',
        shadow: isDark ? 'rgba(100, 180, 255, 0.8)' : 'rgba(20, 80, 200, 0.6)',
        stroke: '#1565C0',
        strokeDark: '#90CAF9',
        beam: 'from-[#1565C0]/15 via-[#90CAF9]/04 to-transparent',
        beamDark: 'dark:from-[#1565C0]/15 dark:via-[#90CAF9]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/bhaktamar')) {
      // 19. Bhaktamar Stotra: Devotional Golden Orange
      return {
        sparkLight: '230, 81, 0',
        sparkDark: '255, 215, 0',
        shadow: isDark ? 'rgba(255, 215, 0, 0.8)' : 'rgba(230, 81, 0, 0.6)',
        stroke: '#E65100',
        strokeDark: '#FFE082',
        beam: 'from-[#E65100]/15 via-[#FFE082]/04 to-transparent',
        beamDark: 'dark:from-[#E65100]/15 dark:via-[#FFE082]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/diet')) {
      // 20. Ahimsa Diet: Compassionate Green
      return {
        sparkLight: '30, 120, 40',
        sparkDark: '0, 230, 118',
        shadow: isDark ? 'rgba(0, 230, 118, 0.8)' : 'rgba(30, 120, 40, 0.6)',
        stroke: '#2E7D32',
        strokeDark: '#69F0AE',
        beam: 'from-[#2E7D32]/15 via-[#00E676]/04 to-transparent',
        beamDark: 'dark:from-[#2E7D32]/15 dark:via-[#00E676]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/verified-food')) {
      // 21. Verified Sattvik Food: Vibrant Forest Green
      return {
        sparkLight: '46, 125, 50',
        sparkDark: '165, 214, 167',
        shadow: isDark ? 'rgba(165, 214, 167, 0.8)' : 'rgba(46, 125, 50, 0.6)',
        stroke: '#1B5E20',
        strokeDark: '#A5D6A7',
        beam: 'from-[#1B5E20]/15 via-[#A5D6A7]/04 to-transparent',
        beamDark: 'dark:from-[#1B5E20]/15 dark:via-[#A5D6A7]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/dharamshalas')) {
      // 22. Dharamshalas: Earthy Terracotta / Warm Sand
      return {
        sparkLight: '180, 90, 50',
        sparkDark: '240, 160, 120',
        shadow: isDark ? 'rgba(240, 160, 120, 0.8)' : 'rgba(180, 90, 50, 0.6)',
        stroke: '#A1887F',
        strokeDark: '#FFE0B2',
        beam: 'from-[#A1887F]/15 via-[#FFE0B2]/04 to-transparent',
        beamDark: 'dark:from-[#A1887F]/15 dark:via-[#FFE0B2]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/vihar-tracker')) {
      // 23. Muni Vihar Tracker: Celestial Sky Blue
      return {
        sparkLight: '20, 140, 200',
        sparkDark: '120, 210, 255',
        shadow: isDark ? 'rgba(120, 210, 255, 0.8)' : 'rgba(20, 140, 200, 0.6)',
        stroke: '#0288D1',
        strokeDark: '#B3E5FC',
        beam: 'from-[#0288D1]/15 via-[#B3E5FC]/04 to-transparent',
        beamDark: 'dark:from-[#0288D1]/15 dark:via-[#B3E5FC]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/manuscript-library')) {
      // 24. Manuscript Library: Ancient Parchment / Ochre
      return {
        sparkLight: '150, 110, 50',
        sparkDark: '230, 190, 120',
        shadow: isDark ? 'rgba(230, 190, 120, 0.8)' : 'rgba(150, 110, 50, 0.6)',
        stroke: '#8D6E63',
        strokeDark: '#FFE082',
        beam: 'from-[#8D6E63]/15 via-[#FFE082]/04 to-transparent',
        beamDark: 'dark:from-[#8D6E63]/15 dark:via-[#FFE082]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/news')) {
      // 25. Jain News Feed: Deep Crimson Red
      return {
        sparkLight: '210, 20, 50',
        sparkDark: '255, 100, 120',
        shadow: isDark ? 'rgba(255, 100, 120, 0.8)' : 'rgba(210, 20, 50, 0.6)',
        stroke: '#C2185B',
        strokeDark: '#FF80AB',
        beam: 'from-[#C2185B]/15 via-[#FF80AB]/04 to-transparent',
        beamDark: 'dark:from-[#C2185B]/15 dark:via-[#FF80AB]/02 to-transparent'
      };
    } else if (lowercasePath.includes('/store')) {
      // 26. Jain Store / Samagri: Rich Jade / Deep Teal
      return {
        sparkLight: '0, 121, 107',
        sparkDark: '128, 203, 196',
        shadow: isDark ? 'rgba(128, 203, 196, 0.8)' : 'rgba(0, 121, 107, 0.6)',
        stroke: '#004D40',
        strokeDark: '#80CBC4',
        beam: 'from-[#004D40]/15 via-[#80CBC4]/04 to-transparent',
        beamDark: 'dark:from-[#004D40]/15 dark:via-[#80CBC4]/02 to-transparent'
      };
    } else {
      // Default / Other: Pure Auspicious Saffron-Gold
      return {
        sparkLight: '224, 80, 10',
        sparkDark: '255, 171, 64',
        shadow: isDark ? 'rgba(255, 110, 0, 0.85)' : 'rgba(224, 80, 10, 0.65)',
        stroke: '#D87D0A',
        strokeDark: '#FFCC80',
        beam: 'from-[#FF6D00]/15 via-[#FFB300]/04 to-transparent',
        beamDark: 'dark:from-[#FF6D00]/15 dark:via-[#FFD54F]/02 to-transparent'
      };
    }
  };

  const colors = getRouteColors();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let time = 0;

    // Create floating spiritual Sparks/dust particles
    const sparks: Spark[] = [];
    const sparkCount = Math.min(65, Math.floor((width * height) / 18000));

    const createSpark = (isInitial = false): Spark => {
      const size = Math.random() * 3.5 + 1.2;
      const maxOpacity = Math.random() * 0.65 + 0.3;
      return {
        x: Math.random() * width,
        y: isInitial ? Math.random() * height : height + Math.random() * 40,
        size,
        speedY: -(Math.random() * 0.95 + 0.45),
        amplitude: Math.random() * 2.2 + 0.6,
        frequency: Math.random() * 0.006 + 0.002,
        phase: Math.random() * Math.PI * 2,
        opacity: isInitial ? Math.random() * maxOpacity : 0,
        maxOpacity,
        fadeSpeed: Math.random() * 0.004 + 0.0015,
      };
    };

    // Initialize list of sparks
    for (let i = 0; i < sparkCount; i++) {
      sparks.push(createSpark(true));
    }

    // Initialize 6 independent floating rotating wireframe globes ("jaal type balls") placed at clean, non-overlapping corner positions away from the center
    const globes: Globe[] = [
      {
        pctX: 0.08,
        pctY: 0.32,
        radius: 46,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: 0.010,
        rotSpeedY: 0.014,
        rotSpeedZ: 0.004,
        floatSpeed: 0.0035,
        floatAmp: 35,
        floatOffset: 0
      },
      {
        pctX: 0.92,
        pctY: 0.32,
        radius: 54,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: -0.012,
        rotSpeedY: 0.010,
        rotSpeedZ: -0.004,
        floatSpeed: 0.003,
        floatAmp: 40,
        floatOffset: Math.PI / 3
      },
      {
        pctX: 0.12,
        pctY: 0.58,
        radius: 36,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: 0.008,
        rotSpeedY: -0.012,
        rotSpeedZ: 0.006,
        floatSpeed: 0.004,
        floatAmp: 25,
        floatOffset: Math.PI * 2 / 3
      },
      {
        pctX: 0.88,
        pctY: 0.58,
        radius: 44,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: 0.0072,
        rotSpeedY: 0.008,
        rotSpeedZ: -0.008,
        floatSpeed: 0.0032,
        floatAmp: 30,
        floatOffset: Math.PI
      },
      {
        pctX: 0.08,
        pctY: 0.84,
        radius: 40,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: -0.0088,
        rotSpeedY: 0.012,
        rotSpeedZ: 0.004,
        floatSpeed: 0.0038,
        floatAmp: 28,
        floatOffset: Math.PI * 4 / 3
      },
      {
        pctX: 0.92,
        pctY: 0.84,
        radius: 48,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
        rotSpeedX: 0.012,
        rotSpeedY: -0.006,
        rotSpeedZ: 0.010,
        floatSpeed: 0.0036,
        floatAmp: 32,
        floatOffset: Math.PI * 5 / 3
      }
    ];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 3D Point Rotation Math
    const rotate3D = (x: number, y: number, z: number, rX: number, rY: number, rZ: number) => {
      // Z-axis rotation
      let cosZ = Math.cos(rZ), sinZ = Math.sin(rZ);
      let x1 = x * cosZ - y * sinZ;
      let y1 = x * sinZ + y * cosZ;
      let z1 = z;

      // Y-axis rotation
      let cosY = Math.cos(rY), sinY = Math.sin(rY);
      let x2 = x1 * cosY - z1 * sinY;
      let z2 = x1 * sinY + z1 * cosY;
      let y2 = y1;

      // X-axis rotation
      let cosX = Math.cos(rX), sinX = Math.sin(rX);
      let y3 = y2 * cosX - z2 * sinX;
      let z3 = y2 * sinX + z2 * cosX;
      let x3 = x2;

      return { x: x3, y: y3, z: z3 };
    };

    const getShiftedHslValues = (shiftIndex: number) => {
      const rgbStr = isDark ? colors.sparkDark : colors.sparkLight;
      const parts = rgbStr.split(',').map(p => parseInt(p.trim(), 10));
      if (parts.length !== 3 || parts.some(isNaN)) {
        return { h: isDark ? 36 : 30, s: 100, l: isDark ? 65 : 45 };
      }
      const [r, g, b] = parts;

      let rNormal = r / 255;
      let gNormal = g / 255;
      let bNormal = b / 255;
      const max = Math.max(rNormal, gNormal, bNormal);
      const min = Math.min(rNormal, gNormal, bNormal);
      let h = 0;
      let s = 0;
      let l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNormal: h = (gNormal - bNormal) / d + (gNormal < bNormal ? 6 : 0); break;
          case gNormal: h = (bNormal - rNormal) / d + 2; break;
          case bNormal: h = (rNormal - gNormal) / d + 4; break;
        }
        h /= 6;
      }

      h = h * 360;
      const shifts = [0, 60, 120, 180, 240, 300];
      const shiftedHue = (h + shifts[shiftIndex]) % 360;
      const saturation = Math.max(85, Math.min(100, s * 100)); // Beautifully saturated
      const lightness = isDark ? 66 : 46; // Bright neon glow

      return { h: shiftedHue, s: saturation, l: lightness };
    };

    // Main particle and 3D wireframe render loop
    const render = () => {
      time++;
      ctx.clearRect(0, 0, width, height);

      // --- Draw 3D Floating Rotating Wireframe Geodesic Globes ---
      // Apply beautiful subtle shadow glow on globes for high-quality neon style
      ctx.shadowBlur = isDark ? 10 : 5;

      globes.forEach((globe, index) => {
        const hsl = getShiftedHslValues(index);
        const globeShadowColor = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.6)`;
        ctx.shadowColor = globeShadowColor;

        // Calculate dynamic float positioning
        const gx = width * globe.pctX;
        const gy = height * globe.pctY + Math.sin(time * globe.floatSpeed + globe.floatOffset) * globe.floatAmp;
        
        // Update rotation angles
        globe.rotX += globe.rotSpeedX;
        globe.rotY += globe.rotSpeedY;
        globe.rotZ += globe.rotSpeedZ;

        // Draw Globe Geodesic Grid
        ctx.lineWidth = 0.8;

        // 1. Draw Latitudes (horizontal rings)
        const latAngles = [-Math.PI / 3, -Math.PI / 6, 0, Math.PI / 6, Math.PI / 3];
        latAngles.forEach((lat) => {
          const r = globe.radius * Math.cos(lat);
          const h = globe.radius * Math.sin(lat);

          ctx.beginPath();
          for (let p = 0; p <= 16; p++) {
            const phi = (p * Math.PI * 2) / 16;
            const px = r * Math.cos(phi);
            const py = h;
            const pz = r * Math.sin(phi);

            const rot = rotate3D(px, py, pz, globe.rotX, globe.rotY, globe.rotZ);
            
            // Fade grid based on depth (Z axis coordinate) for realistic 3D appearance
            const depthFactor = (rot.z + globe.radius) / (globe.radius * 2); // 0 to 1
            const alpha = isDark ? (0.12 + depthFactor * 0.28) : (0.08 + depthFactor * 0.20);
            ctx.strokeStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;

            const sx = gx + rot.x;
            const sy = gy + rot.y;

            if (p === 0) ctx.moveTo(sx, sy);
            else {
              ctx.lineTo(sx, sy);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(sx, sy);
            }
          }
        });

        // 2. Draw Longitudes (vertical segments connecting poles)
        const lons = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4];
        lons.forEach((lon) => {
          ctx.beginPath();
          for (let p = 0; p <= 16; p++) {
            const theta = (p * Math.PI * 2) / 16;
            const px = globe.radius * Math.sin(theta) * Math.cos(lon);
            const py = globe.radius * Math.cos(theta);
            const pz = globe.radius * Math.sin(theta) * Math.sin(lon);

            const rot = rotate3D(px, py, pz, globe.rotX, globe.rotY, globe.rotZ);
            const depthFactor = (rot.z + globe.radius) / (globe.radius * 2);
            const alpha = isDark ? (0.12 + depthFactor * 0.28) : (0.08 + depthFactor * 0.20);
            ctx.strokeStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${alpha})`;

            const sx = gx + rot.x;
            const sy = gy + rot.y;

            if (p === 0) ctx.moveTo(sx, sy);
            else {
              ctx.lineTo(sx, sy);
              ctx.stroke();
              ctx.beginPath();
              ctx.moveTo(sx, sy);
            }
          }
        });

        // 3. Draw intersecting glowing nodes (vertices) to create the modern 3D network look
        ctx.fillStyle = `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${isDark ? 0.75 : 0.55})`;
        const sampleLats = [-Math.PI / 4, 0, Math.PI / 4];
        const samplePhis = [0, Math.PI / 4, Math.PI / 2, (Math.PI * 3) / 4, Math.PI, (Math.PI * 5) / 4, (Math.PI * 3) / 2, (Math.PI * 7) / 2];
        
        sampleLats.forEach((lat) => {
          const r = globe.radius * Math.cos(lat);
          const h = globe.radius * Math.sin(lat);
          samplePhis.forEach((phi) => {
            const px = r * Math.cos(phi);
            const py = h;
            const pz = r * Math.sin(phi);

            const rot = rotate3D(px, py, pz, globe.rotX, globe.rotY, globe.rotZ);
            const depthFactor = (rot.z + globe.radius) / (globe.radius * 2); // 0 to 1
            if (depthFactor > 0.4) { // Only draw on the front facing hemisphere
              ctx.beginPath();
              ctx.arc(gx + rot.x, gy + rot.y, 1.8, 0, Math.PI * 2);
              ctx.fill();
            }
          });
        });
      });

      // --- Draw Rising Sparks ---
      ctx.shadowBlur = isDark ? 10 : 6;
      ctx.shadowColor = colors.shadow;

      for (let i = 0; i < sparks.length; i++) {
        const spark = sparks[i];

        // Wave motion sway
        spark.phase += spark.frequency;
        const currentX = spark.x + Math.sin(spark.phase) * spark.amplitude;

        ctx.beginPath();
        ctx.arc(currentX, spark.y, spark.size, 0, Math.PI * 2);

        const color = isDark 
          ? `rgba(${colors.sparkDark}, ${spark.opacity})` 
          : `rgba(${colors.sparkLight}, ${spark.opacity * 0.95})`;

        ctx.fillStyle = color;
        ctx.fill();

        // Update position
        spark.y += spark.speedY;

        // Fade near boundaries
        if (spark.y < height * 0.15) {
          spark.opacity -= spark.fadeSpeed * 1.6;
        } else if (spark.opacity < spark.maxOpacity) {
          spark.opacity += spark.fadeSpeed;
        }

        // Reset if offscreen or faded
        if (spark.y < -15 || spark.opacity <= 0) {
          sparks[i] = createSpark(false);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, path, colors.shadow, colors.sparkDark, colors.sparkLight, isDark]);

  const isHomePage = path === '/' || path === '' || path === '/home';
  const fillColor = isHomePage 
    ? (isDark ? '#ffffff' : 'url(#homeChakraGradient)') 
    : (isDark ? colors.strokeDark : colors.stroke);

  const strokeColor = isHomePage 
    ? (isDark ? '#ffffff' : 'url(#homeChakraGradient)') 
    : (isDark ? colors.strokeDark : colors.stroke);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none">
      {/* Background paper texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Elegant Dynamic Spiritual Beam of Light from Top-Center */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[85%] max-w-[900px] h-full bg-gradient-to-b ${colors.beam} ${colors.beamDark} to-transparent blur-[80px] opacity-100 pointer-events-none transition-all duration-1000`} />

      {/* Canvas for rising Sparks and 3D Rotating Geodesic Globes */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-100" />

      {/* Masterpiece Intricate Centered Mandala Watermark (Slightly smaller, 100% symmetrical, premium detailing with glowing neon shadows) */}
      <div 
        className="absolute left-1/2 top-1/2 w-[80vw] h-[80vw] max-w-[480px] max-h-[480px] opacity-[0.45] dark:opacity-[0.62] transition-all duration-1000 select-none pointer-events-none"
        style={{
          transform: 'translate3d(-50%, -50%, 0)',
          animation: 'spinClockwise 150s linear infinite',
          willChange: 'transform',
          filter: isDark 
            ? `drop-shadow(0 0 ${isHomePage ? '0.5px' : '3px'} ${isHomePage ? 'rgba(255, 255, 255, 0.3)' : colors.strokeDark})` 
            : `drop-shadow(0 0 ${isHomePage ? '0.3px' : '1.5px'} ${isHomePage ? 'rgba(255, 109, 0, 0.25)' : colors.stroke})`
        }}
      >
        <svg 
          viewBox="0 0 100 100" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className={`chakra-svg w-full h-full transition-all duration-1000 ${isHomePage ? 'stroke-[0.11]' : 'stroke-[0.32]'}`} 
          style={{ stroke: strokeColor }}
        >
          <defs>
            <linearGradient id="homeChakraGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF6D00" /> {/* Saffron */}
              <stop offset="20%" stopColor="#FFD54F" /> {/* Gold */}
              <stop offset="40%" stopColor="#00E676" /> {/* Green */}
              <stop offset="60%" stopColor="#00E5FF" /> {/* Cyan */}
              <stop offset="80%" stopColor="#2979FF" /> {/* Blue */}
              <stop offset="100%" stopColor="#AA00FF" /> {/* Purple */}
            </linearGradient>
          </defs>

          {/* 1. Center Point / Bindu */}
          <circle cx="50" cy="50" r="1.5" fill={fillColor} />
          
          {/* 2. Concentric Core Rings */}
          <circle cx="50" cy="50" r="4.2" strokeWidth="0.25" />
          <circle cx="50" cy="50" r="7.5" strokeDasharray="1 1" strokeWidth="0.20" />
          <circle cx="50" cy="50" r="11" strokeWidth="0.25" />

          {/* 3. Innermost 12 core petals */}
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 4.2 * Math.cos(rad);
            const y1 = 50 + 4.2 * Math.sin(rad);
            const x2 = 50 + 11 * Math.cos(rad);
            const y2 = 50 + 11 * Math.sin(rad);
            const cp1x = 50 + 8 * Math.cos(rad - 0.15);
            const cp1y = 50 + 8 * Math.sin(rad - 0.15);
            const cp2x = 50 + 8 * Math.cos(rad + 0.15);
            const cp2y = 50 + 8 * Math.sin(rad + 0.15);
            return (
              <path
                key={`core-petal-${i}`}
                d={`M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2} Q ${cp2x} ${cp2y} ${x1} ${y1}`}
                strokeWidth="0.20"
              />
            );
          })}

          {/* 4. Second petal layer (16 lotus petals, double-stroked) */}
          {[...Array(16)].map((_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 11 * Math.cos(rad);
            const y1 = 50 + 11 * Math.sin(rad);
            const x2 = 50 + 20 * Math.cos(rad);
            const y2 = 50 + 20 * Math.sin(rad);
            const cp1x = 50 + 16 * Math.cos(rad - 0.18);
            const cp1y = 50 + 16 * Math.sin(rad - 0.18);
            const cp2x = 50 + 16 * Math.cos(rad + 0.18);
            const cp2y = 50 + 16 * Math.sin(rad + 0.18);
            return (
              <g key={`mid-petal-group-${i}`}>
                {/* Outer stroke of petal */}
                <path
                  d={`M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2} Q ${cp2x} ${cp2y} ${x1} ${y1}`}
                  strokeWidth="0.22"
                />
                {/* Inner smaller detail stroke */}
                <path
                  d={`M ${50 + 13 * Math.cos(rad)} ${50 + 13 * Math.sin(rad)} Q ${50 + 16 * Math.cos(rad - 0.1)} ${50 + 16 * Math.sin(rad - 0.1)} ${50 + 18 * Math.cos(rad)} ${50 + 18 * Math.sin(rad)} Q ${50 + 16 * Math.cos(rad + 0.1)} ${50 + 16 * Math.sin(rad + 0.1)} ${50 + 13 * Math.cos(rad)} ${50 + 13 * Math.sin(rad)}`}
                  strokeWidth="0.12"
                  strokeDasharray="1 0.5"
                />
              </g>
            );
          })}

          {/* 5. Lace ring bands */}
          <circle cx="50" cy="50" r="20.5" strokeWidth="0.22" />
          <circle cx="50" cy="50" r="23" strokeDasharray="1.5 1" strokeWidth="0.20" />
          <circle cx="50" cy="50" r="25" strokeWidth="0.22" />

          {/* 6. Scalloped lace arches (32 delicate interlocking arches) */}
          {[...Array(32)].map((_, i) => {
            const angle = (i * 360) / 32;
            const rad1 = (angle * Math.PI) / 180;
            const rad2 = (((i + 1) * 360 / 32) * Math.PI) / 180;
            const x1 = 50 + 25 * Math.cos(rad1);
            const y1 = 50 + 25 * Math.sin(rad1);
            const x2 = 50 + 25 * Math.cos(rad2);
            const y2 = 50 + 25 * Math.sin(rad2);
            // Midpoint extended slightly outward
            const midRad = ((angle + 360 / 64) * Math.PI) / 180;
            const mx = 50 + 27.2 * Math.cos(midRad);
            const my = 50 + 27.2 * Math.sin(midRad);
            return (
              <path
                key={`lace-${i}`}
                d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`}
                strokeWidth="0.20"
              />
            );
          })}

          <circle cx="50" cy="50" r="28.2" strokeWidth="0.25" />

          {/* 7. Large elegant radiating outer petals (24 pointed temple petals with double strokes) */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 360) / 24;
            const rad = (angle * Math.PI) / 180;
            const x1 = 50 + 28.2 * Math.cos(rad);
            const y1 = 50 + 28.2 * Math.sin(rad);
            const x2 = 50 + 39.5 * Math.cos(rad);
            const y2 = 50 + 39.5 * Math.sin(rad);
            const cp1x = 50 + 33.5 * Math.cos(rad - 0.13);
            const cp1y = 50 + 33.5 * Math.sin(rad - 0.13);
            const cp2x = 50 + 33.5 * Math.cos(rad + 0.13);
            const cp2y = 50 + 33.5 * Math.sin(rad + 0.13);
            return (
              <g key={`outer-petal-group-${i}`}>
                {/* Outer petal border */}
                <path
                  d={`M ${x1} ${y1} Q ${cp1x} ${cp1y} ${x2} ${y2} Q ${cp2x} ${cp2y} ${x1} ${y1}`}
                  strokeWidth="0.25"
                />
                {/* Fine central vein line inside each petal */}
                <line
                  x1={50 + 29.5 * Math.cos(rad)}
                  y1={50 + 29.5 * Math.sin(rad)}
                  x2={50 + 37.2 * Math.cos(rad)}
                  y2={50 + 37.2 * Math.sin(rad)}
                  strokeWidth="0.15"
                  strokeDasharray="1.5 1"
                />
                {/* Micro dots on the sides of the petal tip */}
                <circle cx={50 + 36 * Math.cos(rad - 0.06)} cy={50 + 36 * Math.sin(rad - 0.06)} r="0.4" fill={fillColor} />
                <circle cx={50 + 36 * Math.cos(rad + 0.06)} cy={50 + 36 * Math.sin(rad + 0.06)} r="0.4" fill={fillColor} />
              </g>
            );
          })}

          {/* 8. Outer borders, rings & bead patterns */}
          <circle cx="50" cy="50" r="41.5" strokeWidth="0.32" />
          <circle cx="50" cy="50" r="44" strokeDasharray="2 1.5" strokeWidth="0.22" />
          <circle cx="50" cy="50" r="46.2" strokeWidth="0.32" />

          {/* 9. Small outermost decorative scallops (48 mini flame points pointing outwards) */}
          {[...Array(48)].map((_, i) => {
            const angle = (i * 360) / 48;
            const rad1 = (angle * Math.PI) / 180;
            const rad2 = (((i + 0.5) * 360 / 48) * Math.PI) / 180;
            const rad3 = (((i + 1) * 360 / 48) * Math.PI) / 180;
            
            const x1 = 50 + 46.2 * Math.cos(rad1);
            const y1 = 50 + 46.2 * Math.sin(rad1);
            const xTip = 50 + 48.5 * Math.cos(rad2);
            const yTip = 50 + 48.5 * Math.sin(rad2);
            const x2 = 50 + 46.2 * Math.cos(rad3);
            const y2 = 50 + 46.2 * Math.sin(rad3);
            
            return (
              <path
                key={`outer-scallop-${i}`}
                d={`M ${x1} ${y1} L ${xTip} ${yTip} L ${x2} ${y2}`}
                strokeWidth="0.20"
              />
            );
          })}

          {/* 10. Outer beads */}
          {[...Array(48)].map((_, i) => {
            const angle = (i * 360) / 48;
            const rad = (angle * Math.PI) / 180;
            return (
              <circle 
                key={`outer-bead-${i}`}
                cx={50 + 45.1 * Math.cos(rad)} 
                cy={50 + 45.1 * Math.sin(rad)} 
                r="0.5"
                fill={fillColor}
              />
            );
          })}
        </svg>
      </div>

      {/* CSS Stylesheet embedded for spinning animations */}
      <style>{`
        @keyframes spinClockwise {
          0% { transform: translate3d(-50%, -50%, 0) rotate(0deg); }
          100% { transform: translate3d(-50%, -50%, 0) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
