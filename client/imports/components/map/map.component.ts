import {Component, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Device} from "../../../../both/interfaces/device.interface";
import * as _ from "lodash";
import "geolib";
//noinspection TypeScriptCheckImport
import template from "./map.component.html";


@Component({
    moduleId: module.id,
    selector: 'map-section',
    template: template,
    styles: ['.sebm-google-map-container {height: 600px;}']
})
export class MapComponent implements OnInit {
    devicesObservable: FirebaseListObservable<Device[]>;
    devices: Device[] = [];
    isLoading: boolean = true;
    selectedDevices: string[] = [];

    latMunich: number = 48.139;
    lngMunich: number = 11.566;
    zoomMunich: number = 11;

    latCircle: number = 48.139;
    lngCircle: number = 11.566;
    radiusCircle: number = 1000;
    colorCircle: string = "blue";
    strokeColorCircle: string = "blue";

    constructor(private af: AngularFire) {
    }

    ngOnInit(): void {
        this.devicesObservable = this.af.database.list('/online');
        this.devicesObservable.subscribe((devicesData) => {
            _.forEach(devicesData, (device) => {
                if(device && device.l)
                {
                    this.devices.push(device)
                }
            });
            this.isLoading = false
        });
    }

    loadingDeviceDetail(loading: boolean): void {
        this.isLoading = loading;
    }

    onlineStatus(device: Device): string {
        if (!device)
            return '';
        if (device.connections)
            return '/images/green-dot.png';
        return '/images/red-dot.png';
    }

    toggleDeviceView(deviceId: string): void {
        if (this.selectedDevices.indexOf(deviceId) < 0) {
            this.selectedDevices.push(deviceId);
        }
        else {
            //noinspection TypeScriptUnresolvedFunction
            _.pull(this.selectedDevices, deviceId);
        }
    }

    addDeviceView(deviceId: string): void {
        if (this.selectedDevices.indexOf(deviceId) < 0) {
            this.selectedDevices.push(deviceId);
        }
    }

    removeDeviceView(deviceId: string): void {
        if (this.selectedDevices.indexOf(deviceId) > -1) {
            //noinspection TypeScriptUnresolvedFunction
            _.pull(this.selectedDevices, deviceId);
        }
    }

    filterDevices(): void {
        _.forEach(this.devices, (device) => {
            //noinspection TypeScriptUnresolvedVariable
            if (geolib.isPointInCircle(
                    {latitude: device.l[0], longitude: device.l[1]},
                    {latitude: this.latCircle, longitude: this.lngCircle},
                    this.radiusCircle
                )) {
                this.addDeviceView(device.$key);
            }
            else {
                this.removeDeviceView(device.$key);
            }
        });
    }

    radiusChange(radius: number): void {
        this.radiusCircle = radius;
        this.filterDevices();
    }

    centerChange(center) {
        this.latCircle = center['lat'];
        this.lngCircle = center['lng'];
    }

    // TODO: bug when changing the location with center of circle
    dragEnd(): void {
        this.filterDevices();
    }
}