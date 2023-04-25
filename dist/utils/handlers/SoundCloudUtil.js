import { createRequire } from "node:module";
// Temporary solution
const require = createRequire(import.meta.url);
const Soundcloud = require("soundcloud.ts");
export const soundcloud = new Soundcloud.default();
