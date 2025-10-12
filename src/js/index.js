

// src/js/index.js

document.addEventListener('DOMContentLoaded', function() {
    // Configuração inicial
    inicializarVisibilidade();
    configurarSelecaoRota();
    configurarNavegacao();
    configurarValidacaoFormulario();
    configurarNavegacaoTeclado();
    gerenciarEstadoFormulario();
    
    // Inicializar estados
    atualizarBarraProgresso(1);
    atualizarEstadosBotoes(1);
    
    console.log('✅ Formulário otimizado carregado!');
});

// ✅ CORREÇÃO: Inicializar visibilidade correta
function inicializarVisibilidade() {
    // Ocultar TODAS as páginas exceto a primeira
    document.querySelectorAll('.pagina').forEach((pagina, index) => {
        if (index === 0) {
            pagina.classList.add('ativa');
        } else {
            pagina.classList.remove('ativa');
        }
    });
    
    // Ocultar elementos condicionais inicialmente
    const elementosCondicionais = document.querySelectorAll(
        '.pagina-jungle, .formulario-jungle, .formulario-jungle-mid, .formulario-adc, .formulario-sup'
    );
    
    elementosCondicionais.forEach(elemento => {
        elemento.classList.add('oculta');
        elemento.classList.remove('visivel');
    });
    
    // ✅ CORREÇÃO CRÍTICA: Garantir que a barra de progresso mostre apenas páginas visíveis
    atualizarBarraProgressoDinamico();
}

// 1. Configuração da seleção de rota (seleção única)
function configurarSelecaoRota() {
    const radiosRota = document.querySelectorAll('.radio-rota');
    const selecaoRota = document.querySelector('.selecao-rota');
    
    radiosRota.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                // Desmarcar visualmente todas as outras rotas
                document.querySelectorAll('.rota').forEach(rota => {
                    rota.classList.remove('selecionada');
                });
                
                // Marcar visualmente a rota selecionada
                this.closest('.rota').classList.add('selecionada');
                
                // Remover destaque de erro
                selecaoRota.classList.remove('erro');
                
                // Controlar visibilidade dos elementos baseado na rota selecionada
                controlarVisibilidadePorRota(this.value);
            }
        });
        
        // Clicar na div inteira da rota
        const rotaDiv = radio.closest('.rota');
        rotaDiv.addEventListener('click', function(e) {
            if (e.target !== radio) {
                radio.checked = true;
                radio.dispatchEvent(new Event('change'));
            }
        });
    });
}

// ✅ CORREÇÃO: Função atualizada para controlar visibilidade
function controlarVisibilidadePorRota(rotaSelecionada) {
    console.log('🔄 Controlando visibilidade para rota:', rotaSelecionada);
    
    // Elementos específicos para Jungle
    const elementosJungle = document.querySelectorAll('.formulario-jungle');
    const paginaJungle = document.querySelector('.pagina-jungle');
    
    // Elementos específicos para Jungle e Mid
    const elementosJungleMid = document.querySelectorAll('.formulario-jungle-mid');
    
    // Rota Alvo (apenas Jungle e Mid)
    const formularioRotaAlvo = document.querySelector('#pagina3 .formulario:first-child');
    
    // Campos ADC e Suporte
    const formularioSuporteAliado = document.querySelector('.formulario-adc');
    const formularioAdcAliado = document.querySelector('.formulario-sup');

    // ✅ CORREÇÃO: Controlar PÁGINA Jungle (não apenas formulários)
    if (paginaJungle) {
        if (rotaSelecionada === 'Jungle') {
            paginaJungle.classList.remove('oculta');
            paginaJungle.classList.add('visivel');
        } else {
            paginaJungle.classList.remove('visivel');
            paginaJungle.classList.add('oculta');
        }
    }

    // Controlar elementos Jungle (formulários dentro da página 1)
    elementosJungle.forEach(elemento => {
        if (rotaSelecionada === 'Jungle') {
            elemento.classList.remove('oculta');
            elemento.classList.add('visivel');
        } else {
            elemento.classList.remove('visivel');
            elemento.classList.add('oculta');
        }
    });
    
    // Controlar elementos Jungle e Mid
    elementosJungleMid.forEach(elemento => {
        if (rotaSelecionada === 'Jungle' || rotaSelecionada === 'Mid') {
            elemento.classList.remove('oculta');
            elemento.classList.add('visivel');
        } else {
            elemento.classList.remove('visivel');
            elemento.classList.add('oculta');
        }
    });
    
    // Controlar "Rota Alvo" (apenas Jungle e Mid)
    if (formularioRotaAlvo) {
        if (rotaSelecionada === 'Jungle' || rotaSelecionada === 'Mid') {
            formularioRotaAlvo.classList.remove('oculta');
            formularioRotaAlvo.classList.add('visivel');
        } else {
            formularioRotaAlvo.classList.remove('visivel');
            formularioRotaAlvo.classList.add('oculta');
        }
    }
    
    // Controlar campos ADC e Suporte
    if (formularioSuporteAliado) {
        if (rotaSelecionada === 'Adc') {
            formularioSuporteAliado.classList.remove('oculta');
            formularioSuporteAliado.classList.add('visivel');
        } else {
            formularioSuporteAliado.classList.remove('visivel');
            formularioSuporteAliado.classList.add('oculta');
        }
    }
    
    if (formularioAdcAliado) {
        if (rotaSelecionada === 'Sup') {
            formularioAdcAliado.classList.remove('oculta');
            formularioAdcAliado.classList.add('visivel');
        } else {
            formularioAdcAliado.classList.remove('visivel');
            formularioAdcAliado.classList.add('oculta');
        }
    }
    
    // ✅ CORREÇÃO: Atualizar barra de progresso SEMPRE
    atualizarBarraProgressoDinamico();
}

// ✅ CORREÇÃO: Função atualizada para barra de progresso
function atualizarBarraProgressoDinamico() {
    const botoesProgresso = document.querySelectorAll('.barra-progresso');
    const paginasVisiveis = obterPaginasVisiveis();
    const paginaAtual = obterPaginaAtual();
    
    console.log('📊 Páginas visíveis:', paginasVisiveis);
    
    botoesProgresso.forEach(botao => {
        const numeroPagina = parseInt(botao.getAttribute('numero-pagina'));
        
        // Mostrar/ocultar baseado nas páginas visíveis
        if (paginasVisiveis.includes(numeroPagina)) {
            botao.style.display = 'flex';
            botao.classList.remove('oculta');
        } else {
            botao.style.display = 'none';
            botao.classList.add('oculta');
        }
        
        // Atualizar estado ativo
        if (numeroPagina === paginaAtual && paginasVisiveis.includes(numeroPagina)) {
            botao.classList.add('ativo');
        } else {
            botao.classList.remove('ativo');
        }
    });
}

// ✅ CORREÇÃO: Função para obter páginas visíveis
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
    
    // Botão "Enviar"
    if (botaoEnviar) {
        botaoEnviar.addEventListener('click', function(evento) {
            evento.preventDefault();
            if (validarPaginaAtual(6)) {
                enviarFormulario();
            }
        });
    }
}

// ✅ CORREÇÃO: Função para navegar entre páginas
function navegarParaPagina(paginaAlvo) {
    console.log('🔄 Navegando para página:', paginaAlvo);
    
    // Validar se a página alvo é visível
    const elementoPaginaAlvo = document.getElementById(`pagina${paginaAlvo}`);
    if (!elementoPaginaAlvo || elementoPaginaAlvo.classList.contains('oculta')) {
        console.log('❌ Página alvo não está visível, procurando próxima válida...');
        const proximaPagina = obterProximaPaginaValida(paginaAlvo);
        if (proximaPagina) {
            navegarParaPagina(proximaPagina);
        }
        return;
    }
    
    // Esconder todas as páginas
    document.querySelectorAll('.pagina').forEach(pagina => {
        pagina.classList.remove('ativa');
    });
    
    // Mostrar a página alvo
    elementoPaginaAlvo.classList.add('ativa');
    
    // Atualizar UI
    atualizarBarraProgresso(paginaAlvo);
    atualizarEstadosBotoes(paginaAlvo);
    
    console.log('✅ Navegação concluída para página:', paginaAlvo);
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

// ✅ CORREÇÃO: Atualizar estados dos botões
function atualizarEstadosBotoes(paginaAtual) {
    const botoesVoltar = document.querySelectorAll('.btn-voltar');
    const botoesAvancar = document.querySelectorAll('.btn-avancar');
    const botaoEnviar = document.querySelector('.btn-enviar');
    
    const primeiraPaginaVisivel = obterPrimeiraPaginaVisivel();
    const ultimaPaginaVisivel = obterUltimaPaginaVisivel();
    
    console.log('🎯 Estado botões - Página atual:', paginaAtual, 'Primeira:', primeiraPaginaVisivel, 'Última:', ultimaPaginaVisivel);
    
    // Botões Voltar
    botoesVoltar.forEach(botao => {
        botao.disabled = paginaAtual === primeiraPaginaVisivel;
    });
    
    // Botões Avançar
    botoesAvancar.forEach(botao => {
        if (paginaAtual === ultimaPaginaVisivel) {
            botao.style.display = 'none';
        } else {
            botao.style.display = 'inline-block';
        }
    });
    
    // Botão Enviar
    if (botaoEnviar) {
        if (paginaAtual === ultimaPaginaVisivel) {
            botaoEnviar.style.display = 'inline-block';
        } else {
            botaoEnviar.style.display = 'none';
        }
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

// 3. Configuração da validação do formulário
function configurarValidacaoFormulario() {
    // Adicionar validação em tempo real para campos obrigatórios
    const camposObrigatorios = document.querySelectorAll('input[required], textarea[required], select[required]');
    camposObrigatorios.forEach(campo => {
        campo.addEventListener('blur', function() {
            validarCampo(this);
        });
        
        campo.addEventListener('input', function() {
            if (this.value.trim()) {
                this.classList.remove('erro');
                limparErroCampo(this);
            }
        });
        
        // Para select, usar change event também
        if (campo.tagName === 'SELECT') {
            campo.addEventListener('change', function() {
                if (this.value.trim()) {
                    this.classList.remove('erro');
                    limparErroCampo(this);
                }
            });
        }
    });
}

// Função para validar campo individual
function validarCampo(campo) {
    const valor = campo.value.trim();
    let valido = true;
    let mensagem = '';
    
    campo.classList.remove('erro');
    limparErroCampo(campo);
    
    // Validações específicas
    if (campo.hasAttribute('required') && !valor) {
        valido = false;
        mensagem = 'Este campo é obrigatório';
    }
    
    if (campo.name === 'elo' && !valor) {
        valido = false;
        mensagem = 'Selecione seu elo';
    }
    
    if (campo.name === 'nickname' && valor.length < 2) {
        valido = false;
        mensagem = 'Nickname muito curto';
    }
    
    if (!valido) {
        campo.classList.add('erro');
        mostrarErroCampo(campo, mensagem);
    }
    
    return valido;
}

function mostrarErroCampo(campo, mensagem) {
    // Remover mensagem de erro anterior
    limparErroCampo(campo);
    
    // Criar elemento de erro
    const erroElemento = document.createElement('div');
    erroElemento.className = 'mensagem-erro';
    erroElemento.textContent = mensagem;
    
    // Inserir após o campo
    campo.parentNode.appendChild(erroElemento);
}

function limparErroCampo(campo) {
    const erroExistente = campo.parentNode.querySelector('.mensagem-erro');
    if (erroExistente) {
        erroExistente.remove();
    }
}

// Validar página atual
function validarPaginaAtual(numeroPagina) {
    let valido = true;
    
    // Validar campos obrigatórios da página
    const paginaAtual = document.getElementById(`pagina${numeroPagina}`);
    if (paginaAtual && !paginaAtual.classList.contains('oculta')) {
        const camposObrigatorios = paginaAtual.querySelectorAll('input[required], textarea[required], select[required]');
        
        camposObrigatorios.forEach(campo => {
            if (!validarCampo(campo)) {
                valido = false;
            }
        });
    }
    
    // Validação específica para página 1 (rota)
    if (numeroPagina === 1) {
        const rotaSelecionada = document.querySelector('.radio-rota:checked');
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

// Função para enviar o formulário
function enviarFormulario() {
    const formulario = document.getElementById('formularioAnalisePartida');
    const botaoEnviar = document.querySelector('.btn-enviar');
    
    if (!validarPaginaAtual(6)) {
        alert('❌ Por favor, corrija os erros antes de enviar.');
        return;
    }
    
    // Estado de loading
    botaoEnviar.classList.add('carregando');
    botaoEnviar.disabled = true;
    botaoEnviar.innerHTML = '<span class="texto-carregando">Enviando...</span>';
    
    // Coletar dados adicionais antes do envio
    const rotaSelecionada = document.querySelector('.radio-rota:checked');
    if (rotaSelecionada) {
        let campoRota = formulario.querySelector('input[name="rota_selecionada"]');
        if (!campoRota) {
            campoRota = document.createElement('input');
            campoRota.type = 'hidden';
            campoRota.name = 'rota_selecionada';
            formulario.appendChild(campoRota);
        }
        campoRota.value = rotaSelecionada.value;
    }
    
    // Simular envio (substituir por envio real)
    console.log('📤 Enviando dados...', coletarDadosFormulario());
    
    setTimeout(() => {
        // Feedback de sucesso
        mostrarMensagemSucesso();
        
        // Limpa dados salvos
        limparEstadoFormulario();
        
        // Reseta formulário
        formulario.reset();
        
        // Restaura botão
        botaoEnviar.classList.remove('carregando');
        botaoEnviar.disabled = false;
        botaoEnviar.innerHTML = 'Enviar Análise';
        
        // Volta para primeira página
        navegarParaPagina(1);
        
        // ⚠️ PARA ENVIO REAL, DESCOMENTE:
        // formulario.submit();
        
    }, 2000); // Simula delay de rede
}

function coletarDadosFormulario() {
    const dados = {};
    document.querySelectorAll('input, textarea, select').forEach(campo => {
        if (campo.name && !campo.name.startsWith('_')) {
            dados[campo.name] = campo.value;
        }
    });
    return dados;
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

// Navegação por teclado
function configurarNavegacaoTeclado() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + → para avançar
        if (e.ctrlKey && e.key === 'ArrowRight') {
            e.preventDefault();
            const paginaAtual = obterPaginaAtual();
            const proximaPagina = obterProximaPaginaValida(paginaAtual);
            if (proximaPagina && validarPaginaAtual(paginaAtual)) {
                navegarParaPagina(proximaPagina);
            }
        }
        
        // Ctrl + ← para voltar
        if (e.ctrlKey && e.key === 'ArrowLeft') {
            e.preventDefault();
            const paginaAtual = obterPaginaAtual();
            const paginaAnterior = obterPaginaAnteriorValida(paginaAtual);
            if (paginaAnterior) {
                navegarParaPagina(paginaAnterior);
            }
        }
    });
}

// Persistência de dados
function gerenciarEstadoFormulario() {
    // Salvar estado ao navegar
    document.querySelectorAll('input, textarea, select').forEach(campo => {
        campo.addEventListener('input', salvarEstadoFormulario);
        if (campo.type === 'radio' || campo.type === 'checkbox') {
            campo.addEventListener('change', salvarEstadoFormulario);
        }
    });
    
    // Carregar estado ao inicializar
    carregarEstadoFormulario();
}

function salvarEstadoFormulario() {
    const estado = {};
    
    document.querySelectorAll('input, textarea, select').forEach(campo => {
        if (campo.type === 'radio') {
            if (campo.checked) estado[campo.name] = campo.value;
        } else if (campo.type === 'checkbox') {
            estado[campo.name] = campo.checked;
        } else {
            estado[campo.name] = campo.value;
        }
    });
    
    localStorage.setItem('formularioAnalisePartida', JSON.stringify(estado));
}

function carregarEstadoFormulario() {
    try {
        const estadoSalvo = localStorage.getItem('formularioAnalisePartida');
        
        if (estadoSalvo) {
            const estado = JSON.parse(estadoSalvo);
            
            Object.keys(estado).forEach(nome => {
                const valor = estado[nome];
                const campo = document.querySelector(`[name="${nome}"]`);
                
                if (campo) {
                    if (campo.type === 'radio') {
                        // Marca o radio button correto
                        const radioCorreto = document.querySelector(`[name="${nome}"][value="${valor}"]`);
                        if (radioCorreto) {
                            radioCorreto.checked = true;
                            // Dispara o evento change para atualizar a UI
                            radioCorreto.dispatchEvent(new Event('change'));
                        }
                    } else if (campo.type === 'checkbox') {
                        campo.checked = valor;
                    } else {
                        campo.value = valor;
                    }
                }
            });
            
            console.log('✅ Dados do formulário restaurados!');
        }
    } catch (error) {
        console.log('❌ Erro ao carregar dados salvos:', error);
    }
}

function limparEstadoFormulario() {
    localStorage.removeItem('formularioAnalisePartida');
    console.log('✅ Dados do formulário limpos!');
}

// Adicione esta função ao seu arquivo JavaScript
function configurarEnvioPDF() {
    const form = document.getElementById('formularioAnalisePartida');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Mostrar loading
        const btnEnviar = this.querySelector('.btn-enviar');
        btnEnviar.innerHTML = 'Gerando PDF...';
        btnEnviar.disabled = true;
        
        // Gerar PDF
        const pdfGerado = await gerarPDFCompleto();
        
        if (pdfGerado) {
            // Enviar formulário
            this.submit();
        } else {
            // Enviar sem PDF em caso de erro
            this.submit();
        }
    });
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', configurarEnvioPDF);