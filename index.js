const puppeteer = require('puppeteer');
const fs = require('fs');

async function init() {

  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    'ignoreHTTPSErrors': true
  });
  const page = await browser.newPage();

  await page.goto('https://sp.olx.com.br/grande-campinas/regiao-de-campinas', {
  });
  await page.screenshot({ path: 'print-da-olx.png' });
  
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

  // transformando a pesquisa em string
  const producstsString = JSON.stringify(data.products)

  // salvando os dados no arquivo
  fs.writeFile('pesquisa.txt', producstsString, err => {
    if(err) throw err
    console.log('Arquivo salvo com sucesso!');
  })
  
  await browser.close();
}

init()