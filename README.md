# TrustPath Device Intelligence JS SDK

A JavaScript SDK for collecting and analyzing device/browser data, enabling enhanced analytics and insights for web applications.

## Features

- Device fingerprinting
- Browser fingerprinting
- Hardware information collection
- Browser capabilities detection
- Secure hash generation
- Cross-browser compatibility

## Installation

You can install the package via npm:

```bash
npm install @trustpath/device-intelligence-js-sdk
```

Or use it directly via CDN:

```html
<script src="https://unpkg.com/@trustpath/device-intelligence-js-sdk"></script>
```

## Usage

### ES Modules

```javascript
import { getDeviceIntelligence } from '@trustpath/device-intelligence-js-sdk';

async function run() {
    const deviceIntelligence = await getDeviceIntelligence();
    console.log(deviceIntelligence);
}
```

### Browser Script Tag

```html
<script src="<path-to>/trustpath-device-intelligence-js-sdk.umd.js"></script>
<script>
    async function run() {
        const deviceIntelligence = await TrustPath.getDeviceIntelligence();
        console.log(deviceIntelligence);
    }
    run();
</script>
```

## API Reference

### getDeviceIntelligence()

Returns a promise that resolves to an object containing device and browser information:

```typescript
type TrustPathDeviceIntelligence = {
    device_hash: string,        // Unique hash of device characteristics
    device_type: string,        // Type of device (mobile, desktop, tablet, etc.)
    device_os: string,          // Operating system information
    device_model: string,       // Device model information
    browser_hash: string,       // Unique hash of browser characteristics
    browser_name: string,       // Browser name
    browser_version: string,    // Browser version
    cookie_enabled: boolean     // Cookie support status
}
```

### getFingerprintID()

Returns a promise that resolves to device and browser hashes:

```typescript
type TrustPathFingerprintHash = {
    device_hash: string,        // Unique hash of device characteristics
    browser_hash: string        // Unique hash of browser characteristics
}
```

## License

This project is licensed under the AGPL-3.0-or-later License - see the LICENSE file for details.