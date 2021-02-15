import { Adapter, GattLocal, Peripheral } from '../../models';
import { HciPeripheral } from './Peripheral';
export declare class HciAdapter extends Adapter {
    private initialized;
    private scanning;
    private scanEnableTimer;
    private advertising;
    private advertisingEnableTimer;
    private wasAdvertising;
    private hci;
    private gap;
    private gatt;
    private deviceName;
    private advertisedServiceUUIDs;
    private peripherals;
    private connectedDevices;
    private uuidToHandle;
    private handleToUUID;
    private init;
    private onHciStateChange;
    private onHciError;
    dispose(): void;
    isScanning(): Promise<boolean>;
    startScanning(): Promise<void>;
    stopScanning(): Promise<void>;
    getScannedPeripherals(): Promise<Peripheral[]>;
    private onDiscover;
    connect(peripheral: HciPeripheral, minInterval?: number, maxInterval?: number, latency?: number, supervisionTimeout?: number): Promise<void>;
    disconnect(peripheral: HciPeripheral): Promise<void>;
    isAdvertising(): Promise<boolean>;
    startAdvertising(deviceName: string, serviceUUIDs?: string[]): Promise<void>;
    stopAdvertising(): Promise<void>;
    setupGatt(maxMtu?: number): Promise<GattLocal>;
    private onLeScanEnable;
    private onLeAdvertiseEnable;
    private onLeConnComplete;
    private onDisconnectComplete;
}
