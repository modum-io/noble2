import { TypedEmitter } from 'tiny-typed-emitter';
import { AddressType } from './AddressType';
import { GattLocal } from './gatt';
import { MODblue } from './MODblue';
import { Peripheral } from './Peripheral';
export interface AdapterEvents {
    discover: (peripheral: Peripheral) => void;
    connect: (peripheral: Peripheral) => void;
    disconnect: (peripheral: Peripheral, reason?: string) => void;
    error: (error: Error) => void;
}
export declare abstract class Adapter extends TypedEmitter<AdapterEvents> {
    /**
     * The instance of MODblue that this adapter was found by.
     */
    readonly modblue: MODblue;
    /**
     * The unique identifier of this adapter.
     */
    readonly id: string;
    protected _name: string;
    /**
     * The public name of this adapter.
     */
    get name(): string;
    protected _addressType: AddressType;
    /**
     * The MAC address type of this adapter.
     */
    get addressType(): string;
    protected _address: string;
    /**
     * The MAC address of this adapter. All lowercase, with colon separator between bytes, e.g. 11:22:33:aa:bb:cc
     */
    get address(): string;
    constructor(modblue: MODblue, id: string, name: string, address?: string);
    /**
     * Scans for a specific {@link Peripheral} using the specified matching function and returns the peripheral once found.
     * If the timeout is reached before finding a peripheral the returned promise will be rejected.
     * @param filter Either a string that is used as name prefix, or a function that returns `true` if the specified peripheral is the peripheral we're looking for.
     * @param timeoutInSeconds The timeout in seconds. The returned promise will reject once the timeout is reached.
     * @param serviceUUIDs The UUIDs of the {@link GattService}s that must be contained in the advertisement data.
     */
    scanFor(filter: string | ((peripheral: Peripheral) => boolean), timeoutInSeconds?: number, serviceUUIDs?: string[]): Promise<Peripheral>;
    /**
     * Returns `true` if this adapter is currently scanning, `false` otherwise.
     */
    abstract isScanning(): boolean;
    /**
     * Start scanning for nearby {@link Peripheral}s.
     * @param serviceUUIDs The UUIDs of the {@link GattService} that an advertising
     * packet must advertise to emit a `discover` event.
     * @param allowDuplicates True if advertisements for the same peripheral should emit multiple `discover` events.
     */
    abstract startScanning(serviceUUIDs?: string[], allowDuplicates?: boolean): Promise<void>;
    /**
     * Stop scanning for peripherals.
     */
    abstract stopScanning(): Promise<void>;
    /**
     * Get all peripherals that were found since the last scan start.
     */
    abstract getScannedPeripherals(): Promise<Peripheral[]>;
    /**
     * Returns `true` if this adapter is currently advertising, `false` otherwise.
     */
    abstract isAdvertising(): boolean;
    /**
     * Start advertising on this adapter.
     * @param deviceName The device name that is included in the advertisement.
     * @param serviceUUIDs The UUIDs of the {@link GattService}s that are included in the advertisement.
     */
    abstract startAdvertising(deviceName: string, serviceUUIDs?: string[]): Promise<void>;
    /**
     * Stop any ongoing advertisements.
     */
    abstract stopAdvertising(): Promise<void>;
    /**
     * Setup the GATT server for this adapter to communicate with connecting remote peripherals.
     * @param maxMtu The maximum MTU that will be negotiated in case the remote peripheral starts an MTU negotation.
     */
    abstract setupGatt(maxMtu?: number): Promise<GattLocal>;
    toString(): string;
    toJSON(): Record<string, unknown>;
}
//# sourceMappingURL=Adapter.d.ts.map