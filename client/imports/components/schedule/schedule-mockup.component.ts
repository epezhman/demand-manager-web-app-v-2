import {Component} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./schedule-mockup.component.html";
import {Device} from "../../../../both/interfaces/device.interface";
import * as geolib from "geolib";
import * as  moment from "moment";
//noinspection TypeScriptCheckImport
import {eachLimit, eachSeries, series} from "async";

@Component({
    moduleId: module.id,
    selector: 'schedule-mockup',
    template: template,
    styles: ['.sebm-google-map-container {height: 400px; }']
})
export class ScheduleMockUpComponent {

    isLoading: boolean = false;

    latGarching: number = 48.2625041;
    lngGarching: number = 11.6718652;
    zoomGarching: number = 15;

    selectedLat: number;
    selectedLng: number;
    startTime: string;
    demandCut: number;
    durationMinutes: number;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {

    }

    locationChanged(m, $event) {
        this.selectedLat = $event.coords.lat;
        this.selectedLng = $event.coords.lng;
    }

    sss() {

        let dId = 'f4c65d10-25d2-11e7-81c6-5d3fcec29a5f';
        let bat = `/power/${dId}/${moment().day()}-${moment().hour()}-${moment().minute()}/power-diff-w`


        let seconds = Array.from(Array(this.durationMinutes).keys());


        console.log(seconds)
        let profileObserver = this.af.database.object(bat);
        let profileSub = profileObserver.subscribe(power => {
            profileSub.unsubscribe();
            console.log(power.$key)
        });
    }

    makeSchedule() {
        if (confirm('Are you Sure?') && this.selectedLat && this.selectedLng && this.demandCut && this.durationMinutes) {
            this.isLoading = true;
            let devices: Device[] = [];
            let devicesObservable = this.af.database.list('/online');
            let devicesSub = devicesObservable.subscribe((devicesData) => {
                devicesSub.unsubscribe();
                devicesData.forEach((device, index, array) => {
                    if (device.hasOwnProperty('connections')) {
                        if (geolib.getDistanceSimple(
                                {latitude: this.selectedLat, longitude: this.selectedLng},
                                {latitude: device.l[0], longitude: device.l[1]}
                            ) < 1000) {
                            devices.push(device);
                        }
                    }
                });


                console.log(devices)
                this.isLoading = false;
            });
        }

    }

}
