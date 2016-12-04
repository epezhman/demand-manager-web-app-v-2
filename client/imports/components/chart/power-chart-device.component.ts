import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import "chart";
import * as _ from "lodash";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";
//noinspection TypeScriptCheckImport
import template from "./power-chart-device.component.html";

@Component({
    moduleId: module.id,
    selector: 'power-chart-device',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PowerChartDeviceComponent {

    lineChartData: Array<any> = [];

    @Input()
    set chartDevice(chartDevice: DeviceDetail) {
        if (chartDevice) {
            var ac_connected = [];
            var app_running = [];
            var computer_running = [];
            var power_rate = [];
            var remaining_capacity = [];
            var remaining_time = [];
            var voltage = [];
            _.forEach(chartDevice, function (powerProfile, key) {
                ac_connected.push(powerProfile['ac_connected_prob_percent']);
                app_running.push(powerProfile['app_running_prob_percent']);
                computer_running.push(powerProfile['computer_running_prob_percent']);
                power_rate.push(powerProfile['power_rate_w']);
                remaining_capacity.push(powerProfile['remaining_capacity_percent']);
                remaining_time.push(powerProfile['remaining_time_minutes']);
                voltage.push(powerProfile['voltage_v']);
            });

            this.lineChartData = [
                {data: ac_connected, label: 'AC Connected %', fill: false},
                {data: app_running, label: 'App Running %', fill: false},
                {data: computer_running, label: 'Computer Running %', fill: false},
                {data: power_rate, label: 'Power Rate w', fill: false},
                {data: remaining_capacity, label: 'Remaining Capacity %', fill: false},
                {data: remaining_time, label: 'Remaining Time m', fill: false},
                {data: voltage, label: 'voltage v', fill: false}
            ];
        }
    }


    public lineChartLabels: Array<any> =
        ['Sat 1', 'Sat 2', 'Sat 3', 'Mon 1', 'Mon 2', 'Mon 3', 'Tue 1', 'Tue 2', 'Tue 3', 'Wed 1',
            'Wed 2', 'Wed 3', 'Thu 1', 'Thu 2', 'Thu 3', 'Fri 1', 'Fri 2', 'Fri 3'];
    public lineChartOptions: any = {
        animation: false,
        responsive: true
    };
    public lineChartLegend: boolean = true;
    public lineChartType: string = 'line';

}
