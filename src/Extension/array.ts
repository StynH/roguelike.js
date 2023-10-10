export {}

declare global {
    interface Array<T> {
        shuffle(): Array<T>;
    }
}

Array.prototype.shuffle = function<T>(): Array<T> {
    const array = [...this];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};
