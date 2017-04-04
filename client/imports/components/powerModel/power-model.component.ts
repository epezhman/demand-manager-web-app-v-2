import {ChangeDetectionStrategy, Component, Inject, Input} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire, FirebaseApp} from "angularfire2";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./power-model.component.html";
import * as firebase from "firebase";

@Component({
    moduleId: module.id,
    selector: 'power-model',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PowerModelComponent {

    @Input() power_model: DeviceDetail;
    @Input() deviceId: string;
    firebaseStorage: any;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService,
                @Inject(FirebaseApp) firebaseApp: firebase.app.App) {
        this.firebaseStorage = firebaseApp.storage();
    }

    uploadPowerModel(uploadModelFile: any): void {
        let uploadModel = this.firebaseStorage.ref().child(`/device-power-model/${this.deviceId}/power_model_cal.js`)
            .put(uploadModelFile.srcElement.files[0]);
        uploadModel.on(firebase.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                this.notif.info(
                    'Uploading',
                    'Power Model File Uploading.'
                );
            }, (error) => {
                this.notif.error(
                    'Error',
                    `Something went wrong: ${error.code}`
                );

            }, () => {
                this.notif.success(
                    'Success',
                    'Power Model File.'
                );
                this.power_model['power-model-url'] = uploadModel.snapshot.downloadURL;
                this.changePowerModel();
            });
    }

    changePowerModel(): void {
        const powerObservable = this.af.database.object(`/power-model/${this.deviceId}/`);
        powerObservable.update({
            'power-model-url': this.power_model['power-model-url']
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
