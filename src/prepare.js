import esMain from 'es-main';
import * as fs from "fs";
import readline from "readline";
import path from "path";
import config from "../config/config.json" assert { type: "json" };

async function prepare_input() {

  if (fs.existsSync(config.input.urls) == false) {
    return false;
  }

  const EXTENSION = '.txt';

  const files = fs.readdirSync(config.input.urls).filter(file => {
    return path.extname(file).toLowerCase() === EXTENSION;
  });

  if (files.length < 1) {
    return false;
  }

  return true;
}

async function prepare_output() {

  //clear output folders
  if (config.output.clear == true) {
    if (fs.existsSync(config.output.crawled_urls) == true) {
      fs.rmSync(config.output.crawled_urls, { recursive: true });
    }
    if (fs.existsSync(config.output.crawled_data) == true) {
      console.log("prepare_output");
      fs.rmSync(config.output.crawled_data, { recursive: true });
    }
    if (fs.existsSync(config.output.new_urls) == true) {
      fs.rmSync(config.output.new_urls, { recursive: true });
    }
  }

  //create output folders
  if (fs.existsSync(config.output.crawled_urls) == false) {
    fs.mkdirSync(config.output.crawled_urls, { recursive: true });
  }
  if (fs.existsSync(config.output.crawled_data) == false) {
    fs.mkdirSync(config.output.crawled_data, { recursive: true });
  }
  if (fs.existsSync(config.output.new_urls) == false) {
    fs.mkdirSync(config.output.new_urls, { recursive: true });
  }

  return true;
}

export async function main() {

  if (false == await prepare_input()) {
    console.log("prepare_input failed.");
    return false;
  }

  if (false == await prepare_output()) {
    console.log("prepare_output failed.");
  }

  return true;
}

(async () => {
  if (esMain(import.meta)) {
    await main();
  }
})();