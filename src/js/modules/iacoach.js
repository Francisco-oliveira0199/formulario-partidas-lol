// iacoach.js - VERSÃO SIMPLIFICADA E CORRIGIDA
class IACoach {
    constructor() {
        this.categorias = {
            'Draft': { peso: 0.15, problemas: [] },
            'Early Game': { peso: 0.20, problemas: [] },
            'Rotação': { peso: 0.15, problemas: [] },
            'Objetivos': { peso: 0.25, problemas: [] },
            'Teamfight': { peso: 0.15, problemas: [] },
            'Visão': { peso: 0.10, problemas: [] }
        };
    }

    init() {
        console.log('🧠 IA Coach inicializado - Foco em análise');
    }

    analisarPartida(dadosPartida) {
        console.log('🔍 IACoach: Analisando partida...');
        
        this.resetarProblemas();
        
        this.analisarDraft(dadosPartida);
        this.analisarEarlyGame(dadosPartida);
        this.analisarRotacao(dadosPartida);
        this.analisarObjetivos(dadosPartida);
        this.analisarTeamfight(dadosPartida);
        this.analisarVisao(dadosPartida);

        const score = this.calcularScore();
        const relatorio = this.gerarRelatorio(score, dadosPartida);
        
        console.log('✅ IACoach: Análise concluída');
        return relatorio;
    }

    resetarProblemas() {
        Object.values(this.categorias).forEach(categoria => {
            categoria.problemas = [];
        });
    }

    analisarDraft(dados) {
        const problemas = [];
        const rota = dados.rota;
        const campeao = dados.campeao;

        const matchupInimigo = this.obterMatchupInimigo(dados, rota);
        if (matchupInimigo && this.verificarMatchupDesfavoravel(campeao, matchupInimigo)) {
            problemas.push({
                tipo: 'MATCHUP_DESFAVORAVEL',
                severidade: 'media',
                descricao: `Matchup desfavorável contra ${matchupInimigo}`,
                acao: 'Focar em farm seguro e evitar trades desnecessários'
            });
        }

        this.categorias['Draft'].problemas = problemas;
    }

    analisarEarlyGame(dados) {
        const problemas = [];
        const rota = dados.rota;

        if (rota === 'Jungle') {
            if (!dados.pathing_inicial || dados.pathing_inicial.length < 10) {
                problemas.push({
                    tipo: 'PATHING_INDEFINIDO',
                    severidade: 'alta',
                    descricao: 'Pathing inicial não definido ou muito genérico',
                    acao: 'Planejar rota de clear específica antes da partida'
                });
            }
        }

        this.categorias['Early Game'].problemas = problemas;
    }

    analisarRotacao(dados) {
        const problemas = [];
        const rota = dados.rota;

        if (['Jungle', 'Mid'].includes(rota)) {
            if (!dados.rota_alvo || dados.rota_alvo.length < 2) {
                problemas.push({
                    tipo: 'ROTAÇÃO_INDEFINIDA',
                    severidade: 'media',
                    descricao: 'Prioridade de rotação não definida',
                    acao: 'Identificar rotas pushadas para focar ganks'
                });
            }
        }

        this.categorias['Rotação'].problemas = problemas;
    }

    analisarObjetivos(dados) {
        const problemas = [];
        let objetivosPerdidos = 0;

        const temposObjetivos = ['125', '600', '1100', '1500', '1600', '1800'];
        temposObjetivos.forEach(tempo => {
            const objetivoTime = dados[`objetivo_${tempo}_time`];
            if (objetivoTime === 'Inimigo') {
                objetivosPerdidos++;
            }
        });

        if (objetivosPerdidos > 3) {
            problemas.push({
                tipo: 'CONTROLE_OBJETIVOS_BAIXO',
                severidade: 'alta',
                descricao: `Perdeu ${objetivosPerdidos} objetivos importantes`,
                acao: 'Melhorar timing e preparação para objetivos'
            });
        }

        this.categorias['Objetivos'].problemas = problemas;
    }

    analisarTeamfight(dados) {
        const problemas = [];

        if (dados.situacao_erro && dados.situacao_erro.toLowerCase().includes('teamfight')) {
            problemas.push({
                tipo: 'POSICIONAMENTO_TEAMFIGHT',
                severidade: 'alta',
                descricao: 'Problemas de posicionamento em teamfights',
                acao: 'Manter distância segura e focar no posicionamento'
            });
        }

        this.categorias['Teamfight'].problemas = problemas;
    }

    analisarVisao(dados) {
        const problemas = [];

        if (!dados.controle_visao || dados.controle_visao.length < 15) {
            problemas.push({
                tipo: 'VISAO_GERAL_INSUFICIENTE',
                severidade: 'media',
                descricao: 'Controle de visão geral insuficiente',
                acao: 'Comprar e posicionar mais wards estrategicamente'
            });
        }

        this.categorias['Visão'].problemas = problemas;
    }

    calcularScore() {
        let scoreBase = 100;
        let penalidadeTotal = 0;

        Object.values(this.categorias).forEach(categoria => {
            const peso = categoria.peso;
            const problemas = categoria.problemas;

            problemas.forEach(problema => {
                let penalidade = 0;
                switch (problema.severidade) {
                    case 'alta': penalidade = 8; break;
                    case 'media': penalidade = 5; break;
                    case 'baixa': penalidade = 2; break;
                }
                penalidadeTotal += penalidade * peso;
            });
        });

        const scoreFinal = Math.max(0, Math.min(100, Math.round(scoreBase - penalidadeTotal)));
        return scoreFinal;
    }

    gerarRelatorio(score, dados) {
        const pontosFortes = this.identificarPontosFortes(dados);
        const areasMelhoria = this.extrairAreasMelhoria();
        const sugestoesPriorizadas = this.gerarSugestoesPriorizadas();

        return {
            score: score,
            pontosFortes: pontosFortes,
            areasMelhoria: areasMelhoria,
            sugestoesPriorizadas: sugestoesPriorizadas,
            totalProblemas: this.contarTotalProblemas(),
            metaProximaPartida: this.gerarMetaProximaPartida(areasMelhoria)
        };
    }

    identificarPontosFortes(dados) {
        const pontos = [];
        
        if (dados.condicao_vitoria_time && dados.condicao_vitoria_time.length > 30) {
            pontos.push('Condições de vitória bem definidas');
        }
        
        if (dados.condicao_vitoria_campeao && dados.condicao_vitoria_campeao.length > 30) {
            pontos.push('Entendimento claro do papel do campeão');
        }

        if (dados.aprendizados && dados.aprendizados.length > 50) {
            pontos.push('Boa capacidade de aprendizado com erros');
        }

        let objetivosAnalisados = 0;
        ['125', '600', '1100', '1500', '1600', '1800'].forEach(tempo => {
            if (dados[`objetivo_${tempo}_time`]) objetivosAnalisados++;
        });
        
        if (objetivosAnalisados >= 3) {
            pontos.push('Boa atenção aos objetivos de mapa');
        }

        if (this.calcularScore() > 80) {
            pontos.push('Jogada consistente e estratégica');
        }

        return pontos.length > 0 ? pontos : ['Boa base para desenvolvimento - continue analisando!'];
    }

    extrairAreasMelhoria() {
        const areas = [];
        
        Object.entries(this.categorias).forEach(([categoria, info]) => {
            info.problemas.forEach(problema => {
                areas.push({
                    categoria: categoria,
                    descricao: problema.descricao,
                    acao: problema.acao,
                    severidade: problema.severidade
                });
            });
        });

        return areas.sort((a, b) => {
            const ordemSeveridade = { 'alta': 3, 'media': 2, 'baixa': 1 };
            return ordemSeveridade[b.severidade] - ordemSeveridade[a.severidade];
        });
    }

    gerarSugestoesPriorizadas() {
        const sugestoes = [];
        const areas = this.extrairAreasMelhoria();

        const principais = areas.slice(0, 4);
        
        principais.forEach(area => {
            sugestoes.push(area.acao);
        });

        if (sugestoes.length < 3) {
            sugestoes.push('Focar em farm consistente durante a partida');
            sugestoes.push('Melhorar comunicação com o time usando pings');
            sugestoes.push('Praticar controle de visão em áreas estratégicas');
        }

        return sugestoes;
    }

    contarTotalProblemas() {
        return Object.values(this.categorias).reduce((total, categoria) => {
            return total + categoria.problemas.length;
        }, 0);
    }

    gerarMetaProximaPartida(areasMelhoria) {
        if (areasMelhoria.length === 0) {
            return 'Manter o bom trabalho e focar em consistência!';
        }

        const areaPrincipal = areasMelhoria[0];
        return `Próxima partida: ${areaPrincipal.acao}`;
    }

    obterMatchupInimigo(dados, rota) {
        const rotaKey = this.rotas[rota];
        return dados[`draft_inimigo_${rotaKey}`];
    }

    verificarMatchupDesfavoravel(campeaoAliado, campeaoInimigo) {
        const matchupsDesfavoraveis = {
            'Teemo': ['Caitlyn', 'Lux', 'Xerath'],
            'Vayne': ['Caitlyn', 'Ashe', 'Varus'],
            'Yasuo': ['Malphite', 'Annie', 'Renekton']
        };

        return matchupsDesfavoraveis[campeaoAliado] && 
               matchupsDesfavoraveis[campeaoAliado].includes(campeaoInimigo);
    }

    get rotas() {
        return {
            'Top': 'top',
            'Jungle': 'jungle',
            'Mid': 'mid', 
            'Adc': 'adc',
            'Sup': 'sup'
        };
    }
}