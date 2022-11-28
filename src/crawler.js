import esMain from 'es-main';
import * as fs from "fs";
import readline from "readline";
import path from "path";
import { startBrowser, stopBrowser, setPagOptions, setPageEvents, gotoUrl, innerText, innerHTML, getTitle} from "./puppeteer-mng.js";
import config from "../config/config.json" assert { type: "json" };

async function crawling_homepage(url) {

  //1. open homepage
  let bOpend = await gotoUrl(url);

  if (bOpend == false) {
    console.log("gotoUrl Error : ", url);
  }

  //2. get content

  let content;
  let ext;

  if (config.crawl.type == "text") {
    content = await innerText("body");
    ext = ".txt";
  } else if (config.crawl.type == "html") {
    content = await innerHTML("body");
    ext = ".html";
  } else if (config.crawl.type == "title") {
    content = await getTitle();
    ext = ".title";
  } else {
    content = "";
    ext = "";
  }

  return {content : content, ext : ext};
}

async function crawlingOneFile(url_path, carwled_url_path, carwled_data_path, new_urls_path) {

  if (fs.existsSync(carwled_data_path) == false) {
    fs.mkdirSync(carwled_data_path, { recursive: true });
  }

  fs.writeFileSync(carwled_url_path, "", 'utf8');
  fs.writeFileSync(new_urls_path, "", 'utf8');

  const urls = readline.createInterface({input: fs.createReadStream(url_path)});

  let idx = 0;

  for await (const buff of urls) {
    let url = buff.toString();

    const homepage = await crawling_homepage(url);

    fs.writeFileSync(path.join(carwled_data_path, idx + homepage.ext), homepage.content, 'utf8');

    fs.appendFileSync(carwled_url_path, url + "\n", 'utf8');

    idx ++;
  }

  return true;
}

async function crawlingAllFiles() {

  if (fs.existsSync(config.input.urls) == false) {
    return false;
  }

  const EXTENSION = '.txt';

  const files = fs.readdirSync(config.input.urls).filter(file => {
    return path.extname(file).toLowerCase() === EXTENSION;
  });

  for (let file of files) {
    const url_path = path.join(path.resolve(config.input.urls), file);
    const carwled_url_path = path.join(path.resolve(config.output.crawled_urls), file);
    const carwled_data_path = path.join(path.resolve(config.output.crawled_data), path.basename(file, EXTENSION));
    const new_urls_path = path.join(path.resolve(config.output.new_urls), file);

    await crawlingOneFile(url_path, carwled_url_path, carwled_data_path, new_urls_path);
  }

  return true;
}

async function install() {
  
  if (false == await startBrowser(config.browser)) {
    return false;
  }

  await setPagOptions(config.page);

  await setPageEvents(config.crawl);

  return true;
}

async function uninstall() {
  return stopBrowser();
}

export async function main() {

  //1. run chrome ...

  console.log("crawler_install.");

  if (false == await install()) {
    console.log("crawler_install failed.");
    return false;
  }

  //2. all crawling ...

 console.log("crawler_crawlingAllFiles.");
 
  if (false == await crawlingAllFiles()) {
    console.log("crawler_all_crawling failed.");
    return false;
  }

  console.log("crawler_uninstall.");

  //3. close chrome ...
  if (false == await uninstall()) {
    console.log("crawler_uninstall failed.");
    return false;
  }

  return true;
}

(async () => {
  if (esMain(import.meta)) {
    await main();
  }
})();