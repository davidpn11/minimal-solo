import * as O from 'fp-ts/lib/Option';

const STORAGE_TO_USE = window.sessionStorage; // localStorage || sessionStorage

/**
 * This function is neccessary on a try/catch basis due to the fact that
 * having localStorage being denied by the user won't just return an undefined,
 * it will thrown an error which makes the whole app unusable.
 * http://crocodillon.com/blog/always-catch-localstorage-security-and-quota-exceeded-errors
 */
export function getStorage(): O.Option<Storage> {
  try {
    return O.fromNullable(STORAGE_TO_USE);
  } catch (e) {
    return O.none;
  }
}

/**
 * SetItem will thrown quota exceeded errors when Storage is full.
 * This function makes so it doesn't blow up the page.
 * Storage is not neccessary for the app to work properly.
 * @param key Local Storage Key
 * @param value Value to be Saved
 */
export function safeSetItem(key: string, value: string) {
  return (storage: Storage) => {
    try {
      storage.setItem(key, value);
    } catch (e) {
      storage.clear();
    }
  };
}
