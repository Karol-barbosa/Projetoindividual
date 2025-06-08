document.addEventListener('DOMContentLoaded', () => {
    console.log('[auth.js] DOM Carregado');

    const formLogin = document.getElementById('formLogin');
    const formRegistrar = document.getElementById('formRegistrar');
    const mensagemErroAuthDiv = document.getElementById('mensagemErroAuth');

    function exibirMensagemErro(mensagem) {
        if (mensagemErroAuthDiv) {
            mensagemErroAuthDiv.textContent = mensagem;
            mensagemErroAuthDiv.style.display = 'block';
        }
    }

    function limparMensagemErro() {
        if (mensagemErroAuthDiv) {
            mensagemErroAuthDiv.textContent = '';
            mensagemErroAuthDiv.style.display = 'none';
        }
    }

    if (formLogin) {
        console.log('[auth.js] Formulário de Login encontrado.');
        formLogin.addEventListener('submit', async (event) => {
            event.preventDefault();
            limparMensagemErro();
            console.log('[auth.js] Submit do formulário de Login');

            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;

            if (!email || !senha) {
                exibirMensagemErro('Email e senha são obrigatórios.');
                return;
            }

            try {
                const response = await fetch('/api/usuario/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, senha }),
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error('[auth.js] Erro no login:', data ? data.erro : 'Resposta não JSON ou sem erro definido');
                    exibirMensagemErro(data && data.erro ? data.erro : 'Falha no login. Verifique suas credenciais.');
                } else {

                    const redirectTo = data.redirectTo || '/dashboard'; 
                    console.log(`[auth.js] Redirecionando para ${redirectTo}`);
                    window.location.href = redirectTo; 
                }
            } catch (error) {
                console.error('[auth.js] Exceção durante o login:', error);
                exibirMensagemErro('Ocorreu um erro ao tentar fazer login. Tente novamente.');
            }
        });
    }

    if (formRegistrar) {
        console.log('[auth.js] Formulário de Registro encontrado.');
        formRegistrar.addEventListener('submit', async (event) => {
            event.preventDefault();
            limparMensagemErro();
            console.log('[auth.js] Submit do formulário de Registro');

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const senha = document.getElementById('senha').value;
            const confirmaSenha = document.getElementById('confirmaSenha').value;

            if (!nome || !email || !senha || !confirmaSenha) {
                exibirMensagemErro('Todos os campos são obrigatórios.');
                return;
            }

            if (senha !== confirmaSenha) {
                exibirMensagemErro('As senhas não conferem.');
                return;
            }
            
            if (senha.length < 6) {
                exibirMensagemErro('A senha deve ter pelo menos 6 caracteres.');
                return;
            }

            try {
                console.log('[auth.js] Enviando dados para registro:', { nome, email, senha: '[OCULTA]', confirmaSenha: '[OCULTA]' } );
                const response = await fetch('/api/usuario/registrar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ nome, email, senha, confirmaSenha }),
                });

                const data = await response.json();
                console.log('[auth.js] Resposta do servidor (registro):', data);

                if (!response.ok) {
                    console.error('[auth.js] Erro no registro:', data ? data.erro : 'Resposta não JSON ou sem erro definido');
                    exibirMensagemErro(data && data.erro ? data.erro : 'Falha ao registrar. Tente novamente.');
                } else {
                    console.log('[auth.js] Registro bem-sucedido:', data);
                    alert(data.mensagem || 'Registro realizado com sucesso! Você será redirecionado para o login.');
                    window.location.href = '/login'; // Redireciona para login após registro
                }
            } catch (error) {
                console.error('[auth.js] Exceção durante o registro:', error);
                exibirMensagemErro('Ocorreu um erro ao tentar registrar. Tente novamente.');
            }
        });
    }
}); 