export interface GoogleUserData {
  name?: string;
  email?: string;
  picture?: string;
  token: string;
}

export interface GoogleTokenResponse {
  access_token?: string;
}

export type GoogleTokenClient = {
  requestAccessToken: () => void;
};
