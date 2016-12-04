import {Component, Input, ChangeDetectionStrategy} from "@angular/core";
import "chart";
import * as _ from "lodash";
//noinspection TypeScriptCheckImport
import template from "./power-chart-device-sum.component.html";
import {DeviceDetail} from "../../../../both/interfaces/device.interface";

@Component({
    moduleId: module.id,
    selector: 'power-chart-device-sum',
    template: template,
    changeDetection: ChangeDetectionStrategy.OnPush

})
export class PowerChartDeviceSumComponent {
    lineChartData: Array<any> = [];

    @Input()
    set chartDevices(chartDevices: Array<DeviceDetail>) {
        if (chartDevices) {
            var ac_connected = [];
            var app_running = [];
            var computer_running = [];
            var power_rate = [];
            var remaining_capacity = [];
            var remaining_time = [];
            var voltage = [];
            var length = chartDevices.length;
            _.forEach(chartDevices[0], (powerProfile, key) => {
                var tempACConnected = 0;
                var tempAppRunning = 0;
                var tempComputerRunning = 0;
                var tempPowerRate = 0;
                var tempRemainingCapacity = 0;
                var tempRemainingTime = 0;
                var tempVoltage = 0;

                chartDevices.forEach((chartDevice) => {
                    if (chartDevice.hasOwnProperty(key)) {
                        tempACConnected += chartDevice[key]['ac_connected_prob_percent'];
                        tempAppRunning += chartDevice[key]['app_running_prob_percent'];
                        tempComputerRunning += chartDevice[key]['computer_running_prob_percent'];
                        tempPowerRate += chartDevice[key]['power_rate_w'];
                        tempRemainingCapacity += chartDevice[key]['remaining_capacity_percent'];
                        tempRemainingTime += chartDevice[key]['remaining_time_minutes'];
                        tempVoltage += chartDevice[key]['voltage_v'];
                    }
                });
                ac_connected.push(Math.round(tempACConnected / length));
                app_running.push(Math.round(tempAppRunning / length));
                computer_running.push(Math.round(tempComputerRunning / length));
                power_rate.push(Math.round((tempPowerRate / length) * 100) / 100);
                remaining_capacity.push(Math.round(tempRemainingCapacity / length));
                remaining_time.push(Math.round(tempRemainingTime / length));
                voltage.push(Math.round((tempVoltage / length) * 100) / 100);
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