/// <reference types="node" />
import { BaseCharacteristic } from '../../Characteristic';
import { BaseDescriptor } from '../../Descriptor';
import { Gatt } from './gatt';
import { Noble } from './Noble';
import { Service } from './Service';
export declare class Characteristic extends BaseCharacteristic<Noble, Service> {
    private gatt;
    private descriptors;
    constructor(noble: Noble, service: Service, uuid: string, properties: string[], gatt: Gatt);
    read(): Promise<Buffer>;
    write(data: Buffer, withoutResponse: boolean): Promise<void>;
    broadcast(broadcast: boolean): Promise<void>;
    notify(notify: boolean): Promise<void>;
    subscribe(): Promise<void>;
    unsubscribe(): Promise<void>;
    getDiscoveredDescriptors(): BaseDescriptor[];
    discoverDescriptors(uuids?: string[]): Promise<BaseDescriptor[]>;
}
