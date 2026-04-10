export class StorageManager {
    constructor() {
        return;
    }
    get(key, defaultValue) {
        let value = localStorage.getItem(key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }
    set(key, value) {
        let jsonValue = JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
    }
    removeItem(key) {
        localStorage.removeItem(key);
    }
    clear() {
        localStorage.clear();
    }
}
