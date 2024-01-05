const express = require('express');
const path = require('path');
const puppeteer = require('puppeteer');

const app = express();

app.use(express.json());

// Adicione o middleware CORS antes de suas rotas
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  
    // Permitir que o navegador envie a solicitação com os métodos especificados
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
    } else {
      next();
    }
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));

});

app.get('/launch', async (req, res ) =>{
    res.send("pagina de lançamento")
})

app.post('/launch', async (req, res) => {
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    const browser = await puppeteer.launch({ headless: false });

    try {
        // Adapte o código Puppeteer original aqui
        const page = await browser.newPage(); // Abre uma nova página

        // Navega para o site de login
        await page.goto('https://circuitodavisao.com', { waitUntil: 'domcontentloaded' });
        console.log("Acessou o site")

        // Aguarda até que o botão de login esteja visível e, em seguida, clica nele
        await page.waitForSelector('a[href="/auth/login"]', { visible: true });
        await page.click('a[href="/auth/login"]');

        // Preenche os campos de usuário e senha
        await page.waitForSelector('input[name="email"]', { visible: true });
        await page.type('input[name="email"]', usuario);
        await page.type('input[name="password"]', senha);

        // Clica no botão de login
        await page.click('button[type="submit"]');
        
        // Aguarda até que a navegação após o login seja concluída
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        console.log("Login realizado com sucesso")

        // Aguarda até que o seletor do perfil seja visível e, em seguida, clica nele
        await page.waitForSelector('div[data-test-id="select-profile-card"]', { visible: true });
        await page.click('div[data-test-id="select-profile-card"]');

        // Aguarda até que o seletor do link seja visível e, em seguida, clica nele
        await page.waitForSelector('a[href="/dashboard/launch/regimentation"]', { visible: true });
        await page.click('a[href="/dashboard/launch/regimentation"]');

        // Aguarda até que o seletor do switch seja visível e, em seguida, clica nele
        console.log("Carregando página de lançamento")
        await page.waitForTimeout(5000);
        await page.waitForSelector('input[type="checkbox"]', { visible: true });
        console.log("Realizando lançamento")

        
        const quantidadeDesejada = req.body.quantidadeDesejada;

        // Encontre todos os checkboxes na página
        const checkboxes = await page.$$('[type="checkbox"]');

        // Itera sobre a lista de checkboxes e clica em cada um, limitando à quantidade desejada
        for (let i = 0; i < quantidadeDesejada && i < checkboxes.length; i++) {
            await checkboxes[i].click();
            // Aguarde 2 segundos antes de prosseguir para o próximo clique
            await delay(2000);
        }

        // Aguarde algum tempo ou execute outras ações após clicar nos checkboxes

        // Exemplo de função de atraso
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        res.status(200).send('Lançamento realizado com sucesso!');
    } catch (error) {
        console.error('Erro durante a execução:', error);
        res.status(500).send('Erro ao iniciar o lançamento.');
    } finally {
        console.log("Lançamento realizado com sucesso")
        //await browser.close();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
