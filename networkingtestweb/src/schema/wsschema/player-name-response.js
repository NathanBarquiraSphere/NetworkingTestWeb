"use strict";
// automatically generated by the FlatBuffers compiler, do not modify
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerNameResponse = void 0;
var flatbuffers = __importStar(require("flatbuffers"));
var PlayerNameResponse = /** @class */ (function () {
    function PlayerNameResponse() {
        this.bb = null;
        this.bb_pos = 0;
    }
    PlayerNameResponse.prototype.__init = function (i, bb) {
        this.bb_pos = i;
        this.bb = bb;
        return this;
    };
    PlayerNameResponse.getRootAsPlayerNameResponse = function (bb, obj) {
        return (obj || new PlayerNameResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    PlayerNameResponse.getSizePrefixedRootAsPlayerNameResponse = function (bb, obj) {
        bb.setPosition(bb.position() + flatbuffers.SIZE_PREFIX_LENGTH);
        return (obj || new PlayerNameResponse()).__init(bb.readInt32(bb.position()) + bb.position(), bb);
    };
    PlayerNameResponse.prototype.sessionId = function () {
        var offset = this.bb.__offset(this.bb_pos, 4);
        return offset ? this.bb.readInt32(this.bb_pos + offset) : 0;
    };
    PlayerNameResponse.prototype.name = function (optionalEncoding) {
        var offset = this.bb.__offset(this.bb_pos, 6);
        return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
    };
    PlayerNameResponse.startPlayerNameResponse = function (builder) {
        builder.startObject(2);
    };
    PlayerNameResponse.addSessionId = function (builder, sessionId) {
        builder.addFieldInt32(0, sessionId, 0);
    };
    PlayerNameResponse.addName = function (builder, nameOffset) {
        builder.addFieldOffset(1, nameOffset, 0);
    };
    PlayerNameResponse.endPlayerNameResponse = function (builder) {
        var offset = builder.endObject();
        return offset;
    };
    PlayerNameResponse.createPlayerNameResponse = function (builder, sessionId, nameOffset) {
        PlayerNameResponse.startPlayerNameResponse(builder);
        PlayerNameResponse.addSessionId(builder, sessionId);
        PlayerNameResponse.addName(builder, nameOffset);
        return PlayerNameResponse.endPlayerNameResponse(builder);
    };
    return PlayerNameResponse;
}());
exports.PlayerNameResponse = PlayerNameResponse;
//# sourceMappingURL=player-name-response.js.map