export {};

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: (...args: any[]) => void;
    Spotify: any;
  }
}
