import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {AngularFire} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./power-model-sum.component.html";
//noinspection TypeScriptCheckImport
import {each} from "async";
import {NotificationsService} from "angular2-notifications";
import * as _ from "lodash";

@Component({
    moduleId: module.id,
    selector: 'power-model-sum',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PowerModelSumComponent {

    @Input() devicesId: Array<string> = [];
    power_model: string = '';

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    changePowerModel() {
        each(this.devicesId, (deviceId, cb) => {
            const powerObservable = this.af.database.object(`/power-model/${deviceId}/`);
            powerObservable.update({
                'power-model': _.trim(this.power_model)
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