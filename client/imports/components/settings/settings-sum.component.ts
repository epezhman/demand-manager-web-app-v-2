import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire} from "angularfire2";
import "geolib";
//noinspection TypeScriptCheckImport
import template from "./settings-sum.component.html";
//noinspection TypeScriptCheckImport
import {each} from "async";


@Component({
    moduleId: module.id,
    selector: 'settings-devices-sum',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class SettingSumComponent {
    @Input() settingDevicesId: Array<string>;

    logging: boolean = false;
    power_model: string = '';

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService,) {

    }

    changeLogging() {
        each(this.settingDevicesId, (deviceId, cb) => {
            const settingsObservable = this.af.database.object(`/settings/${deviceId}/`);
            settingsObservable.update({
                'logging': this.logging
            }).then(() => {
                cb();
            })

        }, (err) => {
            if (err) {
                this.notif.error(
                    'Error',
                    'Something went wrong, try again please.'
                );
            } else {
                this.notif.success(
                    'Success',
                    'Logging Changed.'
                );
            }
        });
    }

    changePowerModel() {
        each(this.settingDevicesId, (deviceId, cb) => {
            const settingsObservable = this.af.database.object(`/settings/${deviceId}/`);
            settingsObservable.update({
                'power-model': this.power_model
            }).then(() => {
                cb();
            })

        }, (err) => {
            if (err) {
                this.notif.error(
                    'Error',
                    'Something went wrong, try again please.'
                );
            } else {
                this.notif.success(
                    'Success',
                    'Power Model Changed.'
                );
            }
        });

    }
}