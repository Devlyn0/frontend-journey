export class StorageManager {
    constructor() {
        return;
    }
    get<T>(key: string, defaultValue: T | T[]): T | T[] | null {
        let value = localStorage.getItem(key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    set<T>(key: string, value: T | null): void {
        let jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
    }
    removeItem(key: string): void {
        localStorage.removeItem(key);
    }
    clear(): void {
        localStorage.clear();
    }
}