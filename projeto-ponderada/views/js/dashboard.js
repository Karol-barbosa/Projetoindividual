// Lógica do frontend para o dashboard virá aqui
console.log('dashboard.js carregado');

document.addEventListener('DOMContentLoaded', () => {
    console.log('[dashboard.js] DOM Carregado');

    // === ELEMENTOS DA UI ===
    const horariosDisponiveisContent = document.getElementById('horariosDisponiveisContent');
    const salasDisponiveisContent = document.getElementById('salasDisponiveisContent');
    const btnConfirmarReserva = document.getElementById('btnConfirmarReserva');
    const mensagemReservaDiv = document.getElementById('mensagemReserva');

    // === ESTADO DA APLICAÇÃO ===
    const state = {
        salaSelecionada: null,
        horarioSelecionado: null,
        reservasDeHoje: [],
        slotsHorarios: Array.from({ length: 13 }, (_, i) => {
            const hora = i + 8;
            const inicio = `${String(hora).padStart(2, '0')}:00`;
            const fim = `${String(hora + 1).padStart(2, '0')}:00`;
            return { id: `horario-${hora}`, texto: `${inicio} - ${fim}`, horario_inicio: inicio };
        })
    };

    // === FUNÇÕES DE LÓGICA / EVENT HANDLERS ===
    function handleSelecionarHorario(slot, buttonElement) {
        if (buttonElement.disabled) return;
        state.horarioSelecionado = (state.horarioSelecionado?.id === slot.id) ? null : slot;
        console.log('Horário selecionado:', state.horarioSelecionado);
        atualizarUI();
    }

    function handleSelecionarSala(buttonElement) {
        const salaId = buttonElement.dataset.salaId;
        const salaNome = buttonElement.textContent;

        state.horarioSelecionado = null; // Sempre limpa o horário ao trocar de sala
        state.salaSelecionada = (state.salaSelecionada?.id === salaId) ? null : { id: salaId, nome: salaNome };
        console.log('Sala selecionada:', state.salaSelecionada);
        atualizarUI();
    }

    async function handleCriarNovaReserva() {
        if (!state.salaSelecionada || !state.horarioSelecionado) {
            exibirMensagem('Por favor, selecione uma sala e um horário.', 'erro');
            return;
        }

        const dadosReserva = {
            sala_id: parseInt(state.salaSelecionada.id, 10), // Garante que é número
            horario_inicio: state.horarioSelecionado.horario_inicio
        };

        console.log('Enviando para o backend:', dadosReserva);
        btnConfirmarReserva.disabled = true;
        exibirMensagem('Processando sua reserva...', 'info');

        try {
            const response = await fetch('/api/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosReserva)
            });
            const resultado = await response.json();
            if (!response.ok) {
                throw new Error(resultado.detalhes || resultado.erro || 'Erro desconhecido');
            }
            exibirMensagem(`Reserva confirmada! Sala ${state.salaSelecionada.nome} às ${state.horarioSelecionado.texto}.`, 'sucesso');
            state.salaSelecionada = null;
            state.horarioSelecionado = null;
            await carregarReservasDeHoje();
        } catch (error) {
            console.error('Falha ao criar reserva:', error);
            exibirMensagem(`Erro: ${error.message}. Por favor, tente outro horário.`, 'erro');
        } finally {
            atualizarUI();
        }
    }

    // === FUNÇÕES DE ATUALIZAÇÃO DA UI (RENDERIZAÇÃO) ===
    function renderizarHorarios() {
        if (!horariosDisponiveisContent) return;
        horariosDisponiveisContent.innerHTML = '';
        state.slotsHorarios.forEach(slot => {
            const button = document.createElement('button');
            button.className = 'horario-button';
            button.dataset.horarioId = slot.id;
            button.dataset.horarioInicio = slot.horario_inicio;
            button.textContent = slot.texto;
            button.addEventListener('click', () => handleSelecionarHorario(slot, button));
            horariosDisponiveisContent.appendChild(button);
        });
    }

    function renderizarSalas() {
        if (salasDisponiveisContent) {
            salasDisponiveisContent.querySelectorAll('.sala-button').forEach(button => {
                button.addEventListener('click', () => handleSelecionarSala(button));
            });
        }
    }

    function exibirMensagem(msg, tipo = 'info') {
        if (mensagemReservaDiv) {
            mensagemReservaDiv.textContent = msg;
            mensagemReservaDiv.className = `mensagem-reserva ${tipo}`;
            if (!msg) {
                mensagemReservaDiv.className = 'mensagem-reserva';
            }
        }
    }

    function atualizarUI() {
        // Atualiza botões de sala
        document.querySelectorAll('.sala-button').forEach(btn => {
            btn.classList.toggle('sala-selecionada', state.salaSelecionada?.id === btn.dataset.salaId);
        });

        // Atualiza botões de horário (disponibilidade e seleção)
        document.querySelectorAll('.horario-button').forEach(btn => {
            let estaReservado = false;
            if (state.salaSelecionada) {
                estaReservado = state.reservasDeHoje.some(reserva =>
                    reserva.sala_id == state.salaSelecionada.id &&
                    new Date(reserva.data_checkin).getHours() === parseInt(btn.dataset.horarioInicio)
                );
            }
            btn.disabled = estaReservado;
            btn.classList.toggle('horario-reservado', estaReservado);
            btn.classList.toggle('horario-selecionado', state.horarioSelecionado?.id === btn.dataset.horarioId);
        });

        // Atualiza botão de confirmação
        if (btnConfirmarReserva) {
            const podeReservar = state.salaSelecionada && state.horarioSelecionado;
            btnConfirmarReserva.disabled = !podeReservar;
            if (podeReservar) {
                btnConfirmarReserva.textContent = `Reservar Sala ${state.salaSelecionada.nome} (${state.horarioSelecionado.texto})`;
            } else {
                btnConfirmarReserva.textContent = 'Selecione Sala e Horário';
            }
        }
    }

    // === CHAMADAS DE API ===
    async function carregarReservasDeHoje() {
        exibirMensagem('Carregando disponibilidade...', 'info');
        try {
            const response = await fetch('/api/reservas/hoje');
            if (!response.ok) throw new Error(`Erro do servidor: ${response.status}`);
            state.reservasDeHoje = await response.json();
            console.log('Reservas de hoje carregadas:', state.reservasDeHoje);
            exibirMensagem('', 'info');
        } catch (error) {
            console.error('Erro ao carregar reservas de hoje:', error);
            exibirMensagem('Não foi possível carregar a disponibilidade das salas.', 'erro');
            state.reservasDeHoje = [];
        } finally {
            atualizarUI();
        }
    }

    // === INICIALIZAÇÃO ===
    function init() {
        renderizarHorarios();
        renderizarSalas();
        if (btnConfirmarReserva) {
            btnConfirmarReserva.addEventListener('click', handleCriarNovaReserva);
        }
        carregarReservasDeHoje();
    }

    init();
});

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Erro ao buscar dados de ${url}:`, error);
        return null;
    }
}

// Funções de exemplo para carregar dados (precisarão de endpoints de API)
async function loadHorariosDisponiveis() {
    const data = await fetchData('/api/horarios/disponiveis'); // Endpoint de exemplo
    const contentDiv = document.getElementById('horariosDisponiveisContent');
    if (data && contentDiv) {
        // Lógica para renderizar os dados
        contentDiv.innerHTML = JSON.stringify(data, null, 2);
    } else if (contentDiv) {
        contentDiv.innerHTML = '<p>Não foi possível carregar os horários disponíveis.</p>';
    }
}

// Adicionar funções similares para salasDisponiveis, horariosReservados, salasReservadas 