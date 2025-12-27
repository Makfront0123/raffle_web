export { };
import { WompiCheckoutConstructor } from "./wompi";

declare global {
  interface Window {
    WidgetCheckout: WompiCheckoutConstructor;
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            ux_mode?: "popup" | "redirect";
            callback: (response: { access_token?: string }) => void;
          }) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
  }
}
