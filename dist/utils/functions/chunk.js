export function chunk(arr, len) {
    const res = [];
    for(let i = 0; i < arr.length; i += len){
        res.push(arr.slice(i, i + len));
    }
    return res;
}
