import { Adapter, GattLocal, Peripheral } from '../../models';
import { HciPeripheral } from './Peripheral';
export declare class HciAdapter extends Adapter {
    private initialized;
    private scanning;
    private advertising;
    private hci;
    private gap;
    private gatt;
    private deviceName;
    private peripherals;
    private uuidToHandle;
    private handleToUUID;
    getScannedPeripherals(): Promise<Peripheral[]>;
    isScanning(): Promise<boolean>;
    private init;
    dispose(): void;
    startScanning(): Promise<void>;
    stopScanning(): Promise<void>;
    private onDiscover;
    connect(peripheral: HciPeripheral): Promise<void>;
    disconnect(peripheral: HciPeripheral): Promise<void>;
    startAdvertising(deviceName: string, serviceUUIDs?: string[]): Promise<void>;
    stopAdvertising(): Promise<void>;
    setupGatt(maxMtu?: number): Promise<GattLocal>;
}
