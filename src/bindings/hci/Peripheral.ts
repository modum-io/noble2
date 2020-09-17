import { BasePeripheral } from '../../Peripheral';

import { Adapter } from './Adapter';
import { Gatt } from './gatt';
import { Hci } from './hci';
import { Noble } from './Noble';
import { Service } from './Service';
import { Signaling } from './signaling';

export class Peripheral extends BasePeripheral<Noble, Adapter> {
	private hci: Hci;
	private handle: number;
	private gatt: Gatt;
	private signaling: Signaling;
	private requestedMTU: number;

	private services: Map<string, Service> = new Map();
	public getDiscoveredServices() {
		return [...this.services.values()];
	}

	public async connect(requestMtu?: number): Promise<void> {
		this._state = 'connecting';
		this.requestedMTU = requestMtu;
		await this.adapter.connect(this);
	}
	public async onConnect(hci: Hci, handle: number) {
		this.handle = handle;

		this.hci = hci;

		this.gatt = new Gatt(this.hci, this.handle);

		this.signaling = new Signaling(this.hci, this.handle);
		this.signaling.on('connectionParameterUpdateRequest', this.onConnectionParameterUpdateRequest);

		const wantedMtu = this.requestedMTU || 256;
		const mtu = await this.gatt.exchangeMtu(wantedMtu);

		this._state = 'connected';
		this._mtu = mtu;
	}

	private onConnectionParameterUpdateRequest = (
		minInterval: number,
		maxInterval: number,
		latency: number,
		supervisionTimeout: number
	) => {
		this.hci.connUpdateLe(this.handle, minInterval, maxInterval, latency, supervisionTimeout);
	};

	public async disconnect(): Promise<number> {
		this._state = 'disconnecting';
		return this.adapter.disconnect(this);
	}
	public onDisconnect() {
		this.gatt.dispose();
		this.gatt = null;

		this.signaling.off('connectionParameterUpdateRequest', this.onConnectionParameterUpdateRequest);
		this.signaling = null;

		this.hci = null;

		this.handle = null;
		this._state = 'disconnected';
		this._mtu = undefined;

		this.services = new Map();
	}

	public async discoverServices(serviceUUIDs?: string[]): Promise<Service[]> {
		const services = await this.gatt.discoverServices(serviceUUIDs || []);
		for (const rawService of services) {
			let service = this.services.get(rawService.uuid);
			if (!service) {
				service = new Service(this.noble, this, rawService.uuid, this.gatt);
				this.services.set(rawService.uuid, service);
			}
		}
		return [...this.services.values()];
	}

	public async discoverIncludedServices(baseService: Service, serviceUUIDs?: string[]) {
		const services = await this.gatt.discoverIncludedServices(baseService.uuid, serviceUUIDs);
		for (const rawService of services) {
			let service = this.services.get(rawService.uuid);
			if (!service) {
				service = new Service(this.noble, this, rawService.uuid, this.gatt);
				this.services.set(rawService.uuid, service);
			}
		}
		return [...this.services.values()];
	}
}
