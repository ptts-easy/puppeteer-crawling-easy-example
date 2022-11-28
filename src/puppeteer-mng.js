//import puppeteer from "puppeteer";
//import puppeteer from "puppeteer-core";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin())

let browser = null;
let page = null;

export async function startBrowser(config) {
  if (browser != null) {
    if (false == await stop_crawler()) {
      return false;
    }
  }

  browser = await puppeteer.launch(config);

  let pages = await browser.pages();

  if (pages.length > 0) {
    page = pages[0];
  } else {
    page = await browser.newPage();
  }

  return true;
}

export async function stopBrowser() {
  if (browser != null) {
    page = null;
    await browser.close();
    browser = null;
    return true;
  }
  return false;
}

export async function setHTTPHeaders(header) {
  if (browser == null || page == null) {
    return false;
  }

  await page.setExtraHTTPHeaders(header);
}

export async function setCookie(cookie) {
  if (browser == null || page == null) {
    return false;
  }

  await page.setCookie(cookie);
}

export async function setPagOptions(option) {
  if (browser == null || page == null) {
    return false;
  }

  await page.setDefaultNavigationTimeout(option.defaultNavigationTimeout);

  await page.setViewport(option.viewport);
}

export async function setPageEvents(config) {
  if (browser == null || page == null) {
    return false;
  }

  await page.setRequestInterception(true);

  page.on('error', () => {
//    console.log("on::error");
  });

  page.on('metrics', () => {
//    console.log("on::metrics");
  });

  page.on('pageerror', () => {
//    console.log("on::pageerror");
  });

  page.on('close', async () => {
//    console.log("on::close");
  });

  page.on('console', () => {
//    console.log("on::console");
  });

  page.on('load', () => {
//    console.log("on::load::", 'page loaded!');
  });

  page.on('domcontentloaded', () => {
//    console.log("on::domcontentloaded::", 'page domcontentloaded!');
  });

  page.on('dialog', async dialog => {
//    console.log("on::dialog::", dialog.message())
    try {
//      await dialog.accept();
      await dialog.dismiss();
    } catch (e) {}
  });

  page.on('popup', () => {
//    console.log("on::popup");
  });

  page.on('requestfailed', () => {
//    console.log("on::requestfailed");
  });

  page.on('requestfinished', () => {
//    console.log("on::requestfinished");
  });

  page.on('requestservedfromcache', () => {
//    console.log("on::requestservedfromcache");
  });

  page.on('workercreated', () => {
//    console.log("on_workercreated");
  });

  page.on('workerdestroyed', () => {
//    console.log("on_workerdestroyed");
  });

  page.on('request', request => {

    let req_type = request.resourceType();

    if (true == filterRequest(request, config)) {
      request.continue();
      console.log("request::continue :: ", req_type);
    } else {
      request.abort();
      console.log("request::abort :: ", req_type);
    }
  });

  page.on('response', (response) => {

    const filter_flg = filterResponse(response, config);

    console.log("response :: ", filter_flg);
  });
}

function filterRequest(request, config) {
//    console.log("on::request::", "isNavigationRequest : ", request.isNavigationRequest());
//    console.log("on::request::", "isMainFrame : ", request.frame() === page.mainFrame());
    let req_type = request.resourceType();

    let filter_flg = false;

    if (config.filter == "white") {
      if(config.typelist.indexOf(req_type) >= 0) {
        filter_flg = true;
      }
    } else if(config.filter == "black") {
      if(config.typelist.indexOf(req_type) < 0) {
        filter_flg = true;
      }
    }

    return filter_flg;
}

function filterResponse(response, config) {
  const request = response.request();
  let req_type = request.resourceType();

  let filter_flg = false;

  if (config.filter == "white") {
    if(config.typelist.indexOf(req_type) >= 0) {
      filter_flg = true;
    }
  } else if(config.filter == "black") {
    if(config.typelist.indexOf(req_type) < 0) {
      filter_flg = true;
    }
  }

  return filter_flg;
}

export async function gotoUrl(url) {
  if (browser == null || page == null) {
    return false;
  }
//  await page.waitForNavigation()

//  await page.goto(url, {'timeout': 10000, 'waitUntil':'load'});
//  await waitTillHTMLRendered(page)
//  const data = await page.content()

//await page.goto(url, { waitUntil: 'load' });
//await page.goto(url, { waitUntil: 'domcontentloaded' });
//await page.goto(url, { waitUntil: 'networkidle0' });
//await page.goto(url, { waitUntil: 'networkidle2' });

  try {
//    await page.waitForNavigation();
//    await page.goto(url, {timeout: 60000});
    await page.goto(url);
    return true;
  } catch (err) {
    console.error(err.message);
    return false;
  }
  return true;
}

export async function getTitle() {
  if (browser == null || page == null) {
    return null;
  }

  const title = await page.title();

  return title;
}

export async function innerText(selector) {
  if (browser == null || page == null) {
    return null;
  }

  await page.waitForSelector(selector);

  const text = await page.$eval(selector, el => el.innerText);

  return text;
}

export async function innerHTML(selector) {
  if (browser == null || page == null) {
    return null;
  }

  await page.waitForSelector(selector);

  const html = await page.$eval(selector, el => el.innerHTML);

  return html;
}

export async function screenShot(path) {
  if (browser == null || page == null) {
    return null;
  }

  await page.screenshot({ path: path });
}

export async function openAlert(text) {
  if (browser == null || page == null) {
    return;
  }

  await page.evaluate((msg) => {alert(msg);}, text);
}

export async function setFocus(selector) {
  if (browser == null || page == null) {
    return null;
  }

  await page.focus(selector);
}

export async function hover(selector) {
  if (browser == null || page == null) {
    return null;
  }

  await page.hover(selector);
}

export async function keyType(text) {
  if (browser == null || page == null) {
    return null;
  }

  await page.keyboard.type(text);
}

export async function mouseLClick(x, y) {
  if (browser == null || page == null) {
    return null;
  }

  await page.mouse.click(x, y, { button: 'left' })
}

export async function mouseMove(x, y) {
  if (browser == null || page == null) {
    return null;
  }

  await page.mouse.move(x, y)
}