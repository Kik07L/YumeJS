export const pathStringToURLString = (path)=>new URL(`file://${path}`).toString();
