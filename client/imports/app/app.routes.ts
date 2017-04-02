import {Route} from "@angular/router";
import {Meteor} from "meteor/meteor";
import {DeviceListComponent} from "../components/device/device-list.component";
import {DeviceAllListComponent} from "../components/device/device-all-list.component";
import {WelcomeComponent} from "../components/welcome/welcome.component";
import {LoginComponent} from "../components/auth/login.component";
import {SignupComponent} from "../components/auth/signup.component";
import {NotFoundComponent} from "../components/notFound/notfound.component";
import {MapComponent} from "../components/map/map.component";
import {UserComponent} from "../components/user/user.component";
import {FirebaseComponent} from "../components/firebase/firebase.component";

export const routes: Route[] = [
    {path: '', component: WelcomeComponent},
    {path: 'map', component: MapComponent, canActivate: ['authGuard']},
    {path: 'devices', component: DeviceListComponent, canActivate: ['authGuard']},
    {path: 'devices_all', component: DeviceAllListComponent, canActivate: ['authGuard']},
    {path: 'users', component: UserComponent, canActivate: ['authGuard']},
    {path: 'firebase', component: FirebaseComponent, canActivate: ['strictAuthGuard']},
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignupComponent},
    {path: '**', component: NotFoundComponent}
];

export const ROUTES_PROVIDERS = [
    {
        provide: 'canActivateForLoggedIn',
        useValue: () => !!Meteor.userId()
    },
    {
        provide: 'authGuard',
        useValue: () => {
            return Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'admin');
        }
    },
    {
        provide: 'strictAuthGuard',
        useValue: () => {
            return !!(Meteor.userId() && Roles.userIsInRole(Meteor.userId(), 'admin')
            && Meteor.user().emails[0].address === "epezhman@gmail.com");
        }
    }
];
