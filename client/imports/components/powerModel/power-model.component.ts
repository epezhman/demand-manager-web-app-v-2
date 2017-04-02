import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire} from "angularfire2";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./power-model.component.html";
import {UtilsService} from "../../services/utils.service";

@Component({
    moduleId: module.id,
    selector: 'power-model',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PowerModelComponent {

    @Input() power_model : DeviceDetail;
    @Input() deviceId: string;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    changePowerModel() {
        const powerObservable = this.af.database.object(`/power-model/${this.deviceId}/`);
        powerObservable.update({
            'power-model': this.power_model['power-model'],
            'power-save-model': this.power_model['power-save-model']
        }).then(() => {
            this.notif.success(
                'Success',
                'Power Model Saved.'
            );
        }).catch((err) => {
            this.notif.error(
                'Error',
                'Something went wrong, try again please.'
            );
        });
    }
}
