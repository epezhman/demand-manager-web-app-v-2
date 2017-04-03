import {Component, OnInit} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Device} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./device-all-list.component.html";
import {PaginationInstance} from "ng2-pagination";
import {NotificationsService} from "angular2-notifications";
//noinspection TypeScriptCheckImport
import {series} from "async";
import * as _ from "lodash";


@Component({
    moduleId: module.id,
    selector: 'device-all-list',
    template: template
})
export class DeviceAllListComponent implements OnInit {
    devicesObservable: FirebaseListObservable<Device[]>;
    devices: Device[] = [];
    isLoading: boolean = true;
    notSubmitting: boolean = false;

    keyFilter: string = '';


    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    notifOptions = {
        timeOut: 5000,
        position: ["bottom", "left"]
    };

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
        this.isLoading = true;
        const countObservable = this.af.database.object(`/statistics/`);
        const countSubscription = countObservable.subscribe(data => {
            countSubscription.unsubscribe();
            countObservable.update({
                'devices-count': this.devices.length
            }).then(() => {
                this.isLoading = false;
                this.notif.success(
                    'Success',
                    'Count Updated.'
                );
            })
        })
    }

    removeDevice(removeDeviceId: string): void {
        removeDeviceId = _.trim(removeDeviceId);
        if (confirm('Are you Sure?') && removeDeviceId) {
            this.notSubmitting = true;
            series([
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/device/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const deviceObservable = this.af.database.object(`/activity-status/${removeDeviceId}`);
                        deviceObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/hardware/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/last-location/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/location/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/online/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/power/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/settings/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/logging/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/schedule-period/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/power-model/${removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const countObservable = this.af.database.object(`/statistics/`);
                        const countSubscription = countObservable.subscribe(data => {
                            countSubscription.unsubscribe();
                            countObservable.update({
                                'devices-count': data['devices-count'] - 1
                            }).then(() => {
                                cb(null);
                            });
                        })
                    }
                ],
                (err, results) => {
                    this.notSubmitting = false;
                    this.notif.success(
                        'Success',
                        'Device is removed.'
                    );
                });
        }
    }

}