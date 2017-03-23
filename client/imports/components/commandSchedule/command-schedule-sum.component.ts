import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {AngularFire} from "angularfire2";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
import * as _ from "lodash";
//noinspection TypeScriptCheckImport
import template from "./command-schedule-sum.component.html";
import {UtilsService} from "../../services/utils.service";
import * as firebase from "firebase";
//noinspection TypeScriptCheckImport
import {each} from "async";
import {NotificationsService} from "angular2-notifications";

@Component({
    moduleId: module.id,
    selector: 'command-schedule-devices-sum',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CommandScheduleSumComponent {

    schedules = {};
    @Input() devicesId: Array<string> = [];

    days: Array<number>;
    hours: Array<number>;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService, private utils: UtilsService) {
        this.days = this.utils.getDays();
        this.hours = this.utils.getHours();
    }

    @Input()
    set scheduleDevices(scheduleDevices: Array<DeviceDetail>) {
        if (scheduleDevices.length) {
            _.forEach(scheduleDevices[0], (timeslot, key) => {
                var countDevices = 0;
                var setDevices = 0;
                var oneHourDuration = '';
                var dayOfWeek = '';
                scheduleDevices.forEach((scheduleDevice) => {
                    if (scheduleDevice.hasOwnProperty(key) && scheduleDevice[key]) {
                        setDevices += scheduleDevice[key]['dr_running_bool'] ? 1 : 0;
                        oneHourDuration = scheduleDevice[key]['one_hour_duration_beginning'];
                        dayOfWeek = scheduleDevice[key]['day_of_week'];
                        countDevices++;
                    }
                });
                this.schedules[this.utils.getDayNum(dayOfWeek) + '-' + oneHourDuration] = {
                    'one_hour_duration_beginning': oneHourDuration,
                    'day_of_week': dayOfWeek,
                    'set_devices_count': setDevices,
                    'devices_count': countDevices
                }
            })
        }
    }

    toggleSchedule(schedule) {
        var dr_running = false;
        if (schedule['set_devices_count'] < schedule['devices_count']) {
            schedule['set_devices_count'] = schedule['devices_count'];
            dr_running = true;
        }
        else {
            schedule['set_devices_count'] = 0;
            dr_running = false;
        }
        var profileId = `${this.utils.getDayNum(schedule['day_of_week'])}-${schedule['one_hour_duration_beginning']}`;
        each(this.devicesId, (deviceId, cb) => {
            const commandObservable = this.af.database.object(`/schedule/${deviceId}/${profileId}`);
            //noinspection TypeScriptUnresolvedVariable
            commandObservable.update({
                'dr_running_bool': dr_running,
                'last-updated': firebase.database.ServerValue.TIMESTAMP
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
                    'Schedule Set.'
                );
            }
        });

    }
}