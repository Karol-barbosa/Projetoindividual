const User = require('../models/User'); // Importar o modelo para consultar o DB

function isAuthenticated(req, res, next) {
    // Se o req.user foi anexado pelo nosso novo middleware, a sessão é válida
    if (req.user && req.session.userId) {
        return next();
    }
    // Se não, redireciona para o login
    res.redirect('/login');
}

function alreadyLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
        return res.redirect('/dashboard');
    }
    next();
}

// NOVO MIDDLEWARE DE VALIDAÇÃO
async function validateSessionUser(req, res, next) {
    // Pula se não houver sessão ou ID de usuário
    if (!req.session || !req.session.userId) {
        return next();
    }

    try {
        const user = await User.buscarUsuarioPorId(req.session.userId);
        
        if (user) {
            // O usuário existe no banco! Anexa o usuário ao objeto 'req'
            // para que outras partes da aplicação possam usá-lo sem consultar o DB novamente.
            req.user = user; 
            return next(); // Prossegue para a próxima rota/middleware
        } else {
            // O ID na sessão é inválido (usuário foi deletado, etc.)
            console.warn(`[authMiddleware] ID de usuário inválido na sessão: ${req.session.userId}. Limpando sessão.`);
            req.session.destroy(err => {
                res.clearCookie('connect.sid');
                if (err) {
                    console.error('[authMiddleware] Erro ao destruir sessão inválida:', err);
                    return res.status(500).send("Erro ao limpar sua sessão. Por favor, limpe os cookies do seu navegador.");
                }
                // Redireciona para o login para que uma nova sessão seja criada.
                return res.redirect('/login');
            });
        }
    } catch (error) {
        console.error('[authMiddleware] Erro ao validar usuário da sessão:', error);
        return next(error);
    }
}

module.exports = { isAuthenticated, alreadyLoggedIn, validateSessionUser }; 