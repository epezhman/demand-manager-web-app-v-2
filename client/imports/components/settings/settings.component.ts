import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
import {NotificationsService} from "angular2-notifications";
import {AngularFire} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./settings.component.html";


@Component({
    moduleId: module.id,
    selector: 'device-setting',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingComponent {

    settings: DeviceDetail;
    @Input() deviceId: string;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {
    }

    @Input()
    set settingDevice(settingDevice: DeviceDetail) {
        if (settingDevice) {
            this.settings = settingDevice;
        }
    }

    changeSetting() {
        const settingsObservable = this.af.database.object(`/settings/${this.deviceId}/`);
        settingsObservable.update({
            'logging': this.settings['logging'],
            'power-monitor-interval': this.settings['power-monitor-interval']
        }).then(() => {
            this.notif.success(
                'Success',
                'Settings Changed'
            );
        }).catch((err) => {
            this.notif.error(
                'Error',
                'Something went wrong, try again please.'
            );
        });
    }

    deleteLogs() {
        if (confirm('Are you Sure?')) {
            const loggingObservable = this.af.database.object(`/logging/${this.deviceId}`);
            loggingObservable.remove().then(() => {
                this.notif.success(
                    'Success',
                    'Logging Deleted'
                );
            }).catch((err) => {
                this.notif.error(
                    'Error',
                    'Something went wrong, try again please.'
                );
            });
        }
    }

    restartApp() {
        const settingsObservable = this.af.database.object(`/settings/${this.deviceId}/`);
        settingsObservable.update({
            'restart': true
        }).then(() => {
            this.notif.success(
                'Success',
                'Restart Set'
            );
        }).catch((err) => {
            this.notif.error(
                'Error',
                'Something went wrong, try again please.'
            );
        });
    }
}