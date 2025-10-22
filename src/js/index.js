class WildRiftAnalyzer {
    constructor() {
        this.modulos = {};
        this.emailDestino = 'nittocoach@gmail.com';
    }

    init() {
        try {
            console.log(' Inicializando Wild Rift Analyzer...');
            
            // Inicializar módulos na ordem correta
            this.modulos.estilos = new EstilosManager();
            this.modulos.nav = new Navigation();
            this.modulos.draft = new DraftSystem();
            this.modulos.objetivos = new ObjectiveSystem();
            this.modulos.template = new TemplateSystem();
            this.modulos.upload = new UploadSystem(); // NOVO MÓDULO

            // Configurar sistemas
            this.configurarSistemas();
            this.configurarEnvioFormulario();
            
            console.log('✅ Wild Rift Analyzer inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
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

            // Enviar por email
            await this.enviarPorEmail(formData);
            
            alert('✅ Análise enviada com sucesso para: ' + this.emailDestino);
            this.limparFormulario();
            
        } catch (error) {
            console.error('❌ Erro ao enviar análise:', error);
            alert('❌ Erro ao enviar análise. Tente novamente.');
        }
    }

    coletarDadosFormulario() {
        const formData = new FormData(document.getElementById('formularioAnalisePartida'));
        
        // Adicionar imagens ao FormData
        if (this.modulos.upload) {
            this.modulos.upload.coletarDadosImagens(formData);
        }
        
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
            const valor = dados[campo];
            return valor && valor.toString().trim() !== '';
        });
    }

    async simularEnvioEmail(dados) {
        // Simular processamento
        console.log('📧 Enviando análise para:', this.emailDestino);
        console.log('📊 Dados coletados:', dados);
        
        // Simular delay de processamento
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Aqui você integraria com uma API real de email
        // Exemplo: EmailJS, SendGrid, ou backend próprio
        console.log('✅ Análise enviada com sucesso!');
        
        // Para implementação real, você precisaria:
        // 1. Uma API backend para enviar emails
        // 2. Ou usar serviços como EmailJS, SendGrid, etc.
        // 3. Gerar PDF com bibliotecas como jsPDF ou html2pdf.js
    }

    limparFormulario() {
        const formulario = document.getElementById('formularioAnalisePartida');
        if (formulario) {
            formulario.reset();
            
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
    console.log('📄 DOM carregado, iniciando aplicação...');
    window.analyzer = new WildRiftAnalyzer();
    window.analyzer.init();
});

// Fallback para garantir que a aplicação inicie
window.addEventListener('load', () => {
    if (!window.analyzer) {
        console.log('🔄 Reinicializando aplicação...');
        window.analyzer = new WildRiftAnalyzer();
        window.analyzer.init();
    }
});