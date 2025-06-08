const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
    async criarUsuario({ nome, email, senha }) {
        console.log('[User.js (Model)] Criando usuário com email:', email);
        try {
            const senhaHash = await bcrypt.hash(senha, 10); // Hash da senha
            console.log('[User.js (Model)] Senha hasheada.');
            
            const query = `
                INSERT INTO usuarios (nome, email, senha_hash)
                VALUES ($1, $2, $3)
                RETURNING id, nome, email;
            `;
            const values = [nome, email, senhaHash];
            console.log("[User.js (Model)] Executando query de inserção em 'usuarios'...");
            const result = await db.query(query, values);
            
            if (result.rows && result.rows.length > 0) {
                console.log('[User.js (Model)] Usuário inserido com sucesso:', result.rows[0]);
                return result.rows[0];
            } else {
                console.warn('[User.js (Model)] Inserção não retornou o usuário esperado.');
                return null;
            }
        } catch (error) {
            console.error('[User.js (Model)] Erro ao criar usuário no banco de dados:', error);
            // Verificar se é erro de email duplicado (unique_violation - código 23505)
            if (error.code === '23505') {
                throw new Error('Este email já está cadastrado.');
            }
            throw error; // Propaga outros erros
        }
    },

    async buscarUsuarioPorEmail(email) {
        console.log('[User.js (Model)] Buscando usuário por email:', email);
        const query = `SELECT * FROM usuarios WHERE email = $1;`;
        console.log("[User.js (Model)] Executando query de busca em 'usuarios'...");
        try {
            const result = await db.query(query, [email]);
            if (result.rows.length > 0) {
                console.log('[User.js (Model)] Usuário encontrado:', result.rows[0].email);
                return result.rows[0];
            }
            console.log('[User.js (Model)] Nenhum usuário encontrado com o email:', email);
            return null;
        } catch (error) {
            console.error('[User.js (Model)] Erro ao buscar usuário por email no banco de dados:', error);
            throw error;
        }
    }
};

module.exports = User;
