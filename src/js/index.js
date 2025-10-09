

// src/js/index.js

document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial
    inicializarVisibilidade();
    configurarSelecaoRota();
    configurarNavegacao();
    configurarValidacaoFormulario();
    
    // Inicializar estados
    atualizarBarraProgresso(1);
    atualizarEstadosBotoes(1);
});

// Inicializar visibilidade correta ao carregar a página
function inicializarVisibilidade() {
    // Ocultar apenas elementos específicos inicialmente
    document.querySelectorAll('.pagina-jungle, .formulario-jungle, .formulario-jungle-mid').forEach(elemento => {
        elemento.classList.add('oculta');
        elemento.classList.remove('visivel');
    });
}

// 1. Configuração da seleção de rota (seleção única)
function configurarSelecaoRota() {
    const checkboxesRota = document.querySelectorAll('.checkbox-rota');
    
    checkboxesRota.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Desmarcar todos os outros checkboxes
                checkboxesRota.forEach(outroCheckbox => {
                    if (outroCheckbox !== this) {
                        outroCheckbox.checked = false;
                    }
                });
                
                // Remover destaque de erro
                const selecaoRota = document.querySelector('.selecao-rota');
                selecaoRota.classList.remove('erro');
                
                // Controlar visibilidade dos elementos baseado na rota selecionada
                controlarVisibilidadePorRota(this.value);
            }
        });
    });
}

// Função para controlar visibilidade dos elementos baseado na rota
function controlarVisibilidadePorRota(rotaSelecionada) {
    // Elementos específicos para Jungle (Página 2 e Pathing Inicial)
    const elementosJungle = document.querySelectorAll('.pagina-jungle, .formulario-jungle');
    
    // Elementos específicos para Jungle e Mid (Rota Impactante)
    const elementosJungleMid = document.querySelectorAll('.formulario-jungle-mid');
    
    // Controlar elementos Jungle
    elementosJungle.forEach(elemento => {
        if (rotaSelecionada === 'Jungle') {
            elemento.classList.remove('oculta');
            elemento.classList.add('visivel');
        } else {
            elemento.classList.remove('visivel');
            elemento.classList.add('oculta');
        }
    });
    
    // Controlar elementos Jungle e Mid (apenas Rota Impactante)
    elementosJungleMid.forEach(elemento => {
        if (rotaSelecionada === 'Jungle' || rotaSelecionada === 'Mid') {
            elemento.classList.remove('oculta');
            elemento.classList.add('visivel');
        } else {
            elemento.classList.remove('visivel');
            elemento.classList.add('oculta');
        }
    });
    
    // A página 3 (Primeiros Ganks) fica visível para TODAS as rotas
    
    // Atualizar barra de progresso
    atualizarBarraProgressoDinamico(rotaSelecionada);
    
    // Se a página atual ficou oculta, navegar para a primeira página visível
    const paginaAtual = obterPaginaAtual();
    const paginaAtualElemento = document.getElementById(`pagina${paginaAtual}`);
    
    if (paginaAtualElemento && paginaAtualElemento.classList.contains('oculta')) {
        const primeiraPaginaVisivel = obterPrimeiraPaginaVisivel();
        navegarParaPagina(primeiraPaginaVisivel);
    }
}

// Atualizar barra de progresso considerando páginas ocultas
function atualizarBarraProgressoDinamico(rotaSelecionada) {
    const botoesProgresso = document.querySelectorAll('.barra-progresso');
    const paginasVisiveis = obterPaginasVisiveis();
    
    botoesProgresso.forEach(botao => {
        const numeroPagina = parseInt(botao.getAttribute('numero-pagina'));
        
        if (paginasVisiveis.includes(numeroPagina)) {
            botao.classList.remove('oculta');
            botao.classList.add('visivel');
        } else {
            botao.classList.remove('visivel');
            botao.classList.add('oculta');
        }
    });
    
    // Atualizar progresso visual
    atualizarBarraProgresso(obterPaginaAtual());
}

// Obter array de páginas visíveis
function obterPaginasVisiveis() {
    const paginasVisiveis = [];
    
    for (let i = 1; i <= 6; i++) {
        const pagina = document.getElementById(`pagina${i}`);
        if (pagina && !pagina.classList.contains('oculta')) {
            paginasVisiveis.push(i);
        }
    }
    
    return paginasVisiveis;
}

// 2. Configuração da navegação entre páginas
function configurarNavegacao() {
    const botoesVoltar = document.querySelectorAll('.btn-voltar');
    const botoesAvancar = document.querySelectorAll('.btn-avancar');
    const botaoEnviar = document.querySelector('.btn-enviar');
    
    // Botões "Avançar"
    botoesAvancar.forEach(botao => {
        botao.addEventListener('click', function() {
            const paginaAtual = obterPaginaAtual();
            const proximaPagina = obterProximaPaginaValida(paginaAtual);
            
            if (proximaPagina && validarPaginaAtual(paginaAtual)) {
                navegarParaPagina(proximaPagina);
            }
        });
    });
    
    // Botões "Voltar"
    botoesVoltar.forEach(botao => {
        botao.addEventListener('click', function() {
            const paginaAtual = obterPaginaAtual();
            const paginaAnterior = obterPaginaAnteriorValida(paginaAtual);
            
            if (paginaAnterior) {
                navegarParaPagina(paginaAnterior);
            }
        });
    });
    
    // Botão "Enviar" - Agora envia o formulário normalmente
    if (botaoEnviar) {
        botaoEnviar.addEventListener('click', function(evento) {
            evento.preventDefault();
            if (validarPaginaAtual(6)) {
                enviarFormulario();
            }
        });
    }
}

// Função para enviar o formulário
function enviarFormulario() {
    const formulario = document.getElementById('formularioAnalisePartida');
    
    // Coletar dados adicionais antes do envio
    const rotaSelecionada = document.querySelector('.checkbox-rota:checked');
    if (rotaSelecionada) {
        // Adicionar campo hidden com a rota selecionada
        let campoRota = formulario.querySelector('input[name="rota_selecionada"]');
        if (!campoRota) {
            campoRota = document.createElement('input');
            campoRota.type = 'hidden';
            campoRota.name = 'rota_selecionada';
            formulario.appendChild(campoRota);
        }
        campoRota.value = rotaSelecionada.value;
    }
    
    // Mostrar mensagem de sucesso
    mostrarMensagemSucesso();
    
    // Enviar formulário após um pequeno delay para mostrar a mensagem
    setTimeout(() => {
        formulario.submit();
    }, 2000);
}

// Obter próxima página válida considerando páginas ocultas
function obterProximaPaginaValida(paginaAtual) {
    let proximaPagina = paginaAtual + 1;
    
    // Pular páginas que devem estar ocultas
    while (proximaPagina <= 6) {
        const pagina = document.getElementById(`pagina${proximaPagina}`);
        if (pagina && !pagina.classList.contains('oculta')) {
            return proximaPagina;
        }
        proximaPagina++;
    }
    
    return null;
}

// Obter página anterior válida considerando páginas ocultas
function obterPaginaAnteriorValida(paginaAtual) {
    let paginaAnterior = paginaAtual - 1;
    
    // Pular páginas que devem estar ocultas
    while (paginaAnterior >= 1) {
        const pagina = document.getElementById(`pagina${paginaAnterior}`);
        if (pagina && !pagina.classList.contains('oculta')) {
            return paginaAnterior;
        }
        paginaAnterior--;
    }
    
    return null;
}

// 3. Configuração da validação do formulário
function configurarValidacaoFormulario() {
    // Adicionar validação em tempo real para campos obrigatórios
    const camposObrigatorios = document.querySelectorAll('input[required], textarea[required]');
    camposObrigatorios.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('erro');
            }
        });
    });
}

// Função para navegar entre páginas
function navegarParaPagina(paginaAlvo) {
    // Esconder todas as páginas
    document.querySelectorAll('.pagina').forEach(pagina => {
        pagina.classList.remove('ativa');
    });
    
    // Mostrar a página alvo
    const elementoPaginaAlvo = document.getElementById(`pagina${paginaAlvo}`);
    if (elementoPaginaAlvo && !elementoPaginaAlvo.classList.contains('oculta')) {
        elementoPaginaAlvo.classList.add('ativa');
    }
    
    // Atualizar UI
    atualizarBarraProgresso(paginaAlvo);
    atualizarEstadosBotoes(paginaAlvo);
}

// Atualizar barra de progresso
function atualizarBarraProgresso(paginaAtual) {
    document.querySelectorAll('.barra-progresso').forEach((barra, indice) => {
        if (!barra.classList.contains('oculta')) {
            const numeroPagina = parseInt(barra.getAttribute('numero-pagina'));
            if (numeroPagina === paginaAtual) {
                barra.classList.add('ativo');
            } else {
                barra.classList.remove('ativo');
            }
        }
    });
}

// Atualizar estados dos botões
function atualizarEstadosBotoes(paginaAtual) {
    const botoesVoltar = document.querySelectorAll('.btn-voltar');
    const botoesAvancar = document.querySelectorAll('.btn-avancar');
    const botaoEnviar = document.querySelector('.btn-enviar');
    
    // Botões Voltar
    botoesVoltar.forEach(botao => {
        const primeiraPaginaVisivel = obterPrimeiraPaginaVisivel();
        botao.disabled = paginaAtual === primeiraPaginaVisivel;
    });
    
    // Botões Avançar
    botoesAvancar.forEach(botao => {
        const ultimaPaginaVisivel = obterUltimaPaginaVisivel();
        botao.style.display = paginaAtual === ultimaPaginaVisivel ? 'none' : 'inline-block';
    });
    
    // Botão Enviar
    if (botaoEnviar) {
        const ultimaPaginaVisivel = obterUltimaPaginaVisivel();
        botaoEnviar.style.display = paginaAtual === ultimaPaginaVisivel ? 'inline-block' : 'none';
    }
}

// Obter primeira página visível
function obterPrimeiraPaginaVisivel() {
    for (let i = 1; i <= 6; i++) {
        const pagina = document.getElementById(`pagina${i}`);
        if (pagina && !pagina.classList.contains('oculta')) {
            return i;
        }
    }
    return 1;
}

// Obter última página visível
function obterUltimaPaginaVisivel() {
    for (let i = 6; i >= 1; i--) {
        const pagina = document.getElementById(`pagina${i}`);
        if (pagina && !pagina.classList.contains('oculta')) {
            return i;
        }
    }
    return 6;
}

// Obter página atual
function obterPaginaAtual() {
    const paginaAtiva = document.querySelector('.pagina.ativa');
    if (paginaAtiva) {
        return parseInt(paginaAtiva.id.replace('pagina', ''));
    }
    return 1;
}

// Validar página atual
function validarPaginaAtual(numeroPagina) {
    let valido = true;
    
    // Validar campos obrigatórios da página
    const paginaAtual = document.getElementById(`pagina${numeroPagina}`);
    if (paginaAtual && !paginaAtual.classList.contains('oculta')) {
        const camposObrigatorios = paginaAtual.querySelectorAll('input[required], textarea[required]');
        
        camposObrigatorios.forEach(campo => {
            if (!validarCampo(campo)) {
                valido = false;
            }
        });
    }
    
    // Validação específica para página 1 (rota)
    if (numeroPagina === 1) {
        const rotaSelecionada = document.querySelector('.checkbox-rota:checked');
        if (!rotaSelecionada) {
            valido = false;
            const selecaoRota = document.querySelector('.selecao-rota');
            selecaoRota.classList.add('erro');
        }
    }
    
    if (!valido) {
        alert('Por favor, preencha todos os campos obrigatórios antes de continuar.');
    }
    
    return valido;
}

// Validar campo individual
function validarCampo(campo) {
    if (!campo.value.trim()) {
        campo.classList.add('erro');
        return false;
    } else {
        campo.classList.remove('erro');
        return true;
    }
}

// Mostrar mensagem de sucesso
function mostrarMensagemSucesso() {
    const mensagemSucesso = document.getElementById('mensagemSucesso');
    
    if (mensagemSucesso) {
        // Mostrar mensagem
        mensagemSucesso.classList.add('mostrar');
        
        // Manter a mensagem visível durante o envio
        setTimeout(() => {
            mensagemSucesso.classList.remove('mostrar');
        }, 5000);
    }
}