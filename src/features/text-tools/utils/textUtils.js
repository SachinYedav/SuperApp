// 1. JSON FORMATTER
export const formatJson = (input) => {
  try {
    const parsed = JSON.parse(input);
    return { value: JSON.stringify(parsed, null, 2), error: null };
  } catch (e) {
    return { value: input, error: e.message };
  }
};

export const minifyJson = (input) => {
  try {
    const parsed = JSON.parse(input);
    return { value: JSON.stringify(parsed), error: null };
  } catch (e) {
    return { value: input, error: e.message };
  }
};

// 2. TEXT TRANSFORMER
export const transformText = (text, type) => {
  if (!text) return '';
  switch (type) {
    case 'upper': return text.toUpperCase();
    case 'lower': return text.toLowerCase();
    case 'title': return text.replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
    case 'reverse': return text.split('').reverse().join('');
    case 'remove-lines': return text.replace(/(\r\n|\n|\r)/gm, " ");
    case 'slug': return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    default: return text;
  }
};

export const analyzeText = (text) => {
  return {
    chars: text.length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    lines: text ? text.split(/\r\n|\r|\n/).length : 0
  };
};

// 3. BASE64
export const base64Action = (text, action) => {
  try {
    return { 
      value: action === 'encode' ? btoa(text) : atob(text), 
      error: null 
    };
  } catch (e) {
    return { value: text, error: 'Invalid Input format for Base64' };
  }
};

// 4. JWT DECODER
export const decodeJwt = (token) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) throw new Error('Invalid JWT format');
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        return { header, payload, error: null };
    } catch (e) {
        return { header: null, payload: null, error: 'Invalid Token' };
    }
};

// 5. REGEX TESTER
export const testRegex = (regexStr, text, flags = 'gm') => {
    try {
        if (!regexStr) return { matches: [], error: null };
        const regex = new RegExp(regexStr, flags);
        const matches = text.match(regex);
        return { matches: matches || [], error: null };
    } catch (e) {
        return { matches: [], error: e.message };
    }
};