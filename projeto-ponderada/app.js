const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const { alreadyLoggedIn, isAuthenticated } = require('./middleware/authMiddleware'); // Importar o middleware

// Configuração da Sessão
app.use(session({
    secret: 'seuSegredoSuperSecretoAquiPodeMudar', // Mude isso em produção!
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Em produção (HTTPS), mude para true
}));
console.log('[app.js] Middleware de sessão configurado.');

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
console.log('[app.js] View engine configurado para EJS no diretório /views.');

// Middlewares para parsing de corpo de requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
console.log('[app.js] Middlewares express.json e express.urlencoded configurados.');

// Servir arquivos estáticos (CSS, JS do cliente)
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/css', express.static(path.join(__dirname, 'views/css')));
app.use('/js', express.static(path.join(__dirname, 'views/js')));
app.use(express.static(path.join(__dirname, 'public')));
console.log('[app.js] Servindo arquivos estáticos de /assets (da raiz), /views/css, /views/js e /public.');


// ROTA RAIZ
app.get('/', (req, res) => {
    console.log(`[app.js] ROTA GET '/' ACESSADA.`);
    if (req.session && req.session.userId) {
        console.log('[app.js] Usuário logado, redirecionando para /dashboard.');
        return res.redirect('/dashboard');
    }
    console.log('[app.js] Usuário não logado, redirecionando para /login.');
    return res.redirect('/login');
});

// Rota básica para teste (manter para diagnóstico, se desejar)
app.get('/teste', (req, res) => {
    console.log(`[app.js] ROTA GET '/teste' ACESSADA (HANDLER EM APP.JS).`);
    res.status(200).send('Servidor está funcionando na rota /teste diretamente do app.js!');
});


// Outras Rotas da Aplicação (montadas a partir de routes/index.js)
const apiRoutes = require('./routes'); 
app.use('/', apiRoutes); // Monta rotas de routes/index.js (ex: /login, /registrar, /dashboard, /reservas-pages/...)
console.log('[app.js] Rotas de ./routes (apiRoutes) montadas em /.');

// Tratamento de erro 404 (DEVE SER O ÚLTIMO MIDDLEWARE DE ROTA)
app.use((req, res, next) => {
    console.warn(`[app.js] ROTA NÃO ENCONTRADA (404): ${req.method} ${req.originalUrl}. Nenhum handler anterior capturou esta rota.`);
    res.status(404).render('pages/404', { titulo: 'Página não encontrada' }, (err, html) => {
        if (err) {
            console.error('[app.js] ERRO AO RENDERIZAR views/pages/404.ejs:', err.message);
            return res.status(404).send('Erro 404: Página não encontrada (e falha ao renderizar página de erro personalizada).');
        }
        res.send(html);
    });
});

// Tratamento de erro genérico (DEVE SER O ÚLTIMO MIDDLEWARE DE TODOS)
app.use((err, req, res, next) => {
    console.error('[app.js] ERRO INESPERADO NO SERVIDOR (HANDLER GENÉRICO):', err.stack);
    res.status(500).send('Algo deu muito errado no servidor! (Erro 500)');
});

// Inicia o servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`ROTA RAIZ: http://localhost:${PORT}/`);
    console.log(`http://localhost:${PORT}/login`);
});
