class LocalStorageManager {
  constructor(prefix = '') {
    this.prefix = prefix;
  }

  _key(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value) {
    try {
      localStorage.setItem(this._key(key), JSON.stringify(value));
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  get(key) {
    try {
      const value = localStorage.getItem(this._key(key));
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Error reading from localStorage', e);
      return null;
    }
  }

  remove(key) {
    try {
      localStorage.removeItem(this._key(key));
    } catch (e) {
      console.error('Error removing from localStorage', e);
    }
  }

  clearAll() {
    // Only clears keys with the prefix
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

export default LocalStorageManager