import Provider from "pages/login/[provider]";
import { StorageManager } from "utils/storage";
import { randomUUID } from "utils/string";

const AUTH_PROVIDERS = ["discord", "github"] as const;
export type Provider = typeof AUTH_PROVIDERS[number];

export const isProvider = (value: unknown): value is Provider =>
  AUTH_PROVIDERS.includes(value as Provider);

export class OAuthManager {
  static _storage = new StorageManager("OAuth");
  static _stateExpiry = 600000; // 10 minutes

  /**
   * Create state secret token and store it for future use.
   *
   * State token is used for CSRF protection. It will be included as a
   * query parameter when browser is redirected to provider's site, and
   * also when provider redirects the browser back to our site.
   */
  static async createStateSecret(provider: Provider): Promise<string> {
    const key = this._getStateSecretStorageKey(provider);
    const state = await randomUUID();
    const value = JSON.stringify({
      state,
      expiry: Date.now() + this._stateExpiry,
    });

    this._storage.setValue(key, value);
    return state;
  }

  /**
   * Validate the received token matches the one sent to the provider.
   *
   * Since the token isn't needed any more after the validation, it's
   * also removed from the storage.
   */
  static validateStateSecret(provider: Provider, receivedState: string): void {
    const key = this._getStateSecretStorageKey(provider);
    const value = this._storage.popValue(key);

    if (value === null) {
      throw new Error(`OAuth state token for ${provider} not found in storage`);
    }

    const { state: expectedState, expiry } = JSON.parse(value);

    if (Date.now() > expiry) {
      throw new Error(`OAuth state token for ${provider} has expired`);
    }

    if (receivedState !== expectedState) {
      throw new Error(`Incorrect OAuth state token received from ${provider}`);
    }
  }

  /** Return the URL used to start the authentication flow. */
  static async getProviderLoginUrl(provider: Provider): Promise<string> {
    const state = await this.createStateSecret(provider);
    const redirectUri = this.getLocalRedirectUri(provider);

    if (provider === "discord") {
      const clientId = process.env.NEXT_PUBLIC_DISCORD_ID;
      return `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&response_type=code&scope=email%20identify`;
    }

    if (provider === "github") {
      const clientId = process.env.NEXT_PUBLIC_GITHUB_ID;
      return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&response_type=code&scope=user:email,read:user`;
    }

    throw new Error(`Unsupported provider "${provider}"`);
  }

  /** Return the URI the provider should redirect the authenticated user to. */
  static getLocalRedirectUri(provider: Provider): string {
    return `${process.env.NEXT_PUBLIC_SITE_DOMAIN}/login/${provider}`;
  }

  static _getStateSecretStorageKey(provider: Provider): string {
    return `${provider}LoginState`;
  }
}
