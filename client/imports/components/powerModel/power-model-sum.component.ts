import {ChangeDetectionStrategy, Component, Inject, Input} from "@angular/core";
import {AngularFire, FirebaseApp} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./power-model-sum.component.html";
//noinspection TypeScriptCheckImport
import {each} from "async";
import {NotificationsService} from "angular2-notifications";
import * as _ from "lodash";
import * as firebase from "firebase";
import * as  moment from "moment";


@Component({
    moduleId: module.id,
    selector: 'power-model-sum',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PowerModelSumComponent {

    @Input() devicesId: Array<string> = [];
    power_save_model_url: string = '';
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
        if (uploadModelFile.srcElement.files[0]) {
            let uploadModel = this.firebaseStorage.ref().child(`/group-power-model/${moment().format()}/power_model_cal.js`)
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
                    this.power_save_model_url = uploadModel.snapshot.downloadURL;
                    this.changePowerModelURL();
                });
        }
    }

    changePowerModelURL() {
        each(this.devicesId, (deviceId, cb) => {
            const powerObservable = this.af.database.object(`/power-model/${deviceId}/`);
            powerObservable.update({
                'power-model-url': _.trim(this.power_save_model_url)
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