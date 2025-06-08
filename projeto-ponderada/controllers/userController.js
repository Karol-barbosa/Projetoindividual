const User = require('../models/User'); // Modelo de usuário que acabamos de ajustar
const bcrypt = require('bcryptjs');    // Para comparar a senha no login

// Função para registrar um novo usuário
async function registrar(req, res) {
    console.log('[userController.js] Requisição de registro recebida.');
    const { nome, email, senha, confirmaSenha } = req.body;
    
    console.log('[userController.js] VALORES PARA VALIDAÇÃO:');
    console.log(`  >> nome: '${nome}' (é falsy? ${!nome})`);
    console.log(`  >> email: '${email}' (é falsy? ${!email})`);
    console.log(`  >> senha: \'${senha ? "[VALOR PRESENTE]" : "[VALOR AUSENTE OU VAZIO]"}\' (é falsy? ${!senha})`);
    console.log(`  >> confirmaSenha: \'${confirmaSenha ? "[VALOR PRESENTE]" : "[VALOR AUSENTE OU VAZIO]"}\' (é falsy? ${!confirmaSenha})`);

    // Validações básicas
    if (!nome || !email || !senha || !confirmaSenha) {
        // Mensagem de log atualizada para ser mais específica sobre a falha
        console.log('[userController.js] Falha na validação porque um ou mais campos são falsy. Verifique os logs >> acima.');
        return res.status(400).json({ erro: 'Todos os campos (nome, email, senha, confirmação de senha) são obrigatórios e não podem ser vazios.' });
    }

    if (senha !== confirmaSenha) {
        console.log('[userController.js] Falha na validação: Senhas não conferem.');
        return res.status(400).json({ erro: 'As senhas não conferem.' });
    }
    
    if (senha.length < 6) {
        console.log('[userController.js] Falha na validação: Senha muito curta.');
        return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres.' });
    }

    try {
        console.log('[userController.js] Chamando User.criarUsuario com:', { nome, email, senha: '[OCULTA]' });
        const novoUsuario = await User.criarUsuario({ nome, email, senha });
        
        if (novoUsuario) {
            console.log('[userController.js] Usuário registrado com sucesso:', novoUsuario.email);
            res.status(201).json({ 
                mensagem: 'Usuário registrado com sucesso!', 
                usuario: { id: novoUsuario.id, nome: novoUsuario.nome, email: novoUsuario.email } 
            });
        } else {
            console.error('[userController.js] User.criarUsuario retornou null/undefined, o que não deveria acontecer se lança erros.');
            res.status(500).json({ erro: 'Ocorreu um erro inesperado ao registrar o usuário.' });
        }
    } catch (error) {
        console.error('[userController.js] Erro ao registrar usuário:', error.message);
        if (error.message === 'Este email já está cadastrado.') {
            return res.status(409).json({ erro: error.message }); // 409 Conflict
        }
        res.status(500).json({ erro: 'Erro interno do servidor ao tentar registrar.', detalhe: error.message });
    }
}

// Função para logar um usuário
async function login(req, res) {
    console.log('[userController.js] Requisição de login recebida.');
    const { email, senha } = req.body;
    console.log('[userController.js] Dados recebidos:', { email, senha: '[SENHA OCULTA]' });

    if (!email || !senha) {
        console.log('[userController.js] Falha na validação: Email ou senha ausente.');
        return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    try {
        console.log('[userController.js] Buscando usuário por email:', email);
        const usuario = await User.buscarUsuarioPorEmail(email);

        if (!usuario) {
            console.log('[userController.js] Usuário não encontrado para o email:', email);
            return res.status(401).json({ erro: 'Credenciais inválidas (email não encontrado).' }); // 401 Unauthorized
        }
        
        if (!usuario.senha_hash) {
            console.error(`[userController.js] Usuário ${email} encontrado, mas não possui senha_hash no banco.`);
            return res.status(500).json({ erro: 'Erro de configuração da conta do usuário.' });
        }

        console.log('[userController.js] Usuário encontrado. Comparando senhas...');
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha_hash);

        if (!senhaCorreta) {
            console.log('[userController.js] Senha incorreta para o usuário:', email);
            return res.status(401).json({ erro: 'Credenciais inválidas (senha incorreta).' });
        }

        console.log('[userController.js] Login bem-sucedido para o usuário:', email);
        req.session.userId = usuario.id;
        req.session.userEmail = usuario.email;
        req.session.userName = usuario.nome;
        console.log('[userController.js] Sessão configurada:', req.session);

        res.status(200).json({ 
            mensagem: 'Login bem-sucedido!', 
            usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
            redirectTo: '/dashboard'
        });

    } catch (error) {
        console.error('[userController.js] Erro durante o login:', error);
        res.status(500).json({ erro: 'Erro interno do servidor ao tentar fazer login.', detalhe: error.message });
    }
}

// Função para fazer logout
async function logout(req, res) {
    console.log('[userController.js] Requisição de logout recebida.');
    req.session.destroy(err => {
        if (err) {
            console.error('[userController.js] Erro ao destruir a sessão:', err);
            return res.status(500).json({ erro: 'Falha ao fazer logout.', detalhe: err.message });
        }
        console.log('[userController.js] Sessão destruída com sucesso.');
        res.clearCookie('connect.sid');
        res.status(200).json({ mensagem: 'Logout realizado com sucesso!', redirectTo: '/login' });
    });
}

module.exports = { 
    registrar, 
    login,
    logout
};
