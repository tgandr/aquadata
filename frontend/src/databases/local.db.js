import { Preferences } from "@capacitor/preferences";

export default class LocalDb{
    static async get(key) {
        const res = await Preferences.get({key})
        return JSON.parse(res.value)
    }

    static async set(key, value) {
        await Preferences.set({key,value: JSON.stringify(value)})
    }
}