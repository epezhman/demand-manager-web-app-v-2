import {TimeAddZerosPipe} from "./time-add-zeros.pipe";
import {StringFilterPipe} from "./string-filter.pipe";
import {LocationFilterPipe} from "./location-filter.pipe";
import {DeviceStatusPipe} from "./device-status.pipe";
import {DisplayNamePipe} from "./display-name.pipe";

export const PIPE_DECLARATIONS = [
    DeviceStatusPipe,
    LocationFilterPipe,
    StringFilterPipe,
    TimeAddZerosPipe,
    DisplayNamePipe
];