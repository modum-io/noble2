import {
	GattCharacteristicProperty,
	GattCharacteristicRemote,
	GattDescriptorRemote,
	GattRemote
} from '../../../../models';
import {
	buildTypedValue,
	DbusObject,
	I_BLUEZ_CHARACTERISTIC,
	I_BLUEZ_DEVICE,
	I_BLUEZ_SERVICE,
	I_OBJECT_MANAGER,
	I_PROPERTIES
} from '../../misc';
import { DbusPeripheral } from '../../Peripheral';

import { DbusGattCharacteristicRemote } from './Characteristic';
import { DbusGattServiceRemote } from './Service';

// tslint:disable: promise-must-complete

const DISCOVER_TIMEOUT = 10; // in seconds

export class DbusGattRemote extends GattRemote {
	public peripheral: DbusPeripheral;

	public services: Map<string, DbusGattServiceRemote> = new Map();

	public constructor(peripheral: DbusPeripheral) {
		super(peripheral);
	}

	protected async doDiscoverServices(): Promise<DbusGattServiceRemote[]> {
		const path = this.peripheral.path;
		const dbus = this.peripheral.adapter.modblue.dbus;

		const obj = await dbus.getProxyObject('org.bluez', path);
		const propsIface = obj.getInterface(I_PROPERTIES);

		const servicesResolved = (await propsIface.Get(I_BLUEZ_DEVICE, 'ServicesResolved')).value;
		if (!servicesResolved) {
			const timeoutError = new Error('Discovering timed out');
			await new Promise<void>((res, rej) => {
				let timeout: NodeJS.Timeout;

				const onPropertiesChanged = (iface: string, changedProps: DbusObject) => {
					if (iface !== I_BLUEZ_DEVICE) {
						return;
					}

					if ('ServicesResolved' in changedProps && changedProps.ServicesResolved.value) {
						propsIface.off('PropertiesChanged', onPropertiesChanged);
						if (timeout) {
							clearTimeout(timeout);
							timeout = null;
						}
						res();
					}
				};

				propsIface.on('PropertiesChanged', onPropertiesChanged);

				timeout = setTimeout(() => {
					propsIface.off('PropertiesChanged', onPropertiesChanged);
					rej(timeoutError);
				}, DISCOVER_TIMEOUT * 1000);
			});
		}

		const objManager = await dbus.getProxyObject(`org.bluez`, '/');
		const objManagerIface = objManager.getInterface(I_OBJECT_MANAGER);

		const objs = await objManagerIface.GetManagedObjects();
		const keys = Object.keys(objs);

		for (const srvPath of keys) {
			if (!srvPath.startsWith(path)) {
				continue;
			}

			const srvObj = objs[srvPath][I_BLUEZ_SERVICE];
			if (!srvObj) {
				continue;
			}

			let service = this.services.get(srvPath);
			if (!service) {
				const uuid = srvObj.UUID.value.replace(/-/g, '');
				service = new DbusGattServiceRemote(this, srvPath, uuid);
				this.services.set(uuid, service);
			}
		}

		return [...this.services.values()];
	}

	public async discoverCharacteristics(serviceUUID: string): Promise<GattCharacteristicRemote[]> {
		const service = this.services.get(serviceUUID);
		if (!service) {
			throw new Error(`Service ${serviceUUID} not found`);
		}

		const objManager = await this.peripheral.adapter.modblue.dbus.getProxyObject(`org.bluez`, '/');
		const objManagerIface = objManager.getInterface(I_OBJECT_MANAGER);

		const objs = await objManagerIface.GetManagedObjects();
		const keys = Object.keys(objs);

		const characteristics: DbusGattCharacteristicRemote[] = [];

		for (const charPath of keys) {
			if (!charPath.startsWith(service.path)) {
				continue;
			}

			const charObj = objs[charPath][I_BLUEZ_CHARACTERISTIC];
			if (!charObj) {
				continue;
			}

			const uuid = charObj.UUID.value.replace(/-/g, '');
			const properties = (charObj.Flags.value as string[]).filter((p) => !p.startsWith('secure-'));
			const secure = properties.filter((p) => p.startsWith('encrypt')).map((p) => p.replace('encrypt-', ''));
			const characteristic = new DbusGattCharacteristicRemote(
				service,
				charPath,
				uuid,
				properties as GattCharacteristicProperty[],
				secure as GattCharacteristicProperty[]
			);
			characteristics.push(characteristic);
		}

		return characteristics;
	}

	public async read(serviceUUID: string, characteristicUUID: string): Promise<Buffer> {
		const service = this.services.get(serviceUUID);
		if (!service) {
			throw new Error(`Service ${serviceUUID} not found`);
		}

		const characteristic = service.characteristics.get(characteristicUUID);
		if (!characteristic) {
			throw new Error(`Characteristic ${characteristicUUID} in service ${serviceUUID} not found`);
		}

		const obj = await this.peripheral.adapter.modblue.dbus.getProxyObject('org.bluez', characteristic.path);
		const iface = obj.getInterface(I_BLUEZ_CHARACTERISTIC);

		return iface.ReadValue({
			offset: buildTypedValue('uint16', 0)
		});
	}
	public async write(
		serviceUUID: string,
		characteristicUUID: string,
		data: Buffer,
		withoutResponse: boolean
	): Promise<void> {
		const service = this.services.get(serviceUUID);
		if (!service) {
			throw new Error(`Service ${serviceUUID} not found`);
		}

		const characteristic = service.characteristics.get(characteristicUUID);
		if (!characteristic) {
			throw new Error(`Characteristic ${characteristicUUID} in service ${serviceUUID} not found`);
		}

		const obj = await this.peripheral.adapter.modblue.dbus.getProxyObject('org.bluez', characteristic.path);
		const iface = obj.getInterface(I_BLUEZ_CHARACTERISTIC);

		await iface.WriteValue([...data], {
			offset: buildTypedValue('uint16', 0),
			type: buildTypedValue('string', withoutResponse ? 'command' : 'request')
		});
	}
	public async broadcast(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	public async notify(): Promise<void> {
		throw new Error('Method not implemented.');
	}
	public async discoverDescriptors(): Promise<GattDescriptorRemote[]> {
		throw new Error('Method not implemented.');
	}

	public async readValue(): Promise<Buffer> {
		throw new Error('Method not implemented.');
	}
	public async writeValue(): Promise<void> {
		throw new Error('Method not implemented.');
	}
}
