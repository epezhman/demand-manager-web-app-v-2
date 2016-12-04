import {Pipe} from "@angular/core";
import {Device} from "../../../both/interfaces/device.interface";


@Pipe({
    name: 'stringFilter'
})
export class StringFilterPipe {

    transform(value: Device[], q: string) {
        if (!q || q === '') {
            return value;
        }
        return value.filter(item => -1 < item.$key.toLowerCase().indexOf(q.toLowerCase()));
    }
}