import {Meteor} from 'meteor/meteor';

Meteor.publish('users-list', function () {
    if (this.userId && Roles.userIsInRole(this.userId, 'admin'))
        return Meteor.users.find({});
});

Meteor.publish(null, function () {
    //noinspection TypeScriptUnresolvedVariable
    return Meteor.roles.find({})
});