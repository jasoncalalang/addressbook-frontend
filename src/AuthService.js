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

      const storedTokens = sessionStorage.getItem('appIdTokens');
      if (storedTokens) {
        this.tokens = JSON.parse(storedTokens);
      } else {
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
      // Clear stored tokens
      sessionStorage.removeItem('appIdTokens');
      this.tokens = null;

      // Redirect to the App ID logout endpoint
      const logoutUrl = `https://au-syd.appid.cloud.ibm.com/oauth/v4/0148eb09-a770-4ccd-9718-904ec6c01e5e/logout?client_id=${config.clientId}&redirect_uri=${config.redirectUri}`;
      window.location.href = logoutUrl;
    } catch (e) {
      console.error('Failed to logout:', e);
    }
  }

  isAuthenticated() {
    return this.tokens != null;
  }

  async getAccessToken() {
    if (this.tokens) {
      const now = Math.floor(Date.now() / 1000);
      const expiration = this.tokens.accessTokenPayload.exp;

      if (now > expiration - 60) {
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
