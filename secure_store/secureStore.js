import EncryptedStorage from 'react-native-encrypted-storage';

export async function storeSecureData(key,obj){
    try {
        await EncryptedStorage.setItem(
            key,
            JSON.stringify(obj)
        );
        console.log('secret stored successfully')
        return true
    } catch (error) {
        console.log('secret stored error')
        console.log(error)
        return false
    }
}

export async function getSecureData(key){
        try {   
            const session = await EncryptedStorage.getItem(key);

            if (session !== undefined) {
                return session
            }
        } catch (error) {
            console.log('cant get data from secure store',error)
        }
}


export async function clearSecureStorage() {
    try {
        await EncryptedStorage.clear();
        return true
    } catch (error) {
        return false
    }
}

export async function removeSecureData(key) {
    try {
        await EncryptedStorage.removeItem(key);
    } catch (error) {
    }
}