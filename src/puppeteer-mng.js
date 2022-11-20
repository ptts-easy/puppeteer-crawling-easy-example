//const puppeteer = require('puppeteer');
//const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth')

puppeteer.use(StealthPlugin())


const config = require('./config.json');

let browser = null;
let page = null;

const cookie = {
  name: 'login_email',
  value: 'set_by_cookie@domain.com',
  domain: '.paypal.com',
  url: 'https://www.paypal.com/',
  path: '/',
  httpOnly: true,
  secure: true
}

async function startBrowser() {
  if(browser != null) {
    await stop_crawler();
  }

  browser = await puppeteer.launch(config);

  let pages = await browser.pages();

  if (pages.length > 0) {
    page = pages[0];
  } else {
    page = await browser.newPage();
  }
}

async function stopBrowser() {
  if (browser != null) {
    page = null;
    await browser.close();
    browser = null;
  }
}

async function setPagOptions(){
  if (browser == null || page == null) {
    return false;
  }

  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
  await page.setCookie(cookie);
  await page.setViewport({ width: 1366, height: 768});
}

async function setPageEvents(){
  if (browser == null || page == null) {
    return false;
  }

  await page.setRequestInterception(true);

  page.on('load', () => {
    console.log("on::load::", 'page loaded!');
  });

  page.on('domcontentloaded', () => {
    console.log("on::domcontentloaded::", 'page domcontentloaded!');
  });

  page.on('dialog', async dialog => {
    console.log("on::dialog::", dialog.message())
//    await dialog.dismiss()
  });

  page.on('close', async () => {
    console.log("on::close");
  });

  page.on('request', request => {
    console.log("on::request::", "isNavigationRequest : ", request.isNavigationRequest());
    console.log("on::request::", "isMainFrame : ", request.frame() === page.mainFrame());
    if (request.resourceType() === 'image') {
      request.abort();
//      request.respond(request.redirectChain().length
//        ? { body: '' } // prevent 301/302 redirect
//        : { status: 204 } // prevent navigation by js
//      );
    } else {
      console.log("on::request::", "url : ", request.url());
      request.continue();
    }
  });
  page.on('response', (response) => {
    const request = response.request();
    if (request.resourceType() !== 'image') {
      console.log("on::response::", response.status(), response.url());
    }
  });
}

async function gotoUrl(url){
  if (browser == null || page == null) {
    return false;
  }

//  const start_time = new Date();
  
//  await page.waitForNavigation()

//  await page.goto(url, {'timeout': 10000, 'waitUntil':'load'});
//  await waitTillHTMLRendered(page)
//  const data = await page.content()

//await page.goto(url, { waitUntil: 'load' });
//await page.goto(url, { waitUntil: 'domcontentloaded' });
//await page.goto(url, { waitUntil: 'networkidle0' });
//await page.goto(url, { waitUntil: 'networkidle2' });

  try {
//    await page.goto(url, {timeout: 60000});
    await page.goto(url);
    if (this.waitForElement !== null) {
      return true;
    }
    return false;
  } catch (err) {
    console.error(err.message);
    return false;
  }

//  const end_time = new Date();

//  console.log("goto Time :", (end_time.valueOf() - start_time.valueOf())/1000);

  return true;
}

async function getTitle(){
  if (browser == null || page == null) {
    return null;
  }

  const title = await page.title();

  return title;
}

async function innerText(selector){
  if (browser == null || page == null) {
    return null;
  }

  const text = await page.$eval(selector, el => el.innerText);

  return text;
}

async function innerHTML(selector){
  if (browser == null || page == null) {
    return null;
  }

  const html = await page.$eval(selector, el => el.innerHTML);

  return html;
}

async function screenShot(path){
  if (browser == null || page == null) {
    return null;
  }

  await page.screenshot({ path: path });
}

async function openAlert(text){
  if (browser == null || page == null) {
    return;
  }

  await page.evaluate((msg) => {alert(msg);}, text);
}

async function setFocus(selector){
  if (browser == null || page == null) {
    return null;
  }

  await page.focus(selector);
}

async function hover(selector){
  if (browser == null || page == null) {
    return null;
  }

  await page.hover(selector);
}

async function keyType(text){
  if (browser == null || page == null) {
    return null;
  }

  await page.keyboard.type(text);
}

async function mouseLClick(x, y){
  if (browser == null || page == null) {
    return null;
  }

  await page.mouse.click(x, y, { button: 'left' })
}

async function mouseMove(x, y){
  if (browser == null || page == null) {
    return null;
  }

  await page.mouse.move(x, y)
}

module.exports = {
  startBrowser, 
  stopBrowser,
  setPagOptions,
  setPageEvents,
  gotoUrl,
  getTitle,
  innerText,
  innerHTML,
  screenShot,
  openAlert,
  setFocus,
  keyType,
  mouseLClick,
  mouseMove
};
