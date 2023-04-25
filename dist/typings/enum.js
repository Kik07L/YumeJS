/* eslint-disable @typescript-eslint/naming-convention */ export var MessageComponentTypes;
(function(MessageComponentTypes) {
    MessageComponentTypes[MessageComponentTypes["ACTION_ROW"] = 1] = "ACTION_ROW";
    MessageComponentTypes[MessageComponentTypes["BUTTON"] = 2] = "BUTTON";
    MessageComponentTypes[MessageComponentTypes["SELECT_MENU"] = 3] = "SELECT_MENU";
})(MessageComponentTypes || (MessageComponentTypes = {}));
export var InteractionTypes;
(function(InteractionTypes) {
    InteractionTypes[InteractionTypes["PING"] = 1] = "PING";
    InteractionTypes[InteractionTypes["APPLICATION_COMMAND"] = 2] = "APPLICATION_COMMAND";
    InteractionTypes[InteractionTypes["MESSAGE_COMPONENT"] = 3] = "MESSAGE_COMPONENT";
})(InteractionTypes || (InteractionTypes = {}));
