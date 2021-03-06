import { Adapter, MODblue } from '../../models';
/**
 * Use the web-bluetooth bindings to access BLE functions.
 */
export declare class WebMODblue extends MODblue {
    private adapter;
    dispose(): Promise<void>;
    getAdapters(): Promise<Adapter[]>;
}
//# sourceMappingURL=MODblue.d.ts.map