{
//  "headless": true,
  "headless": false,
  "ignoreHTTPSErrors": true,
  "acceptInsecureCerts": true,
  "args": [
//      "--proxy-server=http://192.168.0.1:8000",
//      "--user-agent=\"new user\"",
      "--start-maximized",
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--ignore-certificate-errors",
      "--ignore-certificate-errors-spki-list",
      "--enable-features=NetworkService"
    ]
}