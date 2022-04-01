export enum STORAGE_KEYS {
    USER = 'user',
}

class Storage {
    get(key: STORAGE_KEYS) {
        const item = localStorage.getItem(key)
        if (item) {
            return JSON.parse(item)
        }
    }

    set(key: STORAGE_KEYS, value: any) {
        return localStorage.setItem(key, JSON.stringify(value))
    }

    delete(key: STORAGE_KEYS) {
        return localStorage.removeItem(key)
    }
}

export default new Storage()
