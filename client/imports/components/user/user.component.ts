import {Component, OnInit, OnDestroy} from "@angular/core";
import {Meteor} from "meteor/meteor";
//noinspection TypeScriptCheckImport
import template from "./user.component.html";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {Users} from "../../../../both/collections/users.collection";
import {User} from "../../../../both/interfaces/user.interface";
import {MeteorObservable} from "meteor-rxjs";
import {NotificationsService} from "angular2-notifications";

@Component({
    moduleId: module.id,
    selector: 'user-section',
    template: template
})
export class UserComponent implements OnInit, OnDestroy {

    isLoading: boolean = true;
    //noinspection JSAnnotator
    users: Observable<User>;
    usersSub: Subscription;

    notifOptions = {
        timeOut: 5000,
        position:["bottom", "left"]
    };

    constructor(private notif: NotificationsService) {

    }

    ngOnInit() {
        if (this.usersSub) {
            this.usersSub.unsubscribe();
        }
        this.usersSub = MeteorObservable.subscribe('users-list').subscribe(() => {
            this.users = Users.find({}).zone();
            this.isLoading = false;
        });
    }

    ngOnDestroy() {
        this.usersSub.unsubscribe();
    }

    addAdmin(user: Meteor.User): void {
        if (confirm('Are you Sure?'))
            MeteorObservable.call('addUserToAdmin', user._id).subscribe(() => {
                this.notif.success(
                    'Success',
                    'Added to Admin.'
                );
            }, (error) => {
                this.notif.error(
                    'Error',
                    `Failed due to ${error}`
                );
            });
    }

    removeAdmin(user: Meteor.User): void {
        if (confirm('Are you Sure?'))
            MeteorObservable.call('removeUserFromAdmin', user._id).subscribe(() => {
                this.notif.success(
                    'Success',
                    'Removed from Admin'
                );
            }, (error) => {
                this.notif.error(
                    'Error',
                    `Failed due to ${error}`
                );
            });
    }

    isAdmin(user: Meteor.User): boolean {
        return Roles.userIsInRole(user, 'admin');
    }

    isAllowedToChangeAdmin(): boolean {
        return Roles.userIsInRole(Meteor.user(), 'admin');
    }

}
