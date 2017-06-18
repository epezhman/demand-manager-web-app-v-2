import {Component} from "@angular/core";
import {NotificationsService} from "angular2-notifications";
import {AngularFire, FirebaseListObservable} from "angularfire2";
//noinspection TypeScriptCheckImport
import template from "./schedule-mockup.component.html";
import {Device} from "../../../../both/interfaces/device.interface";
import * as  moment from "moment";
//noinspection TypeScriptCheckImport
import {eachLimit, eachSeries, series} from "async";
import * as _ from "lodash";


@Component({
    moduleId: module.id,
    selector: 'schedule-mockup',
    template: template,
    styles: ['.sebm-google-map-container {height: 400px; }']
})
export class ScheduleMockUpComponent {
    dmObservable: FirebaseListObservable<Device[]>;

    isLoading: boolean = false;

    selectedDevices: Device[] = [];
    participatingDevices: Device[] = [];
    estimatedDemandCut: number;
    schedulingStartTime: any;
    schedulingFinishedTime: any;
    allJoinedTime: any;
    generatedSchedule: string;

    latGarching: number = 48.2625041;
    lngGarching: number = 11.6718652;
    zoomGarching: number = 15;

    selectedLat: number;
    selectedLng: number;
    startTime: string;
    demandCut: number;
    durationMinutes: number;

    isAllJoined: boolean = false;

    notifOptions = {
        timeOut: 1000,
        position: ["bottom", "left"]
    };

    constructor(private af: AngularFire, private notif: NotificationsService) {
        this.dmObservable = this.af.database.list('/dm');
        this.dmObservable.subscribe((devicesData) => {
            this.participatingDevices = devicesData;
            if (!this.isAllJoined && this.participatingDevices.length === this.selectedDevices.length) {
                this.isAllJoined = true;
                this.allJoinedTime = moment().format("YYYY-MM-DD HH:mm:ss:SSS");
            }
        });
    }

    locationChanged(m, $event) {
        this.selectedLat = $event.coords.lat;
        this.selectedLng = $event.coords.lng;
    }

    makeSchedule() {
        if (confirm('Are you Sure?') && this.selectedLat && this.selectedLng && this.demandCut && this.durationMinutes) {
            this.isLoading = true;
            this.isAllJoined = false;
            this.schedulingStartTime = moment().format("YYYY-MM-DD HH:mm:ss:SSS");
            this.selectedDevices = [];
            this.participatingDevices = [];
            this.schedulingFinishedTime = null;
            this.allJoinedTime = null;
            this.generatedSchedule = '';
            let powerDiffs: number[] = [];
            let dmObservable = this.af.database.object(`/dm`);
            dmObservable.remove();
            let devicesObservable = this.af.database.list('/online');
            let devicesSub = devicesObservable.subscribe((devicesData) => {
                if (devicesSub)
                    devicesSub.unsubscribe();
                devicesData.forEach((device, index, array) => {
                    if (device.hasOwnProperty('connections')) {
                        if (geolib.getDistanceSimple(
                                {latitude: this.selectedLat, longitude: this.selectedLng},
                                {latitude: device.l[0], longitude: device.l[1]}
                            ) < 1000) {
                            this.selectedDevices.push(device);
                        }
                    }
                });
                let minutes = Array.from(Array(this.durationMinutes).keys());
                eachLimit(minutes, 50, (minute, mcb) => {
                    let newTime = moment().add(minute, 'm');
                    eachLimit(this.selectedDevices, 50, (device, dcb) => {
                        let profileObserver = this.af.database.object(`/power/${device.$key}/${newTime.day()}-${newTime.hour()}-${newTime.minute()}/power_diff_w`);
                        let profileSub = profileObserver.subscribe(power => {
                            if (profileSub)
                                profileSub.unsubscribe();
                            powerDiffs.push(+power.$value);
                            dcb();
                        });
                    }, (err) => {
                        if (err) {
                            this.notif.error(
                                'Error',
                                'Something went wrong.'
                            );
                            mcb();
                        } else {
                            mcb();
                        }
                    })
                }, (err) => {
                    if (err) {
                        this.notif.error(
                            'Error',
                            'Something went wrong.'
                        );
                    }
                    this.estimatedDemandCut = Math.round((_.sum(powerDiffs) / powerDiffs.length) * 100) / 100;
                    let schedule = '';
                    if (this.startTime) {
                        let basTime = moment(`${moment().format('YYYY-MM-DD')} ${this.startTime}`);
                        schedule = `${basTime.format("YYYY-MM-DDTHH:mm:ssZ")}$${basTime.add(this.durationMinutes, 'm')
                            .format("YYYY-MM-DDTHH:mm:ssZ")}`;
                    }
                    else {
                        schedule = `${moment().format("YYYY-MM-DDTHH:mm:ssZ")}$${moment().add(this.durationMinutes, 'm')
                            .format("YYYY-MM-DDTHH:mm:ssZ")}`;
                    }
                    this.generatedSchedule = schedule;
                    eachLimit(this.selectedDevices, 50, (device, dcb) => {
                        const scheduleObservable = this.af.database.object(`/schedule-period/${device.$key}/`);
                        scheduleObservable.update({
                            'schedule': _.trim(schedule)
                        }).then(() => {
                            dcb();
                        });
                    }, (err) => {
                        if (err) {
                            this.notif.error(
                                'Error',
                                'Something went wrong.'
                            );
                            this.isLoading = false;
                        } else {
                            this.notif.success(
                                'Success',
                                'Scheduling was successful.'
                            );
                            this.schedulingFinishedTime = moment().format("YYYY-MM-DD HH:mm:ss:SSS");
                            this.isLoading = false;
                        }
                    })
                });

            });
        }
    }
}

// Specific Schedule e.g.: 2017-03-29T17:53:23+02:00$2017-03-29T18:55:23+02:00
// Daily Schedule  e.g.:  17:53:23+02:00%18:55:23+02:00
// Weekly Schedule e.g.:  3W17:53:23+02:00#4W18:55:23+02:00 , Monday = 1 , Sunday = 7