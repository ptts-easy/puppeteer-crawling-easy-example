import * as cheerio from "cheerio"

async function tag_text_paser($ : any, tag : any){

  const tags = $(tag);

//  console.log(tags.length);

  const n = tags.length;

  const tag_text = [];

  for(let i = 0; i < n; i ++)
  {
    tag_text.push($(tags[i]).text());
  }

//  console.log(tag_text);

  return tag_text;
}

export async function html_paser(html_info_text : any){

  const $ = cheerio.load(html_info_text);

  return {"result" : 
    {
      "headers":{
        "h1" : await tag_text_paser($, "h1"),
        "h2" : await tag_text_paser($, "h2"),
        "h3" : await tag_text_paser($, "h3"),
        "h4" : await tag_text_paser($, "h4"),
        "h5" : await tag_text_paser($, "h5"),
        "h6" : await tag_text_paser($, "h6")
      },
      "title" : await tag_text_paser($, "title"),
//      "text" : await tag_text_paser($, "body"),
//      "text" : await tag_text_paser($, "div"),
//      "text" : await tag_text_paser($, "p"),
//      "text" : await tag_text_paser($, "div:empty, p:empty"),
//      "text" : await tag_text_paser($, "div:only-child, p:only-child"),
      "text" : await tag_text_paser($, "div, p"),
      "links" : await tag_text_paser($, "a"),
      "url" : ""
    }
  };
}
