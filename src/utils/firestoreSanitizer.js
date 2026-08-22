/**
 * Utility to recursively sanitize data before saving to Firestore.
 * Firestore does not support arrays containing other arrays.
 * This also removes undefined values.
 */

export function findNestedArrays(data, currentPath = "root", found = []) {
  if (data === null || data === undefined) return found;

  if (Array.isArray(data)) {
    data.forEach((item, index) => {
      const itemPath = `${currentPath}[${index}]`;
      if (Array.isArray(item)) {
        found.push(itemPath);
      } else if (typeof item === 'object' && item !== null) {
        findNestedArrays(item, itemPath, found);
      }
    });
  } else if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      const childPath = `${currentPath}.${key}`;
      if (Array.isArray(data[key])) {
        // Check if this array contains another array
        data[key].forEach((item, index) => {
          if (Array.isArray(item)) {
            found.push(`${childPath}[${index}]`);
          } else if (typeof item === 'object' && item !== null) {
            findNestedArrays(item, `${childPath}[${index}]`, found);
          }
        });
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        findNestedArrays(data[key], childPath, found);
      }
    });
  }

  return found;
}

export function sanitizeForFirestore(data) {
  if (data === undefined) {
    return null; // Replace undefined with null
  }

  if (data === null || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    // Check if it's an array of arrays
    const hasInnerArray = data.some(item => Array.isArray(item));
    
    if (hasInnerArray) {
      // Convert inner arrays to objects to make it Firestore safe
      return data.map(item => {
        if (Array.isArray(item)) {
          return { items: item.map(subItem => sanitizeForFirestore(subItem)) };
        }
        return sanitizeForFirestore(item);
      });
    }

    // Normal array, just sanitize children
    return data.map(item => sanitizeForFirestore(item)).filter(item => item !== undefined);
  }

  // It's an object
  const cleanObj = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      cleanObj[key] = sanitizeForFirestore(value);
    }
  }
  return cleanObj;
}
