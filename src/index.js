/**
 * Summary.
 *
 * Description.
 *
 * @file    This file is crawling homepage to html/text from url list.
 * @author  ptts
 * @since   2022-11-20
 */

import { main as prepare } from "./prepare.js";
import { main as crawler_main } from "./crawler.js";

async function main() {
  //1. prepare environment ...

  await prepare();

  //2. start crawling ...

  await crawler_main();
}

(async () => {
  await main();
})();