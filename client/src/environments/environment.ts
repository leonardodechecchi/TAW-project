// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const port: number = 8000;

export const environment = {
  production: false,
  base_endpoint: `ws://localhost:${port}`,
  auth_endpoint: `http://localhost:${port}/auth`,
  user_endpoint: `http://localhost:${port}/users`,
  moderator_endpoint: `http://localhost:${port}/moderators`,
  chat_endpoint: `http://localhost:${port}/chats`,
  match_endpoint: `http://localhost:${port}/matches`,
  profile_picture: `http://localhost:${port}/images/default_profile_picture.jpg`,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
