import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
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
            let sumAll = {};
            _.forEach(chartDevice, function (powerProfile, key) {
                let tempKey = '';
                let keyToken = key.split('-');
                let hour = parseInt(keyToken[1]);
                if (hour < 8)
                    tempKey = `${keyToken[0]}-0`;
                else if (hour < 16)
                    tempKey = `${keyToken[0]}-1`;
                else if (hour < 24)
                    tempKey = `${keyToken[0]}-2`;

                if (sumAll[tempKey]) {
                    sumAll[tempKey]['power_consume'] += powerProfile['estimated_power_consume_w'];
                    sumAll[tempKey]['power_save'] += powerProfile['estimated_power_save_w'];
                }
                else {
                    sumAll[tempKey] = {
                        'power_consume': powerProfile['estimated_power_consume_w'],
                        'power_save': powerProfile['estimated_power_save_w']
                    }
                }
            });

            let estimated_power_consume_w = [];
            let estimated_power_save_w = [];

            _.forEach(sumAll, function (sumDaySection) {
                estimated_power_consume_w.push(sumDaySection['power_consume'] / 480);
                estimated_power_save_w.push(sumDaySection['power_save'] / 480);
            });

            this.lineChartData = [
                {data: estimated_power_consume_w, label: 'Estimated Power w %', fill: false},
                {data: estimated_power_save_w, label: 'Estimated Power Save w', fill: false}
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
