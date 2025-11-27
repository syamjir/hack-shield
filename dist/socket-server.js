"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path_1 = require("path");
// Load your .env.local file manually
dotenv.config({ path: (0, path_1.resolve)(process.cwd(), ".env.local") });
var socket_io_1 = require("socket.io");
var Message_js_1 = require("./models/Message.js");
var connectToMongo_js_1 = require("./lib/connectToMongo.js");
// -------------------------------------------------
// 1️⃣ CONNECT TO MONGO ONE TIME BEFORE STARTING SERVER
// -------------------------------------------------
function start() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1, io, onlineUsers;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, connectToMongo_js_1.connectToMongo)()];
                case 1:
                    _a.sent();
                    console.log("✅ MongoDB Connected for Socket Server");
                    return [3 /*break*/, 3];
                case 2:
                    err_1 = _a.sent();
                    console.error("❌ Database connection failed:", err_1);
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3:
                    io = new socket_io_1.Server(4000, {
                        cors: { origin: "*" },
                    });
                    onlineUsers = {};
                    io.on("connection", function (socket) {
                        console.log("🔥 Socket connected:", socket.id);
                        // JOIN ROOM
                        socket.on("join_room", function (roomId) { return __awaiter(_this, void 0, void 0, function () {
                            var uniqueOnlineUsers, onlineUsersIds, messages;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        socket.join(roomId);
                                        onlineUsers[socket.id] = roomId;
                                        uniqueOnlineUsers = Object.values(onlineUsers).reduce(function (acc, curr) {
                                            if (!acc.includes(curr))
                                                acc.push(curr);
                                            return acc;
                                        }, []);
                                        onlineUsersIds = Object.values(onlineUsers);
                                        // const isOnline =
                                        //   onlineUsersIds.length === 2 && onlineUsersIds[0] === onlineUsersIds[1];
                                        io.emit("online-users", uniqueOnlineUsers);
                                        io.to(roomId).emit("online_status", {
                                            userId: roomId,
                                            online: true,
                                        });
                                        return [4 /*yield*/, Message_js_1.default.find({ room: roomId })
                                                .sort({
                                                createdAt: 1,
                                            })
                                                .lean()];
                                    case 1:
                                        messages = _a.sent();
                                        socket.emit("message_history", messages);
                                        console.log("\uD83D\uDCCC Joined room: ".concat(roomId));
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        // SEND MESSAGE + SAVE TO DB
                        socket.on("send_message", function (msg) { return __awaiter(_this, void 0, void 0, function () {
                            var saved, err_2;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, Message_js_1.default.create({
                                                room: msg.room,
                                                text: msg.text,
                                                sender: msg.sender,
                                            })];
                                    case 1:
                                        saved = _a.sent();
                                        io.to(msg.room).emit("receive_message", saved);
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_2 = _a.sent();
                                        console.error("❌ Message save failed:", err_2);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        // TYPING EVENTS
                        socket.on("typing", function (roomId, sender) {
                            io.to(roomId).emit("typing", { isTyping: true, sender: sender });
                        });
                        socket.on("stop_typing", function (roomId, sender) {
                            io.to(roomId).emit("typing", { isTyping: false, sender: sender });
                        });
                        // MARK READ (called by client when user sees messages)
                        socket.on("mark_read", function (roomId) { return __awaiter(_this, void 0, void 0, function () {
                            var err_3;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        // Update unread messages
                                        return [4 /*yield*/, Message_js_1.default.updateMany({ room: roomId, read: false }, { read: true })];
                                    case 1:
                                        // Update unread messages
                                        _a.sent();
                                        io.to(roomId).emit("messages_read");
                                        return [3 /*break*/, 3];
                                    case 2:
                                        err_3 = _a.sent();
                                        console.error("❌ mark_read error:", err_3);
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                        // DISCONNECT
                        socket.on("disconnect", function () {
                            var roomId = onlineUsers[socket.id];
                            delete onlineUsers[socket.id];
                            io.emit("online-users", Object.values(onlineUsers));
                            if (roomId) {
                                io.to(roomId).emit("online_status", {
                                    userId: roomId,
                                    online: false,
                                });
                            }
                            console.log("❌ Socket disconnected:", socket.id);
                        });
                    });
                    console.log("🚀 Socket Server running on port 4000");
                    return [2 /*return*/];
            }
        });
    });
}
// START SERVER
start();
