import { persistentAtom } from '@nanostores/persistent';

export const messagesStore = persistentAtom('messages', [], {
    encode: JSON.stringify,
    decode: JSON.parse,
})