import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire} from "angularfire2";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./command-schedule.component.html";
import {UtilsService} from "../../services/utils.service";
import * as firebase from "firebase";

@Component({
    moduleId: module.id,
    selector: 'command-schedule-device',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class CommandScheduleComponent {

    schedules: DeviceDetail;
    @Input() deviceId: string;
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
    set scheduleDevice(scheduleDevice: DeviceDetail) {
        if (scheduleDevice) {
            this.schedules = scheduleDevice;
        }
    }

    toggleSchedule(schedule) {
        schedule['dr_running_bool'] = !schedule['dr_running_bool'];
        var profileId = `${this.utils.getDayNum(schedule['day_of_week'])}-${schedule['one_hour_duration_beginning']}`;
        const commandObservable = this.af.database.object(`/schedule/${this.deviceId}/${profileId}`);
        //noinspection TypeScriptUnresolvedVariable
        commandObservable.update({
            'dr_running_bool': schedule['dr_running_bool'],
            'last-updated': firebase.database.ServerValue.TIMESTAMP
        }).then(() => {
            this.notif.success(
                'Success',
                'Schedule Set.'
            );
        }).catch((err) => {
            this.notif.error(
                'Error',
                'Something went wrong, try again please.'
            );
        });
    }
}
