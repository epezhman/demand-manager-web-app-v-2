import {Component} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Device} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import {series} from "async";
import {NotificationsService} from "angular2-notifications";
//noinspection TypeScriptCheckImport
import template from "./firebase.component.html";
import * as _ from "lodash";


@Component({
    moduleId: module.id,
    selector: 'firebase-section',
    template: template
})
export class FirebaseComponent {
    devices: FirebaseListObservable<Device[]>;
    notSubmitting: boolean = false;

    removeDeviceId: string;

    notifOptions = {
        timeOut: 5000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    login() {
        this.af.auth.login();
    }

    logout() {
        this.af.auth.logout();
    }

    removeDevice(): void {
        this.removeDeviceId = _.trim(this.removeDeviceId);
        if (confirm('Are you Sure?') && this.removeDeviceId) {
            this.notSubmitting = true;
            series([
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/device/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const deviceObservable = this.af.database.object(`/activity-status/${this.removeDeviceId}`);
                        deviceObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/hardware/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/last-location/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/location/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/online/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/power/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/settings/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/logging/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/schedule-period/${this.removeDeviceId}`);
                        onlineObservable.remove().then(() => {
                            cb(null);
                        });
                    },
                    (cb) => {
                        const onlineObservable = this.af.database.object(`/power-model/${this.removeDeviceId}`);
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
                    this.removeDeviceId = '';
                    this.notif.success(
                        'Success',
                        'Device is removed.'
                    );
                });
        }
    }

}