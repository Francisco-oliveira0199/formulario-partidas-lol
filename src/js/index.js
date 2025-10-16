class WildRiftAnalyzer {
    constructor() {
        this.modulos = {};
    }

    init() {
        try {
            console.log('🚀 Inicializando Wild Rift Analyzer...');
            
            // Inicializar módulos na ordem correta
            this.modulos.estilos = new EstilosManager();
            this.modulos.nav = new Navigation();
            this.modulos.draft = new DraftSystem();
            this.modulos.objetivos = new ObjectiveSystem();
            this.modulos.template = new TemplateSystem();

            // Configurar sistemas
            this.configurarSistemas();
            
            console.log('✅ Wild Rift Analyzer inicializado com sucesso!');
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
        }
    }

    configurarSistemas() {
        // Inicializar cada módulo
        this.modulos.estilos.init();
        this.modulos.nav.init();
        this.modulos.draft.init();
        this.modulos.objetivos.init();
        this.modulos.template.init();
        
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