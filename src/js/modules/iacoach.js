// iacoach.js
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
        console.log('🧠 IA Coach inicializado');
    }

    analisarPartida(dadosPartida) {
        console.log('🔍 Iniciando análise da partida...', dadosPartida);
        
        // Coletar problemas por categoria
        this.analisarDraft(dadosPartida);
        this.analisarEarlyGame(dadosPartida);
        this.analisarRotacao(dadosPartida);
        this.analisarObjetivos(dadosPartida);
        this.analisarTeamfight(dadosPartida);
        this.analisarVisao(dadosPartida);

        // Calcular score
        const score = this.calcularScore();
        
        // Gerar relatório
        const relatorio = this.gerarRelatorio(score, dadosPartida);
        
        console.log('✅ Análise concluída - Score:', score);
        return relatorio;
    }

    analisarDraft(dados) {
        const problemas = [];
        const rota = dados.rota;
        const campeao = dados.campeao;

        // Verificar matchups problemáticos
        const matchupInimigo = this.obterMatchupInimigo(dados, rota);
        if (matchupInimigo && this.verificarMatchupDesfavoravel(campeao, matchupInimigo)) {
            problemas.push({
                tipo: 'MATCHUP_DESFAVORAVEL',
                severidade: 'media',
                descricao: `Matchup desfavorável contra ${matchupInimigo}`,
                acao: 'Focar em farm seguro e evitar trades desnecessários'
            });
        }

        // Verificar sinergia de time
        if (!this.verificarSinergiaTime(dados)) {
            problemas.push({
                tipo: 'SINERGIA_TIME_BAIXA',
                severidade: 'baixa',
                descricao: 'Composição do time com sinergia limitada',
                acao: 'Adaptar build e playstyle para compensar'
            });
        }

        this.categorias['Draft'].problemas = problemas;
    }

    analisarEarlyGame(dados) {
        const problemas = [];
        const rota = dados.rota;

        // Análise específica por rota
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

        // Verificar primeiras trocas
        if (dados.recursos_queimados && dados.recursos_queimados.includes('Flash')) {
            problemas.push({
                tipo: 'RECURSOS_QUEIMADOS',
                severidade: 'alta',
                descricao: 'Feitiços importantes usados muito cedo',
                acao: 'Jogar mais defensivamente até que feitiços voltem'
            });
        }

        this.categorias['Early Game'].problemas = problemas;
    }

    analisarRotacao(dados) {
        const problemas = [];
        const rota = dados.rota;

        // Análise de rotação para Jungle e Mid
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

        // Verificar controle de objetivos
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

        // Verificar controle de visão em objetivos
        if (!dados.controle_visao || dados.controle_visao.length < 20) {
            problemas.push({
                tipo: 'VISAO_OBJETIVOS_INSUFICIENTE',
                severidade: 'media',
                descricao: 'Controle de visão em objetivos insuficiente',
                acao: 'Priorizar wards em pit de objetivos 1min antes do spawn'
            });
        }

        this.categorias['Objetivos'].problemas = problemas;
    }

    analisarTeamfight(dados) {
        const problemas = [];

        // Analisar erros em teamfights
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
            problemasPorCategoria: this.categorias,
            totalProblemas: this.contarTotalProblemas(),
            metaProximaPartida: this.gerarMetaProximaPartida(areasMelhoria),
            descricaoScore: this.getDescricaoScore(score)
        };
    }

    identificarPontosFortes(dados) {
        const pontos = [];
        
        // Verificar condições de vitória bem definidas
        if (dados.condicao_vitoria_time && dados.condicao_vitoria_time.length > 30) {
            pontos.push('Condições de vitória bem definidas');
        }
        
        if (dados.condicao_vitoria_campeao && dados.condicao_vitoria_campeao.length > 30) {
            pontos.push('Entendimento claro do papel do campeão');
        }

        // Verificar aprendizados
        if (dados.aprendizados && dados.aprendizados.length > 50) {
            pontos.push('Boa capacidade de aprendizado com erros');
        }

        // Verificar análise de objetivos
        let objetivosAnalisados = 0;
        ['125', '600', '1100', '1500', '1600', '1800'].forEach(tempo => {
            if (dados[`objetivo_${tempo}_time`]) objetivosAnalisados++;
        });
        
        if (objetivosAnalisados >= 3) {
            pontos.push('Boa atenção aos objetivos de mapa');
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

        // Ordenar por severidade
        return areas.sort((a, b) => {
            const ordemSeveridade = { 'alta': 3, 'media': 2, 'baixa': 1 };
            return ordemSeveridade[b.severidade] - ordemSeveridade[a.severidade];
        });
    }

    gerarSugestoesPriorizadas() {
        const sugestoes = [];
        const areas = this.extrairAreasMelhoria();

        // Pegar as 3-5 principais sugestões
        areas.slice(0, 5).forEach(area => {
            sugestoes.push(area.acao);
        });

        return sugestoes.length > 0 ? sugestoes : ['Continue analisando suas partidas para identificar áreas de melhoria específicas'];
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

    getDescricaoScore(score) {
        if (score >= 90) return 'Excelente! Continue com esse trabalho consistente.';
        if (score >= 80) return 'Muito bom! Pequenos ajustes farão grande diferença.';
        if (score >= 70) return 'Bom! Foque nas áreas de melhoria identificadas.';
        if (score >= 60) return 'Regular. Há oportunidades claras de melhoria.';
        return 'Há várias áreas para trabalhar. Foque nos fundamentos primeiro.';
    }

    // Métodos auxiliares
    obterMatchupInimigo(dados, rota) {
        const rotaKey = this.rotas[rota];
        return dados[`draft_inimigo_${rotaKey}`];
    }

    verificarMatchupDesfavoravel(campeaoAliado, campeaoInimigo) {
        // Simulação simples - em implementação real, usaríamos uma base de dados de matchups
        const matchupsDesfavoraveis = {
            'Teemo': ['Caitlyn', 'Lux', 'Xerath'],
            'Vayne': ['Caitlyn', 'Ashe', 'Varus'],
            'Yasuo': ['Malphite', 'Annie', 'Renekton']
        };

        return matchupsDesfavoraveis[campeaoAliado] && 
               matchupsDesfavoraveis[campeaoAliado].includes(campeaoInimigo);
    }

    verificarSinergiaTime(dados) {
        // Simulação simples de sinergia
        const composicaoAliada = [
            dados.draft_aliado_top,
            dados.draft_aliado_jungle, 
            dados.draft_aliado_mid,
            dados.draft_aliado_adc,
            dados.draft_aliado_sup
        ].filter(Boolean);

        return composicaoAliada.length >= 3; // Considerar boa sinergia se pelo menos 3 campeões preenchidos
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