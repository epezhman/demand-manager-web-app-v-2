import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire} from "angularfire2";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./schedule.component.html";
import * as _ from "lodash";

@Component({
    moduleId: module.id,
    selector: 'schedule-device',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ScheduleComponent {

    @Input() schedule_period: DeviceDetail;
    @Input() deviceId: string;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    changeSchedulePeriod() {
        const scheduleObservable = this.af.database.object(`/schedule-period/${this.deviceId}/`);
        scheduleObservable.update({
            'schedule': _.trim(this.schedule_period['schedule'])
        }).then(() => {
            this.notif.success(
                'Success',
                'Schedule Saved'
            );
        }).catch((err) => {
            this.notif.error(
                'Error',
                'Something went wrong, try again please.'
            );
        });
    }
}
