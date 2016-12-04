import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
import * as _ from "lodash";
import "geolib";

//noinspection TypeScriptCheckImport
import template from "./map-device.component.html";


@Component({
    moduleId: module.id,
    selector: 'map-device',
    template: template,
    styles: ['.sebm-google-map-container {height: 300px;}'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapDeviceComponent {
    latMunich: number = 48.139;
    lngMunich: number = 11.566;
    zoomMunich: number = 10;

    locationsData: Array<any> = [];

    @Input()
    set mapDevice(mapDevice: DeviceDetail) {
        if(mapDevice)
        {
            this.locationsData = _.values(mapDevice);
        }
    }

    iconBasedOnDay(location: DeviceDetail): string {
        if (!location)
            return '';

        switch (location['day_of_week']) {
            case 'mon':
                return '/images/maps_marker/blue_MarkerM.png';
            case 'tue':
                return '/images/maps_marker/brown_MarkerT.png';
            case 'wed':
                return '/images/maps_marker/orange_MarkerW.png';
            case 'thu':
                return '/images/maps_marker/paleblue_MarkerT.png';
            case 'fri':
                return '/images/maps_marker/pink_MarkerF.png';
            case 'sat':
                return '/images/maps_marker/yellow_MarkerS.png';
            case 'sun':
                return '/images/maps_marker/purple_MarkerS.png';
        }
        return '/images/red-dot.png';
    }
}