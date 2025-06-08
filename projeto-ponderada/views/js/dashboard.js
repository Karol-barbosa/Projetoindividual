// Lógica do frontend para o dashboard virá aqui
console.log('dashboard.js carregado');

document.addEventListener('DOMContentLoaded', () => {
    console.log('[dashboard.js] DOM Carregado');

    const horariosDisponiveisContent = document.getElementById('horariosDisponiveisContent');
    const salasDisponiveisContent = document.getElementById('salasDisponiveisContent');
    const btnConfirmarReserva = document.getElementById('btnConfirmarReserva');
    const mensagemReservaDiv = document.getElementById('mensagemReserva');

    // Horários de 08:00 às 21:00, de 1 em 1 hora
    const SLOTS_HORARIOS = [];
    for (let i = 8; i < 21; i++) {
        const inicio = i.toString().padStart(2, '0') + ':00';
        const fim = (i + 1).toString().padStart(2, '0') + ':00';
        SLOTS_HORARIOS.push({ id: `horario-${i}-${i+1}`, texto: `${inicio} - ${fim}` });
    }

    let salaSelecionada = null;
    let horarioSelecionado = null;

    function renderizarHorarios() {
        if (!horariosDisponiveisContent) return;
        horariosDisponiveisContent.innerHTML = ''; // Limpa placeholder "Carregando..."

        SLOTS_HORARIOS.forEach(slot => {
            const button = document.createElement('button');
            button.classList.add('horario-button');
            button.dataset.horarioId = slot.id;
            button.textContent = slot.texto;
            button.addEventListener('click', () => selecionarHorario(slot, button));
            horariosDisponiveisContent.appendChild(button);
        });
    }

    function atualizarBotoesHorario() {
        document.querySelectorAll('.horario-button').forEach(btn => {
            if (btn.dataset.horarioId === horarioSelecionado?.id) {
                btn.classList.add('horario-selecionado');
            } else {
                btn.classList.remove('horario-selecionado');
            }
            // Aqui futuramente adicionaremos a classe 'horario-reservado' se necessário
        });
    }

    function atualizarBotoesSala() {
        document.querySelectorAll('.sala-button').forEach(btn => {
            if (btn.dataset.salaid === salaSelecionada?.id) {
                btn.classList.add('sala-selecionada'); // Adicionaremos este estilo no CSS
            } else {
                btn.classList.remove('sala-selecionada');
            }
             // Aqui futuramente adicionaremos a classe 'sala-reservada' se necessário
        });
    }

    function selecionarHorario(slot, buttonElement) {
        if (horarioSelecionado && horarioSelecionado.id === slot.id) {
            horarioSelecionado = null; // Desseleciona se clicar no mesmo
        } else {
            horarioSelecionado = slot;
        }
        console.log('Horário selecionado:', horarioSelecionado);
        atualizarBotoesHorario();
        verificarSelecaoCompleta();
    }

    function selecionarSala(salaId, buttonElement) {
        if (salaSelecionada && salaSelecionada.id === salaId) {
            salaSelecionada = null; // Desseleciona se clicar na mesma
        } else {
            salaSelecionada = { id: salaId }; // Armazenamos o ID da sala
        }
        console.log('Sala selecionada:', salaSelecionada);
        atualizarBotoesSala();
        verificarSelecaoCompleta();
    }

    function verificarSelecaoCompleta() {
        if (btnConfirmarReserva) {
            if (salaSelecionada && horarioSelecionado) {
                btnConfirmarReserva.disabled = false;
                btnConfirmarReserva.textContent = `Reservar Sala ${salaSelecionada.id} (${horarioSelecionado.texto})`;
                mensagemReservaDiv.textContent = '';
            } else {
                btnConfirmarReserva.disabled = true;
                btnConfirmarReserva.textContent = 'Selecione Sala e Horário';
            }
        }
    }

    // Adicionar event listeners para os botões de sala existentes
    if (salasDisponiveisContent) {
        salasDisponiveisContent.querySelectorAll('.sala-button').forEach(button => {
            button.addEventListener('click', () => selecionarSala(button.dataset.salaid, button));
        });
    }

    if (btnConfirmarReserva) {
        btnConfirmarReserva.addEventListener('click', async () => {
            if (!salaSelecionada || !horarioSelecionado) {
                exibirMensagem('Por favor, selecione uma sala e um horário.', 'erro');
                return;
            }

            // Lógica para criar reserva (chamada fetch para o backend)
            // Por enquanto, apenas um log e mensagem
            console.log(`Tentando reservar: Sala ${salaSelecionada.id}, Horário: ${horarioSelecionado.texto}`);
            exibirMensagem(`Reserva para Sala ${salaSelecionada.id} às ${horarioSelecionado.texto} solicitada! (Backend não implementado)`, 'sucesso');
            
            // Simular que a reserva foi feita e o horário/sala ficaram indisponíveis (temporário)
            // No futuro, isso será atualizado com base na resposta real do backend
            const horarioBtn = document.querySelector(`.horario-button[data-horario-id="${horarioSelecionado.id}"]`);
            if (horarioBtn) horarioBtn.classList.add('horario-reservado');
            
            const salaBtn = document.querySelector(`.sala-button[data-salaid="${salaSelecionada.id}"]`);
            // if (salaBtn) salaBtn.classList.add('sala-reservada'); // Decidir como marcar a sala toda
            
            // Limpar seleção e desabilitar botão
            salaSelecionada = null;
            horarioSelecionado = null;
            atualizarBotoesHorario();
            atualizarBotoesSala();
            verificarSelecaoCompleta();
        });
    }

    function exibirMensagem(msg, tipo = 'info') {
        if (mensagemReservaDiv) {
            mensagemReservaDiv.textContent = msg;
            mensagemReservaDiv.className = `mensagem-reserva ${tipo}`;
        }
    }

    // Inicialização
    renderizarHorarios();
    verificarSelecaoCompleta(); // Para estado inicial do botão de confirmar

    // TODO: Buscar dados de reservas existentes para hoje e marcar salas/horários ocupados.
    // loadReservasDeHoje(); 
    // loadSalasOcupadasAgora();
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