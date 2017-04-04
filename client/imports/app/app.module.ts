import {enableProdMode, NgModule} from "@angular/core";
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
import {AngularFireModule, AuthMethods, AuthProviders} from "angularfire2";
import {AgmCoreModule} from "angular2-google-maps/core";
import {Ng2PaginationModule} from "ng2-pagination";
import {SCHEDULE_DECLARATIONS} from "../components/schedule";
import {POWER_MODEL_DECLARATIONS} from "../components/powerModel";
import {CHART_DECLARATIONS} from "../components/powerChart";
import {SETTINGS_DECLARATIONS} from "../components/settings";
import {ChartsModule} from "ng2-charts/ng2-charts";
import {UtilsService} from "../services/utils.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


if (Meteor.isProduction) {
    enableProdMode();
}

export const firebaseConfig = {
    apiKey: "AIzaSyAtWT98dejyLr9BQXkmxiTHbBtbKQ1ObnY",
    authDomain: "tum-dm-fireb.firebaseapp.com",
    databaseURL: "https://tum-dm-fireb.firebaseio.com",
    storageBucket: "tum-dm-fireb.appspot.com",
};

const firebaseAuthConfig = {
    provider: AuthProviders.Google,
    method: AuthMethods.Popup
};

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(routes),
        AccountsModule,
        FormsModule,
        ReactiveFormsModule,
        SimpleNotificationsModule.forRoot(),
        Ng2PaginationModule,
        ChartsModule,
        AngularFireModule.initializeApp(firebaseConfig, firebaseAuthConfig),
        BrowserAnimationsModule,
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
        ...SCHEDULE_DECLARATIONS,
        ...CHART_DECLARATIONS,
        ...SETTINGS_DECLARATIONS,
        ...POWER_MODEL_DECLARATIONS
    ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        UtilsService,
        ...ROUTES_PROVIDERS
    ]
})
export class AppModule {
}