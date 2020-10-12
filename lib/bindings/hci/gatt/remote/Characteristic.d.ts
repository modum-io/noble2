import { GattCharacteristicProperty, GattCharacteristicRemote } from '../../../../models';
import { HciGattDescriptorRemote } from './Descriptor';
import { HciGattServiceRemote } from './Service';
export declare class HciGattCharacteristicRemote extends GattCharacteristicRemote {
    service: HciGattServiceRemote;
    readonly startHandle: number;
    readonly valueHandle: number;
    endHandle: number;
    descriptors: Map<string, HciGattDescriptorRemote>;
    constructor(service: HciGattServiceRemote, uuid: string, properties: GattCharacteristicProperty[], startHandle: number, valueHandle: number);
}
