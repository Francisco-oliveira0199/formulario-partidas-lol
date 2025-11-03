// nav.js - VERSÃO COMPLETA COM VALIDAÇÃO INTELIGENTE
// nav.js - VERSÃO COMPLETA COM DEBUG AVANÇADO
class Navigation {
    constructor() {
        this.paginaAtual = 1;
        this.totalPaginas = 6;
        this.debugMode = true; // Ativar debug completo
    }

    init() {
        this.configurarNavegacao();
        this.configurarTeclado();
        this.configurarDebugGlobal();
        console.log('🚀 Navigation inicializado - DEBUG ATIVADO');
    }

    configurarNavegacao() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-avancar')) {
                console.log('🔼 CLIQUE: Botão Avançar');
                this.avancarPagina();
            } else if (e.target.matches('.btn-voltar')) {
                console.log('🔽 CLIQUE: Botão Voltar');
                this.voltarPagina();
            }
        });
    }

    configurarTeclado() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                console.log('➡️ TECLA: Seta Direita');
                this.avancarPagina();
            } else if (e.key === 'ArrowLeft') {
                console.log('⬅️ TECLA: Seta Esquerda');
                this.voltarPagina();
            }
        });
    }

    configurarDebugGlobal() {
        // Expor métodos de debug globalmente
        window.debugNavegacao = {
            forcarPagina3: () => this.forcarPagina3(),
            verificarEstado: () => this.verificarEstadoCompleto(),
            listarPaginas: () => this.listarTodasPaginas(),
            testarCSS: () => this.testarEstilosCSS()
        };
        
        console.log('🐛 DEBUG GLOBAL ATIVADO - Comandos disponíveis:');
        console.log('- debugNavegacao.forcarPagina3()');
        console.log('- debugNavegacao.verificarEstado()');
        console.log('- debugNavegacao.listarPaginas()');
        console.log('- debugNavegacao.testarCSS()');
    }

    avancarPagina() {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        console.log('🔍 === AVANÇAR PÁGINA ===');
        console.log('📊 Estado atual:', {
            paginaAtual: this.paginaAtual,
            rota: rotaSelecionada,
            isJungle: isJungle
        });
        
        let proximaPagina = this.paginaAtual + 1;
        
        // LÓGICA DE NAVEGAÇÃO
        if (!isJungle && this.paginaAtual === 1) {
            proximaPagina = 3;
            console.log('🎯 PULANDO página 2 (não é Jungle)');
        }
        
        console.log(`🔄 Tentando ir para página: ${proximaPagina}`);
        
        if (proximaPagina <= this.totalPaginas) {
            this.irParaPagina(proximaPagina);
        } else {
            console.log('❌ Última página alcançada');
        }
    }

    voltarPagina() {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        console.log('🔍 === VOLTAR PÁGINA ===');
        
        let paginaAnterior = this.paginaAtual - 1;
        
        // LÓGICA DE VOLTAR
        if (!isJungle && this.paginaAtual === 3) {
            paginaAnterior = 1;
            console.log('🎯 Voltando da página 3 para 1 (não é Jungle)');
        } else if (isJungle && this.paginaAtual === 3) {
            paginaAnterior = 2;
            console.log('🎯 Voltando da página 3 para 2 (Jungle)');
        }
        
        console.log(`🔄 Voltando para página: ${paginaAnterior}`);
        
        if (paginaAnterior >= 1) {
            this.irParaPagina(paginaAnterior);
        } else {
            console.log('❌ Primeira página alcançada');
        }
    }

    irParaPagina(numero) {
        console.log(`🎯 === INICIANDO NAVEGAÇÃO PARA PÁGINA ${numero} ===`);
        
        // DEBUG: Verificar existência da página
        const paginaAlvo = document.getElementById(`pagina${numero}`);
        if (!paginaAlvo) {
            console.error(`❌ CRÍTICO: Página ${numero} NÃO EXISTE no HTML!`);
            this.listarTodasPaginas();
            return;
        }
        
        console.log(`✅ Página ${numero} encontrada no DOM`);
        
        // Validar página atual
        if (!this.validarPaginaAtual()) {
            console.log('❌ Validação falhou - navegação bloqueada');
            return;
        }
        
        console.log('✅ Validação passou - procedendo com navegação');
        
        // EXECUTAR NAVEGAÇÃO
        this.executarNavegacao(numero);
        
        // DEBUG FINAL
        setTimeout(() => {
            this.verificarNavegacaoConcluida(numero);
        }, 300);
    }

    executarNavegacao(numero) {
        console.log('🔄 Executando sequência de navegação...');
        
        // 1. OCULTAR todas as páginas
        this.ocultarTodasPaginas();
        
        // 2. MOSTRAR página alvo (COM FORÇA)
        this.mostrarPaginaForcada(numero);
        
        // 3. Atualizar UI
        this.atualizarProgresso(numero);
        this.atualizarBotoes(numero);
        
        // 4. Atualizar estado
        this.paginaAtual = numero;
        console.log(`✅ Estado atualizado: página ${this.paginaAtual}`);
        
        // 5. Atualizar outros sistemas
        if (window.analyzer && window.analyzer.modulos.draft) {
            window.analyzer.modulos.draft.atualizarPaginaAtual(numero);
        }
    }

    mostrarPaginaForcada(numero) {
        const pagina = document.getElementById(`pagina${numero}`);
        console.log(`👁️ FORÇANDO exibição da página ${numero}:`);
        
        // REMOVER QUALQUER CLASSE QUE BLOQUEIE
        pagina.classList.remove('oculta', 'invisivel', 'transparente');
        
        // ADICIONAR CLASSE ATIVA (COM MÚLTIPLAS GARANTIAS)
        pagina.classList.add('ativo', 'visivel');
        
        // FORÇAR ESTILOS DIRETAMENTE NO ELEMENTO
        pagina.style.display = 'block !important';
        pagina.style.visibility = 'visible !important';
        pagina.style.opacity = '1 !important';
        pagina.style.position = 'relative !important';
        pagina.style.zIndex = '1000 !important';
        pagina.style.left = 'auto !important';
        pagina.style.top = 'auto !important';
        
        console.log('🎨 Estilos aplicados:');
        console.log('- Classe:', pagina.className);
        console.log('- Display:', window.getComputedStyle(pagina).display);
        console.log('- Visibility:', window.getComputedStyle(pagina).visibility);
        console.log('- Opacity:', window.getComputedStyle(pagina).opacity);
        console.log('- Position:', window.getComputedStyle(pagina).position);
        
        // Scroll para garantir visibilidade
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('📜 Scroll para topo executado');
        }, 100);
    }

    ocultarTodasPaginas() {
        console.log('👻 Ocultando TODAS as páginas...');
        const paginas = document.querySelectorAll('.pagina');
        
        paginas.forEach((pagina, index) => {
            console.log(`- Ocultando: ${pagina.id}`);
            
            // Remover classe ativa
            pagina.classList.remove('ativo', 'visivel');
            
            // Adicionar classe oculta
            pagina.classList.add('oculta');
            
            // Forçar estilos de ocultação
            pagina.style.display = 'none !important';
            pagina.style.visibility = 'hidden !important';
        });
        
        console.log(`✅ ${paginas.length} páginas ocultadas`);
    }

    validarPaginaAtual() {
        // DEBUG: Pular validação para Página 3 durante testes
        if (this.paginaAtual === 2) {
            console.log('🎯 VALIDAÇÃO: Página 2 - Validando apenas para Jungle');
            return this.validarPagina2Condicional();
        }
        
        console.log(`🔍 Validando página ${this.paginaAtual}...`);
        const paginaAtual = document.getElementById(`pagina${this.paginaAtual}`);
        
        if (!paginaAtual) {
            console.error('❌ Página atual não encontrada');
            return true; // Permitir navegação mesmo com erro
        }

        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        // REGRA ESPECIAL: Página 2 só é válida se for Jungle
        if (this.paginaAtual === 2 && !isJungle) {
            console.log('🎯 Página 2 ignorada (não é Jungle)');
            return true;
        }

        // Para outras páginas, validação normal
        let camposObrigatorios = Array.from(paginaAtual.querySelectorAll('[required]'));
        
        // Filtrar apenas campos visíveis
        camposObrigatorios = camposObrigatorios.filter(campo => {
            const estaOculto = campo.offsetParent === null || 
                              campo.closest('.oculta') !== null;
            return !estaOculto;
        });
        
        console.log(`📝 ${camposObrigatorios.length} campos obrigatórios para validar`);
        
        let valido = true;
        let camposInvalidos = [];

        camposObrigatorios.forEach(campo => {
            const valor = campo.value.trim();
            const campoValido = campo.checkValidity() && valor !== '';
            
            if (!campoValido) {
                campo.classList.add('erro');
                valido = false;
                camposInvalidos.push(campo.name || campo.id);
            } else {
                campo.classList.remove('erro');
            }
        });

        if (!valido) {
            console.log('❌ Campos inválidos:', camposInvalidos);
            const mensagem = `Por favor, preencha os campos obrigatórios:\n\n• ${camposInvalidos.join('\n• ')}`;
            alert(mensagem);
        } else {
            console.log('✅ Todos os campos válidos');
        }

        return valido;
    }

    validarPagina2Condicional() {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        console.log(`🔍 Validando Página 2 - Jungle: ${isJungle}`);
        
        if (!isJungle) {
            console.log('🎯 Página 2 ignorada (não é Jungle)');
            return true;
        }
        
        // Validar campos da Página 2 (sem required no HTML)
        const campos = [
            { id: 'skillOrder', nome: 'Skill Order' },
            { id: 'ordemCampos', nome: 'Ordem dos Campos' },
            { id: 'combosClear', nome: 'Combos de Clear' }
        ];
        
        let valido = true;
        let camposVazios = [];

        campos.forEach(({ id, nome }) => {
            const campo = document.getElementById(id);
            if (campo) {
                const valor = campo.value.trim();
                if (!valor) {
                    campo.classList.add('erro');
                    valido = false;
                    camposVazios.push(nome);
                } else {
                    campo.classList.remove('erro');
                }
            }
        });

        if (!valido) {
            const mensagem = `Como você selecionou Jungle, preencha:\n\n• ${camposVazios.join('\n• ')}`;
            alert(mensagem);
        }

        return valido;
    }

    atualizarProgresso(numero) {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        console.log(`📊 Atualizando barra de progresso: página ${numero}`);
        
        document.querySelectorAll('.barra-progresso').forEach((barra, index) => {
            const numeroBarra = index + 1;
            const estaAtiva = numeroBarra === numero;
            const foiConcluida = numeroBarra < numero;
            const ehPagina2 = numeroBarra === 2;
            
            // Resetar classes
            barra.classList.remove('ativo', 'concluido', 'ignorada');
            
            // Aplicar classes
            if (estaAtiva) {
                barra.classList.add('ativo');
                console.log(`🎯 Barra ${numeroBarra} ATIVA`);
            } else if (foiConcluida) {
                barra.classList.add('concluido');
            }
            
            // Página 2 ignorada se não for Jungle
            if (!isJungle && ehPagina2) {
                barra.classList.add('ignorada');
            }
        });
    }

    atualizarBotoes(numero) {
        const btnVoltar = document.querySelector('.btn-voltar');
        if (btnVoltar) {
            btnVoltar.disabled = numero === 1;
            console.log(`🔘 Botão Voltar: ${btnVoltar.disabled ? 'disabled' : 'enabled'}`);
        }
        
        const btnAvancar = document.querySelector('.btn-avancar');
        const btnEnviar = document.querySelector('.btn-enviar');
        
        if (btnAvancar && btnEnviar) {
            const isUltimaPagina = numero === this.totalPaginas;
            btnAvancar.style.display = isUltimaPagina ? 'none' : 'block';
            btnEnviar.style.display = isUltimaPagina ? 'block' : 'none';
            
            console.log(`🔘 Botões: ${isUltimaPagina ? 'ENVIAR' : 'AVANÇAR'}`);
        }
    }

    // ========== MÉTODOS DE DEBUG ==========
    
    forcarPagina3() {
        console.log('🚀 === FORÇANDO PÁGINA 3 ===');
        this.executarNavegacao(3);
    }

    verificarEstadoCompleto() {
        console.log('🔍 === ESTADO COMPLETO DO SISTEMA ===');
        
        // Estado interno
        console.log('📊 ESTADO INTERNO:', {
            paginaAtual: this.paginaAtual,
            totalPaginas: this.totalPaginas,
            debugMode: this.debugMode
        });
        
        // Estado das páginas
        this.listarTodasPaginas();
        
        // Estado da rota
        const rota = document.querySelector('input[name="rota"]:checked');
        console.log('🎯 ROTA SELECIONADA:', rota ? rota.value : 'NENHUMA');
        
        // Estado do progresso
        console.log('📈 BARRAS DE PROGRESSO:', document.querySelectorAll('.barra-progresso').length);
    }

    listarTodasPaginas() {
        console.log('📄 === LISTA DE TODAS AS PÁGINAS ===');
        const paginas = document.querySelectorAll('.pagina');
        
        paginas.forEach((pagina, index) => {
            const estaAtiva = pagina.classList.contains('ativo');
            const estaOculta = pagina.classList.contains('oculta');
            const display = window.getComputedStyle(pagina).display;
            const visibility = window.getComputedStyle(pagina).visibility;
            const opacity = window.getComputedStyle(pagina).opacity;
            
            console.log(`${index + 1}. ${pagina.id}:`, {
                ativo: estaAtiva,
                oculta: estaOculta,
                display: display,
                visibility: visibility,
                opacity: opacity,
                existe: !!pagina
            });
        });
        
        console.log(`📊 Total: ${paginas.length} páginas encontradas`);
    }

    testarEstilosCSS() {
        console.log('🎨 === TESTE DE ESTILOS CSS ===');
        const pagina3 = document.getElementById('pagina3');
        
        if (!pagina3) {
            console.error('❌ Página 3 não encontrada para teste CSS');
            return;
        }
        
        console.log('🧪 Aplicando estilos de teste...');
        
        // Aplicar estilos visíveis de teste
        pagina3.style.border = '5px solid #00ff00';
        pagina3.style.background = 'rgba(0, 255, 0, 0.1)';
        pagina3.style.padding = '20px';
        pagina3.style.margin = '10px';
        
        console.log('✅ Estilos de teste aplicados - Verifique visualmente!');
    }

    verificarNavegacaoConcluida(numero) {
        console.log(`✅ === NAVEGAÇÃO PARA PÁGINA ${numero} CONCLUÍDA ===`);
        
        const pagina = document.getElementById(`pagina${numero}`);
        if (!pagina) {
            console.error('❌ Página não encontrada após navegação!');
            return;
        }
        
        const estaVisivel = pagina.offsetParent !== null && 
                           window.getComputedStyle(pagina).display !== 'none';
        
        console.log('📊 RESULTADO FINAL:', {
            pagina: numero,
            elementoExiste: !!pagina,
            classeAtivo: pagina.classList.contains('ativo'),
            classeOculta: pagina.classList.contains('oculta'),
            display: window.getComputedStyle(pagina).display,
            visibility: window.getComputedStyle(pagina).visibility,
            estaVisivel: estaVisivel
        });
        
        if (!estaVisivel) {
            console.error('CRÍTICO: Página NÃO está visível após navegação!');
            console.log('Execute debugNavegacao.forcarPagina3() para forçar');
        } else {
            console.log('SUCESSO: Página está visível!');
        }
    }
}