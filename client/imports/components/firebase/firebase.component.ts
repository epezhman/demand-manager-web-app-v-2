import {Component} from "@angular/core";
import {AngularFire, FirebaseListObservable} from "angularfire2";
import {Device} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import {eachLimit, eachSeries, series} from "async";
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
    profileDeviceId: string;

    cntr: number;

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

    fixPowerProfile(): void {
        this.profileDeviceId = _.trim(this.profileDeviceId);
        if (confirm('Are you Sure?') && this.profileDeviceId) {
            this.notSubmitting = true;
            this.cntr = 0;
            let profilesObservable = this.af.database.list(`/power/${this.profileDeviceId}`);
            let profilesSub = profilesObservable.subscribe((profiles) => {
                profilesSub.unsubscribe();
                eachLimit(profiles, 50, (profile, profileCb) => {
                    const profileObservable = this.af.database.object((`/power/${this.profileDeviceId}/${profile.$key}`));
                    profileObservable.update({
                        'power-diff-w': profile['estimated_power_consume_w'] - profile['estimated_power_save_w']
                    }).then(() => {
                        setTimeout(profileCb, 20);
                        this.cntr += 1;
                    }).catch((err) => {
                        this.notif.error(
                            'Error',
                            'Something went wrong.'
                        );
                        setTimeout(profileCb, 20);
                    });
                }, (err) => {
                    if (err) {
                        this.notif.error(
                            'Error',
                            'Something went wrong.'
                        );
                        this.notSubmitting = false;
                        this.profileDeviceId = '';

                    } else {
                        this.notif.success(
                            'Success',
                            'Profile Migrated.'
                        );
                        this.notSubmitting = false;
                        this.profileDeviceId = '';
                    }
                });

            });
        }
    }


}