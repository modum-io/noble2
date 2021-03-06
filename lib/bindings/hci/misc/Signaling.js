"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signaling = void 0;
const os_1 = __importDefault(require("os"));
const CONNECTION_PARAMETER_UPDATE_REQUEST = 0x12;
const CONNECTION_PARAMETER_UPDATE_RESPONSE = 0x13;
const SIGNALING_CID = 0x0005;
class Signaling {
    constructor(hci, handle) {
        this.onAclStreamData = (handle, cid, data) => {
            if (handle !== this.handle || cid !== SIGNALING_CID) {
                return;
            }
            const code = data.readUInt8(0);
            const identifier = data.readUInt8(1);
            // const length = data.readUInt16LE(2);
            const signalingData = data.slice(4);
            if (code === CONNECTION_PARAMETER_UPDATE_REQUEST) {
                this.processConnectionParameterUpdateRequest(identifier, signalingData);
            }
        };
        this.handle = handle;
        this.hci = hci;
        this.hci.on('aclDataPkt', this.onAclStreamData);
    }
    dispose() {
        if (this.hci) {
            this.hci.off('aclDataPkt', this.onAclStreamData);
            this.hci = null;
        }
        this.handle = null;
    }
    processConnectionParameterUpdateRequest(identifier, data) {
        const minInterval = data.readUInt16LE(0) * 1.25;
        const maxInterval = data.readUInt16LE(2) * 1.25;
        const latency = data.readUInt16LE(4);
        const supervisionTimeout = data.readUInt16LE(6) * 10;
        if (os_1.default.platform() !== 'linux') {
            const response = Buffer.alloc(6);
            response.writeUInt8(CONNECTION_PARAMETER_UPDATE_RESPONSE, 0); // code
            response.writeUInt8(identifier, 1); // identifier
            response.writeUInt16LE(2, 2); // length
            response.writeUInt16LE(0, 4);
            this.hci.writeAclDataPkt(this.handle, SIGNALING_CID, response);
            this.hci.connUpdateLe(this.handle, minInterval, maxInterval, latency, supervisionTimeout).catch(() => null);
        }
        else {
            this.hci.trackSentAclPackets(this.handle, 1);
        }
    }
}
exports.Signaling = Signaling;
//# sourceMappingURL=Signaling.js.map