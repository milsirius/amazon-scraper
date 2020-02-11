const puppeteer = require('puppeteer');
var b = require('./busquedesamazon');
var sleep = require('system-sleep');

var busquedes = b.busquedes;

async function setup_browser() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36');

  await page.setViewport({ width: 1280, height: 800 });

  return [browser, page];
}
function getlink(s) {
  return "https://www.amazon.es/s?k=" + s.replace(/ /g,"+");
}

async function getinfo(con, page) {
  var divs = await page.$$('div.s-include-content-margin');

  for (var div of divs) {
    try {
      const a = await div.$('a.a-link-normal');
      var link = await ( await a.getProperty( 'href' ) ).jsonValue();
      link = link.split('ref=')[0]
      console.log(link);

      const span = await div.$('span.a-size-medium');
      var text = await page.evaluate(span => span.textContent, span);
      text = text.replace(/'/g,"").replace(/"/g,'');
      console.log(text);

      const spanpreu = await div.$('span.a-price-whole');
      var preu = await page.evaluate(spanpreu => spanpreu.textContent, spanpreu);
      var preu = preu.replace('.','').replace(',','.');
      console.log(preu);



    }catch(e) {

    }
  }
}

async function main(inici, fi) {
  if (fi != "tot") {
    busquedes = busquedes.slice(inici, fi);
  }

  const values = await setup_browser();
  const browser = values[0];
  const page = values[1];


  for (const busqueda of busquedes) {

    console.log(getlink(busqueda));
    await page.goto(getlink(busqueda));
    await page.waitForSelector('span.a-price-whole');

    await getinfo(con, page);
    //sleep(3000);

    
  }

  await browser.close();
  con.end();

}


main(0,"tot");

module.exports.main = main;