import {Injectable} from '@angular/core';

@Injectable()
export class UtilsService {
    getDayNum(d: string): number {
        switch (d) {
            case 'sun':
                return 0;
            case 'mon':
                return 1;
            case 'tue':
                return 2;
            case 'wed':
                return 3;
            case 'thu':
                return 4;
            case 'fri':
                return 5;
            case 'sat':
                return 6;
        }
    }

    getDays(): Array<number> {
        return [1, 2, 3, 4, 5, 6, 0];
    }

    getHours(): Array<number> {
        return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
    }
}