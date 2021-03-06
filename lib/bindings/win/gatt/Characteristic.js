"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WinGattCharacteristic = void 0;
const models_1 = require("../../../models");
const Descriptor_1 = require("./Descriptor");
class WinGattCharacteristic extends models_1.GattCharacteristic {
    discoverDescriptors() {
        const noble = this.service.gatt.peripheral.adapter.noble;
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
            this.descriptors.clear();
            noble.discoverDescriptors(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid);
        });
    }
    read() {
        const noble = this.service.gatt.peripheral.adapter.noble;
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
            noble.read(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid);
        });
    }
    write(value, withoutResponse) {
        const noble = this.service.gatt.peripheral.adapter.noble;
        return new Promise((resolve, reject) => {
            const handler = (dev, srv, char, err) => {
                if (dev === this.service.gatt.peripheral.uuid && srv === this.service.uuid && char === this.uuid) {
                    noble.off('write', handler);
                    if (err instanceof Error) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            };
            noble.on('write', handler);
            noble.write(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid, value, withoutResponse);
        });
    }
    broadcast() {
        throw new Error('Method not implemented.');
    }
    notify(notify) {
        const noble = this.service.gatt.peripheral.adapter.noble;
        return new Promise((resolve, reject) => {
            const handler = (dev, srv, char, err) => {
                if (dev === this.service.gatt.peripheral.uuid && srv === this.service.uuid && char === this.uuid) {
                    noble.off('notify', handler);
                    if (err instanceof Error) {
                        reject(err);
                    }
                    else {
                        resolve();
                    }
                }
            };
            noble.on('notify', handler);
            noble.notify(this.service.gatt.peripheral.uuid, this.service.uuid, this.uuid, notify);
        });
    }
    addDescriptor() {
        throw new Error('Method not implemented.');
    }
}
exports.WinGattCharacteristic = WinGattCharacteristic;
//# sourceMappingURL=Characteristic.js.map