import { Peripheral } from '../Peripheral';
export declare class GattError extends Error {
    readonly peripheral: Peripheral;
    constructor(peripheral: Peripheral, message: string);
}