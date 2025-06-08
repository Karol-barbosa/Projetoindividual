// Função para carregar todas as reservas
async function carregarReservas() {
    try {
        console.log('[reservas.js] Carregando reservas de /api/reservas');
        const response = await fetch('/api/reservas');
        const reservas = await response.json();
        console.log('[reservas.js] Reservas carregadas:', reservas);
        exibirReservas(reservas);
    } catch (error) {
        console.error('[reservas.js] Erro ao carregar reservas:', error);
        alert('Erro ao carregar as reservas. Tente novamente mais tarde.');
    }
}

// Função para criar uma nova reserva
async function criarReserva(event) {
    event.preventDefault();
    console.log('[reservas.js] Evento de submit do formulário capturado para criar reserva.');
    
    const formData = {
        usuario_id: parseInt(document.getElementById('usuario_id').value),
        sala_id: parseInt(document.getElementById('sala_id').value),
        data_checkin: document.getElementById('data_checkin').value,
        data_checkout: document.getElementById('data_checkout').value,
        status: document.getElementById('status').value
    };
    console.log('[reservas.js] Dados do formulário para criar:', formData);

    try {
        console.log('[reservas.js] Enviando requisição POST para /api/reserva');
        const response = await fetch('/api/reserva', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        const responseBody = await response.text();
        console.log('[reservas.js] Resposta do servidor (criar reserva):', response.status, responseBody);

        if (!response.ok) {
            let errorData = JSON.parse(responseBody); // Tentar parsear, pode falhar se não for JSON
            throw new Error(errorData.erro || `Erro ${response.status}`);
        }
        const novaReserva = JSON.parse(responseBody);
        alert('Reserva criada com sucesso!');
        window.location.href = '/reservas-pages/reservas-view';
    } catch (error) {
        console.error('[reservas.js] Erro ao criar reserva:', error);
        alert('Erro ao criar a reserva: ' + error.message);
    }
}

// Função para excluir uma reserva
async function excluirReserva(id) {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) return;
    console.log(`[reservas.js] Excluindo reserva ID: ${id} via DELETE /api/reserva/${id}`);
    try {
        const response = await fetch(`/api/reserva/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir reserva');
        alert('Reserva excluída com sucesso!');
        carregarReservas();
    } catch (error) {
        console.error('[reservas.js] Erro ao excluir reserva:', error);
        alert('Erro ao excluir a reserva.');
    }
}

// Função para atualizar o status de uma reserva
async function atualizarStatus(id, novoStatus) {
    console.log(`[reservas.js] Atualizando status reserva ID: ${id} para ${novoStatus} via PATCH /api/reserva/${id}/status`);
    try {
        const response = await fetch(`/api/reserva/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: novoStatus })
        });
        if (!response.ok) throw new Error('Erro ao atualizar status');
        alert('Status atualizado com sucesso!');
        carregarReservas();
    } catch (error) {
        console.error('[reservas.js] Erro ao atualizar status:', error);
        alert('Erro ao atualizar o status.');
    }
}

// Função para exibir as reservas na página
function exibirReservas(reservas) {
    const container = document.getElementById('reservas-lista');
    if (!container) {
        console.error('[reservas.js] Elemento reservas-lista não encontrado!');
        return;
    }
    
    container.innerHTML = '';

    if (!Array.isArray(reservas)) {
        return;
    }

    if (reservas.length === 0) {
        container.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
        return;
    }

    reservas.forEach(reserva => {
        const card = document.createElement('div');
        card.className = 'reserva-card';
        // Formatar a data pode ser feito aqui se necessário
        const dataCheckinFormatada = reserva.data_checkin ? new Date(reserva.data_checkin).toLocaleDateString() : 'N/A';
        const dataCheckoutFormatada = reserva.data_checkout ? new Date(reserva.data_checkout).toLocaleDateString() : 'N/A';

        card.innerHTML = `
            <h3>Reserva ID: ${reserva.id}</h3>
            <div class="reserva-info">
                <p><strong>Sala ID:</strong> ${reserva.sala_id}</p>
                <p><strong>Usuário ID:</strong> ${reserva.usuario_id}</p>
                <p><strong>Check-in:</strong> ${dataCheckinFormatada}</p>
                <p><strong>Check-out:</strong> ${dataCheckoutFormatada}</p>
                <p><strong>Status:</strong> <span class="status status-${String(reserva.status || 'desconhecido').toLowerCase()}">${reserva.status || 'Desconhecido'}</span></p>
            </div>
            <div class="botoes-acao">
                <select onchange="atualizarStatus(${reserva.id}, this.value)" class="btn-select-status">
                    <option value="" disabled ${!reserva.status ? 'selected' : ''}>Mudar Status</option>
                    <option value="pendente" ${reserva.status === 'pendente' ? 'selected' : ''}>Pendente</option>
                    <option value="confirmada" ${reserva.status === 'confirmada' ? 'selected' : ''}>Confirmada</option>
                    <option value="cancelada" ${reserva.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
                <button onclick="excluirReserva(${reserva.id})" class="btn btn-excluir">Excluir</button>
                <!-- Botão de Editar pode levar para uma página de formulário de edição -->
                <!-- Exemplo: <a href="/reservas-pages/reservas/editar/${reserva.id}" class="btn btn-editar">Editar</a> -->
            </div>
        `;
        container.appendChild(card);
    });
}

// Ajustar o DOMContentLoaded para as novas URLs das páginas de reserva
document.addEventListener('DOMContentLoaded', () => {
    console.log('[reservas.js] DOM completamente carregado e parseado.');
    
    const estaNaPaginaFormReserva = window.location.pathname.endsWith('/reservas-pages/reservas/novo') || window.location.pathname.includes('/reservas-pages/reservas/editar/');
    const estaNaPaginaListaReservas = window.location.pathname.endsWith('/reservas-pages/reservas-view');

    if (estaNaPaginaFormReserva) {
        const formReserva = document.getElementById('form-reserva');
        if (formReserva) {
            console.log('[reservas.js] Formulário #form-reserva encontrado na página de formulário de reserva.');
            formReserva.addEventListener('submit', criarReserva); // Ou uma função de editarReserva se for o caso
        } else {
            console.warn('[reservas.js] Formulário #form-reserva NÃO encontrado na página de formulário de reserva.');
        }
    } else if (estaNaPaginaListaReservas) {
        console.log('[reservas.js] Na página de listagem de reservas. Carregando reservas...');
        carregarReservas();
    } else {
        console.log('[reservas.js] Página não identificada como lista ou formulário de reservas. Nenhuma ação específica de reserva tomada.');
    }
}); 