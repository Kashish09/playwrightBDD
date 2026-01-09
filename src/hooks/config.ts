import { LaunchOptions } from '@playwright/test';

type BrowserName = 'chromium' | 'firefox' | 'webkit' | 'chrome' | 'msedge';

const browser = (process.env.BROWSER ?? 'chromium') as BrowserName;

const browserOptions: LaunchOptions = {
//   slowMo: Number(process.env.SLOW_MO ?? 0),
  headless: process.env.HEADLESS === 'true'
};

if (browser === 'chromium' || browser === 'chrome' || browser === 'msedge') {
    browserOptions.args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-infobars',
    '--disable-extensions',
    '--disable-gpu',
    '--window-size=1920,1080',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream'
  ];
}

else if (browser === 'firefox') {
  browserOptions.firefoxUserPrefs = {
    'media.navigator.streams.fake': true,
    'media.navigator.permission.disabled': true
  };
}

export const config = {
  browser,
  browserOptions
};

export const baseURL = process.env.BASEURL!;

export const emailLogin = process.env.Email!;
export const passwordLogin = process.env.Password!;