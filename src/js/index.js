class WildRiftAnalyzer {
    constructor() {
        this.modulos = {};
        this.emailDestino = 'nittocoach@gmail.com';
        this.emailjsConfig = {
            publicKey: "1bph11qy38lrIRSwK",
            serviceId: "service_n23atzb", 
            templateId: "template_1ob8gnk"
        };
    }

    init() {
        try {
            console.log('Inicializando Wild Rift Analyzer...');
            
            // Inicializar módulos na ordem correta
            this.modulos.estilos = new EstilosManager();
            this.modulos.nav = new Navigation();
            this.modulos.draft = new DraftSystem();
            this.modulos.objetivos = new ObjectiveSystem();
            this.modulos.template = new TemplateSystem();
            this.modulos.upload = new UploadSystem();

            // Configurar sistemas
            this.configurarSistemas();
            this.configurarEnvioFormulario();
            this.configurarEmailContato();
            
            console.log('Wild Rift Analyzer inicializado com sucesso!');
            console.log('EmailJS configurado com:', this.emailjsConfig);
        } catch (error) {
            console.error('Erro na inicialização:', error);
        }
    }

    configurarEmailContato() {
        const emailInput = document.getElementById('email_contato_visivel');
        const emailHidden = document.getElementById('emailContatoHidden');
        
        if (emailInput && emailHidden) {
            emailInput.addEventListener('input', (e) => {
                if (e.target.value.trim()) {
                    emailHidden.value = e.target.value;
                } else {
                    emailHidden.value = 'nao-responder@nittocoach.com';
                }
            });
        }
    }

    configurarEnvioFormulario() {
        const formulario = document.getElementById('formularioAnalisePartida');
        if (formulario) {
            formulario.addEventListener('submit', (e) => {
                e.preventDefault();
                this.enviarAnalise();
            });
        }
    }

    async enviarAnalise() {
        try {
            console.log('Iniciando envio da análise...');
            
            // Coletar dados do formulário
            const formData = this.coletarDadosFormulario();
            
            // Validar dados obrigatórios
            if (!this.validarDadosEnvio(formData)) {
                alert('Por favor, preencha todos os campos obrigatórios antes de enviar.');
                return;
            }

            // Mostrar loading no botão
            this.mostrarLoading(true);

            // Enviar por email
            const sucesso = await this.enviarPorEmail(formData);
            
            if (sucesso) {
                alert('Análise enviada com sucesso para: ' + this.emailDestino);
                this.limparFormulario();
            } else {
                alert('Análise salva localmente. Tente enviar novamente mais tarde.');
            }
            
        } catch (error) {
            console.error('Erro ao enviar análise:', error);
            alert('Erro ao enviar análise. Os dados foram salvos localmente.');
        } finally {
            this.mostrarLoading(false);
        }
    }

    coletarDadosFormulario() {
        const formData = new FormData(document.getElementById('formularioAnalisePartida'));
        
        // Adicionar imagens ao FormData
        if (this.modulos.upload) {
            this.modulos.upload.coletarDadosImagens(formData);
        }
        
        // Adicionar metadados
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
            // Inicializar EmailJS COM SUAS CREDENCIAIS
            emailjs.init(this.emailjsConfig.publicKey);

            // Converter FormData para objeto
            const dados = {};
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    dados[key] = `Arquivo: ${value.name} (${value.size} bytes)`;
                } else {
                    dados[key] = value;
                }
            }

            // Preparar template parameters com TODOS os campos
            const templateParams = {
                // CAMPOS DE ENVIO PRINCIPAIS
                from_name: dados.nickname || 'Jogador Wild Rift',
                from_email: 'sistema@nittocoach.com',
                reply_to: dados.email_contato || 'nao-responder@nittocoach.com',
                to_email: this.emailDestino,
                cc: 'backup@nittocoach.com',
                bcc: 'arquivo@nittocoach.com',
                
                // DADOS DA ANÁLISE
                nome: dados.nome || 'Não informado',
                nickname: dados.nickname || 'Anônimo',
                elo: dados.elo || 'Não informado',
                campeao: dados.campeao || 'Não informado',
                rota: dados.rota || 'Não informado',
                data_envio: new Date().toLocaleString('pt-BR'),
                
                // DRAFTS
                draft_aliado_top: dados.draft_aliado_top || 'Não preenchido',
                draft_aliado_jungle: dados.draft_aliado_jungle || 'Não preenchido',
                draft_aliado_mid: dados.draft_aliado_mid || 'Não preenchido',
                draft_aliado_adc: dados.draft_aliado_adc || 'Não preenchido',
                draft_aliado_sup: dados.draft_aliado_sup || 'Não preenchido',
                draft_inimigo_top: dados.draft_inimigo_top || 'Não informado',
                draft_inimigo_jungle: dados.draft_inimigo_jungle || 'Não informado',
                draft_inimigo_mid: dados.draft_inimigo_mid || 'Não informado',
                draft_inimigo_adc: dados.draft_inimigo_adc || 'Não informado',
                draft_inimigo_sup: dados.draft_inimigo_sup || 'Não informado',

                // CONDIÇÕES DE VITÓRIA
                condicao_vitoria_time: dados.condicao_vitoria_time || 'Não informado',
                condicao_vitoria_campeao: dados.condicao_vitoria_campeao || 'Não informado',

                // VANTAGENS POR TEMPO
                vantagem_time_comeco: dados.vantagem_time_comeco === 'Sim' ? '✅ Sim' : '❌ Não',
                vantagem_time_meio: dados.vantagem_time_meio === 'Sim' ? '✅ Sim' : '❌ Não',
                vantagem_time_final: dados.vantagem_time_final === 'Sim' ? '✅ Sim' : '❌ Não',
                vantagem_campeao_comeco: dados.vantagem_campeao_comeco === 'Sim' ? '✅ Sim' : '❌ Não',
                vantagem_campeao_meio: dados.vantagem_campeao_meio === 'Sim' ? '✅ Sim' : '❌ Não',
                vantagem_campeao_final: dados.vantagem_campeao_final === 'Sim' ? '✅ Sim' : '❌ Não',
                vantagem_time_comeco_class: dados.vantagem_time_comeco === 'Sim' ? 'checked' : 'unchecked',
                vantagem_time_meio_class: dados.vantagem_time_meio === 'Sim' ? 'checked' : 'unchecked',
                vantagem_time_final_class: dados.vantagem_time_final === 'Sim' ? 'checked' : 'unchecked',
                vantagem_campeao_comeco_class: dados.vantagem_campeao_comeco === 'Sim' ? 'checked' : 'unchecked',
                vantagem_campeao_meio_class: dados.vantagem_campeao_meio === 'Sim' ? 'checked' : 'unchecked',
                vantagem_campeao_final_class: dados.vantagem_campeao_final === 'Sim' ? 'checked' : 'unchecked',

                // JUNGLE
                pathing_inicial: dados.pathing_inicial || '',
                skill_order: dados.skill_order || '',
                ordem_campos: dados.ordem_campos || '',
                combos_clear: dados.combos_clear || '',

                // GANKS
                rota_alvo: dados.rota_alvo || '',
                estado_inimigo: dados.estado_inimigo || 'Não informado',
                recursos_queimados: dados.recursos_queimados || 'Não informado',
                resultado_gank: dados.resultado_gank || 'Não informado',
                ganhos: dados.ganhos || 'Não informado',
                perdas: dados.perdas || 'Não informado',

                // OBJETIVOS
                objetivo_125_ativo: dados.objetivo_125_ativo === 'on',
                objetivo_125_tipo: dados.objetivo_125_tipo || '',
                objetivo_125_time: dados.objetivo_125_time || '',
                objetivo_600_ativo: dados.objetivo_600_ativo === 'on',
                objetivo_600_tipo_1: dados.objetivo_600_tipo_1 || '',
                objetivo_600_tipo_2: dados.objetivo_600_tipo_2 || '',
                objetivo_600_time: dados.objetivo_600_time || '',
                objetivo_1100_ativo: dados.objetivo_1100_ativo === 'on',
                objetivo_1100_tipo: dados.objetivo_1100_tipo || '',
                objetivo_1100_time: dados.objetivo_1100_time || '',
                objetivo_1500_ativo: dados.objetivo_1500_ativo === 'on',
                objetivo_1500_tipo: dados.objetivo_1500_tipo || '',
                objetivo_1500_time: dados.objetivo_1500_time || '',
                objetivo_1600_ativo: dados.objetivo_1600_ativo === 'on',
                objetivo_1600_tipo: dados.objetivo_1600_tipo || '',
                objetivo_1600_time: dados.objetivo_1600_time || '',
                objetivo_1800_ativo: dados.objetivo_1800_ativo === 'on',
                objetivo_1800_tipo: dados.objetivo_1800_tipo || '',
                objetivo_1800_time: dados.objetivo_1800_time || '',

                // VISÃO
                controle_visao: dados.controle_visao || 'Não informado',

                // ERROS
                situacao_erro: dados.situacao_erro || 'Não informado',
                causa_erro: dados.causa_erro || 'Não informado',
                consequencia_erro: dados.consequencia_erro || 'Não informado',
                prevencao_erro: dados.prevencao_erro || 'Não informado',

                // PÓS-JOGO
                resumo_partida: dados.resumo_partida || 'Não informado',
                rota_impactante: dados.rota_impactante || '',
                momentos_chave: dados.momentos_chave || 'Não informado',
                aprendizados: dados.aprendizados || 'Não informado',

                // CHECKLIST
                check_pathing: dados.check_pathing === 'Sim' ? '✅' : '❌',
                check_recursos: dados.check_recursos === 'Sim' ? '✅' : '❌',
                check_trocas: dados.check_trocas === 'Sim' ? '✅' : '❌',
                check_visao: dados.check_visao === 'Sim' ? '✅' : '❌',
                check_aprendizados: dados.check_aprendizados === 'Sim' ? '✅' : '❌',
                check_pathing_class: dados.check_pathing === 'Sim' ? 'checked' : 'unchecked',
                check_recursos_class: dados.check_recursos === 'Sim' ? 'checked' : 'unchecked',
                check_trocas_class: dados.check_trocas === 'Sim' ? 'checked' : 'unchecked',
                check_visao_class: dados.check_visao === 'Sim' ? 'checked' : 'unchecked',
                check_aprendizados_class: dados.check_aprendizados === 'Sim' ? 'checked' : 'unchecked',

                // METADADOS
                subject_suffix: `[WR-${this.gerarIdAnalise()}]`,
                priority: 'high',
                category: 'analise_partida',
                template_type: 'analise_completa',
                system_version: '2.0',
                analysis_timestamp: new Date().toISOString()
            };

            console.log('Enviando email via EmailJS...');
            console.log('Usando Service ID:', this.emailjsConfig.serviceId);
            console.log('Usando Template ID:', this.emailjsConfig.templateId);
            
            const response = await emailjs.send(
                this.emailjsConfig.serviceId,
                this.emailjsConfig.templateId, 
                templateParams
            );

            console.log('Email enviado com sucesso!', response);
            return response.status === 200;
            
        } catch (error) {
            console.error('Erro ao enviar email:', error);
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
            console.log('Tentando método de backup...');
            
            // Salvar dados localmente
            this.salvarDadosLocalmente(formData);
            
            // Tentar FormSubmit como fallback
            return await this.enviarViaFormSubmit(formData);
            
        } catch (error) {
            console.error('Todos os métodos falharam:', error);
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
            console.error('FormSubmit falhou:', error);
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
            console.log('Dados salvos localmente');
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
            
            // Resetar uploads
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
            
            // Voltar para a primeira página
            if (window.analyzer && window.analyzer.modulos.nav) {
                window.analyzer.modulos.nav.irParaPagina(1);
            }
        }
    }

    configurarSistemas() {
        // Inicializar cada módulo
        Object.values(this.modulos).forEach(modulo => {
            if (modulo && typeof modulo.init === 'function') {
                modulo.init();
            }
        });
        
        // Garantir que a primeira página esteja visível
        this.mostrarPaginaInicial();
    }

    mostrarPaginaInicial() {
        const primeiraPagina = document.getElementById('pagina1');
        if (primeiraPagina) {
            primeiraPagina.classList.add('ativo');
        }
        
        // Garantir que drafts aliados estejam ocultos inicialmente
        const draftsAliados = document.querySelectorAll('.draft-field');
        draftsAliados.forEach(draft => {
            draft.classList.add('oculta');
        });
    }
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando aplicação...');
    window.analyzer = new WildRiftAnalyzer();
    window.analyzer.init();
});

// Fallback para garantir que a aplicação inicie
window.addEventListener('load', () => {
    if (!window.analyzer) {
        console.log('Reinicializando aplicação...');
        window.analyzer = new WildRiftAnalyzer();
        window.analyzer.init();
    }
});