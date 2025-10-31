// draft.js - VERSÃO CORRIGIDA E SIMPLIFICADA
class DraftSystem {
    constructor() {
        this.rotas = {
            'Top': 'top',
            'Jungle': 'jungle', 
            'Mid': 'mid',
            'Adc': 'adc',
            'Sup': 'sup'
        };
        this.rotaSelecionada = null;
        this.paginaAtual = 1;
    }

    init() {
        console.log('🎯 INICIANDO DRAFT SYSTEM');
        
        this.configurarEventos();
        this.inicializarDrafts();
        this.inicializarChecklist();
        
        console.log('✅ DraftSystem inicializado');
    }

    configurarEventos() {
        console.log('🔧 Configurando eventos...');
        
        // Evento para mudança de rota
        document.querySelectorAll('input[name="rota"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.rotaSelecionada = e.target.value;
                    console.log('🎯 ROTA SELECIONADA:', this.rotaSelecionada);
                    this.atualizarDraftAliado();
                    this.atualizarVisibilidadeRota();
                }
            });
        });

        // Verificar se já tem rota selecionada
        setTimeout(() => {
            const rotaPreSelecionada = document.querySelector('input[name="rota"]:checked');
            if (rotaPreSelecionada) {
                this.rotaSelecionada = rotaPreSelecionada.value;
                console.log('🔍 Rota pré-selecionada:', this.rotaSelecionada);
                this.atualizarDraftAliado();
                this.atualizarVisibilidadeRota();
            }
        }, 100);
    }

    inicializarDrafts() {
        console.log('📋 INICIALIZAÇÃO: Ocultando TODOS os drafts aliados inicialmente');
        
        // Inicialmente ocultar todos os drafts aliados
        const draftAliadoFields = this.getDraftAliadoFields();
        draftAliadoFields.forEach(field => {
            this.ocultarCampo(field);
        });
        
        console.log(`🚫 ${draftAliadoFields.length} drafts aliados ocultos`);
    }

    atualizarDraftAliado() {
        if (!this.rotaSelecionada) {
            console.log('⏳ Aguardando seleção de rota...');
            return;
        }
        
        console.log('🔄 ATUALIZANDO DRAFT para rota:', this.rotaSelecionada);
        
        const draftAliadoFields = this.getDraftAliadoFields();
        let mostrados = 0;
        let ocultados = 0;
        
        // LÓGICA CORRIGIDA: Mostrar APENAS as rotas que NÃO são a do jogador
        draftAliadoFields.forEach(field => {
            const rotaField = field.getAttribute('data-rota');
            const rotaCorrespondente = this.getRotaPorId(rotaField);
            
            if (!rotaCorrespondente) {
                console.warn('⚠️ Rota não encontrada para campo:', rotaField);
                return;
            }
            
            if (rotaCorrespondente !== this.rotaSelecionada) {
                // MOSTRAR esta rota (não é a do jogador)
                this.mostrarCampo(field);
                mostrados++;
            } else {
                // OCULTAR esta rota (é a do jogador)
                this.ocultarCampo(field);
                ocultados++;
            }
        });
        
        console.log(`🎯 RESULTADO: ${mostrados} mostrados, ${ocultados} ocultados`);
    }

    mostrarCampo(campo) {
        campo.classList.remove('oculta');
    }

    ocultarCampo(campo) {
        campo.classList.add('oculta');
    }

    getDraftAliadoFields() {
        return document.querySelectorAll('.draft-coluna:first-child .draft-field');
    }

    getRotaPorId(idRota) {
        return Object.keys(this.rotas).find(nome => this.rotas[nome] === idRota);
    }

    inicializarChecklist() {
        const checklistPathing = document.getElementById('checklistPathingContainer');
        if (checklistPathing) {
            checklistPathing.classList.add('oculta');
        }
    }

    atualizarVisibilidadeRota() {
        if (!this.rotaSelecionada) return;

        const isJungle = this.rotaSelecionada === 'Jungle';
        const isJungleOrMid = ['Jungle', 'Mid'].includes(this.rotaSelecionada);
        const isTopAdcSup = ['Top', 'Adc', 'Sup'].includes(this.rotaSelecionada);

        console.log(`🔄 Atualizando visibilidade - Rota: ${this.rotaSelecionada}, Jungle: ${isJungle}, Jungle/Mid: ${isJungleOrMid}`);

        // Elementos específicos de Jungle
        document.querySelectorAll('.jungle-only').forEach(el => {
            el.classList.toggle('oculta', !isJungle);
        });

        // Elementos específicos de Jungle e Mid
        document.querySelectorAll('.jungle-mid-only').forEach(el => {
            el.classList.toggle('oculta', !isJungleOrMid);
        });

        // CORREÇÃO: Para Top/Adc/Sup, garantir que campos de ganks sejam opcionais
        if (isTopAdcSup && this.paginaAtual === 3) {
            const camposGanks = ['estadoInimigo', 'recursosQueimados', 'resultadoGank', 'ganhos', 'perdas'];
            camposGanks.forEach(id => {
                const campo = document.getElementById(id);
                if (campo) {
                    campo.removeAttribute('required');
                    // Garantir que o placeholder não tenha indicação de obrigatório
                    if (!campo.placeholder.includes('(opcional')) {
                        campo.placeholder = campo.placeholder + ' (opcional)';
                    }
                }
            });
        }

        // Atualizar páginas específicas
        const paginaJungle = document.getElementById('pagina2');
        if (paginaJungle) {
            paginaJungle.classList.toggle('oculta', !isJungle);
        }

        // Atualizar campo hidden
        const rotaHidden = document.getElementById('rotaSelecionadaHidden');
        if (rotaHidden) {
            rotaHidden.value = this.rotaSelecionada;
        }

        this.atualizarChecklistRota();
    }

    atualizarChecklistRota() {
        if (!this.rotaSelecionada) return;

        const isJungle = this.rotaSelecionada === 'Jungle';
        const checklistPathing = document.getElementById('checklistPathingContainer');
        
        if (checklistPathing) {
            if (isJungle) {
                checklistPathing.classList.remove('oculta');
            } else {
                checklistPathing.classList.add('oculta');
                const checkbox = checklistPathing.querySelector('input[type="checkbox"]');
                if (checkbox) checkbox.checked = false;
            }
        }
    }

    // Método para forçar atualização se necessário
    forcarAtualizacao() {
        if (this.rotaSelecionada) {
            this.atualizarDraftAliado();
            this.atualizarVisibilidadeRota();
        }
    }
}