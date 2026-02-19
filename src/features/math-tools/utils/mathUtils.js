// 1. SAFE EVALUATOR 
export const evaluateExpr = (expr) => {
  try {
    if (!expr) return '';
    if (/[^0-9+\-*/().\s\^πe]/.test(expr.replace(/sin|cos|tan|log|ln|sqrt/g, ''))) {
        return 'Error';
    }

    let sanitized = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'Math.PI')
      .replace(/e/g, 'Math.E')
      .replace(/√/g, 'Math.sqrt')
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/log/g, 'Math.log10')
      .replace(/ln/g, 'Math.log');

    // eslint-disable-next-line no-new-func
    const result = new Function('return ' + sanitized)();
    
    // Handle Infinity / NaN
    if (!isFinite(result) || isNaN(result)) return 'Error';
    
    return Math.round(result * 1000000000) / 1000000000;
  } catch (err) {
    return 'Error';
  }
};

// 2. UNIT CONVERTER DATA
export const UNITS = {
  length: {
    base: 'm',
    units: {
      km: 1000, m: 1, cm: 0.01, mm: 0.001, 
      mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254
    }
  },
  weight: {
    base: 'kg',
    units: {
      t: 1000, kg: 1, g: 0.001, mg: 0.000001,
      lb: 0.453592, oz: 0.0283495
    }
  },
  data: {
    base: 'B',
    units: {
      TB: 1099511627776, GB: 1073741824, MB: 1048576, KB: 1024, B: 1
    }
  },
  time: {
    base: 's',
    units: {
      yr: 31536000, wk: 604800, d: 86400, hr: 3600, min: 60, s: 1, ms: 0.001
    }
  }
};

export const convertUnit = (value, from, to, type) => {
  if (type === 'temperature') {
    if (from === to) return value;
    let celsius = value;
    if (from === 'F') celsius = (value - 32) * (5/9);
    if (from === 'K') celsius = value - 273.15;
    
    if (to === 'C') return celsius;
    if (to === 'F') return (celsius * 9/5) + 32;
    if (to === 'K') return celsius + 273.15;
    return value;
  }

  const factors = UNITS[type]?.units;
  if (!factors) return 0;
  const baseValue = value * factors[from]; 
  return baseValue / factors[to]; 
};

// 3. DATE UTILS
export const dateDiff = (d1, d2) => {
  const date1 = new Date(d1);
  const date2 = new Date(d2);
  const diffTime = Math.abs(date2 - date1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const years = Math.floor(diffDays / 365);
  const months = Math.floor((diffDays % 365) / 30);
  const days = Math.floor((diffDays % 365) % 30);

  return { totalDays: diffDays, years, months, days };
};