import { EventEmitter } from 'events';

import { GattLocal } from './gatt';
import { Noble } from './Noble';
import { Peripheral } from './Peripheral';

export declare interface Adapter {
	on(event: 'discover', listener: (peripheral: Peripheral) => void): this;
	on(event: 'connect', listener: (peripheral: Peripheral) => void): this;
	on(event: 'disconnect', listener: (peripheral: Peripheral) => void): this;

	emit(event: 'discover', peripheral: Peripheral): boolean;
	emit(event: 'connect', peripheral: Peripheral): boolean;
	emit(event: 'disconnect', peripheral: Peripheral, reason: number): boolean;

	isScanning(): Promise<boolean>;

	startScanning(serviceUUIDs?: string[], allowDuplicates?: boolean): Promise<void>;
	stopScanning(): Promise<void>;

	getScannedPeripherals(): Promise<Peripheral[]>;

	startAdvertising(deviceName: string, serviceUUIDs?: string[]): Promise<void>;
	stopAdvertising(): Promise<void>;

	setupGatt(maxMtu?: number): Promise<GattLocal>;
}

export abstract class Adapter extends EventEmitter {
	public readonly noble: Noble;

	public readonly id: string;

	protected _name: string;
	public get name() {
		return this._name;
	}

	protected _addressType: string;
	public get addressType() {
		return this._addressType;
	}

	protected _address: string;
	public get address() {
		return this._address;
	}

	public constructor(noble: Noble, id: string, name?: string, address?: string) {
		super();

		this.noble = noble;
		this.id = id;
		this._name = name || `hci${id.replace('hci', '')}`;
		this._address = address;
	}

	public toString() {
		return JSON.stringify({
			id: this.id,
			name: this.name,
			address: this.address
		});
	}
}
