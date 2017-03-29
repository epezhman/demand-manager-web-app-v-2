import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {AngularFire} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./schedule-sum.component.html";
//noinspection TypeScriptCheckImport
import {each} from "async";
import {NotificationsService} from "angular2-notifications";
import * as _ from "lodash";

@Component({
    moduleId: module.id,
    selector: 'schedule-devices-sum',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class ScheduleSumComponent {

    @Input() devicesId: Array<string> = [];
    schedule_period: string = '';

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    changeSchedulePeriod() {
        each(this.devicesId, (deviceId, cb) => {
            const scheduleObservable = this.af.database.object(`/schedule-period/${deviceId}/`);
            scheduleObservable.update({
                'schedule': _.trim(this.schedule_period)
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
                    'Schedule Period Changed.'
                );
            }
        });
    }
}