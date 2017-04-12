import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
import {NotificationsService} from "angular2-notifications";
import {AngularFire, FirebaseListObservable} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./settings.component.html";
import {Angular2Csv} from "angular2-csv/Angular2-csv";
import * as  moment from "moment";


@Component({
    moduleId: module.id,
    selector: 'device-setting',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingComponent {

    settings: DeviceDetail;
    @Input() deviceId: string;
    logsObservable: FirebaseListObservable<DeviceDetail[]>;
    logsSubscription: any;

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
        if (this.settings['logging']) {
            settingsObservable.update({
                'logging': this.settings['logging']
            }).then(() => {
                this.notif.success(
                    'Success',
                    'Logging Changed'
                );
            }).catch((err) => {
                this.notif.error(
                    'Error',
                    'Something went wrong, try again please.'
                );
            });
        }
        if (this.settings['power-monitor-interval']) {
            settingsObservable.update({
                'power-monitor-interval': this.settings['power-monitor-interval']
            }).then(() => {
                this.notif.success(
                    'Success',
                    'Power Monitor Interval Changed'
                );
            }).catch((err) => {
                this.notif.error(
                    'Error',
                    'Something went wrong, try again please.'
                );
            });
        }
        if (this.settings['days-delete-db']) {
            settingsObservable.update({
                'days-delete-db': this.settings['days-delete-db']
            }).then(() => {
                this.notif.success(
                    'Success',
                    'Days to Delete DB Changed'
                );
            }).catch((err) => {
                this.notif.error(
                    'Error',
                    'Something went wrong, try again please.'
                );
            });
        }
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
        if (confirm('Are you Sure?')) {
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

    downloadLogs(): void {
        this.logsObservable = this.af.database.list(`/logging/${this.deviceId}/`);
        this.logsSubscription = this.logsObservable.subscribe((logs) => {
            new Angular2Csv(logs, `logs_${this.deviceId}_${moment().format()}`);
            this.logsSubscription.unsubscribe();
        });
    }
}