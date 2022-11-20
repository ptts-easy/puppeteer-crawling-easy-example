{
  "browser":{
    "headless": true,
    "ignoreHTTPSErrors": true,
    "acceptInsecureCerts": true,
    "ignoreDefaultArgs": ["--disable-extensions", "--enable-automation"],
    "executablePath": "node_modules/puppeteer/.local-chromium/win64-1011831/chrome-win/chrome.exe",
    "args": [
        "--load-extension=../../../../../extensions/User-Agent Switcher for Chrome/",
        "--proxy-server=http://172.25.1.2:3129",
        "--user-agent=\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edg/105.0.1343.33\"",
        "--start-maximized"
      ]
  }
  "filter":{
    "deep":1,
    "response":true,
    "blackList":[],
    "whiteList":[]
  }
  "input":{
    "urls":"../dataset/urls/"
  }
  "output":{
    "crawled_urls":"../dataset/crawled-urls/",
    "crawled_data":"../dataset/crawled-data/",
    "new_urls":"../dataset/new-urls/"
  }
}