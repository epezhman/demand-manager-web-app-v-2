import {Pipe} from "@angular/core";
import {Device} from "../../../both/interfaces/device.interface";


@Pipe({
    name: 'deviceStatus'
})
export class DeviceStatusPipe {
    transform(device: Device): string {
        if (!device)
            return '';
        console.log(device);
        if (device.connections)
            return '<div class="online-status online" data-toggle="tooltip" title="Online"></div>';
        return '<div class="online-status offline" data-toggle="tooltip" title="Offline"></div>';

    }
}