// app.js - SISTEMA IA COACH AVANÇADO COMPLETO PARA WILD RIFT

class IACoachAvancado {
    constructor() {
        this.conhecimento = {};
        this.historicoAnalises = [];
        this.padroesAprendidos = [];
        this.sinergiasCounters = {};
        this.contextoPartida = {
            tipo: 'solo_queue',
            coordenacao: 'limitada'
        };
        
        // TIMINGS CORRETOS DO WILD RIFT
        this.timingsWildRift = {
            nivel_ultimate: 5,
            primeiro_obj_neutro: '1:25',
            primeiro_dragao: '5:00',
            primeiro_arauto: '5:00',
            segundo_dragao: '9:00',
            baron_nashor: '10:00',
            dragao_anciao: '16:00',
            tempo_partida_media: '15-20min'
        };
    }

    async carregarConhecimentoCompleto() {
        try {
            console.log('Carregando conhecimento completo da IA para Wild Rift...');
            
            // Carregar conhecimento base
            this.conhecimento = {
                objetivos: {
                    arongueijo: {
                        beneficio: 'Gold e experiência para o time',
                        timing: '1:25',
                        prioridade: ['jungle', 'mid', 'sup'],
                        descricao: 'Primeiro objetivo neutro - controle early'
                    },
                    dragoes_wild_rift: {
                        'Infernal': { 
                            beneficio: '+8% Dano de Ataque e Habilidade', 
                            prioridade: ['mago', 'assassino', 'atirador'],
                            timing: '5:00'
                        },
                        'Montanha': { 
                            beneficio: '+10% Escudo e +10% Cura/Regeneração', 
                            prioridade: ['tanque', 'lutador'],
                            timing: '5:00'
                        },
                        'Gelo': { 
                            beneficio: '+10% Aceleração de Habilidade', 
                            prioridade: ['mago', 'suporte'],
                            timing: '5:00'
                        },
                        'Oceano': { 
                            beneficio: 'Restaura 3% da Vida e Mana Perdidos', 
                            prioridade: ['lutador', 'tanque'],
                            timing: '5:00'
                        }
                    },
                    arauto: {
                        beneficio: 'Convocável para empurrar torres',
                        timing: '5:00',
                        duracao: '4:00',
                        prioridade: ['jungle', 'mid', 'top']
                    },
                    baron_nashor: {
                        beneficio: 'Buff de Ataque e Empurrão de Waves',
                        timing: '10:00',
                        prioridade: 'TIME_COMPLETO'
                    }
                },
                estrategias: {
                    prioridades_por_fase: {
                        'very_early_game_0_2_min': {
                            'jungle': ['clear_rapido', 'preparar_arongueijo_1:25'],
                            'mid': ['push_lane', 'prioridade_arongueijo'],
                            'top': ['farm_seguro', 'tp_arongueijo_se_necessario'],
                            'adc': ['farm', 'posicionamento_defensivo'],
                            'sup': ['visao_arongueijo', 'rotação_1:25']
                        },
                        'early_game_2_5_min': {
                            'jungle': ['farm', 'ganks', 'preparar_objetivos_5min'],
                            'mid': ['farm', 'pressao_lane', 'roam_pos_5'],
                            'top': ['farm', 'controle_wave', 'tp_objetivos'],
                            'adc': ['farm_seguro', 'posicionamento', 'evitar_ganks'],
                            'sup': ['visao_objetivos', 'poke', 'protecao_adc']
                        },
                        'mid_game_5_10_min': {
                            'jungle': ['objetivos_5min', 'controle_dragao_arauto', 'teamfights'],
                            'mid': ['roam', 'objetivos_5min', 'teamfights'],
                            'top': ['split_push', 'tp_objetivos_5min', 'teamfights'],
                            'adc': ['farm', 'objetivos_5min', 'posicionamento_teamfight'],
                            'sup': ['visao_objetivos_5min', 'engajamento', 'protecao_carry']
                        }
                    }
                },
                classesCampeoes: {
                    classes_principais: {
                        'tanque': {
                            subclasses: {
                                'vanguarda': {
                                    exemplos: ['Malphite', 'Amumu', 'Leona', 'Alistar', 'Braum'],
                                    pontos_fortes: ['engajamento', 'resistencia', 'controle_massa'],
                                    pontos_fracos: ['dano_baixo', 'mobilidade', 'dependencia_teamfight'],
                                    estilo_jogo: 'Iniciar teamfights e proteger a linha de frente',
                                    power_spike: 'Nível 5 - Ultimate para engajar'
                                }
                            }
                        },
                        'lutador': {
                            subclasses: {
                                'colossos': {
                                    exemplos: ['Darius', 'Garen', 'Renekton', 'Sett', 'Jax'],
                                    pontos_fortes: ['dano_sustentado', 'resistencia', '1v1'],
                                    pontos_fracos: ['kite', 'mobilidade', 'dependente_early'],
                                    estilo_jogo: 'Pressão constante e split push',
                                    power_spike: 'Nível 5 - Ultimate para all-in'
                                }
                            }
                        },
                        'mago': {
                            subclasses: {
                                'artilharia': {
                                    exemplos: ['Lux', 'Zoe', 'Xerath', 'Orianna', 'Ahri'],
                                    pontos_fortes: ['poke_longo_alcance', 'controle_zona', 'burst'],
                                    pontos_fracos: ['mobilidade', 'frageis', 'dependente_skillshots'],
                                    estilo_jogo: 'Poke a distância e controle de área',
                                    power_spike: 'Nível 5 - Ultimate para burst'
                                }
                            }
                        },
                        'atirador': {
                            subclasses: {
                                'hiper_carregador': {
                                    exemplos: ['Vayne', 'KogMaw', 'Jinx', 'KaiSa', 'Tristana'],
                                    pontos_fortes: ['dano_late_game', 'dano_tanques', 'escalonamento'],
                                    pontos_fracos: ['early_game_fraco', 'dependente_protecao', 'mobilidade'],
                                    estilo_jogo: 'Farm seguro early, dominar late game',
                                    power_spike: 'Nível 5 - Ultimate para all-in ou segurança'
                                }
                            }
                        },
                        'assassino': {
                            subclasses: {
                                'early_carry': {
                                    exemplos: ['Zed', 'Talon', 'KhaZix', 'Akali', 'Fizz'],
                                    pontos_fortes: ['mobilidade', 'burst', 'picks'],
                                    pontos_fracos: ['teamfight', 'dependente_snowball', 'frageis'],
                                    estilo_jogo: 'Eliminar alvos prioritários e criar picks',
                                    power_spike: 'Nível 5 - Ultimate para eliminação garantida'
                                }
                            }
                        }
                    }
                },
                matchups: {
                    'Teemo': {
                        'Darius': { 
                            dificuldade: 'DIFICIL', 
                            estrategia: 'Jogue safe até nível 5, abuse range após ultimate.',
                            winRate: 42,
                            dicas: ['Use Q para poke seguro', 'Mantenha distância', 'Aproveite após nível 5']
                        }
                    },
                    'Yasuo': {
                        'Annie': { 
                            dificuldade: 'DIFICIL', 
                            estrategia: 'Jogue defensivo até nível 5, windwall o Q dela.',
                            winRate: 45,
                            dicas: ['Windwall no momento certo', 'Cuidado com stun nível 5']
                        }
                    }
                },
                powerSpikes: {
                    'Yasuo': { 
                        niveis: [1, 2, 5],
                        itens: ['STATIKK', 'INFINITY_EDGE'], 
                        powerspike: 'FORTE',
                        descricao: 'Fortíssimo com ultimate nível 5'
                    },
                    'Kassadin': { 
                        niveis: [5, 11, 15],
                        powerspike: 'MUITO_FORTE',
                        descricao: 'Começa a ficar forte com ultimate nível 5'
                    },
                    'Lee Sin': { 
                        niveis: [2, 3, 5],
                        powerspike: 'EARLY',
                        descricao: 'Dominante early game com ultimate nível 5'
                    }
                },
                metricasPorElo: {
                    'Ferro-Bronze': { 
                        csMin: 4, 
                        participacao: 0.4, 
                        visao: 0.8,
                        objetivos: 2,
                        kda: 2.0
                    },
                    'Prata-Ouro': { 
                        csMin: 5, 
                        participacao: 0.5, 
                        visao: 1.2,
                        objetivos: 3,
                        kda: 2.5
                    }
                },
                estrategiasPorRota: {
                    'Jungle': {
                        'OBJECTIVE_CONTROL': {
                            campeoes: ['Nunu', 'Amumu', 'Jarvan IV'],
                            descricao: 'Foco em controle de dragão e arauto 5:00',
                            pathing: 'Clear -> Objetivo 5:00'
                        }
                    }
                },
                composicoesIdeais: {
                    'ENGAGE': {
                        descricao: 'Composição de engajamento forte pós nível 5',
                        campeoes: ['Malphite', 'Amumu', 'Leona', 'Miss Fortune', 'Yasuo'],
                        estrategia: 'Forçar teamfights após nível 5 em objetivos',
                        sinergia: 90
                    }
                }
            };

            // CARREGAR CONHECIMENTO DE DRAFT COMPETITIVO
            await this.carregarConhecimentoDraft();
            
            // Carregar sinergias e counters dos PDFs
            await this.carregarSinergiasCounters();
            await this.carregarConhecimentoLocal();
            
            console.log('Conhecimento Wild Rift carregado');

        } catch (error) {
            console.error('Erro ao carregar conhecimento:', error);
            this.conhecimento = {
                objetivos: {},
                estrategias: {},
                classesCampeoes: {},
                matchups: {},
                powerSpikes: {},
                metricasPorElo: {},
                estrategiasPorRota: {},
                composicoesIdeais: {},
                draft_competitivo: {}
            };
        }
    }

    // NOVO MÉTODO PARA CARREGAR DRAFT COMPETITIVO
    async carregarConhecimentoDraft() {
        try {
            console.log('Carregando conhecimento de draft competitivo...');
            
            // Tentar carregar do arquivo JSON
            const response = await fetch('./data/draft.json');
            if (response.ok) {
                const draftData = await response.json();
                this.conhecimento.draft_competitivo = draftData.construcao_draft_competitivo;
                console.log('Conhecimento de draft carregado com sucesso');
            } else {
                // Fallback com estrutura básica
                this.conhecimento.draft_competitivo = {
                    fundamentos_leitura_meta: {
                        prioridades_globais_vs_regionais: {
                            metricas_avaliacao: [
                                "Taxa de disputa - frequência de pick/ban",
                                "Taxa de vitória contextual - performance em diferentes situações"
                            ]
                        }
                    },
                    tipos_composicao_fundamentais: {},
                    estrategia_picks_flexiveis: {}
                };
                console.warn('Usando fallback para conhecimento de draft');
            }
        } catch (error) {
            console.warn('Erro ao carregar conhecimento de draft:', error);
            this.conhecimento.draft_competitivo = {};
        }
    }

    async carregarSinergiasCounters() {
        try {
            console.log('Carregando dados de sinergias e counters...');
            
            // Tentar carregar do arquivo JSON
            const response = await fetch('./data/sinergias-counters.json');
            if (response.ok) {
                this.sinergiasCounters = await response.json();
                console.log('Sinergias e counters carregados do JSON');
            } else {
                // Fallback para dados embutidos
                this.sinergiasCounters = {
                    categorias_sinergias: {
                        "wombo_combo": "Campeões com AoE CC que combinam devastadoramente",
                        "protect_the_carry": "Enchanters que protegem hypercarries",
                        "dive_comp": "Campeões que mergulham no backline juntos",
                        "poke_comp": "Campeões de longo alcance que desgastam",
                        "split_push": "Duos que pressionam múltiplas lanes",
                        "pick_comp": "Campeões que isolam e executam alvos"
                    },
                    campeoes: {}
                };
                console.log('Usando fallback para sinergias e counters');
            }
        } catch (error) {
            console.warn('Erro ao carregar sinergias e counters:', error);
            this.sinergiasCounters = { categorias_sinergias: {}, campeoes: {} };
        }
    }

    // ANÁLISE AVANÇADA DE DRAFT BASEADA NO CONHECIMENTO CARREGADO
    analisarDraftCompetitivo(timeAliado, timeInimigo) {
        const analise = {
            composicao_identificada: null,
            sinergias_avancadas: [],
            counters_estrategicos: [],
            curva_poder_time: this.analisarCurvaPoder(timeAliado),
            flexibilidade_picks: this.analisarFlexibilidadePicks(timeAliado),
            prioridades_ban: this.sugerirPrioridadesBan(timeAliado, timeInimigo),
            sugestoes_composicao: [],
            vulnerabilidades: []
        };

        // Identificar tipo de composição baseado no draft.json
        analise.composicao_identificada = this.identificarComposicaoFundamental(timeAliado);
        
        // Analisar sinergias em camadas
        analise.sinergias_avancadas = this.analisarSinergiasCamadas(timeAliado);
        
        // Identificar counters estratégicos
        analise.counters_estrategicos = this.identificarCountersEstrategicos(timeAliado, timeInimigo);
        
        // Gerar sugestões baseadas no draft competitivo
        analise.sugestoes_composicao = this.gerarSugestoesComposicao(analise);
        analise.vulnerabilidades = this.identificarVulnerabilidades(timeAliado, timeInimigo);

        return analise;
    }

    // IDENTIFICAR COMPOSIÇÃO FUNDAMENTAL
    identificarComposicaoFundamental(timeAliado) {
        const tiposComposicao = this.conhecimento.draft_competitivo?.tipos_composicao_fundamentais;
        if (!tiposComposicao) return null;

        const campeoes = Object.values(timeAliado).filter(c => c);
        let melhorMatch = null;
        let maiorPontuacao = 0;

        Object.entries(tiposComposicao).forEach(([tipo, dados]) => {
            const pontuacao = this.calcularMatchComposicao(campeoes, dados);
            if (pontuacao > maiorPontuacao) {
                maiorPontuacao = pontuacao;
                melhorMatch = { tipo, dados, pontuacao };
            }
        });

        return melhorMatch && maiorPontuacao > 0.6 ? melhorMatch : null;
    }

    calcularMatchComposicao(campeoes, dadosComposicao) {
        let pontuacao = 0;
        const elementosChave = dadosComposicao.elementos_chave || [];
        
        campeoes.forEach(campeao => {
            const dadosCampeao = this.sinergiasCounters.campeoes[campeao];
            if (dadosCampeao) {
                // Verificar se o campeão se encaixa nos elementos chave da composição
                elementosChave.forEach(elemento => {
                    if (this.campeaoTemElemento(campeao, elemento)) {
                        pontuacao += 0.2;
                    }
                });
            }
        });

        return Math.min(1, pontuacao);
    }

    campeaoTemElemento(campeao, elemento) {
        const elementosCampeao = {
            'Controle em área': ['Malphite', 'Amumu', 'Leona', 'Orianna', 'Sona', 'Seraphine'],
            'Dano em grupo': ['Miss Fortune', 'Kennen', 'Fiddlesticks', 'Brand', 'Ziggs'],
            'Supports encantadores': ['Lulu', 'Janna', 'Yuumi', 'Soraka', 'Nami'],
            'Tanks protetores': ['Braum', 'Tahm Kench', 'Alistar', 'Thresh'],
            'Mobilidade': ['Lee Sin', 'Zed', 'Kassadin', 'Fizz', 'Akali', 'Camille'],
            'Potencial de explosão': ['Zed', 'Diana', 'Syndra', 'Veigar', 'Annie', 'Leblanc'],
            'Capacidade de duel': ['Fiora', 'Jax', 'Tryndamere', 'Camille', 'Riven', 'Irelia'],
            'Limpeza de ondas': ['Sivir', 'Anivia', 'Ziggs', 'Xerath', 'Lux', 'Morgana']
        };

        return elementosCampeao[elemento]?.includes(campeao) || false;
    }

    // ANALISAR SINERGIAS EM CAMADAS
    analisarSinergiasCamadas(timeAliado) {
        const sinergias = [];
        const campeoes = Object.values(timeAliado).filter(c => c);
        
        // Sinergia Mecânica
        sinergias.push({
            camada: 'Mecânica',
            sinergias: this.analisarSinergiaMecanica(campeoes)
        });
        
        // Sinergia Estratégica
        sinergias.push({
            camada: 'Estratégica',
            sinergias: this.analisarSinergiaEstrategica(campeoes)
        });
        
        // Sinergia Ritmo
        sinergias.push({
            camada: 'Ritmo',
            sinergias: this.analisarSinergiaRitmo(campeoes)
        });

        return sinergias.filter(s => s.sinergias.length > 0);
    }

    analisarSinergiaMecanica(campeoes) {
        const combosConhecidos = [
            { campeoes: ['Malphite', 'Yasuo'], descricao: 'Combo ultimate devastador' },
            { campeoes: ['Orianna', 'Jarvan IV'], descricao: 'Combo de controle de área' },
            { campeoes: ['Zilean', 'KogMaw'], descricao: 'Revive + hiper carry' },
            { campeoes: ['Camille', 'Galio'], descricao: 'Engaje global + follow up' },
            { campeoes: ['Leona', 'Miss Fortune'], descricao: 'CC em área + ultimate' }
        ];

        return combosConhecidos.filter(combo => 
            combo.campeoes.every(c => campeoes.includes(c))
        );
    }

    analisarSinergiaEstrategica(campeoes) {
        const sinergias = [];
        const curvas = this.analisarCurvaPoderTime(campeoes);
        
        // Verificar convergência de condições de vitória
        if (curvas.early > 2 && curvas.late > 2) {
            sinergias.push('Composição equilibrada com múltiplas condições de vitória');
        }
        
        // Verificar sinergia estratégica baseada no draft.json
        const draftConhecimento = this.conhecimento.draft_competitivo;
        if (draftConhecimento?.camadas_sinergia) {
            if (curvas.mid >= 3) {
                sinergias.push('Sinergia de ritmo - time alinhado no meio do jogo');
            }
        }
        
        return sinergias;
    }

    analisarSinergiaRitmo(campeoes) {
        const sinergias = [];
        const powerSpikes = this.identificarPowerSpikesTime(campeoes);
        
        if (powerSpikes.mid.length >= 3) {
            sinergias.push('Time com forte power spike no meio do jogo - focar objetivos 5:00-15:00');
        }
        
        if (powerSpikes.early.length >= 3) {
            sinergias.push('Time de early game - pressionar desde o nível 1');
        }
        
        return sinergias;
    }

    // ANALISAR CURVA DE PODER DO TIME
    analisarCurvaPoder(timeAliado) {
        const campeoes = Object.values(timeAliado).filter(c => c);
        const curvas = this.analisarCurvaPoderTime(campeoes);
        
        return {
            early_game: curvas.early,
            mid_game: curvas.mid,
            late_game: curvas.late,
            composicao_recomendada: this.sugerirComposicaoPorCurva(curvas)
        };
    }

    analisarCurvaPoderTime(campeoes) {
        let early = 0, mid = 0, late = 0;
        
        campeoes.forEach(campeao => {
            const spike = this.conhecimento.powerSpikes[campeao];
            if (spike) {
                if (spike.powerspike === 'EARLY') early++;
                if (spike.powerspike === 'FORTE' && spike.niveis?.includes(5)) mid++;
                if (spike.powerspike === 'MUITO_FORTE') late++;
            }
        });
        
        return { early, mid, late };
    }

    sugerirComposicaoPorCurva(curvas) {
        if (curvas.early >= 3) return "Composição de early game agressivo";
        if (curvas.mid >= 3) return "Composição de meio de jogo com foco em objetivos";
        if (curvas.late >= 3) return "Composição de late game com escalabilidade";
        return "Composição equilibrada";
    }

    // ANALISAR FLEXIBILIDADE DE PICKS
    analisarFlexibilidadePicks(timeAliado) {
        const campeoes = Object.values(timeAliado).filter(c => c);
        let flexibilidade = 0;
        
        campeoes.forEach(campeao => {
            const picksFlexiveis = this.conhecimento.draft_competitivo?.estrategia_picks_flexiveis?.exemplos_alto_impacto;
            if (picksFlexiveis && picksFlexiveis[campeao]) {
                flexibilidade += picksFlexiveis[campeao].length;
            }
        });
        
        return {
            score: flexibilidade,
            analise: flexibilidade >= 3 ? "Alta flexibilidade estratégica" : 
                     flexibilidade >= 2 ? "Flexibilidade moderada" : 
                     "Baixa flexibilidade"
        };
    }

    // SUGERIR PRIORIDADES DE BAN
    sugerirPrioridadesBan(timeAliado, timeInimigo) {
        const prioridades = [];
        const campeoesAliados = Object.values(timeAliado).filter(c => c);
        
        // Identificar counters para nossa composição
        campeoesAliados.forEach(campeao => {
            const dadosCampeao = this.sinergiasCounters.campeoes[campeao];
            if (dadosCampeao && dadosCampeao.counters) {
                dadosCampeao.counters.forEach(counter => {
                    if (this.counterEstrategico(counter)) {
                        prioridades.push({
                            campeao: counter.campeao,
                            prioridade: 'ALTA',
                            razao: `Counter estratégico para ${campeao}`,
                            descricao: counter.descricao
                        });
                    }
                });
            }
        });
        
        return this.priorizarBans(prioridades).slice(0, 3);
    }

    counterEstrategico(counter) {
        const descricao = counter.descricao.toLowerCase();
        return descricao.includes('devastador') || 
               descricao.includes('destrói') || 
               descricao.includes('ignora') ||
               descricao.includes('true damage') ||
               descricao.includes('hard counter');
    }

    priorizarBans(prioridades) {
        return prioridades.sort((a, b) => {
            const pesoA = a.prioridade === 'ALTA' ? 3 : a.prioridade === 'MEDIA' ? 2 : 1;
            const pesoB = b.prioridade === 'ALTA' ? 3 : b.prioridade === 'MEDIA' ? 2 : 1;
            return pesoB - pesoA;
        });
    }

    // IDENTIFICAR COUNTERS ESTRATÉGICOS
    identificarCountersEstrategicos(timeAliado, timeInimigo) {
        const counters = [];
        const campeoesInimigos = Object.values(timeInimigo).filter(c => c);
        
        campeoesInimigos.forEach(inimigo => {
            const dadosInimigo = this.sinergiasCounters.campeoes[inimigo];
            if (dadosInimigo && dadosInimigo.counters) {
                dadosInimigo.counters.forEach(counter => {
                    if (Object.values(timeAliado).includes(counter.campeao)) {
                        counters.push({
                            campeao_aliado: counter.campeao,
                            campeao_inimigo: inimigo,
                            vantagem: 'Counter estratégico',
                            descricao: counter.descricao
                        });
                    }
                });
            }
        });
        
        return counters;
    }

    // GERAR SUGESTÕES DE COMPOSIÇÃO
    gerarSugestoesComposicao(analiseDraft) {
        const sugestoes = [];
        
        if (analiseDraft.composicao_identificada) {
            const comp = analiseDraft.composicao_identificada;
            sugestoes.push(`Composição identificada: ${comp.tipo.replace('_', ' ').toUpperCase()}`);
            sugestoes.push(`${comp.dados.identidade}`);
            sugestoes.push(`Janela de força: ${comp.dados.janela_forca}`);
        }
        
        if (analiseDraft.curva_poder_time.early_game >= 3) {
            sugestoes.push("Time de early game - pressionar objetivos desde 1:25");
        }
        
        if (analiseDraft.flexibilidade_picks.score >= 3) {
            sugestoes.push("Aproveite a flexibilidade para swaps estratégicos");
        }
        
        return sugestoes;
    }

    // IDENTIFICAR VULNERABILIDADES
    identificarVulnerabilidades(timeAliado, timeInimigo) {
        const vulnerabilidades = [];
        const campeoesAliados = Object.values(timeAliado).filter(c => c);
        
        // Verificar falta de tanque
        const temTanque = campeoesAliados.some(campeao => 
            this.identificarClasseCampeao(campeao) === 'tanque'
        );
        if (!temTanque) {
            vulnerabilidades.push("Falta de frontline - time muito frágil em teamfights");
        }
        
        // Verificar falta de controle de grupo
        const temCCMassa = campeoesAliados.some(campeao => 
            ['Malphite', 'Amumu', 'Leona', 'Orianna', 'Sona', 'Seraphine'].includes(campeao)
        );
        if (!temCCMassa) {
            vulnerabilidades.push("Falta de controle em área - dificuldade em teamfights organizadas");
        }
        
        // Verificar falta de dano mágico/físico balanceado
        const danoMagico = campeoesAliados.some(campeao => 
            ['mago', 'assassino_magico'].includes(this.identificarClasseCampeao(campeao))
        );
        const danoFisico = campeoesAliados.some(campeao => 
            ['atirador', 'assassino', 'lutador'].includes(this.identificarClasseCampeao(campeao))
        );
        
        if (!danoMagico || !danoFisico) {
            vulnerabilidades.push("Dano desbalanceado - inimigo pode stackar resistências facilmente");
        }
        
        return vulnerabilidades;
    }

    // MÉTODOS PARA ANALISAR SINERGIAS
    analisarSinergiasTime(timeAliado) {
        const analise = {
            sinergias_encontradas: [],
            counters_potenciais: [],
            composicao_tipo: null,
            sugestoes: []
        };

        const campeoesTime = Object.values(timeAliado).filter(c => c);
        
        // Analisar tipos de composição
        analise.composicao_tipo = this.identificarTipoComposicao(campeoesTime);
        
        // Encontrar sinergias entre campeões do time
        analise.sinergias_encontradas = this.encontrarSinergiasTime(campeoesTime);
        
        // Identificar counters potenciais do time inimigo
        analise.counters_potenciais = this.identificarCountersPotenciais(timeAliado);
        
        // Gerar sugestões baseadas na análise
        analise.sugestoes = this.gerarSugestoesSinergias(analise);
        
        return analise;
    }

    identificarTipoComposicao(campeoes) {
        const tipos = {
            wombo_combo: 0,
            protect_carry: 0,
            dive_comp: 0,
            poke_comp: 0,
            split_push: 0,
            pick_comp: 0
        };

        campeoes.forEach(campeao => {
            const dadosCampeao = this.sinergiasCounters.campeoes[campeao];
            if (dadosCampeao) {
                // Analisar sinergias para determinar tipo de composição
                dadosCampeao.sinergias.forEach(sinergia => {
                    if (sinergia.descricao.toLowerCase().includes('aoe') || sinergia.descricao.toLowerCase().includes('combo')) {
                        tipos.wombo_combo++;
                    }
                    if (sinergia.descricao.toLowerCase().includes('protect') || sinergia.descricao.toLowerCase().includes('shield')) {
                        tipos.protect_carry++;
                    }
                    if (sinergia.descricao.toLowerCase().includes('dive') || sinergia.descricao.toLowerCase().includes('engage')) {
                        tipos.dive_comp++;
                    }
                    if (sinergia.descricao.toLowerCase().includes('poke') || sinergia.descricao.toLowerCase().includes('longo')) {
                        tipos.poke_comp++;
                    }
                });
            }
        });

        // Retornar o tipo com maior pontuação
        return Object.keys(tipos).reduce((a, b) => tipos[a] > tipos[b] ? a : b);
    }

    encontrarSinergiasTime(campeoes) {
        const sinergias = [];
        
        for (let i = 0; i < campeoes.length; i++) {
            for (let j = i + 1; j < campeoes.length; j++) {
                const campeaoA = campeoes[i];
                const campeaoB = campeoes[j];
                
                const sinergia = this.verificarSinergiaDireta(campeaoA, campeaoB);
                if (sinergia) {
                    sinergias.push(sinergia);
                }
            }
        }
        
        return sinergias;
    }

    verificarSinergiaDireta(campeaoA, campeaoB) {
        const dadosA = this.sinergiasCounters.campeoes[campeaoA];
        const dadosB = this.sinergiasCounters.campeoes[campeaoB];
        
        if (!dadosA || !dadosB) return null;
        
        // Verificar se campeaoB está nas sinergias de campeaoA
        const sinergiaAB = dadosA.sinergias.find(s => s.campeao === campeaoB);
        if (sinergiaAB) {
            return {
                campeoes: [campeaoA, campeaoB],
                descricao: sinergiaAB.descricao,
                direcao: 'A→B'
            };
        }
        
        // Verificar se campeaoA está nas sinergias de campeaoB
        const sinergiaBA = dadosB.sinergias.find(s => s.campeao === campeaoA);
        if (sinergiaBA) {
            return {
                campeoes: [campeaoA, campeaoB],
                descricao: sinergiaBA.descricao,
                direcao: 'B→A'
            };
        }
        
        return null;
    }

    identificarCountersPotenciais(timeAliado) {
        const counters = [];
        const campeoesAliados = Object.values(timeAliado).filter(c => c);
        
        campeoesAliados.forEach(campeao => {
            const dadosCampeao = this.sinergiasCounters.campeoes[campeao];
            if (dadosCampeao && dadosCampeao.counters) {
                dadosCampeao.counters.forEach(counter => {
                    counters.push({
                        campeao_aliado: campeao,
                        counter: counter.campeao,
                        descricao: counter.descricao,
                        prioridade: this.calcularPrioridadeCounter(counter.descricao)
                    });
                });
            }
        });
        
        return counters.sort((a, b) => b.prioridade - a.prioridade).slice(0, 5);
    }

    calcularPrioridadeCounter(descricao) {
        let prioridade = 1;
        if (descricao.includes('true damage') || descricao.includes('ignora')) prioridade += 2;
        if (descricao.includes('cancela') || descricao.includes('bloqueia')) prioridade += 1;
        if (descricao.includes('devastador') || descricao.includes('destrói')) prioridade += 1;
        return prioridade;
    }

    gerarSugestoesSinergias(analise) {
        const sugestoes = [];
        
        if (analise.composicao_tipo) {
            const tipoComposicao = this.sinergiasCounters.categorias_sinergias[analise.composicao_tipo];
            sugestoes.push(`Sua composição favorece: ${tipoComposicao}`);
        }
        
        if (analise.sinergias_encontradas.length > 0) {
            sugestoes.push('Sinergias identificadas no time:');
            analise.sinergias_encontradas.slice(0, 3).forEach(sinergia => {
                sugestoes.push(`- ${sinergia.campeoes.join(' + ')}: ${sinergia.descricao}`);
            });
        }
        
        if (analise.counters_potenciais.length > 0) {
            sugestoes.push('Cuidado com counters:');
            analise.counters_potenciais.slice(0, 3).forEach(counter => {
                sugestoes.push(`- ${counter.counter} countera ${counter.campeao_aliado}`);
            });
        }
        
        return sugestoes;
    }

    // ATUALIZAR análise de partida para incluir draft competitivo
    analisarPartidaAvancada(dados) {
        console.log('Iniciando análise avançada para Wild Rift...');

        this.definirContextoPartida(dados);

        const analiseBase = this.analisarPartidaBase(dados);
        const composicoes = this.extrairComposicoes(dados);
        
        // NOVA ANÁLISE DE DRAFT COMPETITIVO
        const analiseDraft = this.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        
        const analiseComposicao = this.analisarComposicaoTime(dados);
        const analiseObjetivos = this.analisarEstrategiaObjetivos(dados);
        const analiseSinergias = this.analisarSinergiasTime(composicoes.timeAliado);
        
        const sugestoesPersonalizadas = this.gerarSugestoesPersonalizadas(
            dados, analiseBase, analiseComposicao, analiseObjetivos, analiseSinergias, analiseDraft
        );

        const score = this.calcularScoreCompleto(analiseBase, analiseComposicao, analiseObjetivos, analiseDraft);

        return {
            score: score,
            pontosFortes: [
                ...analiseBase.pontosFortes, 
                ...analiseSinergias.sinergias_encontradas.map(s => `Sinergia: ${s.descricao}`),
                ...analiseDraft.sugestoes_composicao
            ],
            areasMelhoria: [
                ...analiseBase.problemas, 
                ...analiseComposicao.problemas, 
                ...analiseObjetivos.problemas,
                ...analiseDraft.vulnerabilidades
            ],
            sugestoesPriorizadas: sugestoesPersonalizadas,
            metaProximaPartida: this.gerarMetaPersonalizada(dados, analiseBase, analiseComposicao),
            analiseComposicao: analiseComposicao,
            analiseObjetivos: analiseObjetivos,
            analiseSinergias: analiseSinergias,
            // NOVA SEÇÃO DE DRAFT
            analiseDraft: analiseDraft,
            oportunidades: this.identificarOportunidades(dados, analiseComposicao),
            contexto: this.contextoPartida,
            insightsContextuais: this.gerarInsightsContextuais(dados, {
                analiseComposicao, 
                analiseObjetivos, 
                analiseSinergias,
                analiseDraft
            }),
            timings: this.timingsWildRift
        };
    }

    // ATUALIZAR geração de sugestões para incluir draft
    gerarSugestoesPersonalizadas(dados, analiseBase, analiseComposicao, analiseObjetivos, analiseSinergias, analiseDraft) {
        const sugestoes = [];

        // SUGESTÕES BASEADAS EM DRAFT COMPETITIVO
        if (analiseDraft.sugestoes_composicao.length > 0) {
            sugestoes.push(...analiseDraft.sugestoes_composicao);
        }
        
        if (analiseDraft.prioridades_ban.length > 0) {
            sugestoes.push("Prioridades de Ban:");
            analiseDraft.prioridades_ban.slice(0, 2).forEach(ban => {
                sugestoes.push(`- ${ban.campeao}: ${ban.razao}`);
            });
        }

        // Sugestões baseadas em sinergias
        if (analiseSinergias.sugestoes.length > 0) {
            sugestoes.push(...analiseSinergias.sugestoes);
        }

        const classeJogador = this.identificarClasseCampeao(dados.campeao);
        if (classeJogador) {
            sugestoes.push(...this.gerarSugestoesPorClasse(classeJogador, dados));
        }

        sugestoes.push(...analiseComposicao.problemas.map(p => p.sugestao));
        sugestoes.push(...analiseObjetivos.sugestoes);
        sugestoes.push(...this.gerarSugestoesContextuais());
        sugestoes.push(...this.gerarSugestoesPorElo(dados.elo));

        return this.priorizarSugestoes(sugestoes).slice(0, 5);
    }

    // ATUALIZAR cálculo de score para incluir draft
    calcularScoreCompleto(analiseBase, analiseComposicao, analiseObjetivos, analiseDraft) {
        let score = 100;
        
        // Penalidades base
        analiseBase.problemas.forEach(problema => {
            score -= problema.severidade === 'alta' ? 10 : 5;
        });
        
        // Bônus por bom draft
        if (analiseDraft) {
            if (analiseDraft.flexibilidade_picks.score >= 3) score += 5;
            if (analiseDraft.curva_poder_time.early_game >= 2) score += 3;
            if (analiseDraft.sinergias_avancadas.length >= 2) score += 5;
            if (analiseDraft.composicao_identificada) score += 8;
        }
        
        return Math.max(0, Math.min(100, Math.round(score)));
    }

    // MÉTODO para obter matchup específico
    obterMatchup(campeaoAliado, campeaoInimigo) {
        const dadosCampeao = this.sinergiasCounters.campeoes[campeaoAliado];
        if (!dadosCampeao) return null;
        
        const counter = dadosCampeao.counters.find(c => c.campeao === campeaoInimigo);
        if (counter) {
            return {
                dificuldade: 'DIFICIL',
                estrategia: `Cuidado: ${counter.descricao}`,
                dicas: this.gerarDicasMatchup(campeaoAliado, campeaoInimigo)
            };
        }
        
        // Verificar se é um bom matchup
        const sinergia = dadosCampeao.sinergias.find(s => s.campeao === campeaoInimigo);
        if (sinergia) {
            return {
                dificuldade: 'FACIL', 
                estrategia: `Vantagem: ${sinergia.descricao}`,
                dicas: ['Aproveite a sinergia com seu aliado', 'Coordene engajamentos']
            };
        }
        
        return {
            dificuldade: 'NEUTRO',
            estrategia: 'Matchup equilibrado - foque em farm e objetivos',
            dicas: ['Jogue seguro', 'Aguarde oportunidades']
        };
    }

    gerarDicasMatchup(campeaoAliado, campeaoInimigo) {
        const dicas = [];
        const dadosCampeao = this.sinergiasCounters.campeoes[campeaoAliado];
        
        if (dadosCampeao) {
            const counter = dadosCampeao.counters.find(c => c.campeao === campeaoInimigo);
            if (counter) {
                if (counter.descricao.includes('true damage')) {
                    dicas.push('Construa resistência em vez de vida');
                }
                if (counter.descricao.includes('poke')) {
                    dicas.push('Foque em engajar rapidamente');
                }
                if (counter.descricao.includes('bloqueia')) {
                    dicas.push('Use suas habilidades com cuidado');
                }
            }
        }
        
        return dicas.length > 0 ? dicas : ['Jogue defensivamente', 'Peça ajuda do jungle'];
    }

    // MÉTODOS ORIGINAIS (mantidos da versão anterior)
    definirContextoPartida(dados) {
        if (dados.coordenacao_time === 'competitiva' || dados.premade === '5_man') {
            this.contextoPartida = {
                tipo: 'competitive',
                coordenacao: 'total',
                estrategia: 'complexa_possivel'
            };
        } else if (dados.coordenacao_time === 'flex_queue' || dados.premade === '2_3_man') {
            this.contextoPartida = {
                tipo: 'flex_queue', 
                coordenacao: 'media',
                estrategia: 'moderada'
            };
        } else {
            this.contextoPartida = {
                tipo: 'solo_queue',
                coordenacao: 'limitada',
                estrategia: 'simplificada'
            };
        }
    }

    analisarEstrategiaObjetivos(dados) {
        const analise = {
            problemas: [],
            sugestoes: [],
            prioridades: this.determinarPrioridadesObjetivos(dados),
            decisaoArauto: this.analisarDecisaoArauto(dados),
            decisaoArongueijo: this.analisarDecisaoArongueijo(dados)
        };

        analise.sugestoes.push(`ARONGUEIJO 1:25: ${this.gerarEstrategiaArongueijo(dados)}`);
        
        if (this.contextoPartida.tipo === 'competitive') {
            analise.sugestoes.push(...this.gerarSugestoesCompetitivas(dados));
        } else {
            analise.sugestoes.push(...this.gerarSugestoesSoloQueue(dados));
        }

        const dragãoIdeal = this.identificarDragaoIdeal(dados);
        if (dragãoIdeal) {
            analise.sugestoes.push(`Priorizar Dragão ${dragãoIdeal.nome} às 5:00 - ${dragãoIdeal.razao}`);
        }

        return analise;
    }

    analisarDecisaoArongueijo(dados) {
        const vantagemEarly = this.calcularVantagemMuitoEarly(dados);
        
        if (vantagemEarly.alta) {
            return {
                decisao: "INVADIR_ARONGUEIJO",
                estrategia: "Invadir e contestar arongueijo inimigo",
                razao: "Vantagem early permite agressividade",
                prioridade: "ALTA",
                timing: "1:25"
            };
        } else {
            return {
                decisao: "PROTEGER_ARONGUEIJO",
                estrategia: "Proteger nosso arongueijo e farmar",
                razao: "Foco em segurança early",
                prioridade: "MEDIA", 
                timing: "1:25"
            };
        }
    }

    analisarDecisaoArauto(dados) {
        const contexto = this.contextoPartida;
        const vantagem = this.calcularVantagemEarly(dados);
        const timingObjetivo = '5:00';
        
        if (contexto.tipo === 'competitive') {
            return this.decisaoArautoCompetitiva(dados, vantagem, timingObjetivo);
        } else {
            return this.decisaoArautoSoloQueue(dados, vantagem, timingObjetivo);
        }
    }

    decisaoArautoCompetitiva(dados, vantagem, timing) {
        const podeDualObjective = this.podeFazerDualObjective(dados);
        
        if (podeDualObjective && vantagem.alta) {
            return {
                decisao: "DUAL_OBJECTIVE_5MIN",
                estrategia: `Dividir time às ${timing} - 3-4 dragão, 1-2 arauto`,
                razao: "Coordenação total permite controlar ambos objetivos",
                prioridade: "MAXIMA",
                timing: timing
            };
        } else {
            return {
                decisao: "ARAURO_PRIORITARIO", 
                estrategia: `Focar arauto às ${timing} + pressionar mid`,
                razao: "Acelerar jogo com vantagem existente",
                prioridade: "ALTA",
                timing: timing
            };
        }
    }

    decisaoArautoSoloQueue(dados, vantagem, timing) {
        if (vantagem.alta) {
            return {
                decisao: "ARAURO_PRIORITARIO",
                estrategia: `Focar arauto às ${timing} + comunicar com pings`,
                razao: "Converter vantagem em pressão de mapa early",
                prioridade: "ALTA",
                timing: timing
            };
        } else {
            return {
                decisao: "DRAGAO_SEGURO",
                estrategia: `Focar dragão às ${timing} + farm recuperação`,
                razao: "Objetivo mais seguro",
                prioridade: "BAIXA",
                timing: timing
            };
        }
    }

    gerarSugestoesCompetitivas(dados) {
        const sugestoes = [];
        const composicao = this.extrairComposicoes(dados);
        const powerSpikes = this.identificarPowerSpikesTime(composicao.timeAliado);
        
        sugestoes.push("ARONGUEIJO 1:25: Coordenar jungle + mid/sup para controle");
        
        if (powerSpikes.mid.length > 0) {
            sugestoes.push(`POWER SPIKE NÍVEL 5: ${powerSpikes.mid.join(', ')} - coordenar objetivos 5:00`);
        }
        
        sugestoes.push("OBJETIVOS 5:00: Preparar dragão/arauto com recalls ~4:30");
        
        if (this.podeFazerDualObjective(dados)) {
            sugestoes.push("DUAL OBJECTIVE POSSÍVEL: Dividir time para arauto + dragão às 5:00");
        }
        
        return sugestoes;
    }

    gerarSugestoesSoloQueue(dados) {
        const sugestoes = [];
        const composicao = this.extrairComposicoes(dados);
        const powerSpikes = this.identificarPowerSpikesTime(composicao.timeAliado);
        
        sugestoes.push("ARONGUEIJO 1:25: Jungle priorize, lanes ajudem se seguro");
        sugestoes.push("OBJETIVOS 5:00: Usar pings para comunicar foco (dragão OU arauto)");
        
        if (powerSpikes.mid.length > 0) {
            sugestoes.push(`APROVEITAR NÍVEL 5: ${powerSpikes.mid[0]} tem powerspike para objetivos 5:00`);
        }
        
        return sugestoes;
    }

    identificarPowerSpikesTime(timeAliado) {
        const spikes = {
            early: [],
            mid: [],
            late: []
        };

        Object.values(timeAliado).forEach(campeao => {
            if (!campeao) return;
            
            const powerSpike = this.conhecimento.powerSpikes[campeao];
            if (powerSpike) {
                if (powerSpike.niveis.includes(5)) {
                    spikes.mid.push(`${campeao} (Nível 5)`);
                }
                if (powerSpike.powerspike === 'EARLY') {
                    spikes.early.push(`${campeao} (Early)`);
                }
                if (powerSpike.powerspike === 'MUITO_FORTE') {
                    spikes.late.push(`${campeao} (Late)`);
                }
            }
        });

        return spikes;
    }

    calcularVantagemMuitoEarly(dados) {
        return {
            alta: Math.random() > 0.7,
            moderada: Math.random() > 0.4 && Math.random() <= 0.7,
            baixa: Math.random() <= 0.4
        };
    }

    gerarEstrategiaArongueijo(dados) {
        const vantagem = this.calcularVantagemMuitoEarly(dados);
        return vantagem.alta ? "Invadir e contestar" : "Proteger e farmar seguro";
    }

    extrairComposicoes(dados) {
        return {
            timeAliado: {
                top: dados.draft_aliado_top,
                jungle: dados.draft_aliado_jungle,
                mid: dados.draft_aliado_mid,
                adc: dados.draft_aliado_adc,
                sup: dados.draft_aliado_sup
            },
            timeInimigo: {
                top: dados.draft_inimigo_top,
                jungle: dados.draft_inimigo_jungle,
                mid: dados.draft_inimigo_mid,
                adc: dados.draft_inimigo_adc,
                sup: dados.draft_inimigo_sup
            }
        };
    }

    calcularVantagemEarly(dados) {
        return {
            alta: Math.random() > 0.7,
            moderada: Math.random() > 0.4 && Math.random() <= 0.7,
            baixa: Math.random() <= 0.4
        };
    }

    podeFazerDualObjective(dados) {
        const vantagem = this.calcularVantagemEarly(dados);
        const visao = this.avaliarControleVisao(dados);
        return vantagem.alta && visao.excelente && this.contextoPartida.coordenacao === 'total';
    }

    avaliarControleVisao(dados) {
        return {
            excelente: Math.random() > 0.8,
            boa: Math.random() > 0.5,
            ruim: Math.random() <= 0.5
        };
    }

    identificarClasseCampeao(nomeCampeao) {
        if (!nomeCampeao) return null;
        const classesBase = {
            'hiper_carregador': ['Vayne', 'KogMaw', 'Jinx', 'KaiSa'],
            'tanque': ['Malphite', 'Amumu', 'Leona', 'Braum'],
            'assassino': ['Zed', 'Talon', 'KhaZix', 'Akali'],
            'atirador': ['Caitlyn', 'Jhin', 'Ezreal', 'Varus'],
            'mago': ['Lux', 'Zoe', 'Xerath', 'Orianna'],
            'lutador': ['Darius', 'Garen', 'Renekton', 'Sett']
        };

        for (const [classe, campeoes] of Object.entries(classesBase)) {
            if (campeoes.some(c => c.toLowerCase().includes(nomeCampeao.toLowerCase()))) {
                return classe;
            }
        }
        return null;
    }

    identificarDragaoIdeal(dados) {
        const composicao = this.extrairComposicoes(dados);
        const classesTime = this.identificarClassesTime(composicao.timeAliado);

        if (classesTime.atirador) {
            return { nome: "Infernal", razao: "Aumenta dano dos atiradores" };
        }
        if (classesTime.tanque) {
            return { nome: "Montanha", razao: "Aumenta resistência do frontline" };
        }
        return null;
    }

    analisarComposicaoTime(dados) {
        const composicao = this.extrairComposicoes(dados);
        return {
            sinergia: this.calcularSinergiaTime(composicao.timeAliado),
            balanceamento: this.analisarBalanceamentoTime(composicao.timeAliado),
            vantagemComposicao: { desvantagem: false, detalhes: [], estrategia: "Jogar padrão" },
            problemas: [],
            pontosFortes: ["Composição balanceada"],
            oportunidadesSwap: []
        };
    }

    identificarClassesTime(time) {
        const classes = {};
        Object.values(time).forEach(campeao => {
            if (!campeao) return;
            const classe = this.identificarClasseCampeao(campeao);
            if (classe) {
                if (!classes[classe]) classes[classe] = [];
                classes[classe].push(campeao);
            }
        });
        return classes;
    }

    calcularSinergiaTime(timeAliado) {
        return Math.random() * 0.3 + 0.7;
    }

    analisarBalanceamentoTime(timeAliado) {
        return {
            balanceado: Math.random() > 0.5,
            problemas: [],
            sugestoes: [],
            composicao: { tank: 1, assasino: 1, atirador: 1, mago: 1 }
        };
    }

    analisarPartidaBase(dados) {
        const problemas = [];
        
        if (!dados.draft_inimigo_top || !dados.draft_inimigo_jungle) {
            problemas.push({
                categoria: 'DRAFT_INCOMPLETO',
                severidade: 'baixa',
                descricao: 'Análise de draft incompleta',
                sugestao: 'Preencha todos os campeões inimigos'
            });
        }

        return {
            problemas: problemas,
            pontosFortes: ["Análise base positiva", "Boa compreensão do jogo"],
            score: 75
        };
    }

    determinarPrioridadesObjetivos(dados) {
        return this.conhecimento.estrategias?.prioridades_por_fase?.early_game_2_5_min || {};
    }

    gerarMetaPersonalizada(dados, analiseBase, analiseComposicao) {
        return "Melhorar controle de objetivos early game";
    }

    identificarOportunidades(dados, analiseComposicao) {
        return ["Oportunidade de swap identificada", "Arauto disponível para aceleração"];
    }

    gerarSugestoesPorClasse(classe, dados) {
        const sugestoes = [];
        if (classe === 'hiper_carregador') {
            sugestoes.push("Como hiper carregador: Foque em farm seguro até nível 5");
            sugestoes.push("Use ultimate nível 5 defensivamente para sobreviver ganks");
        } else if (classe === 'tanque') {
            sugestoes.push("Como tanque: Seja o frontline nas teamfights pós nível 5");
        }
        return sugestoes;
    }

    gerarSugestoesContextuais() {
        const sugestoes = [];
        if (this.contextoPartida.tipo === 'solo_queue') {
            sugestoes.push("SOLO QUEUE: Focar comunicação clara com pings");
        } else {
            sugestoes.push("COMPETITIVE: Coordenar dual objectives quando possível");
        }
        return sugestoes;
    }

    gerarSugestoesPorElo(elo) {
        return [`Dica para ${elo}: Foque em objetivos em vez de kills`];
    }

    priorizarSugestoes(sugestoes) {
        return sugestoes.sort((a, b) => {
            const prioridadeA = a.includes('PRIORIDADE') ? 3 : a.includes('OPORTUNIDADE') ? 2 : 1;
            const prioridadeB = b.includes('PRIORIDADE') ? 3 : b.includes('OPORTUNIDADE') ? 2 : 1;
            return prioridadeB - prioridadeA;
        });
    }

    gerarInsightsContextuais(dados, analises) {
        const insights = [];
        if (this.contextoPartida.tipo === 'competitive') {
            insights.push("Partida competitiva detectada - estratégias avançadas disponíveis");
        }
        
        // Insights baseados no draft
        if (analises.analiseDraft) {
            if (analises.analiseDraft.composicao_identificada) {
                insights.push(`Composição ${analises.analiseDraft.composicao_identificada.tipo} identificada`);
            }
            if (analises.analiseDraft.flexibilidade_picks.score >= 3) {
                insights.push("Alta flexibilidade de picks detectada");
            }
        }
        
        return insights.length > 0 ? insights.join('. ') : 'Análise contextual padrão aplicada';
    }

    verificarLaneEstado(dados, rota) {
        return Math.random() > 0.5;
    }

    verificarSoulPoint(dados) {
        return {
            devePriorizar: Math.random() > 0.7,
            mensagem: "Soul point próximo - prioridade máxima no próximo dragão"
        };
    }

    contarObjetivosPerdidos(dados) {
        let perdidos = 0;
        const tempos = ['125', '600', '1100', '1500', '1600', '1800'];
        tempos.forEach(tempo => {
            if (dados[`objetivo_${tempo}_time`] === 'Inimigo') {
                perdidos++;
            }
        });
        return perdidos;
    }

    identificarOportunidadesSwap(composicao) {
        return [];
    }

    analisarMatchupComposicao(classesTime, classesInimigo) {
        return [];
    }

    identificarPontosFortesClasses(classesTime) {
        return ["Composição balanceada"];
    }

    verificarSinergiaClasses(classesTime) {
        return [];
    }

    analisarNecessidadeSwap(dados) {
        return false;
    }

    avaliarRecursosTime(dados) {
        return {
            suficientes: Math.random() > 0.6,
            limitados: Math.random() <= 0.6
        };
    }

    async carregarConhecimentoLocal() {
        try {
            const conhecimentoSalvo = localStorage.getItem('ia_coach_conhecimento');
            if (conhecimentoSalvo) {
                const conhecimento = JSON.parse(conhecimentoSalvo);
                this.conhecimento = this.mesclarConhecimento(this.conhecimento, conhecimento);
            }
        } catch (error) {
            console.warn('Erro ao carregar conhecimento local:', error);
        }
    }

    mesclarConhecimento(base, novo) {
        const resultado = { ...base };
        for (const categoria in novo) {
            if (resultado[categoria]) {
                resultado[categoria] = { ...resultado[categoria], ...novo[categoria] };
            } else {
                resultado[categoria] = novo[categoria];
            }
        }
        return resultado;
    }

    aprenderDeAnalise(analise, dados) {
        const padrao = {
            timestamp: new Date().toISOString(),
            contexto: this.contextoPartida,
            score: analise.score,
            sugestoesEfetivas: analise.sugestoesPriorizadas.slice(0, 2)
        };

        this.padroesAprendidos.push(padrao);
        this.salvarPadroesAprendidos();
    }

    salvarPadroesAprendidos() {
        try {
            if (this.padroesAprendidos.length > 100) {
                this.padroesAprendidos = this.padroesAprendidos.slice(-100);
            }
            localStorage.setItem('ia_coach_padroes', JSON.stringify(this.padroesAprendidos));
        } catch (error) {
            console.warn('Erro ao salvar padrões:', error);
        }
    }

    async carregarConhecimento() {
        return this.carregarConhecimentoCompleto();
    }
}

// ============================================================================
// SISTEMA PRINCIPAL COMPLETO
// ============================================================================

class WildRiftAnalyzer {
    constructor() {
        this.paginaAtual = 1;
        this.totalPaginas = 7;
        this.analiseAtualId = null;
        this.sistemaPronto = false;
        this.rotaSelecionada = null;
        
        this.config = {
            email: {
                destino: 'nittocoach@gmail.com',
                serviceId: 'service_n23atzb',
                templateId: 'template_1ob8gnk',
                publicKey: '1bph11qy38lrIRSwK'
            },
            limites: {
                tamanhoImagem: 5 * 1024 * 1024,
                tempoCarregamento: 2000
            }
        };

        this.iaCoach = new IACoachAvancado();
        
        this.campeoes = [
            'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe',
            'Aurelion Sol', 'Azir', 'Bardo', 'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Camille',
            'Corki', 'Darius', 'Diana', 'Draven', 'Dr. Mundo', 'Ekko', 'Elise', 'Evelynn', 'Ezreal',
            'Fiddlesticks', 'Fiora', 'Fizz', 'Galio', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen',
            'Hecarim', 'Heimerdinger', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV', 'Jax',
            'Jayce', 'Jhin', 'Jinx', 'KaiSa', 'Kalista', 'Karma', 'Katarina', 'Kassadin', 'Kayle',
            'Kayn', 'Kennen', 'KhaZix', 'Kindred', 'KogMaw', 'LeBlanc', 'Lee Sin', 'Leona', 'Lillia',
            'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'Master Yi',
            'Miss Fortune', 'Mordekaiser', 'Morgana', 'Nami', 'Nasus', 'Nautilus', 'Nidalee',
            'Nocturne', 'Nunu & Willump', 'Olaf', 'Orianna', 'Ornn', 'Pantheon', 'Poppy', 'Pyke',
            'Qiyana', 'Quinn', 'Rakan', 'Rammus', 'RekSai', 'Rell', 'Renekton', 'Rengar', 'Riven',
            'Rumble', 'Ryze', 'Samira', 'Sejuani', 'Senna', 'Seraphine', 'Sett', 'Shaco', 'Shen',
            'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka', 'Swain', 'Sylas',
            'Syndra', 'Tahm Kench', 'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh', 'Tristana',
            'Trundle', 'Tryndamere', 'Twisted Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne',
            'Veigar', 'VelKoz', 'Vex', 'Vi', 'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick',
            'Wukong', 'Xayah', 'Xerath', 'Xin Zhao', 'Yasuo', 'Yone', 'Yorick', 'Yuumi', 'Zac',
            'Zed', 'Ziggs', 'Zilean', 'Zoe', 'Zyra'
        ];

        this.objetivos = [
            { tempo: '1:25', nome: 'Arongueijo - Primeiro objetivo neutro', tipo: 'arongueijo' },
            { tempo: '5:00', nome: 'Primeiro Dragão e Arauto', tipo: 'duplo' },
            { tempo: '9:00', nome: 'Segundo Dragão', tipo: 'normal' },
            { tempo: '10:00', nome: 'Baron Nashor', tipo: 'normal' },
            { tempo: '13:00', nome: 'Terceiro Dragão', tipo: 'normal' },
            { tempo: '16:00', nome: 'Dragão Ancião', tipo: 'normal' }
        ];
    }

    async init() {
        try {
            console.log('Inicializando Wild Rift Analyzer Avançado...');
            
            await this.inicializarSistemas();
            this.configurarEventos();
            await this.inicializarEmailJS();
            
            this.sistemaPronto = true;
            console.log('Sistema avançado inicializado com sucesso');
            
        } catch (error) {
            console.error('Erro na inicialização:', error);
            this.mostrarErro('Erro ao inicializar o sistema. Recarregue a página.');
        }
    }

    async inicializarSistemas() {
        this.inicializarAutocompleteCampeoes();
        this.inicializarObjetivos();
        this.inicializarUpload();
        await this.iaCoach.carregarConhecimentoCompleto();
    }

    inicializarAutocompleteCampeoes() {
        const datalist = document.getElementById('listaCampeoes');
        if (datalist) {
            this.campeoes.forEach(campeao => {
                const option = document.createElement('option');
                option.value = campeao;
                datalist.appendChild(option);
            });
        }
    }

    inicializarObjetivos() {
        const container = document.querySelector('.objetivos-container');
        if (!container) return;

        container.innerHTML = this.objetivos.map(objetivo => `
            <div class="objetivo-grupo" data-tempo="${objetivo.tempo}">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_${objetivo.tempo.replace(':', '')}_ativo">
                        <span class="checkmark"></span>
                        ${objetivo.tempo} - ${objetivo.nome}
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    ${this.gerarOpcoesObjetivo(objetivo)}
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_${objetivo.tempo.replace(':', '')}_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_${objetivo.tempo.replace(':', '')}_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>
        `).join('');
    }

    gerarOpcoesObjetivo(objetivo) {
        const opcoes = {
            arongueijo: `
                <select name="objetivo_${objetivo.tempo.replace(':', '')}_tipo" class="select-objetivo">
                    <option value="">Selecione quantos arongueijos...</option>
                    <option value="Um">Arongueijo bot</option>
                    <option value="Um">Arongueijo top</option>
                    <option value="Dois">Dois arongueijos</option>
                    <option value="Nenhum">Nenhum</option>
                </select>
            `,
            duplo: `
                <div class="objetivo-duplo">
                    <div class="select-duplo">
                        <select name="objetivo_${objetivo.tempo.replace(':', '')}_tipo_1" class="select-objetivo">
                            <option value="">Primeiro objetivo...</option>
                            <option value="Fogo">Dragão de Fogo</option>
                            <option value="Gelo">Dragão de Gelo</option>
                            <option value="Montanha">Dragão de Montanha</option>
                            <option value="Oceano">Dragão de Oceano</option>
                            <option value="Arauto">Arauto</option>
                            <option value="Nenhum">Nenhum</option>
                        </select>
                    </div>
                    <div class="select-duplo">
                        <select name="objetivo_${objetivo.tempo.replace(':', '')}_tipo_2" class="select-objetivo">
                            <option value="">Segundo objetivo...</option>
                            <option value="Fogo">Dragão de Fogo</option>
                            <option value="Gelo">Dragão de Gelo</option>
                            <option value="Montanha">Dragão de Montanha</option>
                            <option value="Oceano">Dragão de Oceano</option>
                            <option value="Arauto">Arauto</option>
                            <option value="Nenhum">Nenhum</option>
                        </select>
                    </div>
                </div>
            `,
            normal: `
                <select name="objetivo_${objetivo.tempo.replace(':', '')}_tipo" class="select-objetivo">
                    <option value="">Selecione o objetivo...</option>
                    <option value="Fogo">Dragão de Fogo</option>
                    <option value="Gelo">Dragão de Gelo</option>
                    <option value="Montanha">Dragão de Montanha</option>
                    <option value="Oceano">Dragão de Oceano</option>
                    <option value="Arauto">Arauto</option>
                    <option value="Baron">Baron Nashor</option>
                    <option value="Ancião">Dragão Ancião</option>
                    <option value="Nenhum">Nenhum</option>
                </select>
            `
        };
        return opcoes[objetivo.tipo] || opcoes.normal;
    }

    inicializarUpload() {
        document.querySelectorAll('.upload-area').forEach(area => {
            area.addEventListener('dragover', (e) => {
                e.preventDefault();
                area.classList.add('drag-over');
            });

            area.addEventListener('dragleave', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');
            });

            area.addEventListener('drop', (e) => {
                e.preventDefault();
                area.classList.remove('drag-over');
                
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    const input = area.closest('.upload-label').querySelector('.upload-input');
                    input.files = files;
                    this.processarUpload(input);
                }
            });
        });
    }

    configurarEventos() {
        document.addEventListener('click', (e) => {
            const { target } = e;
            
            if (target.matches('.btn-avancar')) {
                e.preventDefault();
                this.avancarPagina();
            } else if (target.matches('.btn-voltar')) {
                e.preventDefault();
                this.voltarPagina();
            } else if (target.matches('.btn-enviar')) {
                e.preventDefault();
                this.enviarAnalise();
            } else if (target.matches('#btnNovaAnalise')) {
                this.iniciarNovaAnalise();
            } else if (target.matches('#btnCompartilhar')) {
                this.compartilharRelatorio();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.avancarPagina();
            if (e.key === 'ArrowLeft') this.voltarPagina();
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('input[name="rota"]')) {
                this.rotaSelecionada = e.target.value;
                this.atualizarVisibilidadeRota();
                this.atualizarDraftAliado();
            }
        });

        document.addEventListener('click', (e) => {
            const cabecalho = e.target.closest('.objetivo-cabecalho');
            if (cabecalho) {
                const checkbox = cabecalho.querySelector('.objetivo-checkbox');
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                    this.toggleOpcoesObjetivo(checkbox);
                    e.stopPropagation();
                }
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('.upload-input')) {
                this.processarUpload(e.target);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-remover-imagem')) {
                this.removerImagem(e.target);
            }
        });

        document.addEventListener('input', (e) => {
            if (e.target.matches('[required]')) {
                this.validarCampo(e.target);
            }
        });
    }

    async inicializarEmailJS() {
        try {
            if (typeof emailjs !== 'undefined') {
                await emailjs.init(this.config.email.publicKey);
                console.log('EmailJS inicializado');
            }
        } catch (error) {
            console.warn('EmailJS não inicializado:', error);
        }
    }

    mostrarPagina(numero) {
        if (numero < 1 || numero > this.totalPaginas) {
            console.error('Número de página inválido:', numero);
            return false;
        }

        document.querySelectorAll('.pagina').forEach(pagina => {
            pagina.classList.add('oculta');
            pagina.classList.remove('ativo');
        });

        const paginaAlvo = document.getElementById(numero === 7 ? 'paginaAgradecimento' : `pagina${numero}`);
        if (paginaAlvo) {
            paginaAlvo.classList.remove('oculta');
            paginaAlvo.classList.add('ativo');
            this.paginaAtual = numero;
            
            this.atualizarProgresso(numero);
            this.atualizarBotoesNavegacao(numero);
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            console.log(`Página ${numero} mostrada`);
            return true;
        }
        
        return false;
    }

    avancarPagina() {
        const proximaPagina = this.calcularProximaPagina();
        if (this.validarPaginaAtual() && proximaPagina <= this.totalPaginas) {
            this.mostrarPagina(proximaPagina);
        }
    }

    voltarPagina() {
        const paginaAnterior = this.calcularPaginaAnterior();
        if (paginaAnterior >= 1) {
            this.mostrarPagina(paginaAnterior);
        }
    }

    calcularProximaPagina() {
        const isJungle = this.rotaSelecionada === 'Jungle';
        if (!isJungle && this.paginaAtual === 1) {
            return 3;
        }
        return this.paginaAtual + 1;
    }

    calcularPaginaAnterior() {
        const isJungle = this.rotaSelecionada === 'Jungle';
        if (!isJungle && this.paginaAtual === 3) {
            return 1;
        }
        if (isJungle && this.paginaAtual === 3) {
            return 2;
        }
        return this.paginaAtual - 1;
    }

    validarPaginaAtual() {
        const campos = document.querySelectorAll(`#pagina${this.paginaAtual} [required]`);
        const camposInvalidos = Array.from(campos).filter(campo => !campo.value.trim());
        
        if (camposInvalidos.length > 0) {
            camposInvalidos[0].focus();
            camposInvalidos[0].classList.add('erro');
            this.mostrarErro('Preencha todos os campos obrigatórios antes de avançar.');
            return false;
        }
        
        return true;
    }

    atualizarProgresso(numero) {
        document.querySelectorAll('.barra-progresso').forEach((barra, index) => {
            const numeroBarra = index + 1;
            barra.classList.toggle('ativo', numeroBarra === numero);
            barra.classList.toggle('concluido', numeroBarra < numero);
        });
    }

    atualizarBotoesNavegacao(numero) {
        const btnVoltar = document.querySelector('.btn-voltar');
        const btnAvancar = document.querySelector('.btn-avancar');
        const btnEnviar = document.querySelector('.btn-enviar');

        if (btnVoltar) btnVoltar.disabled = numero === 1;
        
        if (btnAvancar && btnEnviar) {
            const isUltimaPagina = numero === 6;
            btnAvancar.style.display = isUltimaPagina ? 'none' : 'block';
            btnEnviar.style.display = isUltimaPagina ? 'block' : 'none';
        }
    }

    atualizarVisibilidadeRota() {
        if (!this.rotaSelecionada) return;

        const isJungle = this.rotaSelecionada === 'Jungle';
        const isJungleOrMid = ['Jungle', 'Mid'].includes(this.rotaSelecionada);

        document.querySelectorAll('.jungle-only').forEach(el => {
            el.classList.toggle('oculta', !isJungle);
        });

        document.querySelectorAll('.jungle-mid-only').forEach(el => {
            el.classList.toggle('oculta', !isJungleOrMid);
        });

        const rotaHidden = document.getElementById('rotaSelecionadaHidden');
        if (rotaHidden) {
            rotaHidden.value = this.rotaSelecionada;
        }
    }

    atualizarDraftAliado() {
        if (!this.rotaSelecionada) return;

        const draftAliadoFields = document.querySelectorAll('.draft-coluna:first-child .draft-field');
        
        draftAliadoFields.forEach(field => {
            const rotaField = field.getAttribute('data-rota');
            const shouldShow = rotaField !== this.rotaSelecionada.toLowerCase();
            field.classList.toggle('oculta', !shouldShow);
        });
    }

    toggleOpcoesObjetivo(checkbox) {
        const grupo = checkbox.closest('.objetivo-grupo');
        const opcoes = grupo.querySelector('.objetivo-opcoes');
        
        if (checkbox.checked) {
            grupo.classList.add('ativo');
            opcoes.classList.remove('oculta');
        } else {
            grupo.classList.remove('ativo', 'erro');
            opcoes.classList.add('oculta');
        }
    }

    processarUpload(input) {
        const file = input.files[0];
        if (!file) return;

        const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!tiposPermitidos.includes(file.type)) {
            this.mostrarErroUpload(input, 'Tipo de arquivo não permitido. Use PNG, JPG ou WebP.');
            return;
        }

        if (file.size > this.config.limites.tamanhoImagem) {
            this.mostrarErroUpload(input, 'Arquivo muito grande. Máximo 5MB.');
            return;
        }

        this.criarPreview(input, file);
    }

    criarPreview(input, file) {
        const reader = new FileReader();
        const uploadArea = input.closest('.upload-label').querySelector('.upload-area');
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');
        const previewImage = preview.querySelector('.preview-image');

        reader.onload = (e) => {
            previewImage.src = e.target.result;
            placeholder.classList.add('oculta');
            preview.classList.remove('oculta');
            uploadArea.classList.add('com-imagem');
            uploadArea.classList.remove('erro');
        };

        reader.readAsDataURL(file);
    }

    removerImagem(btn) {
        const uploadArea = btn.closest('.upload-area');
        const input = uploadArea.closest('.upload-label').querySelector('.upload-input');
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');
        
        input.value = '';
        placeholder.classList.remove('oculta');
        preview.classList.add('oculta');
        uploadArea.classList.remove('com-imagem', 'erro');
    }

    mostrarErroUpload(input, mensagem) {
        const uploadArea = input.closest('.upload-label').querySelector('.upload-area');
        uploadArea.classList.add('erro');
        input.value = '';
        this.mostrarFeedback(mensagem, 'erro');
    }

    async enviarAnalise() {
        if (!this.validarFormularioCompleto()) {
            this.mostrarErro('Preencha todos os campos obrigatórios antes de enviar.');
            return;
        }

        try {
            this.mostrarLoading(true);
            
            const dados = this.coletarDadosFormulario();
            const relatorioIA = this.iaCoach.analisarPartidaAvancada(dados);
            this.iaCoach.aprenderDeAnalise(relatorioIA, dados);
            this.enviarEmail(dados).catch(console.error);
            this.mostrarResultadoAnalise(relatorioIA);
            
        } catch (error) {
            console.error('Erro ao enviar análise:', error);
            this.mostrarErro('Erro ao processar análise. Tente novamente.');
        } finally {
            this.mostrarLoading(false);
        }
    }

    validarFormularioCompleto() {
        const camposObrigatorios = document.querySelectorAll('[required]');
        let valido = true;

        camposObrigatorios.forEach(campo => {
            if (!campo.value.trim()) {
                campo.classList.add('erro');
                valido = false;
            } else {
                campo.classList.remove('erro');
            }
        });

        return valido;
    }

    validarCampo(campo) {
        if (campo.value.trim()) {
            campo.classList.remove('erro');
        } else {
            campo.classList.add('erro');
        }
    }

    coletarDadosFormulario() {
        const formData = new FormData(document.getElementById('formularioAnalisePartida'));
        const dados = {};
        
        for (let [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                dados[key] = value;
            }
        }
        
        this.analiseAtualId = `WR-${Date.now().toString(36).toUpperCase()}`;
        dados.analysis_id = this.analiseAtualId;
        
        return dados;
    }

    async enviarEmail(dados) {
        if (typeof emailjs === 'undefined') {
            console.warn('EmailJS não disponível');
            return false;
        }

        try {
            await emailjs.send(
                this.config.email.serviceId,
                this.config.email.templateId,
                {
                    to_email: this.config.email.destino,
                    analysis_id: dados.analysis_id,
                    nickname: dados.nickname,
                    elo: dados.elo,
                    campeao: dados.campeao,
                    rota: dados.rota,
                    message: this.gerarResumoEmail(dados)
                }
            );
            console.log('Email enviado com sucesso');
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            return false;
        }
    }

    gerarResumoEmail(dados) {
        return `
Análise de Partida - Wild Rift

Jogador: ${dados.nickname || 'N/A'}
Elo: ${dados.elo || 'N/A'} 
Campeão: ${dados.campeao || 'N/A'}
Rota: ${dados.rota || 'N/A'}

ID da Análise: ${dados.analysis_id}
Data: ${new Date().toLocaleString('pt-BR')}

--- Análise automatizada ---
        `.trim();
    }

    mostrarResultadoAnalise(relatorioIA) {
        this.mostrarPagina(7);
        this.preencherRelatorioIA(relatorioIA);
    }

    preencherRelatorioIA(relatorioIA) {
        const scoreElem = document.getElementById('scoreRelatorio');
        const conteudoElem = document.getElementById('conteudoRelatorio');
        
        if (scoreElem) scoreElem.textContent = relatorioIA.score;
        if (conteudoElem) {
            conteudoElem.innerHTML = this.gerarHTMLRelatorio(relatorioIA);
        }
    }

    gerarHTMLRelatorio(relatorioIA) {
        return `
            <div class="resumo-ia">
                <div class="score-destaque">
                    <h3>Pontuação da Análise</h3>
                    <div class="score-valor">${relatorioIA.score}/100</div>
                    <p class="score-descricao">${this.getDescricaoScore(relatorioIA.score)}</p>
                </div>
                
                ${relatorioIA.insightsContextuais ? `
                <div class="insights-contextuais">
                    <h4>Insights Contextuais</h4>
                    <p>${relatorioIA.insightsContextuais}</p>
                </div>
                ` : ''}
                
                <div class="contexto-partida">
                    <h4>Contexto da Partida</h4>
                    <p><strong>Tipo:</strong> ${relatorioIA.contexto.tipo} | 
                    <strong>Coordenação:</strong> ${relatorioIA.contexto.coordenacao} | 
                    <strong>Estratégia:</strong> ${relatorioIA.contexto.estrategia}</p>
                </div>
                
                ${relatorioIA.analiseDraft ? `
                <div class="analise-draft">
                    <h4>Análise de Draft Competitivo</h4>
                    ${relatorioIA.analiseDraft.composicao_identificada ? `
                    <div class="composicao-identificada">
                        <h5>Composição Identificada</h5>
                        <p><strong>Tipo:</strong> ${relatorioIA.analiseDraft.composicao_identificada.tipo.replace('_', ' ').toUpperCase()}</p>
                        <p><strong>Identidade:</strong> ${relatorioIA.analiseDraft.composicao_identificada.dados.identidade}</p>
                        <p><strong>Janela de Força:</strong> ${relatorioIA.analiseDraft.composicao_identificada.dados.janela_forca}</p>
                    </div>
                    ` : ''}
                    
                    ${relatorioIA.analiseDraft.curva_poder_time ? `
                    <div class="curva-poder">
                        <h5>Curva de Poder do Time</h5>
                        <p><strong>Early Game:</strong> ${relatorioIA.analiseDraft.curva_poder_time.early_game}/5</p>
                        <p><strong>Mid Game:</strong> ${relatorioIA.analiseDraft.curva_poder_time.mid_game}/5</p>
                        <p><strong>Late Game:</strong> ${relatorioIA.analiseDraft.curva_poder_time.late_game}/5</p>
                        <p><strong>Recomendação:</strong> ${relatorioIA.analiseDraft.curva_poder_time.composicao_recomendada}</p>
                    </div>
                    ` : ''}
                    
                    ${relatorioIA.analiseDraft.flexibilidade_picks ? `
                    <div class="flexibilidade-picks">
                        <h5>Flexibilidade de Picks</h5>
                        <p><strong>Score:</strong> ${relatorioIA.analiseDraft.flexibilidade_picks.score}/5</p>
                        <p><strong>Análise:</strong> ${relatorioIA.analiseDraft.flexibilidade_picks.analise}</p>
                    </div>
                    ` : ''}
                    
                    ${relatorioIA.analiseDraft.prioridades_ban && relatorioIA.analiseDraft.prioridades_ban.length > 0 ? `
                    <div class="prioridades-ban">
                        <h5>Prioridades de Ban</h5>
                        <ul>
                            ${relatorioIA.analiseDraft.prioridades_ban.map(ban => `
                                <li><strong>${ban.campeao}</strong> - ${ban.razao} (${ban.prioridade})</li>
                            `).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
                
                ${relatorioIA.analiseSinergias ? `
                <div class="analise-sinergias">
                    <h4>Análise de Sinergias</h4>
                    ${relatorioIA.analiseSinergias.sugestoes.map(sugestao => `<p>${sugestao}</p>`).join('')}
                </div>
                ` : ''}
                
                <h3>Pontos Fortes</h3>
                <ul class="pontos-fortes">
                    ${relatorioIA.pontosFortes.map(ponto => `<li>${ponto}</li>`).join('')}
                </ul>
                
                ${relatorioIA.oportunidades && relatorioIA.oportunidades.length > 0 ? `
                <div class="oportunidades">
                    <h4>Oportunidades Identificadas</h4>
                    <ul>
                        ${relatorioIA.oportunidades.map(op => `<li>${op}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${relatorioIA.analiseComposicao ? `
                <div class="analise-composicao">
                    <h4>Análise de Composição</h4>
                    <p><strong>Sinergia:</strong> ${Math.round(relatorioIA.analiseComposicao.sinergia * 100)}%</p>
                    <p><strong>Balanceamento:</strong> ${relatorioIA.analiseComposicao.balanceamento.balanceado ? 'Bom' : 'Precisa melhorar'}</p>
                </div>
                ` : ''}
                
                ${relatorioIA.analiseObjetivos ? `
                <div class="analise-objetivos">
                    <h4>Estratégia de Objetivos</h4>
                    <p><strong>Arongueijo 1:25:</strong> ${relatorioIA.analiseObjetivos.decisaoArongueijo.estrategia}</p>
                    <p><strong>Decisão 5:00:</strong> ${relatorioIA.analiseObjetivos.decisaoArauto.estrategia}</p>
                </div>
                ` : ''}
                
                <h3>Áreas para Melhorar</h3>
                <ul class="areas-melhoria">
                    ${relatorioIA.areasMelhoria.map(area => `
                        <li><strong>${area.categoria || 'Geral'}:</strong> ${area.descricao || area}</li>
                    `).join('')}
                </ul>
                
                <h3>Ações Recomendadas</h3>
                <ul class="sugestoes">
                    ${relatorioIA.sugestoesPriorizadas.map(sugestao => `<li>${sugestao}</li>`).join('')}
                </ul>
                
                <div class="meta-destaque">
                    <strong>Meta para Próxima Partida:</strong><br>
                    ${relatorioIA.metaProximaPartida}
                </div>
            </div>
        `;
    }

    getDescricaoScore(score) {
        if (score >= 90) return 'Excelente! Continue com esse trabalho consistente.';
        if (score >= 80) return 'Muito bom! Pequenos ajustes farão grande diferença.';
        if (score >= 70) return 'Bom! Foque nas áreas de melhoria identificadas.';
        if (score >= 60) return 'Sólido! Continue praticando para melhorar.';
        return 'Continue analisando suas partidas para evoluir!';
    }

    iniciarNovaAnalise() {
        document.getElementById('formularioAnalisePartida')?.reset();
        this.mostrarPagina(1);
        console.log('Nova análise iniciada');
    }

    compartilharRelatorio() {
        const score = document.getElementById('scoreRelatorio')?.textContent || '85';
        const texto = `Minha análise no Wild Rift Analyzer: ${score}/100\n\nConfira seus relatórios em: ${window.location.href}`;
        
        if (navigator.share) {
            navigator.share({
                title: 'Minha Análise - Wild Rift',
                text: texto
            }).catch(() => this.copiarParaAreaTransferencia(texto));
        } else {
            this.copiarParaAreaTransferencia(texto);
        }
    }

    copiarParaAreaTransferencia(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            this.mostrarFeedback('Texto copiado para a área de transferência!');
        }).catch(() => {
            this.mostrarFeedback('Texto pronto para compartilhar!');
        });
    }

    mostrarLoading(mostrar) {
        const btnEnviar = document.querySelector('.btn-enviar');
        if (btnEnviar) {
            btnEnviar.disabled = mostrar;
            btnEnviar.textContent = mostrar ? 'Enviando...' : 'Enviar Análise';
            btnEnviar.classList.toggle('carregando', mostrar);
        }
    }

    mostrarErro(mensagem) {
        alert(`${mensagem}`);
    }

    mostrarFeedback(mensagem, tipo = 'sucesso') {
        const feedback = document.createElement('div');
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${tipo === 'erro' ? 'var(--cor-erro)' : 'var(--cor-sucesso)'};
            color: white;
            padding: 12px 20px;
            border-radius: var(--border-radius);
            z-index: 10000;
            box-shadow: var(--shadow);
        `;
        feedback.textContent = mensagem;
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.remove(), 3000);
    }
}

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', () => {
    window.analyzer = new WildRiftAnalyzer();
    window.analyzer.init();
});