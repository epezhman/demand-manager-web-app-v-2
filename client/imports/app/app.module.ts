import {NgModule, enableProdMode} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {AppComponent} from "./app.component";
import {RouterModule} from "@angular/router";
import {routes, ROUTES_PROVIDERS} from "./app.routes";
import {WelcomeComponent} from "../components/welcome/welcome.component";
import {AccountsModule} from "angular2-meteor-accounts-ui";
import {AUTH_DECLARATIONS} from "../components/auth";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NotFoundComponent} from "../components/notFound/notfound.component";
import {PIPE_DECLARATIONS} from "../pipes";
import {MAP_DECLARATIONS} from "../components/map";
import {FIREBASE_DECLARATIONS} from "../components/firebase";
import {DEVICE_DECLARATIONS} from "../components/device";
import {USER_DECLARATIONS} from "../components/user";
import {SimpleNotificationsModule} from "angular2-notifications";
import {AngularFireModule, WindowLocation} from "angularfire2";
import {AgmCoreModule} from "angular2-google-maps/core";
import {Ng2PaginationModule} from "ng2-pagination";
import {COMMAND_DECLARATIONS} from "../components/commandSchedule";
import {CHART_DECLARATIONS} from "../components/chart";
import {SETTINGS_DECLARATIONS} from "../components/settings"
import { ChartsModule } from 'ng2-charts/ng2-charts';
import {UtilsService} from "../services/utils.service";


if (Meteor.isProduction) {
    enableProdMode();
}

export const firebaseConfig = {
    apiKey: "AIzaSyAtWT98dejyLr9BQXkmxiTHbBtbKQ1ObnY",
    authDomain: "tum-dm-fireb.firebaseapp.com",
    databaseURL: "https://tum-dm-fireb.firebaseio.com",
    storageBucket: "tum-dm-fireb.appspot.com",
};


@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        AccountsModule,
        FormsModule,
        ReactiveFormsModule,
        SimpleNotificationsModule,
        Ng2PaginationModule,
        ChartsModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAaTEB01LfTgf7SrjKZzz_PbWT6hNxJHcM'
        })
    ],
    declarations: [
        AppComponent,
        WelcomeComponent,
        NotFoundComponent,
        ...AUTH_DECLARATIONS,
        ...DEVICE_DECLARATIONS,
        ...FIREBASE_DECLARATIONS,
        ...MAP_DECLARATIONS,
        ...USER_DECLARATIONS,
        ...PIPE_DECLARATIONS,
        ...COMMAND_DECLARATIONS,
        ...CHART_DECLARATIONS,
        ...SETTINGS_DECLARATIONS
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        UtilsService,
        ...ROUTES_PROVIDERS,
        {
            provide: WindowLocation,
            useValue: {
                hash: '',
                search: '',
                pathname: '/',
                port: '',
                hostname: 'localhost',
                host: 'localhost',
                protocol: 'https',
                origin: 'localhost',
                href: 'https://localhost/'
            }
        }
    ]
})
export class AppModule {
}