// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  base_endpoint: 'ws://localhost:8000',
  auth_endpoint: 'http://localhost:8000/auth',
  user_endpoint: 'http://localhost:8000/users',
  moderator_endpoint: 'http://localhost:8000/moderators',
  chat_endpoint: 'http://localhost:8000/chats',
  profile_picture: 'http://localhost:8000/images/default_profile_picture.jpg',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
