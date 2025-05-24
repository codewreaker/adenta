import { useCallback, useEffect, useState } from 'react';
import './styles.css';

export interface ColorWheelProps {
  initialColor?: string;
  onChange?: (color: string) => void;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function ColorWheel({ 
  initialColor = '#1f2028',
  onChange,
  position = 'bottom-right'
}: ColorWheelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentColors, setCurrentColors] = useState({
    bg: initialColor,
    primary: '#ff6a1a',
    bgDark: '#181114',
    bgDarker: '#1a1012'
  });

  const updatePalette = useCallback((bgColor: string) => {
    if (!isMounted) return;

    try {
      const hsl = parseColor(bgColor);
      const primaryColor = adjustHSL(hsl, { s: 30, l: 30 });
      const bgDarkColor = adjustHSL(hsl, { l: -10 });
      const bgDarkerColor = adjustHSL(hsl, { l: -15 });
      const gradientColor = adjustHSL(hsl, { l: -5 });
      
      const root = document.documentElement;
      
      // Update colors
      root.style.setProperty('--color-bg', bgColor);
      root.style.setProperty('--color-bg-dark', bgDarkColor);
      root.style.setProperty('--color-bg-darker', bgDarkerColor);
      root.style.setProperty('--color-primary', primaryColor);
      root.style.setProperty('--color-primary-light', primaryColor);
      root.style.setProperty(
        '--color-bg-gradient',
        `linear-gradient(135deg, ${gradientColor} 60%, ${primaryColor} 100%)`
      );
      
      // Update shadows
      const { r, g, b } = hexToRGB(primaryColor);
      root.style.setProperty('--color-shadow', `rgba(${r}, ${g}, ${b}, 0.1)`);
      root.style.setProperty('--color-shadow-strong', `rgba(${r}, ${g}, ${b}, 0.18)`);
      root.style.setProperty('--color-shadow-light', `rgba(${r}, ${g}, ${b}, 0.04)`);
      root.style.setProperty('--color-shadow-tab', `rgba(${r}, ${g}, ${b}, 0.08)`);

      setCurrentColors({
        bg: bgColor,
        primary: primaryColor,
        bgDark: bgDarkColor,
        bgDarker: bgDarkerColor
      });

      onChange?.(bgColor);
    } catch (error) {
      console.error('Error updating palette:', error);
    }
  }, [isMounted, onChange]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      const root = document.documentElement;
      ['--color-bg', '--color-bg-dark', '--color-bg-darker', '--color-primary',
       '--color-primary-light', '--color-bg-gradient', '--color-shadow',
       '--color-shadow-strong', '--color-shadow-light', '--color-shadow-tab']
        .forEach(prop => root.style.removeProperty(prop));
    };
  }, []);

  useEffect(() => {
    if (isMounted && initialColor) {
      updatePalette(initialColor);
    }
  }, [initialColor, isMounted, updatePalette]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updatePalette(e.target.value);
  };

  return (
    <div className={`color-picker-container ${position}`}>
      <div className="theme-picker">
        <div className="preview-palette">
          <div 
            className="color-preview bg" 
            title={`Background: ${currentColors.bg}`}
            onClick={() => setIsOpen(true)}
            style={{ backgroundColor: currentColors.bg }}
          />
          <div 
            className="color-preview bg-dark"
            title={`Dark: ${currentColors.bgDark}`}
            style={{ backgroundColor: currentColors.bgDark }}
          />
          <div 
            className="color-preview bg-darker"
            title={`Darker: ${currentColors.bgDarker}`}
            style={{ backgroundColor: currentColors.bgDarker }}
          />
          <div 
            className="color-preview primary"
            title={`Primary: ${currentColors.primary}`}
            style={{ backgroundColor: currentColors.primary }}
          />
        </div>
      </div>

      {isOpen && (
        <div className="color-picker-overlay" onClick={() => setIsOpen(false)}>
          <div className="color-picker-content" onClick={e => e.stopPropagation()}>
            <input
              type="color"
              id="colorWheel"
              value={currentColors.bg}
              onChange={handleColorChange}
              title="Choose background color"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function parseColor(color: string) {
  // For HSL colors
  const hslMatch = color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/i);
  if (hslMatch) {
    return {
      h: parseInt(hslMatch[1]),
      s: parseInt(hslMatch[2]),
      l: parseInt(hslMatch[3])
    };
  }

  // For Hex colors
  const hex = color.startsWith('#') ? color : `#${color}`;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid color format. Use hex (#RRGGBB) or HSL format.');
  }

  const r = parseInt(result[1], 16) / 255;
  const g = parseInt(result[2], 16) / 255;
  const b = parseInt(result[3], 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }

  return { h, s: s * 100, l: l * 100 };
}

function adjustHSL(
  { h, s, l }: { h: number; s: number; l: number },
  { h: dh = 0, s: ds = 0, l: dl = 0 }
) {
  const newH = (h + dh) % 360;
  const newS = Math.min(100, Math.max(0, s + ds));
  const newL = Math.min(100, Math.max(0, l + dl));
  return HSLToHex(newH, newS, newL);
}

function HSLToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l - c/2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }

  const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}

function hexToRGB(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    throw new Error('Invalid hex color');
  }
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  };
}
