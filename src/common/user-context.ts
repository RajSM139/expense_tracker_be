import { DecodedIdToken } from 'firebase-admin/auth';

export class UserContext {
  private static _user: DecodedIdToken | null = null;

  static setUser(user: DecodedIdToken) {
    this._user = user;
  }

  static getUser(): DecodedIdToken | null {
    return this._user;
  }

  static clear() {
    this._user = null;
  }
}
