class DraftSystem {
    constructor() {
        this.rotas = {
            'Top': 'top',
            'Jungle': 'jungle', 
            'Mid': 'mid',
            'Adc': 'adc',
            'Sup': 'sup'
        };
    }

    init() {
        console.log('🎯 Inicializando DraftSystem...');
        this.configurarEventos();
        this.inicializarDrafts();
        console.log('✅ DraftSystem inicializado');
    }

    configurarEventos() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'rota') {
                console.log('🔄 Rota selecionada:', e.target.value);
                this.atualizarDraftAliado(e.target.value);
                this.atualizarVisibilidadeRota(e.target.value);
            }
        });
    }

    inicializarDrafts() {
        // Ocultar todos os drafts aliados inicialmente
        Object.values(this.rotas).forEach(rota => {
            this.toggleDraftField(rota, false);
        });
        
        console.log('📋 Drafts aliados inicializados (ocultos)');
    }

    atualizarDraftAliado(rotaJogador) {
        console.log('🔄 Atualizando draft aliado para:', rotaJogador);
        
        // Ocultar todos os drafts
        Object.values(this.rotas).forEach(rota => {
            this.toggleDraftField(rota, false);
        });

        // Mostrar apenas as rotas que NÃO são a do jogador
        Object.entries(this.rotas).forEach(([nome, id]) => {
            if (nome !== rotaJogador) {
                this.toggleDraftField(id, true);
            }
        });

        console.log(`🎯 Draft aliado atualizado: mostrando todas as rotas exceto ${rotaJogador}`);
    }

    toggleDraftField(rotaId, mostrar) {
        const field = document.querySelector(`.draft-field[data-rota="${rotaId}"]`);
        if (field) {
            if (mostrar) {
                field.classList.remove('oculta');
            } else {
                field.classList.add('oculta');
            }
        }
    }

    atualizarVisibilidadeRota(rotaSelecionada) {
        console.log('🔄 Atualizando visibilidade para rota:', rotaSelecionada);
        
        // CORREÇÃO CRÍTICA: Separar Jungle-only de Jungle-Mid
        const elementosJungleOnly = document.querySelectorAll('.jungle-only');
        const elementosJungleMid = document.querySelectorAll('.jungle-mid-only');
        const paginaJungle = document.getElementById('pagina2');

        // CORREÇÃO: Jungle-only deve aparecer APENAS para Jungle
        const isJungle = rotaSelecionada === 'Jungle';
        elementosJungleOnly.forEach(el => {
            if (isJungle) {
                el.classList.remove('oculta');
            } else {
                el.classList.add('oculta');
            }
        });
        
        // CORREÇÃO: Página 2 (Clear Inicial) deve aparecer APENAS para Jungle
        if (paginaJungle) {
            if (isJungle) {
                paginaJungle.classList.remove('oculta');
            } else {
                paginaJungle.classList.add('oculta');
            }
        }

        // CORREÇÃO: Jungle-mid-only deve aparecer para Jungle E Mid
        const isJungleOrMid = ['Jungle', 'Mid'].includes(rotaSelecionada);
        elementosJungleMid.forEach(el => {
            if (isJungleOrMid) {
                el.classList.remove('oculta');
            } else {
                el.classList.add('oculta');
            }
        });

        // Atualizar campo hidden
        const rotaHidden = document.getElementById('rotaSelecionadaHidden');
        if (rotaHidden) {
            rotaHidden.value = rotaSelecionada;
        }

        console.log(`👀 Visibilidade atualizada - Jungle: ${isJungle}, Jungle/Mid: ${isJungleOrMid}`);
        
        // CORREÇÃO: Atualizar navegação para pular página 2 se não for Jungle
        this.ajustarNavegacaoRota(rotaSelecionada);
    }

    ajustarNavegacaoRota(rotaSelecionada) {
        // Se não for Jungle e estiver na página 2, voltar para página 1
        if (rotaSelecionada !== 'Jungle' && window.analyzer && window.analyzer.modulos.nav) {
            const nav = window.analyzer.modulos.nav;
            if (nav.paginaAtual === 2) {
                nav.irParaPagina(1);
            }
        }
    }
}