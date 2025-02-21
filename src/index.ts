import { getFingerprintData as getThumbmarkFingerprintData} from '@thumbmarkjs/thumbmarkjs'
import { UAParser } from 'ua-parser-js'
 
import { Sha256 } from '@aws-crypto/sha256-browser'

export type Data = string | string[] | number | boolean | Component;

export interface Component {
    [key: string]: Data;
}

export type TrustPathDeviceIntelligence = {
    device_hash: string,
    device_type: string | undefined,
    device_os: string | undefined,
    device_model: string | undefined,
    browser_hash: string,
    browser_name: string | undefined,
    browser_version: string | undefined,
    cookie_enabled: boolean
}

export type TrustPathFingerprintHash = {
    device_hash: string,
    browser_hash: string,
}

export type TrustPathFingerprint = {
    device_data: DeviceData,
    browser_data: BrowserData
}

export type DeviceData = {
    audio: Data,
    canvas: Data,
    fonts: Data,
    hardware: Data,
    screen: Data,
    math: Data,
    platform: Data
}

export type BrowserData = {
    device_data: DeviceData,
    locales: Data,
    permissions: Data,
    plugins: Data,
    browser: Data,
    webgl: Data,
}

export type CookieData = {
    browser_data: BrowserData,
    cookies: string
}

export async function getFingerprintData(): Promise<TrustPathFingerprint> {
    let thumbmarkjs = await getThumbmarkFingerprintData();
    let device_data: DeviceData = {
        audio: thumbmarkjs.audio,
        canvas: thumbmarkjs.canvas,
        fonts: thumbmarkjs.fonts,
        hardware: thumbmarkjs.hardware,
        screen: thumbmarkjs.screen,
        math: thumbmarkjs.math,
        platform: (thumbmarkjs as any).system.platform,
    };
    let browser_data: BrowserData = {
        device_data,
        locales: thumbmarkjs.locals,
        permissions: thumbmarkjs.permissions,
        plugins: thumbmarkjs.plugins,
        browser: thumbmarkjs.system,
        webgl: thumbmarkjs.webgl
    }
    return {
        device_data,
        browser_data
    }
}

export async function hash(text: string): Promise<string> {
    const hasher = new Sha256();
    hasher.update(text);
    const hashBuffer = await hasher.digest();
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map((item) => item.toString(16).padStart(2, "0")).join("");
    return hash;
}

export async function createFingerprintHashFor(data: TrustPathFingerprint): Promise<TrustPathFingerprintHash> {
    return {
        device_hash: await hash(JSON.stringify(data.device_data)),
        browser_hash: await hash(JSON.stringify(data.browser_data)),
    }
}

export async function createDeviceIntelligenceFor(data: TrustPathFingerprint): Promise<TrustPathDeviceIntelligence> {
    let parser = new UAParser();
    let agent = parser.getResult();
    return {
        device_hash: await hash(JSON.stringify(data.device_data)),
        device_type: agent.device.type,
        device_os: agent.os.toString(),
        device_model: agent.device.model,
        browser_hash: await hash(JSON.stringify(data.browser_data)),
        browser_name: agent.browser.name,
        browser_version: agent.browser.version,
        cookie_enabled: (data as any).browser_data.browser.cookieEnabled
    }
}

export async function getFingerprintID(): Promise<TrustPathFingerprintHash> {
    let data = await getFingerprintData();
    return createFingerprintHashFor(data)
}

export async function getDeviceIntelligence(): Promise<TrustPathDeviceIntelligence> {
    let data = await getFingerprintData();
    return await createDeviceIntelligenceFor(data);
}
