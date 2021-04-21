"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinGattCharacteristic = void 0;
const models_1 = require("../../../models");
const Descriptor_1 = require("./Descriptor");
class WinGattCharacteristic extends models_1.GattCharacteristic {
    discoverDescriptors() {
        const noble = this.service.gatt.peripheral.adapter.noble;
        this.descriptors.clear();
        noble.discoverDescriptors(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid);
        return new Promise((resolve, reject) => {
            const handler = (dev, srv, char, descUUIDs) => {
                if (dev === this.service.gatt.peripheral.uuid && srv === this.service.uuid && char === this.uuid) {
                    noble.off('descriptorsDiscover', handler);
                    if (descUUIDs instanceof Error) {
                        reject(descUUIDs);
                    }
                    else {
                        for (const descUUID of descUUIDs) {
                            this.descriptors.set(descUUID, new Descriptor_1.WinGattDescriptor(this, descUUID, true));
                        }
                        resolve([...this.descriptors.values()]);
                    }
                }
            };
            noble.on('descriptorsDiscover', handler);
        });
    }
    read() {
        const noble = this.service.gatt.peripheral.adapter.noble;
        noble.read(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid);
        return new Promise((resolve, reject) => {
            const handler = (dev, srv, char, data, isNotification) => {
                if (dev === this.service.gatt.peripheral.uuid &&
                    srv === this.service.uuid &&
                    char === this.uuid &&
                    !isNotification) {
                    noble.off('read', handler);
                    if (data instanceof Error) {
                        reject(data);
                    }
                    else {
                        resolve(data);
                    }
                }
            };
            noble.on('read', handler);
        });
    }
    write(value, withoutResponse) {
        const noble = this.service.gatt.peripheral.adapter.noble;
        noble.write(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid, value, withoutResponse);
        return new Promise((resolve, reject) => {
            const handler = (dev, srv, char, err) => {
                if (dev === this.service.gatt.peripheral.uuid && srv === this.service.uuid && char === this.uuid) {
                    noble.off('write', handler);
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            };
            noble.on('write', handler);
        });
    }
    broadcast() {
        throw new Error('Method not implemented.');
    }
    notify(notify) {
        const noble = this.service.gatt.peripheral.adapter.noble;
        noble.notify(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid, notify);
        return new Promise((resolve, reject) => {
            const handler = (dev, srv, char, err) => {
                if (dev === this.service.gatt.peripheral.uuid && srv === this.service.uuid && char === this.uuid) {
                    noble.off('notify', handler);
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            };
            noble.on('notify', handler);
        });
    }
    addDescriptor() {
        throw new Error('Method not implemented.');
    }
}
exports.WinGattCharacteristic = WinGattCharacteristic;
//# sourceMappingURL=Characteristic.js.map