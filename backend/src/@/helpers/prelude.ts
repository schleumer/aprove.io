export function memoAsync<T>(fn: () => Promise<T>): () => Promise<T> {
    let cachedValue = null;

    return async () => {
        if (cachedValue) {
            return cachedValue;
        }

        cachedValue = await fn();

        return cachedValue;
    };
}
