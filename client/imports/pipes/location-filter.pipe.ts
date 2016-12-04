import {Pipe} from "@angular/core";
import {Device} from "../../../both/interfaces/device.interface";
import "geolib";

@Pipe({
    name: 'locationFilter'
})
export class LocationFilterPipe {

    transform(value: Device[], lat: number, lon: number, radius: number) {

        if (!lon || !lat || !radius) {
            return value;
        }
        return value.filter(item => {
            try {
                //noinspection TypeScriptUnresolvedVariable
                return geolib.isPointInCircle(
                    {latitude: item.l[0], longitude: item.l[1]},
                    {latitude: lat, longitude: lon},
                    radius
                );
            }
            catch (e) {

                console.error(e);
            }

        });
    }
}