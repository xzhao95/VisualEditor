type SimplyListener = () => void
export function createEvent() {
    const listeners = [] as SimplyListener[];

    return {
        on: (cb: () => void) => {
            listeners.push(cb)
        },
        off: (cb: () => void) => {
            const index = listeners.indexOf(cb);
            if(index >= 0) {
                listeners.splice(index, 1)
            }
        },
        emit: () => {
            listeners.forEach(fn => fn())
        }
    }
}