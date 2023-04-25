export class NoStackError extends Error {
    constructor(message){
        super(message);
        this.stack = this.message;
    }
}
