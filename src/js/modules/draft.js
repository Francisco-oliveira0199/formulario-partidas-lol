class DraftSystem {
    constructor() {
        this.rotas = {
            'Top': 'top',
            'Jungle': 'jungle', 
            'Mid': 'mid',
            'Adc': 'adc',
            'Sup': 'sup'
        };
        this.paginaAtual = 1;
    }

    init() {
        console.log('🎯 Inicializando DraftSystem...');
        this.configurarEventos();
        this.inicializarDrafts();
        this.inicializarChecklist(); // NOVO: Inicializar checklist
        console.log('✅ DraftSystem inicializado');
    }

    configurarEventos() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'rota') {
                console.log('🔄 Rota selecionada:', e.target.value);
                this.atualizarDraftAliado(e.target.value);
                this.atualizarVisibilidadeRota(e.target.value);
                this.atualizarChecklistRota(e.target.value); // NOVO MÉTODO
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

    // NOVO: Inicializar checklist
    inicializarChecklist() {
        // Garantir que o checklist jungle comece oculto
        const checklistPathing = document.getElementById('checklistPathingContainer');
        if (checklistPathing) {
            checklistPathing.classList.add('oculta');
            console.log('📋 Checklist Pathing inicializado (oculto)');
        }
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

    // NOVO MÉTODO: Atualizar visibilidade do checklist baseado na rota
    atualizarChecklistRota(rotaSelecionada) {
        const isJungle = rotaSelecionada === 'Jungle';
        const checklistPathing = document.getElementById('checklistPathingContainer');
        
        if (checklistPathing) {
            if (isJungle) {
                checklistPathing.classList.remove('oculta');
                console.log('📋 Checklist Pathing: VISÍVEL para Jungle');
            } else {
                checklistPathing.classList.add('oculta');
                // Resetar o checkbox se não for Jungle
                const checkbox = checklistPathing.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    checkbox.checked = false;
                    console.log('📋 Checklist Pathing: OCULTO e desmarcado');
                }
            }
        }
    }

    atualizarVisibilidadeRota(rotaSelecionada) {
        console.log('🔄 Atualizando visibilidade para rota:', rotaSelecionada);
        
        const isJungle = rotaSelecionada === 'Jungle';
        const elementosJungleOnly = document.querySelectorAll('.jungle-only');
        const paginaJungle = document.getElementById('pagina2');

        // Atualizar elementos jungle-only
        elementosJungleOnly.forEach(el => {
            if (isJungle) {
                el.classList.remove('oculta');
            } else {
                el.classList.add('oculta');
            }
        });
        
        // CORREÇÃO CRÍTICA: Página 2 deve aparecer APENAS para Jungle
        if (paginaJungle) {
            if (isJungle) {
                paginaJungle.classList.remove('oculta');
            } else {
                paginaJungle.classList.add('oculta');
            }
        }

        // CORREÇÃO: Jungle-mid-only deve aparecer para Jungle E Mid
        const isJungleOrMid = ['Jungle', 'Mid'].includes(rotaSelecionada);
        const elementosJungleMid = document.querySelectorAll('.jungle-mid-only');
        
        elementosJungleMid.forEach(el => {
            if (isJungleOrMid) {
                el.classList.remove('oculta');
            } else {
                el.classList.add('oculta');
            }
        });

        // NOVO: Atualizar checklist também
        this.atualizarChecklistRota(rotaSelecionada);

        // Atualizar campo hidden
        const rotaHidden = document.getElementById('rotaSelecionadaHidden');
        if (rotaHidden) {
            rotaHidden.value = rotaSelecionada;
        }

        console.log(`👀 Visibilidade atualizada - Jungle: ${isJungle}, Jungle/Mid: ${isJungleOrMid}`);
        
        // CORREÇÃO: Se não for Jungle e estiver na página 2, voltar automaticamente para página 1
        if (!isJungle && this.paginaAtual === 2 && window.analyzer && window.analyzer.modulos.nav) {
            window.analyzer.modulos.nav.irParaPagina(1);
        }
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