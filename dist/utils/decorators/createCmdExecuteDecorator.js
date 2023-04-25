import { createMethodDecorator } from "./createMethodDecorator";
export function createCmdExecuteDecorator(func) {
    return createMethodDecorator(func);
}
