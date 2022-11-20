 /**
 * Summary.
 *
 * Description.
 *
 * @file    This file test all mongodb functions.
 * @author  ptts
 * @since   2022-08-19
 */

const {
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
} = require("./puppeteer-mng");
const {sleep} = require("./thread-mng");

async function puppeteer_all_test() {

  console.log("======= start all-test =======");

  await startBrowser();

  await setPagOptions();

  await setPageEvents();

  await gotoUrl("https://www.google.com");

  const title = await getTitle();

  if (title != null) {
    console.log("==================== Homepage Title ==================");
    console.log(title)
  }

  const text = await innerText("body");

  if (text != null) {
    console.log("==================== BodyText ==================");
//    console.log(text)
  }

  const html = await innerHTML("body");

  if (html != null) {
    console.log("==================== BodyHTML ==================");
//    console.log(html)
  }

  console.log("==================== screenShot ==================");
//  await screenShot('example.png');

  console.log("==================== animation ==================");

  await setFocus("[name=q]");

  await sleep(1000);

  await keyType("I input text automatically.");

  await sleep(1000);

  await mouseMove(100, 100);

  await sleep(1000);

  await mouseMove(200, 100);

  await sleep(1000);

  await mouseMove(200, 200);

  await sleep(1000);

  await mouseMove(100, 100);

  await sleep(1000);
  
  openAlert("This message is inside an alert box");

  await sleep(3000);

  await stopBrowser();

  console.log("======= end all-test =======");
}

async function puppeteer_open_google() {

  console.log("======= start google =======");

  await startBrowser();

//  await setPagOptions();

//  await setPageEvents();

//  await gotoUrl("https://www.google.com");

  await gotoUrl("https://bot.sannysoft.com/");

//  await stopBrowser();
}

(async () => {
//  await puppeteer_all_test();
  await puppeteer_open_google();
})();