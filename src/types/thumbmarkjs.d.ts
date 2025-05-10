declare module "@thumbmarkjs/thumbmarkjs" {
  export interface FingerprintData {
    audio: any;
    canvas: any;
    fonts: any;
    hardware: any;
    screen: any;
    math: any;
    locals: any;
    permissions: any;
    plugins: any;
    system: {
      platform: any;
      cookieEnabled: boolean;
    };
    webgl: any;
  }

  export function getFingerprintData(): Promise<FingerprintData>;
  export function getFingerprint(): Promise<string>;
}
