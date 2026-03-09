export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: (() => void) | null;
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => {
        addListener: (event: string, callback: (args: unknown) => void) => void;
        connect: () => void;
      };
    };
  }
}
