import fs from "fs"
import readline from "readline";
import * as natural from "natural"

const sentence_tokenizer = new natural.SentenceTokenizer();
const word_tokenizer = new natural.WordTokenizer();

async function line_paser(text : any){

  const words = await word_tokenizer.tokenize(text);

  if(words.length < 2)
  {
    return null;
  }

  return {url:words[0], category:words[1]};
}

async function line_paser_1(text : any){

  const sentences = sentence_tokenizer.tokenize(text);

  if(sentences.length < 2)
  {
    return null;
  }

  return {url:sentences[0], category:sentences[1]};
}

async function line_paser_2(text : any){

  const result = text.trim().split(/\s+/);

  if(result.length < 2)
  {
    return null;
  }

  return {url:result[0], category:result[1]};
}

async function processLineByLine(file_path) {
  const fileStream = fs.createReadStream(file_path);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let total_urls = [];

  for await (const line of rl) {
    let url = await line_paser_2(line);

    if (url != null) {
      total_urls.push(url);
    }
  }

  return total_urls;
}

export async function url_paser(urls_path : any) {

  const url_info = await processLineByLine(urls_path);

  return url_info;
}
