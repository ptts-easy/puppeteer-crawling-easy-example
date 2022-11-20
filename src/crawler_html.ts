const puppeteer = require('puppeteer');

let browser = null;
let page = null;

export async function start_crawler(){
  if(browser != null) {
    await stop_crawler();
  }

  browser = await puppeteer.launch(
    {
//      headless: false,
//      headless: true,
      headless: process.env.CRAWLING_HEADLESS == "true",
      ignoreHTTPSErrors: true,
      acceptInsecureCerts: true,
      args: [
//          '--proxy-server=http://172.25.1.2:3129',
//          '--user-agent="urlgrabber/3.10 yum/3.4.3"',
//          '--start-maximized',
//          '--start-fullscreen',
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--ignore-certificate-errors',
          '--ignore-certificate-errors-spki-list',
          '--enable-features=NetworkService'
        ]
    }
  );

  let pages = await browser.pages();

  if (pages.length > 0) {
    page = pages[0];
  } else {
    page = await browser.newPage();
  }

//  await page.setDefaultNavigationTimeout(0);

  await page.setDefaultNavigationTimeout(30000);

  await page.setViewport({ width: 1366, height: 768});

  await page.setRequestInterception(true);

  page.on('close', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_close");
    }
  });
  page.on('console', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_console");
    }
  });
//  page.on('dialog', async (dialog) => {
  page.on('dialog', async dialog => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_dialog");
    }
    try {
//      await dialog.accept();
      await dialog.dismiss();
    } catch (e) {}
  });
  page.on('domcontentloaded', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_domcontentloaded");
    }
  });
  page.on('error', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_error");
    }
  });
  page.on('load', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_load");
    }
  });
  page.on('metrics', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_metrics");
    }
  });
  page.on('pageerror', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_pageerror");
    }
  });
  page.on('popup', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_popup");
    }
  });
  page.on('requestfailed', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_requestfailed");
    }
  });
  page.on('requestfinished', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_requestfinished");
    }
  });
  page.on('requestservedfromcache', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_requestservedfromcache");
    }
  });
  page.on('response', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_response");
    }
  });
  page.on('workercreated', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_workercreated");
    }
  });
  page.on('workerdestroyed', () => {
    if (process.env.LOG_CRAWLING_RESPONSE == "true") {
      console.log("on_workerdestroyed");
    }
  });

  page.on('request', (req) => {
    if (process.env.CRAWLING_HTML == "true" && req.resourceType() !== 'document') {
      if (process.env.LOG_CRAWLING_RESPONSE == "true") {
        console.log("on_request::Aborted !!! : ", req.resourceType())
      }
      req.abort();
    } else if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
      if (process.env.LOG_CRAWLING_RESPONSE == "true") {
        console.log("on_request::Aborted !!! : ", req.resourceType())
      }
      req.abort();
    } else {
      if (process.env.LOG_CRAWLING_RESPONSE == "true") {
        console.log("on_request::Continue !!! : ", req.resourceType())      
      }
      req.continue();
    }
  });
}

export async function stop_crawler(){
  if (browser != null) {
    await browser.close();
    page = null;
  }
}

export async function crawler_html(url){

  if (browser == null || page == null) {
    return null;
  }

//  console.log(url)

  const start_time = new Date();

  let html = "";
  
  try {
    await Promise.all([
        page.waitForNavigation(),
        page.goto(url),
        //await page.goto(`https://github.com/`, {timeout: 0});     
        //await page.goto(query, {waitUntil : 'networkidle2' }).catch(e => void 0);   
        page.waitForSelector('body')
    ]);
//  html = await page.$eval('body', el => el.innerText);
    html = await page.$eval('body', el => el.innerHTML);
  } catch (err) {
    if (process.env.ERROR_CRAWLING == "true") {
      console.error("crawler::error : ", err.message);
    }
    html = "error";
  }

  const end_time = new Date();

  if (process.env.LOG_CRAWLING_TIME == "true") {
    console.log("Crawling Time :", (end_time.valueOf() - start_time.valueOf())/1000);
  }

  return html;
}

/*
https://pptr.dev/api/
https://github.com/checkly/puppeteer-examples/blob/master/1.%20basics/get_list_of_links.js
https://www.tabnine.com/code/javascript/modules/puppeteer
{
  await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8' })
  await page.setViewport({ width: 1280, height: 800 })
  await page.goto('https://soundcloud.com/')
  await page.hover('.playableTile__artwork')
  page.screenshot({ path: 'hover.png' })
  page.tracing.start({ path: 'trace.json' })
  await page.tracing.start({
    path: 'trace.json',
    categories: ['devtools.timeline']
  })
  
  await page.goto('https://news.ycombinator.com/news')

  // execute standard javascript in the context of the page.
  const stories = await page.$$eval('a.storylink', anchors => { return anchors.map(anchor => anchor.textContent).slice(0, 10) })
  console.log(stories)
  await page.tracing.stop()
  await browser.close()

  this.page.evaluate(() => window.stop());      //run javascript
  await page.click('button.prod-ProductCTA--primary')
  await page.waitForSelector('.Cart-PACModal-ItemInfoContainer')
  await page.type('#login_field', process.env.GITHUB_USER)
  await page.type('#password', process.env.GITHUB_PWD)
  await page.click('[name="commit"]')
  await page.waitForNavigation()
  page.on('dialog', async dialog => {
    console.log(dialog.message())
    await dialog.dismiss()
  })
  await page.evaluate(() => alert('This message is inside an alert box'))
  await page.focus('trix-editor')
  await page.keyboard.type('Just adding a title')
  const title = await page.title()
  await page.mouse.click(132, 103, { button: 'left' })
}
*/