"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var MessageSchema = new mongoose_1.Schema({
    room: { type: String, required: true },
    sender: { type: String, required: true, enum: ["admin", "user"] },
    text: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });
var Message = mongoose_1.default.models.Message || mongoose_1.default.model("Message", MessageSchema);
exports.default = Message;
