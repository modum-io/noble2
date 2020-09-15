/// <reference types="node" />
import { NobleBindings } from '../Bindings';
export declare class HciBindings extends NobleBindings {
    private state;
    private addresses;
    private addressTypes;
    private connectable;
    private requestedMtu;
    private scanServiceUUIDs;
    private pendingConnectionUUID;
    private connectionQueue;
    private uuidToHandle;
    private handleToUUID;
    private gatts;
    private aclStreams;
    private signalings;
    private hci;
    private gap;
    constructor();
    getDevices(): {
        id: number;
        address: any;
    }[];
    init(deviceId?: number): void;
    dispose(): void;
    startScanning(serviceUUIDs: string[], allowDuplicates: boolean): void;
    stopScanning(): void;
    connect(peripheralUUID: string, requestMtu?: number): void;
    disconnect(peripheralUUID: string): void;
    updateRssi(peripheralUUID: string): void;
    private onSigInt;
    private onExit;
    private onStateChange;
    private onAddressChange;
    private onScanStart;
    private onScanStop;
    private onDiscover;
    private onLeConnComplete;
    private onLeConnUpdateComplete;
    private onDisconnComplete;
    private onEncryptChange;
    private onMtu;
    private onRssiRead;
    private onAclDataPkt;
    discoverServices(peripheralUUID: string, uuids: string[]): void;
    private onServicesDiscover;
    private onServicesDiscovered;
    discoverIncludedServices(peripheralUUID: string, serviceUUID: string, serviceUUIDs: string[]): void;
    private onIncludedServicesDiscovered;
    discoverCharacteristics(peripheralUUID: string, serviceUUID: string, characteristicUUIDs: string[]): void;
    private onCharacteristicsDiscover;
    private onCharacteristicsDiscovered;
    read(peripheralUUID: string, serviceUUID: string, characteristicUUID: string): void;
    private onRead;
    write(peripheralUUID: string, serviceUUID: string, characteristicUUID: string, data: Buffer, withoutResponse: boolean): void;
    private onWrite;
    broadcast(peripheralUUID: string, serviceUUID: string, characteristicUUID: string, broadcast: boolean): void;
    private onBroadcast;
    notify(peripheralUUID: string, serviceUUID: string, characteristicUUID: string, notify: boolean): void;
    private onNotify;
    private onNotification;
    discoverDescriptors(peripheralUUID: string, serviceUUID: string, characteristicUUID: string): void;
    private onDescriptorsDiscover;
    private onDescriptorsDiscovered;
    readValue(peripheralUUID: string, serviceUUID: string, characteristicUUID: string, descriptorUUID: string): void;
    private onValueRead;
    writeValue(peripheralUUID: string, serviceUUID: string, characteristicUUID: string, descriptorUUID: string, data: Buffer): void;
    private onValueWrite;
    readHandle(peripheralUUID: string, attHandle: number): void;
    private onHandleRead;
    writeHandle(peripheralUUID: string, attHandle: number, data: Buffer, withoutResponse: boolean): void;
    private onHandleWrite;
    private onHandleNotify;
    private onConnectionParameterUpdateRequest;
}
