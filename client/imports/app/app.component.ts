import {Component} from "@angular/core";
import {InjectUser} from "angular2-meteor-accounts-ui";
//noinspection TypeScriptCheckImport
import template from "./app.component.html";
import {AngularFire} from "angularfire2";

@Component({
    moduleId: module.id,
    selector: 'app',
    template: template
})
@InjectUser('user')
export class AppComponent {
    user: Meteor.User;

    constructor(private af: AngularFire) {

    }

    logout() {
        Meteor.logout();
    }

    isAdmin(): boolean {
        return Roles.userIsInRole(Meteor.user(), 'admin');
    }

    isStrictAdmin(): boolean {
        return Roles.userIsInRole(Meteor.user(), 'admin')
            && Meteor.user().emails[0].address === "epezhman@gmail.com";
    }
}
