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
}
