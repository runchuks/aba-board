import * as SecureStore from 'expo-secure-store';

async function set(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

async function get(key: string) {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
        return result
    }
    console.log('no key');
    return null;
}

const STORAGE = {
    set,
    get
}

export default STORAGE
