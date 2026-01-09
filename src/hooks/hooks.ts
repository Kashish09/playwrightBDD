import { Before, After, BeforeAll, AfterAll, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { config } from './config';
import { ICustomWorld } from './custom-world';
import {
  chromium,
  ChromiumBrowser,
  firefox,
  FirefoxBrowser,
  webkit,
  WebKitBrowser,
  ConsoleMessage,
  request,
  Browser
} from '@playwright/test';
import { ensureDir } from 'fs-extra';
import logger from '../helper/logger';
import { PageManager } from '../pages/PageManager';

//cucumber timeout 30secs
setDefaultTimeout(30 * 1000);

let browser: ChromiumBrowser | FirefoxBrowser | WebKitBrowser | Browser;
const tracesDir = 'traces';

BeforeAll(async function () {
  logger.info("---Starting test setup---");
  logger.info(`Selected browser from config: ${config.browser}`);
  logger.info("Launching browser");
  switch (config.browser) {
    case 'firefox':
      browser = await firefox.launch(config.browserOptions);
      break;
    case 'webkit':
      browser = await webkit.launch(config.browserOptions);
      break;
    case 'msedge':
      browser = await chromium.launch({ ...config.browserOptions, channel: 'msedge' });
      break;
    case 'chrome':
      browser = await chromium.launch({ ...config.browserOptions, channel: 'chrome' });
      break;
    default:
      browser = await chromium.launch(config.browserOptions);
  }
  logger.info(`Browser launched successfully: ${config.browser}`);
  await ensureDir(tracesDir);
});

Before({ tags: '@debug' }, function (this: ICustomWorld) {
  this.debug = true;
});

Before(async function (this: ICustomWorld, { pickle }) {
  this.startTime = new Date();
  this.testName = pickle.name.replace(/\W/g, '-');
  logger.info(`Starting test: ${pickle.name} `);
  this.context = await browser.newContext({
    acceptDownloads: true,
    recordVideo: process.env.TVIDEO === '1' ? { dir: 'screenshots' } : undefined,
    viewport: { width: 1920, height: 1080 }
  });
//   this.server = await request.newContext({
//     // All requests we send go to this API endpoint.
//     baseURL: config.BASE_API_URL
//   });

  await this.context.tracing.start({ screenshots: true, snapshots: true });
  this.page = await this.context.newPage();
  this.page.on('console', (msg: ConsoleMessage) => {
    if (msg.type() === 'log') {
      this.attach(msg.text());
    }
  });
  this.feature = pickle;

  // Initialize PageManager
  this.pages = new PageManager(this.page);
});

After(async function (this: ICustomWorld, { result }) {
  if (result) {
    this.attach(`Status: ${result?.status}. Duration:${result.duration?.seconds}s`);

    if (result.status !== Status.PASSED) {
      const image = await this.page?.screenshot();

      // Replace : with _ because colons aren't allowed in Windows paths
      const timePart = this.startTime?.toISOString().split('.')[0].replaceAll(':', '_');

      if (image) {
        this.attach(image, 'image/png');
      }
      await this.context?.tracing.stop({
        path: `${tracesDir}/${this.testName}-${timePart}trace.zip`
      });

      logger.error(`Test failed with message: ${result.message}`);
    }
  }
  await this.page?.close();
  await this.context?.close();
});

AfterAll(async function () {
  logger.info("Closing browser");
  if (browser) {
    await browser.close();
    logger.info("Browser closed successfully...");
  }
  else {
    logger.warn("Browser was not initialized...");
  }
});