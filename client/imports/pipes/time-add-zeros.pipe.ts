import {Pipe} from "@angular/core";


@Pipe({
    name: 'timeAddZeros'
})
export class TimeAddZerosPipe {

    transform(t: number) {
        if (t < 10)
            return `0${t}:00`;
        return `${t}:00`;
    }
}