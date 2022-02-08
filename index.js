const puppeteer = require('puppeteer');

async function init() {

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    'ignoreHTTPSErrors': true
  });
  const page = await browser.newPage();

  await page.goto('https://sp.olx.com.br/grande-campinas/regiao-de-campinas', {
  });
  await page.screenshot({ path: '/home/htb/Documentos/Projetos/webcrawler/images/print-da-olx.png' });
  await page.pdf({ path: 'hn.pdf', format: 'a4' });
  
  const data = await page.evaluate(() => {
    const products = []
    document.querySelectorAll('.fnmrjs-1').forEach(item => {

      const title = item.querySelector('h2').innerText
      const price = item.querySelector('span.sc-ifAKCX').innerHTML
      const image = item.querySelector('img')?.dataset?.src

      products.push({
        title,
        price,
        image
      })
    })

    return {
      products
    }
  })

  await data.pdf({ path: 'search.pdf', format: 'a4'})

  

  await browser.close();
}

init()