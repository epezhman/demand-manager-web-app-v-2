import {Meteor} from 'meteor/meteor';
import {check} from 'meteor/check';


Meteor.methods({
    addUserToAdmin: function (userId: String) {
        check(userId, String);
        if (this.userId && Roles.userIsInRole(this.userId, 'admin'))
            Roles.addUsersToRoles(userId, 'admin');
        else
            throw new Meteor.Error('403', 'No permissions!');
    },
    removeUserFromAdmin: function (userId: String) {
        check(userId, String);
        if (this.userId && Roles.userIsInRole(this.userId, 'admin'))
            Roles.removeUsersFromRoles(userId, 'admin');
        else
            throw new Meteor.Error('403', 'No permissions!');
    }
});

