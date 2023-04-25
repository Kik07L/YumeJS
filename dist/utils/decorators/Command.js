export function Command(meta) {
    return (target)=>new Proxy(target, {
            construct: (trgt, args)=>new trgt(...args, meta)
        });
}
