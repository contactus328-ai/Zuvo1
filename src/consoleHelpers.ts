```ts
// Expose auth helpers for use in the browser DevTools console.
import * as phone from ./lib/auth/phoneOtp;
import * as email from ./lib/auth/emailOtp;
import * as session from ./lib/auth/session;

declare global {
  interface Window {
    authHelpers: {
      phone: typeof phone;
      email: typeof email;
      session: typeof session;
    };
  }
}

window.authHelpers = { phone, email, session };


