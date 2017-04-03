import {Component, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Device} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./device-all-list.component.html";
import {PaginationInstance} from "ng2-pagination";


@Component({
    moduleId: module.id,
    selector: 'device-all-list',
    template: template
})
export class DeviceAllListComponent implements OnInit {
    devicesObservable: FirebaseListObservable<Device[]>;
    devices: Device[] = [];
    isLoading: boolean = true;

    keyFilter: string = '';


    constructor(private af: AngularFire) {

    }

    ngOnInit(): void {
        this.devicesObservable = this.af.database.list('/device', {
            query: {
                orderByKey: true,
            }
        });
        this.devicesObservable.subscribe((devicesData) => {
            this.devices = devicesData;
            this.isLoading = false
        });
    }


    public configPagination: PaginationInstance = {
        id: 'devicesPagination',
        itemsPerPage: 100,
        currentPage: 1
    };

    onChangePageSize(pageSize: number): void {
        this.configPagination.itemsPerPage = pageSize;
    }

    pageChanged() {
    }

    loadingDeviceDetail(loading: boolean): void {
        this.isLoading = loading;
    }

    resetDeviceCount(): void {
        const countObservable = this.af.database.object(`/statistics/`);
        const countSubscription = countObservable.subscribe(data => {
            countSubscription.unsubscribe();
            countObservable.update({
                'devices-count': this.devices.length
            })
        })
    }

}