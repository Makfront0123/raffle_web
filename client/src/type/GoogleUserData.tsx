interface GoogleUserData {
  name?: string;
  email?: string;
  picture?: string;
  token: string;
}

interface TokenClient {
  requestAccessToken: () => void;
}
