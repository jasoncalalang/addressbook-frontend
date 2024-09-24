import AppID from 'ibmcloud-appid-js';
import config from './config';

class AuthService {
  constructor() {
    this.appID = new AppID();
    this.tokens = null;
  }

  async init() {
    try {
      await this.appID.init({
        clientId: config.clientId,
        discoveryEndpoint: config.discoveryEndpoint,
      });

      // Attempt to retrieve existing tokens from session storage
      const storedTokens = sessionStorage.getItem('appIdTokens');
      if (storedTokens) {
        this.tokens = JSON.parse(storedTokens);
      } else {
        // Try silent signin to obtain tokens without user interaction
        this.tokens = await this.appID.signinSilent();
        this.storeTokens(this.tokens);
      }
    } catch (e) {
      console.error('Failed to initialize AppID:', e);
    }
  }

  async login() {
    try {
      this.tokens = await this.appID.signin();
      this.storeTokens(this.tokens);
      return this.tokens;
    } catch (e) {
      console.error('Failed to authenticate:', e);
    }
  }

  async logout() {
    try {
      await this.appID.signout();
      this.tokens = null;
      sessionStorage.removeItem('appIdTokens');
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  }

  isAuthenticated() {
    return this.tokens != null;
  }

  getUserInfo() {
    if (this.tokens) {
      return this.tokens.idTokenPayload;
    }
    return null;
  }

  async getAccessToken() {
    if (this.tokens) {
      const now = Math.floor(Date.now() / 1000);
      const expiration = this.tokens.accessTokenPayload.exp;

      if (now > expiration - 60) {
        // Token is expired or about to expire, refresh it
        try {
          this.tokens = await this.appID.signinSilent();
          this.storeTokens(this.tokens);
        } catch (e) {
          console.error('Failed to refresh tokens:', e);
          this.tokens = null;
          sessionStorage.removeItem('appIdTokens');
        }
      }
      return this.tokens.accessToken;
    }
    return null;
  }

  storeTokens(tokens) {
    sessionStorage.setItem('appIdTokens', JSON.stringify(tokens));
  }
}

const authService = new AuthService();
export default authService;
