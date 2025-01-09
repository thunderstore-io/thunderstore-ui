export class StorageManager {
  readonly namespace: string;

  constructor(namespace = "") {
    this.namespace = namespace;
  }

  getValue(key: string): string | null {
    return this._storage.getItem(this._addNamespace(key));
  }

  popValue(key: string): string | null {
    const value = this.getValue(key);
    this.removeValue(key);
    return value;
  }

  removeValue(key: string): void {
    this._storage.removeItem(this._addNamespace(key));
  }

  /** Returns null if storage is unavailable or it contained no value. */
  safeGetValue(key: string): string | null {
    try {
      return this.getValue(key);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  }

  setValue(key: string, value: string): void {
    this._storage.setItem(this._addNamespace(key), value);
  }

  // Accessing window.localStorage directly causes the build process to crash.
  get _storage(): Storage {
    if (typeof window === "undefined") {
      throw new Error("Storage is only available in browser");
    }

    return window.localStorage;
  }

  _addNamespace(key: string): string {
    return this.namespace ? `${this.namespace}.${key}` : key;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setJsonValue(key: string, value: any): void {
    this._storage.setItem(this._addNamespace(key), JSON.stringify(value));
  }

  /** Returns null if storage is unavailable, it contained no value or json threw an error. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  safeGetJsonValue(key: string): any | null {
    try {
      const value = this.getValue(key);
      if (value) {
        return JSON.parse(value);
      } else {
        return null;
      }
    } catch (e) {
      console.warn(`JSON parse from ${this.namespace} storage failed`, e);
      return null;
    }
  }
}
