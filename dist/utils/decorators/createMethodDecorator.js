export function createMethodDecorator(func) {
    return (target, _, descriptor)=>{
        const originalMethod = descriptor.value;
        descriptor.value = async function value(...args) {
            const res = await func(...args);
            if (res === false) return;
            return originalMethod.apply(this, args);
        };
    };
}
