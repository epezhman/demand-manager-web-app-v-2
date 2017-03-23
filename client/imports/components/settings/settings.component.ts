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

    constructor(private af: AngularFire, private notif: NotificationsService,) {

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
            'power-model': this.settings['power-model'],
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
}