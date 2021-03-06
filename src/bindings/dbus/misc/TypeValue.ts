/* eslint-disable @typescript-eslint/no-var-requires */
// This fixes an issue with webpack trying to load the module at compile time
let Variant: new (...args: unknown[]) => unknown;

// https://dbus.freedesktop.org/doc/dbus-specification.html
const MAPPINGS = {
	string: 's',
	int16: 'n',
	boolean: 'b',
	uint16: 'q',
	dict: 'e',
	array: 'a',
	variant: 'v'
};

export function buildTypedValue(types: keyof typeof MAPPINGS | (keyof typeof MAPPINGS)[], value: unknown): unknown {
	const dbusTypes = Array.isArray(types) ? types.map((type) => MAPPINGS[type]) : [MAPPINGS[types]];
	if (dbusTypes.some((type) => !type)) {
		throw new Error(`Unknown type ${types} for value ${value}`);
	}

	if (!Variant) {
		// This fixes an issue with webpack trying to load the module at compile time
		const END = 't';
		Variant = require(`dbus-nex${END}`).Variant;
	}
	return new Variant(dbusTypes.join(''), value);
}
