export function Event(event) {
    return (target)=>new Proxy(target, {
            construct: (trgt, args)=>new trgt(...args, event)
        });
}
