import {Component, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Device} from "../../../../both/interfaces/device.interface";
import * as _ from "lodash";
//noinspection TypeScriptCheckImport
import template from "./device-list.component.html";
import {PaginationInstance} from "ng2-pagination";


@Component({
    moduleId: module.id,
    selector: 'device-list',
    template: template
})
export class DeviceListComponent implements OnInit {
    devicesObservable: FirebaseListObservable<Device[]>;
    devices: Device[] = [];
    isLoading: boolean = true;
    selectedDevices: string[] = [];
    selectAll: boolean = false;

    keyFilter: string = '';
    latitudeFilter: number;
    longitudeFilter: number;
    radiusFilter: number;


    constructor(private af: AngularFire) {

    }

    ngOnInit(): void {
        this.devicesObservable = this.af.database.list('/online', {
            query: {
                orderByKey: true,
            }
        });
        this.devicesObservable.subscribe((devicesData) => {
            this.devices = devicesData;
            this.isLoading = false
        });
    }

    onlineStatus(device: Device): string {
        if (!device)
            return '';
        if (device.connections)
            return '<div class="online-status online" data-toggle="tooltip" title="Online"></div>';
        return '<div class="online-status offline" data-toggle="tooltip" title="Offline"></div>';

    }

    public configPagination:PaginationInstance = {
        id: 'devicesPagination',
        itemsPerPage: 10,
        currentPage: 1
    };

    onChangePageSize(pageSize: number): void {
        this.configPagination.itemsPerPage = pageSize;
    }

    pageChanged() {}


    updateSelectedDevices(deviceId: string, event): void {
        if (event.target.checked) {
            this.selectedDevices.push(deviceId);
        }
        else {
            //noinspection TypeScriptUnresolvedFunction
            _.pull(this.selectedDevices, deviceId);
        }
    }

    loadingDeviceDetail(loading: boolean): void {
        this.isLoading = loading;
    }

    // TODO: this select all does not fire the change event
    selectAllDevices(): void {
        this.selectAll = true;
    }

    deselectAllDevices(): void {
        this.selectAll = false;
        this.selectedDevices = [];
    }


}