const puppeteer = require('puppeteer');

// Substitua as credenciais de login
const usuario = 'fillipemarquessilva@gmail.com';
const senha = 'fillipe995322974';

(async () => {
    const browser = await puppeteer.launch({ headless: false }); // Abre o navegador

    try {
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
        console.log("Login realizado com sucesso")

        // Aguarda até que a navegação após o login seja concluída
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

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

        const quantidadeDesejada = 5;

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

        // Faça outras operações no site, se necessário

    } catch (error) {
        console.error('Erro durante a execução:', error);
    } finally {
        console.log("Lançamento realizado com sucesso")
        await browser.close(); // Fecha o navegador ao finalizar

    }
})();
