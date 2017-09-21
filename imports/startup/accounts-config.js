import { Accounts } from 'meteor/accounts-base';

// config meteor account to use username instead of email
Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});