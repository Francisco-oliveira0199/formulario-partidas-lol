// index.js
class WildRiftAnalyzer {
    constructor() {
        this.modulos = {};
        this.emailDestino = 'nittocoach@gmail.com';
        this.emailjsConfig = {
            publicKey: "1bph11qy38lrIRSwK",
            serviceId: "service_n23atzb", 
            templateId: "template_1ob8gnk"
        };
        this.sistemaPronto = false;
    }

    init() {
        try {
            console.log('🚀 Inicializando Wild Rift Analyzer...');
            
            // Verificar se o DOM está realmente pronto
            if (document.readyState === 'loading') {
                console.log('📄 DOM ainda carregando, aguardando...');
                document.addEventListener('DOMContentLoaded', () => {
                    this.inicializarSistemas();
                });
            } else {
                console.log('📄 DOM já carregado, inicializando...');
                this.inicializarSistemas();
            }
            
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }

    inicializarSistemas() {
        console.log('🔧 Inicializando módulos...');
        
        // Ordem CRÍTICA de inicialização
        this.modulos.estilos = new EstilosManager();
        this.modulos.nav = new Navigation();
        this.modulos.draft = new DraftSystem(); // DEVE ser inicializado primeiro
        this.modulos.objetivos = new ObjectiveSystem();
        this.modulos.template = new TemplateSystem();
        this.modulos.upload = new UploadSystem();
        this.modulos.iaCoach = new IACoach();

        // Configurar sistemas com delay para garantir que tudo está pronto
        setTimeout(() => {
            this.configurarSistemas();
            this.configurarEnvioFormulario();
            this.sistemaPronto = true;
            
            console.log('✅ Wild Rift Analyzer inicializado com sucesso!');
            console.log('📧 EmailJS configurado com:', this.emailjsConfig);
            
            // Forçar verificação final do estado
            this.verificarEstadoInicial();
        }, 200);
    }

    configurarSistemas() {
        console.log('⚙️ Configurando sistemas...');
        
        // Inicializar cada módulo
        Object.values(this.modulos).forEach((modulo, index) => {
            if (modulo && typeof modulo.init === 'function') {
                console.log(`🔧 Inicializando módulo ${index + 1}: ${modulo.constructor.name}`);
                modulo.init();
            }
        });
        
        this.mostrarPaginaInicial();
    }

    verificarEstadoInicial() {
        console.log('🔍 Verificando estado inicial...');
        
        // Verificar se os drafts estão realmente ocultos
        setTimeout(() => {
            const draftsAliados = document.querySelectorAll('.draft-coluna:first-child .draft-field');
            const draftsVisiveis = Array.from(draftsAliados).filter(draft => 
                !draft.classList.contains('oculta')
            );
            
            console.log(`📊 Estado inicial - Drafts aliados: ${draftsAliados.length} total, ${draftsVisiveis.length} visíveis`);
            
            if (draftsVisiveis.length > 0) {
                console.warn('⚠️ ALERTA: Drafts aliados visíveis na inicialização!');
                // Forçar ocultação se necessário
                if (this.modulos.draft) {
                    this.modulos.draft.forcarAtualizacao();
                }
            } else {
                console.log('✅ Drafts aliados corretamente ocultos na inicialização');
            }
        }, 500);
    }

    mostrarPaginaInicial() {
        const primeiraPagina = document.getElementById('pagina1');
        if (primeiraPagina) {
            primeiraPagina.classList.add('ativo');
            console.log('📄 Página 1 ativada');
        }
    }

    configurarEnvioFormulario() {
        const formulario = document.getElementById('formularioAnalisePartida');
        if (formulario) {
            formulario.addEventListener('submit', (e) => {
                e.preventDefault();
                this.enviarAnalise();
            });
            console.log('📝 Formulário de envio configurado');
        }
    }

    async enviarAnalise() {
        try {
            console.log('📤 Iniciando envio da análise...');
            
            // Coletar dados do formulário
            const formData = this.coletarDadosFormulario();
            
            // Validar dados obrigatórios
            if (!this.validarDadosEnvio(formData)) {
                alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
                return;
            }

            // Mostrar loading no botão
            this.mostrarLoading(true);

            // PRIMEIRO: Enviar por email
            const sucessoEnvio = await this.enviarPorEmail(formData);
            
            if (sucessoEnvio) {
                // SEGUNDO: Gerar análise da IA APÓS envio bem-sucedido
                const dados = {};
                for (let [key, value] of formData.entries()) {
                    if (typeof value === 'string') {
                        dados[key] = value;
                    }
                }
                
                const relatorioIA = this.modulos.iaCoach.analisarPartida(dados);
                
                // TERCEIRO: Mostrar relatório da IA na página de agradecimento
                this.mostrarRelatorioPosEnvio(relatorioIA, sucessoEnvio);
                
            } else {
                alert('Erro ao enviar análise. Tente novamente.');
            }
            
        } catch (error) {
            console.error('❌ Erro ao enviar análise:', error);
            alert('Erro ao enviar análise. Tente novamente.');
        } finally {
            this.mostrarLoading(false);
        }
    }

    mostrarRelatorioPosEnvio(relatorioIA, sucessoEnvio) {
        this.irParaPaginaAgradecimento();
        
        setTimeout(() => {
            this.preencherRelatorioAgradecimento(relatorioIA);
        }, 500);
    }

    irParaPaginaAgradecimento() {
        document.querySelectorAll('.pagina').forEach(pagina => {
            pagina.classList.add('oculta');
        });
        
        const paginaAgradecimento = document.getElementById('paginaAgradecimento');
        if (paginaAgradecimento) {
            paginaAgradecimento.classList.remove('oculta');
            paginaAgradecimento.classList.add('ativo');
        }
        
        const containerPrincipal = document.querySelector('.container');
        if (containerPrincipal) {
            containerPrincipal.style.display = 'none';
        }
        
        window.scrollTo(0, 0);
    }

    preencherRelatorioAgradecimento(relatorioIA) {
        const conteudoRelatorio = document.getElementById('conteudoRelatorio');
        const scoreRelatorio = document.getElementById('scoreRelatorio');
        
        if (!conteudoRelatorio || !scoreRelatorio) return;
        
        scoreRelatorio.textContent = relatorioIA.score;
        
        const htmlRelatorio = this.gerarHTMLResumido(relatorioIA);
        conteudoRelatorio.innerHTML = htmlRelatorio;
        
        setTimeout(() => {
            conteudoRelatorio.style.opacity = '1';
            conteudoRelatorio.style.transform = 'translateY(0)';
        }, 100);
    }

    gerarHTMLResumido(relatorioIA) {
        const pontosFortesHTML = relatorioIA.pontosFortes
            .map(ponto => `<li>${ponto}</li>`)
            .join('');
        
        const areasMelhoriaHTML = relatorioIA.areasMelhoria
            .slice(0, 3)
            .map(area => `<li>${area.acao}</li>`)
            .join('');
        
        const sugestoesHTML = relatorioIA.sugestoesPriorizadas
            .map((sugestao, index) => `<li>${sugestao}</li>`)
            .join('');
        
        return `
            <div class="resumo-ia">
                <h3> Seus Pontos Fortes</h3>
                <ul class="pontos-fortes">
                    ${pontosFortesHTML}
                </ul>
                
                <h3> Áreas para Melhorar</h3>
                <ul class="areas-melhoria">
                    ${areasMelhoriaHTML}
                </ul>
                
                <h3> Ações Recomendadas</h3>
                <ul class="sugestoes">
                    ${sugestoesHTML}
                </ul>
                
                <div class="meta-destaque">
                    ${relatorioIA.metaProximaPartida}
                </div>
                
                <div style="text-align: center; margin-top: 15px; opacity: 0.7; font-size: 12px;">
                    ${relatorioIA.totalProblemas} áreas identificadas • 
                    ${Object.keys(relatorioIA.problemasPorCategoria).length} categorias
                </div>
            </div>
        `;
    }

    iniciarNovaAnalise() {
        const containerPrincipal = document.querySelector('.container');
        if (containerPrincipal) {
            containerPrincipal.style.display = 'block';
        }
        
        this.modulos.nav.irParaPagina(1);
        
        this.limparFormulario();
    }

    compartilharRelatorio() {
        alert('Funcionalidade de compartilhamento em desenvolvimento!');
    }

    coletarDadosFormulario() {
        const formData = new FormData(document.getElementById('formularioAnalisePartida'));
        
        if (this.modulos.upload) {
            this.modulos.upload.coletarDadosImagens(formData);
        }
        
        formData.append('timestamp', new Date().toISOString());
        formData.append('user_agent', navigator.userAgent);
        
        return formData;
    }

    validarDadosEnvio(dados) {
        const camposObrigatorios = [
            'nome', 'nickname', 'elo', 'campeao', 'rota',
            'draft_inimigo_top', 'draft_inimigo_jungle', 'draft_inimigo_mid', 
            'draft_inimigo_adc', 'draft_inimigo_sup',
            'condicao_vitoria_time', 'condicao_vitoria_campeao',
            'controle_visao', 'resumo_partida', 'momentos_chave', 'aprendizados'
        ];

        return camposObrigatorios.every(campo => {
            const valor = dados.get ? dados.get(campo) : dados[campo];
            return valor && valor.toString().trim() !== '';
        });
    }

    async enviarPorEmail(formData) {
        return await this.enviarEmailReal(formData);
    }

    async enviarEmailReal(formData) {
        try {
            emailjs.init(this.emailjsConfig.publicKey);

            const dados = {};
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    dados[key] = `Arquivo: ${value.name} (${value.size} bytes)`;
                } else {
                    dados[key] = value;
                }
            }

            const templateParams = {
                from_name: dados.nickname || 'Jogador Wild Rift',
                from_email: 'sistema@nittocoach.com',
                reply_to: 'nao-responder@nittocoach.com',
                to_email: this.emailDestino,
                
                nome: dados.nome || 'Não informado',
                nickname: dados.nickname || 'Anônimo',
                elo: dados.elo || 'Não informado',
                campeao: dados.campeao || 'Não informado',
                rota: dados.rota || 'Não informado',
                data_envio: new Date().toLocaleString('pt-BR'),
                
                // Draft aliado
                draft_aliado_top: dados.draft_aliado_top || 'Não preenchido',
                draft_aliado_jungle: dados.draft_aliado_jungle || 'Não preenchido',
                draft_aliado_mid: dados.draft_aliado_mid || 'Não preenchido',
                draft_aliado_adc: dados.draft_aliado_adc || 'Não preenchido',
                draft_aliado_sup: dados.draft_aliado_sup || 'Não preenchido',
                
                // Draft inimigo
                draft_inimigo_top: dados.draft_inimigo_top || 'Não informado',
                draft_inimigo_jungle: dados.draft_inimigo_jungle || 'Não informado',
                draft_inimigo_mid: dados.draft_inimigo_mid || 'Não informado',
                draft_inimigo_adc: dados.draft_inimigo_adc || 'Não informado',
                draft_inimigo_sup: dados.draft_inimigo_sup || 'Não informado',
                
                // Condições de vitória
                condicao_vitoria_time: dados.condicao_vitoria_time || 'Não informado',
                condicao_vitoria_campeao: dados.condicao_vitoria_campeao || 'Não informado',
                
                // Vantagens
                vantagem_time_comeco: dados.vantagem_time_comeco || 'Não',
                vantagem_time_meio: dados.vantagem_time_meio || 'Não',
                vantagem_time_final: dados.vantagem_time_final || 'Não',
                vantagem_campeao_comeco: dados.vantagem_campeao_comeco || 'Não',
                vantagem_campeao_meio: dados.vantagem_campeao_meio || 'Não',
                vantagem_campeao_final: dados.vantagem_campeao_final || 'Não',
                
                // Jungle específico
                pathing_inicial: dados.pathing_inicial || 'Não aplicável',
                skill_order: dados.skill_order || 'Não aplicável',
                ordem_campos: dados.ordem_campos || 'Não aplicável',
                combos_clear: dados.combos_clear || 'Não aplicável',
                
                // Ganks
                rota_alvo: dados.rota_alvo || 'Não aplicável',
                estado_inimigo: dados.estado_inimigo || 'Não informado',
                recursos_queimados: dados.recursos_queimados || 'Não informado',
                resultado_gank: dados.resultado_gank || 'Não informado',
                ganhos: dados.ganhos || 'Não informado',
                perdas: dados.perdas || 'Não informado',
                
                // Objetivos
                objetivo_125_tipo: dados.objetivo_125_tipo || 'Não capturado',
                objetivo_125_time: dados.objetivo_125_time || 'Nenhum',
                objetivo_600_tipo_1: dados.objetivo_600_tipo_1 || 'Não capturado',
                objetivo_600_tipo_2: dados.objetivo_600_tipo_2 || 'Não capturado',
                objetivo_600_time: dados.objetivo_600_time || 'Nenhum',
                objetivo_1100_tipo: dados.objetivo_1100_tipo || 'Não capturado',
                objetivo_1100_time: dados.objetivo_1100_time || 'Nenhum',
                objetivo_1500_tipo: dados.objetivo_1500_tipo || 'Não capturado',
                objetivo_1500_time: dados.objetivo_1500_time || 'Nenhum',
                objetivo_1600_tipo: dados.objetivo_1600_tipo || 'Não capturado',
                objetivo_1600_time: dados.objetivo_1600_time || 'Nenhum',
                objetivo_1800_tipo: dados.objetivo_1800_tipo || 'Não capturado',
                objetivo_1800_time: dados.objetivo_1800_time || 'Nenhum',
                
                controle_visao: dados.controle_visao || 'Não informado',
                
                // Erros
                situacao_erro: dados.situacao_erro || 'Não informado',
                causa_erro: dados.causa_erro || 'Não informado',
                consequencia_erro: dados.consequencia_erro || 'Não informado',
                prevencao_erro: dados.prevencao_erro || 'Não informado',
                
                // Pós-jogo
                resumo_partida: dados.resumo_partida || 'Não informado',
                rota_impactante: dados.rota_impactante || 'Não aplicável',
                momentos_chave: dados.momentos_chave || 'Não informado',
                aprendizados: dados.aprendizados || 'Não informado',
                
                // Checklist
                check_pathing: dados.check_pathing || 'Não',
                check_recursos: dados.check_recursos || 'Não',
                check_trocas: dados.check_trocas || 'Não',
                check_visao: dados.check_visao || 'Não',
                check_aprendizados: dados.check_aprendizados || 'Não',
                
                subject_suffix: `[WR-${this.gerarIdAnalise()}]`,
                priority: 'high',
                category: 'analise_partida',
                template_type: 'analise_completa',
                system_version: '2.0',
                analysis_timestamp: new Date().toISOString()
            };

            console.log('📧 Enviando email via EmailJS...');
            
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId, 
                templateParams
            );

            console.log('✅ Email enviado com sucesso!', response);
            return response.status === 200;
            
        } catch (error) {
            console.error('❌ Erro ao enviar email:', error);
            return await this.enviarBackupEmail(formData);
        }
    }

    gerarIdAnalise() {
        const timestamp = new Date().getTime().toString(36);
        const random = Math.random().toString(36).substr(2, 5);
        return `${timestamp}-${random}`.toUpperCase();
    }

    async enviarBackupEmail(formData) {
        try {
            console.log('🔄 Tentando método de backup...');
            
            this.salvarDadosLocalmente(formData);
            
            return await this.enviarViaFormSubmit(formData);
            
        } catch (error) {
            console.error('❌ Todos os métodos falharam:', error);
            return false;
        }
    }

    async enviarViaFormSubmit(formData) {
        try {
            const dados = {};
            for (let [key, value] of formData.entries()) {
                if (typeof value === 'string') {
                    dados[key] = value;
                }
            }
            
            const response = await fetch('https://formsubmit.co/ajax/nittocoach@gmail.com', {
                method: 'POST',
                body: JSON.stringify(dados),
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            return response.ok;
        } catch (error) {
            console.error('❌ FormSubmit falhou:', error);
            return false;
        }
    }

    salvarDadosLocalmente(formData) {
        try {
            const dados = {};
            for (let [key, value] of formData.entries()) {
                if (typeof value === 'string') {
                    dados[key] = value;
                }
            }
            
            const analises = JSON.parse(localStorage.getItem('analises_backup') || '[]');
            analises.push({
                ...dados,
                timestamp: new Date().toISOString(),
                id: this.gerarIdAnalise()
            });
            
            localStorage.setItem('analises_backup', JSON.stringify(analises));
            console.log('💾 Dados salvos localmente');
        } catch (error) {
            console.error('❌ Erro ao salvar localmente:', error);
        }
    }

    mostrarLoading(mostrar) {
        const btnEnviar = document.querySelector('.btn-enviar');
        if (btnEnviar) {
            if (mostrar) {
                btnEnviar.classList.add('carregando');
                btnEnviar.disabled = true;
                btnEnviar.textContent = 'Enviando...';
            } else {
                btnEnviar.classList.remove('carregando');
                btnEnviar.disabled = false;
                btnEnviar.textContent = 'Enviar Análise';
            }
        }
    }

    limparFormulario() {
        const formulario = document.getElementById('formularioAnalisePartida');
        if (formulario) {
            formulario.reset();
            
            if (this.modulos.upload) {
                document.querySelectorAll('.upload-input').forEach(input => {
                    input.value = '';
                });
                document.querySelectorAll('.upload-preview').forEach(preview => {
                    preview.classList.add('oculta');
                });
                document.querySelectorAll('.upload-placeholder').forEach(placeholder => {
                    placeholder.classList.remove('oculta');
                });
            }
            
            // Resetar drafts aliados
            if (this.modulos.draft) {
                setTimeout(() => {
                    this.modulos.draft.inicializarDrafts();
                    this.modulos.draft.rotaSelecionada = null;
                }, 100);
            }
            
            if (window.analyzer && window.analyzer.modulos.nav) {
                window.analyzer.modulos.nav.irParaPagina(1);
            }
        }
    }
}

// Inicialização robusta
console.log('🔧 Preparando inicialização do Wild Rift Analyzer...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM completamente carregado, iniciando aplicação...');
    window.analyzer = new WildRiftAnalyzer();
    window.analyzer.init();
});

// Fallback para garantir que a aplicação inicie
window.addEventListener('load', () => {
    if (!window.analyzer) {
        console.log('🔄 Reinicializando aplicação via window.load...');
        window.analyzer = new WildRiftAnalyzer();
        window.analyzer.init();
    }
});