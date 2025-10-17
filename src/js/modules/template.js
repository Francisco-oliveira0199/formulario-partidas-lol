class TemplateSystem {
    constructor() {
        this.templates = {
            'jungle_early': {
                nome: 'Jungle - Early Game Aggressive',
                pathing: "Red Buff → Galinhas → Lobo → Caranguejo do Rio → Gank",
                skillOrder: "Q → W → E",
                condicaoTime: "Ganhar early game com ganks agressivos e controle de objetivos",
                condicaoCampeao: "Criar vantagem early com ganks eficientes e invades"
            },
            'jungle_farm': {
                nome: 'Jungle - Farm Focus', 
                pathing: "Full Clear → Back → Objetivos",
                skillOrder: "Q → E → W",
                condicaoTime: "Chegar ao late game com vantagem de farm",
                condicaoCampeao: "Maximizar farm e chegar aos power spikes rapidamente"
            },
            'mid_roam': {
                nome: 'Mid - Roam Focus',
                condicaoTime: "Criar vantagem através de roams eficientes",
                condicaoCampeao: "Usar mobilidade para impactar outras rotas"
            }
        };
    }

    init() {
        this.configurarTemplates();
        console.log('✅ TemplateSystem inicializado');
    }

    configurarTemplates() {
        document.addEventListener('change', (e) => {
            if (e.target.name === 'rota') {
                this.toggleSistemaTemplates(e.target.value);
            }
        });
    }

    toggleSistemaTemplates(rota) {
        const temTemplates = rota === 'Jungle';
        
        if (!temTemplates) {
            const seletor = document.getElementById('seletorTemplate');
            if (seletor) {
                seletor.value = '';
            }
        }
    }

    aplicarTemplate(templateId) {
        const template = this.templates[templateId];
        if (!template) return;

        if (template.pathing) {
            const pathingInput = document.querySelector('textarea[name="pathing_inicial"]');
            if (pathingInput) pathingInput.value = template.pathing;
        }

        if (template.skillOrder) {
            const skillInput = document.querySelector('input[name="skill_order"]');
            if (skillInput) skillInput.value = template.skillOrder;
        }

        if (template.condicaoTime) {
            const condicaoTime = document.querySelector('textarea[name="condicao_vitoria_time"]');
            if (condicaoTime) condicaoTime.value = template.condicaoTime;
        }

        if (template.condicaoCampeao) {
            const condicaoCampeao = document.querySelector('textarea[name="condicao_vitoria_campeao"]');
            if (condicaoCampeao) condicaoCampeao.value = template.condicaoCampeao;
        }

        console.log(` Template aplicado: ${template.nome}`);
    }
}