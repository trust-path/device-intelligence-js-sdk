import {
  getFingerprintData as getThumbmarkFingerprintData,
  getFingerprint,
} from "@thumbmarkjs/thumbmarkjs";
import { UAParser } from "ua-parser-js";
import { Sha256 } from "@aws-crypto/sha256-browser";
import { Bots } from "ua-parser-js/extensions";

export type Data = string | string[] | number | boolean | Component;

export interface Component {
  [key: string]: Data;
}

export type TrustPathDeviceIntelligence = {
  device_hash: string;
  device_type: string | undefined;
  device_os: string | undefined;
  device_model: string | undefined;
  browser_fingerprint: string;
  browser_name: string | undefined;
  browser_version: string | undefined;
  cookie_enabled: boolean;
  browser_type: string | undefined;
};

export type TrustPathFingerprintHash = {
  device_hash: string;
  browser_hash: string;
};

type DeviceData = {
  audio: Data;
  canvas: Data;
  fonts: Data;
  hardware: Data;
  screen: Data;
  math: Data;
  platform: Data;
};

type BrowserData = {
  device_data: DeviceData;
  locales: Data;
  permissions: Data;
  plugins: Data;
  browser: Data;
  webgl: Data;
};

// Cache the UAParser instance
const parser = new UAParser(Bots);

// Optimized hash function
async function hash(text: string): Promise<string> {
  const hasher = new Sha256();
  hasher.update(text);
  const hashBuffer = await hasher.digest();
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getFingerprintData() {
  const thumbmarkjs = await getThumbmarkFingerprintData();
  const device_data: DeviceData = {
    audio: thumbmarkjs.audio,
    canvas: thumbmarkjs.canvas,
    fonts: thumbmarkjs.fonts,
    hardware: thumbmarkjs.hardware,
    screen: thumbmarkjs.screen,
    math: thumbmarkjs.math,
    platform: (thumbmarkjs as any).system.platform,
  };

  return {
    device_data,
    browser_data: {
      device_data,
      locales: thumbmarkjs.locals,
      permissions: thumbmarkjs.permissions,
      plugins: thumbmarkjs.plugins,
      browser: thumbmarkjs.system,
      webgl: thumbmarkjs.webgl,
    },
  };
}

async function createFingerprintHashFor(data: {
  device_data: DeviceData;
  browser_data: BrowserData;
}): Promise<TrustPathFingerprintHash> {
  const [device_hash, browser_hash] = await Promise.all([
    hash(JSON.stringify(data.device_data)),
    hash(JSON.stringify(data.browser_data)),
  ]);

  return { device_hash, browser_hash };
}

async function createDeviceIntelligenceFor(): Promise<TrustPathDeviceIntelligence> {
  const [thumbmarkjs, fingerprint] = await Promise.all([
    getThumbmarkFingerprintData(),
    getFingerprint(),
  ]);

  let parser = new UAParser(Bots);
  const agent = parser.getResult();

  // Check if the user agent indicates a bot using the built-in detection
  const device_data: DeviceData = {
    audio: thumbmarkjs.audio,
    canvas: thumbmarkjs.canvas,
    fonts: thumbmarkjs.fonts,
    hardware: thumbmarkjs.hardware,
    screen: thumbmarkjs.screen,
    math: thumbmarkjs.math,
    platform: (thumbmarkjs as any).system.platform,
  };

  return {
    device_hash: await hash(JSON.stringify(device_data)),
    device_type: agent.device.type,
    device_os: agent.os.toString(),
    device_model: agent.device.model,
    browser_fingerprint: fingerprint,
    browser_name: agent.browser.name,
    browser_version: agent.browser.version,
    browser_type: agent.browser.type,
    cookie_enabled: (thumbmarkjs as any).system.cookieEnabled,
  };
}

export async function getFingerprintID(): Promise<TrustPathFingerprintHash> {
  const data = await getFingerprintData();
  return createFingerprintHashFor(data);
}

export async function getDeviceIntelligence(): Promise<TrustPathDeviceIntelligence> {
  return createDeviceIntelligenceFor();
}
