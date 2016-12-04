import {Component} from "@angular/core";
import {InjectUser} from "angular2-meteor-accounts-ui";
//noinspection TypeScriptCheckImport
import template from "./welcome.component.html";

@Component({
    moduleId: module.id,
    selector: 'welcome-section',
    template: template
})
@InjectUser('user')
export class WelcomeComponent {
    user: Meteor.User;

    constructor() {
    }

    isAdmin(): boolean {
        if (this.user && Roles.userIsInRole(Meteor.user(), 'admin'))
            return true;
        else if (this.user)
            return false;
        return true
    }
}
