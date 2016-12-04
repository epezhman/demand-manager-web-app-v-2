export interface Device {
    $key?: string;
    connections?: string[];
    g?: string;
    l?: number[];
    selected?: boolean;
}


export interface DeviceDetail {
    $key?: string;
    visible?: boolean;
}