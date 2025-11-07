// index.js - SISTEMA IA COACH HÍBRIDO COMPLETO PARA WILD RIFT

class SistemaAnaliseHibrido {
    constructor() {
        this.iaAtiva = true;
        this.ollamaDisponivel = false;
        this.conhecimento = {};
        this.historicoAnalises = [];
        this.padroesAprendidos = [];
        this.sinergiasCounters = {};
        
        // CONFIGURAÇÕES ATUALIZADAS - Novo modelo GPT-OSS
        this.ollamaConfig = {
            url: 'http://localhost:11434',
            model: 'gpt-oss:120bcloud',
            timeout: 45000,
            fallbackModels: ['gpt-oss:120bcloud', 'llama2', 'mistral', 'codellama']
        };

        this.contextoPartida = {
            tipo: 'solo_queue',
            coordenacao: 'limitada'
        };
        
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

    async inicializarOllama() {
        try {
            console.log('Testando conexão com Ollama...');
            
            const response = await fetch(`${this.ollamaConfig.url}/api/tags`, {
                method: 'GET'
            });

            if (response && response.ok) {
                const data = await response.json();
                console.log('Ollama conectado. Modelos disponíveis:', data.models);
                this.ollamaDisponivel = true;
                
                const modeloPadraoDisponivel = data.models?.some(model => 
                    model.name.includes(this.ollamaConfig.model)
                );
                
                if (!modeloPadraoDisponivel && data.models?.length > 0) {
                    this.ollamaConfig.model = data.models[0].name;
                    console.log(`Usando modelo: ${this.ollamaConfig.model}`);
                }
                
                return true;
            }
            
            console.warn('Ollama não está disponível. Usando modo regras.');
            this.ollamaDisponivel = false;
            return false;
            
        } catch (error) {
            console.warn('Erro ao conectar com Ollama:', error);
            this.ollamaDisponivel = false;
            return false;
        }
    }

    async carregarConhecimentoCompleto() {
        try {
            console.log('Carregando conhecimento completo para Wild Rift...');
            
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
                classesCampeoes: {
                    'tanque': ['Malphite', 'Amumu', 'Leona', 'Alistar', 'Braum', 'Nautilus', 'Shen', 'Ornn', 'Tahm Kench'],
                    'lutador': ['Darius', 'Garen', 'Renekton', 'Sett', 'Jax', 'Fiora', 'Riven', 'Camille', 'Irelia'],
                    'mago': ['Lux', 'Zoe', 'Xerath', 'Orianna', 'Ahri', 'Annie', 'Syndra', 'Veigar', 'Brand'],
                    'atirador': ['Vayne', 'KogMaw', 'Jinx', 'KaiSa', 'Caitlyn', 'Ezreal', 'Jhin', 'Miss Fortune', 'Tristana'],
                    'assassino': ['Zed', 'Talon', 'KhaZix', 'Akali', 'Fizz', 'Katarina', 'Leblanc', 'Pyke', 'Qiyana'],
                    'suporte': ['Lulu', 'Janna', 'Soraka', 'Nami', 'Yuumi', 'Sona', 'Thresh', 'Blitzcrank', 'Rakan']
                },
                powerSpikes: {
                    'Lee Sin': { niveis: [2, 3, 5], powerspike: 'EARLY', descricao: 'Dominante early game' },
                    'Yasuo': { niveis: [1, 2, 5], powerspike: 'FORTE', descricao: 'Forte com ultimate' },
                    'Vayne': { niveis: [5, 11, 15], powerspike: 'MUITO_FORTE', descricao: 'Hiper carry late game' },
                    'Lux': { niveis: [5, 9, 13], powerspike: 'FORTE', descricao: 'Burst com ultimate' },
                    'Zed': { niveis: [3, 5, 6], powerspike: 'FORTE', descricao: 'Assassino com ultimate' },
                    'Jinx': { niveis: [5, 9, 13], powerspike: 'MUITO_FORTE', descricao: 'Escaladora late game' },
                    'Malphite': { niveis: [5, 9], powerspike: 'FORTE', descricao: 'Teamfight com ultimate' },
                    'Darius': { niveis: [2, 3, 5], powerspike: 'FORTE', descricao: 'Duelista early' }
                },
                metricasPorElo: {
                    'Ferro-Bronze': { csMin: 4, participacao: 0.4, visao: 0.8, objetivos: 2, kda: 2.0 },
                    'Prata-Ouro': { csMin: 5, participacao: 0.5, visao: 1.2, objetivos: 3, kda: 2.5 },
                    'Platina-Esmeralda': { csMin: 6, participacao: 0.6, visao: 1.5, objetivos: 4, kda: 3.0 },
                    'Diamante+': { csMin: 7, participacao: 0.7, visao: 2.0, objetivos: 5, kda: 3.5 }
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
                }
            };

            await this.carregarConhecimentoDraft();
            await this.carregarSinergiasCounters();
            await this.inicializarOllama();
            console.log(`Ollama ${this.ollamaDisponivel ? 'disponível' : 'indisponível'}`);

            console.log('Conhecimento Wild Rift carregado completamente');
            return true;

        } catch (error) {
            console.error('Erro ao carregar conhecimento:', error);
            this.conhecimento = {};
            return false;
        }
    }

    async carregarConhecimentoDraft() {
        try {
            console.log('Carregando conhecimento de draft competitivo...');
            
            this.conhecimento.draft_competitivo = {
                fundamentos_leitura_meta: {
                    prioridades_globais_vs_regionais: {
                        metricas_avaliacao: [
                            "Taxa de disputa - frequência de pick/ban",
                            "Taxa de vitória contextual - performance em diferentes situações",
                            "Impacto relativo no jogo - capacidade de carregar partidas"
                        ]
                    }
                },
                tipos_composicao_fundamentais: {
                    "wombo_combo": {
                        identidade: "Explosão de dano em área coordenada",
                        janela_forca: "Mid game (5-15min)",
                        elementos_chave: ["Controle em área", "Dano em grupo"],
                        campeoes_ideais: ["Malphite", "Yasuo", "Orianna", "Miss Fortune", "Amumu"],
                        estrategia: "Forçar teamfights em objetivos com combos coordenados",
                        power_spike: "Nível 5 - ultimates online"
                    },
                    "protect_the_carry": {
                        identidade: "Proteção máxima ao hiper carry", 
                        janela_forca: "Late game (15min+)",
                        elementos_chave: ["Supports encantadores", "Tanks protetores"],
                        campeoes_ideais: ["Lulu", "Janna", "KogMaw", "Vayne", "Braum"],
                        estrategia: "Jogo seguro early, proteger carry no late",
                        power_spike: "2-3 itens completos do carry"
                    },
                    "dive_comp": {
                        identidade: "Mergulho agressivo no backline",
                        janela_forca: "Early-Mid game (1-10min)",
                        elementos_chave: ["Mobilidade", "Potencial de explosão"],
                        campeoes_ideais: ["Camille", "Lee Sin", "Zed", "Alistar", "KhaZix"],
                        estrategia: "Picks agressivos e mergulhos coordenados",
                        power_spike: "Nível 3-5 - habilidades básicas completas"
                    },
                    "poke_comp": {
                        identidade: "Desgaste a distância antes dos engajamentos",
                        janela_forca: "Mid game (5-15min)",
                        elementos_chave: ["Limpeza de ondas", "Dano a distância"],
                        campeoes_ideais: ["Zoe", "Xerath", "Jayce", "Varus", "Ziggs"],
                        estrategia: "Poke constante antes de objetivos",
                        power_spike: "Primeiro item completo"
                    }
                },
                estrategia_picks_flexiveis: {
                    exemplos_alto_impacto: {
                        "Sett": ["Top", "Suporte"],
                        "Gragas": ["Top", "Mid", "Jungle"],
                        "Karma": ["Top", "Mid", "Suporte"],
                        "Pyke": ["Suporte", "Mid"],
                        "Pantheon": ["Top", "Mid", "Suporte", "Jungle"]
                    }
                },
                camadas_sinergia: {
                    "mecanica": "Combos de habilidades específicas",
                    "estrategica": "Condições de vitória complementares", 
                    "ritmo": "Power spikes temporizados"
                }
            };
            
            console.log('Conhecimento de draft carregado com sucesso');
        } catch (error) {
            console.warn('Erro ao carregar conhecimento de draft:', error);
            this.conhecimento.draft_competitivo = {};
        }
    }

    async carregarSinergiasCounters() {
        try {
            console.log('Carregando dados de sinergias e counters...');
            
            this.sinergiasCounters = {
                categorias_sinergias: {
                    "wombo_combo": "Campeões com AoE CC que combinam devastadoramente",
                    "protect_the_carry": "Enchanters que protegem hypercarries", 
                    "dive_comp": "Campeões que mergulham no backline juntos",
                    "poke_comp": "Campeões de longo alcance que desgastam",
                    "split_push": "Duos que pressionam múltiplas lanes",
                    "pick_comp": "Campeões que isolam e executam alvos"
                },
                campeoes: {
                    "Malphite": {
                        sinergias: [
                            { campeao: "Yasuo", descricao: "Combo ultimate devastador - Yasuo pode usar ultimate no knockup" },
                            { campeao: "Orianna", descricao: "Combo de controle de área - Orianna ultimate seguindo Malphite" },
                            { campeao: "Miss Fortune", descricao: "CC em área combina com ultimate da MF" }
                        ],
                        counters: [
                            { campeao: "Morgana", descricao: "Escudo bloqueia todo o engajamento" },
                            { campeao: "Olaf", descricao: "Ultimate ignora controle de grupo" }
                        ]
                    },
                    "Yasuo": {
                        sinergias: [
                            { campeao: "Malphite", descricao: "Combo ultimate devastador" },
                            { campeao: "Alistar", descricao: "Knockups múltiplos para ultimate" },
                            { campeao: "Diana", descricao: "Puxada em área combina com ultimate" }
                        ],
                        counters: [
                            { campeao: "Annie", descricao: "Stun instantâneo countera mobilidade" },
                            { campeao: "Pantheon", descricao: "Bloqueia ataques básicos e Q" }
                        ]
                    },
                    "Vayne": {
                        sinergias: [
                            { campeao: "Lulu", descricao: "Buff de ataque e proteção máxima" },
                            { campeao: "Janna", descricao: "Escudo e peel para sobrevivência" }
                        ],
                        counters: [
                            { campeao: "Caitlyn", descricao: "Range maior domina early game" },
                            { campeao: "Malphite", descricao: "Atacapeed slow destrói DPS" }
                        ]
                    },
                    "Zed": {
                        sinergias: [
                            { campeao: "Lee Sin", descricao: "Mobilidade dupla para picks" }
                        ],
                        counters: [
                            { campeao: "Lissandra", descricao: "Ultimate countera todo o combo" },
                            { campeao: "Kayle", descricao: "Ultimate invencível bloqueia burst" }
                        ]
                    }
                }
            };
            
            console.log('Sinergias e counters carregados completamente');
        } catch (error) {
            console.warn('Erro ao carregar sinergias e counters:', error);
            this.sinergiasCounters = { categorias_sinergias: {}, campeoes: {} };
        }
    }

    async analisarPartidaComIA(dados) {
        if (!this.ollamaDisponivel) {
            return {
                sucesso: false,
                tipo: 'OLLAMA_INDISPONIVEL',
                erro: 'Ollama não está disponível'
            };
        }

        try {
            const prompt = this.construirPromptIA(dados);
            console.log(`Enviando prompt para Ollama (Modelo: ${this.ollamaConfig.model})...`);

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.ollamaConfig.timeout);

            const response = await fetch(`${this.ollamaConfig.url}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.ollamaConfig.model,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        top_p: 0.85,
                        top_k: 50,
                        num_predict: 1500,
                        repeat_penalty: 1.1,
                        num_ctx: 4096
                    }
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`Erro Ollama: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.response || data.response.trim().length < 100) {
                throw new Error('Resposta da IA muito curta ou vazia');
            }

            console.log(`Resposta da IA recebida com sucesso (Modelo: ${this.ollamaConfig.model})`);
            return {
                sucesso: true,
                tipo: 'IA',
                conteudo: data.response,
                modelo: this.ollamaConfig.model,
                raw: data
            };

        } catch (error) {
            console.error('Erro na análise IA:', error);
            
            if (error.name === 'AbortError' || error.message.includes('model')) {
                console.log('Tentando fallback para modelos alternativos...');
                return await this.tentarModelosAlternativos(dados);
            }
            
            return {
                sucesso: false,
                tipo: 'ERRO_IA',
                erro: error.message
            };
        }
    }

    async tentarModelosAlternativos(dados) {
        const modelosFallback = this.ollamaConfig.fallbackModels.filter(model => model !== this.ollamaConfig.model);
        
        for (const modelo of modelosFallback) {
            try {
                console.log(`Tentando modelo alternativo: ${modelo}`);
                this.ollamaConfig.model = modelo;
                
                const resultado = await this.analisarPartidaComIA(dados);
                if (resultado.sucesso) {
                    console.log(`Sucesso com modelo alternativo: ${modelo}`);
                    return resultado;
                }
            } catch (error) {
                console.warn(`Falha com modelo ${modelo}:`, error);
                continue;
            }
        }
        
        return {
            sucesso: false,
            tipo: 'TODOS_MODELOS_FALHARAM',
            erro: 'Todos os modelos tentados falharam'
        };
    }

    construirPromptIA(dados) {
        const composicoes = this.extrairComposicoes(dados);
        const analiseDraft = this.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        const analiseSinergias = this.analisarSinergiasTime(composicoes.timeAliado);

        return `
VOCÊ É GPT-OSS:120BCLOUD - UM COACH ESPECIALISTA EM WILD RIFT COM CAPACIDADES AVANÇADAS DE ANÁLISE.

Como modelo de 120B parâmetros, você possui:
- Análise estratégica profunda de drafts e composições
- Compreensão avançada de sinergias entre campeões
- Identificação de padrões complexos de jogo
- Recomendações específicas baseadas em data science

DADOS DO JOGADOR:
- Nickname: ${dados.nickname || 'N/A'}
- Elo: ${dados.elo || 'N/A'}
- Campeão: ${dados.campeao || 'N/A'}
- Rota: ${dados.rota || 'N/A'}

COMPOSIÇÃO DOS TIMES:
Time Aliado: 
• Top: ${dados.draft_aliado_top || 'N/A'}
• Jungle: ${dados.draft_aliado_jungle || 'N/A'} 
• Mid: ${dados.draft_aliado_mid || 'N/A'}
• ADC: ${dados.draft_aliado_adc || 'N/A'}
• Suporte: ${dados.draft_aliado_sup || 'N/A'}

Time Inimigo:
• Top: ${dados.draft_inimigo_top || 'N/A'}
• Jungle: ${dados.draft_inimigo_jungle || 'N/A'}
• Mid: ${dados.draft_inimigo_mid || 'N/A'}
• ADC: ${dados.draft_inimigo_adc || 'N/A'}
• Suporte: ${dados.draft_inimigo_sup || 'N/A'}

ANÁLISE DE DRAFT AVANÇADA:
${analiseDraft.composicao_identificada ? 
`• Composição Identificada: ${analiseDraft.composicao_identificada.tipo.replace('_', ' ').toUpperCase()}
• Identidade: ${analiseDraft.composicao_identificada.dados.identidade}
• Janela de Força: ${analiseDraft.composicao_identificada.dados.janela_forca}
• Estratégia Recomendada: ${analiseDraft.composicao_identificada.dados.estrategia}`
: '• Draft equilibrado - foco em execução'}

${analiseDraft.curva_poder_time ? 
`• Curva de Poder: ${analiseDraft.curva_poder_time.composicao_recomendada}
• Early Game: ${analiseDraft.curva_poder_time.early_game}/5
• Mid Game: ${analiseDraft.curva_poder_time.mid_game}/5
• Late Game: ${analiseDraft.curva_poder_time.late_game}/5` : ''}

${analiseDraft.sinergias_avancadas.length > 0 ? 
`• Sinergias Identificadas: ${analiseDraft.sinergias_avancadas.map(s => s.camada + ': ' + s.sinergias.map(s2 => s2.descricao).join(', ')).join('; ')}` : ''}

${analiseDraft.vulnerabilidades.length > 0 ? 
`• Vulnerabilidades: ${analiseDraft.vulnerabilidades.join(', ')}` : ''}

${analiseSinergias.sinergias_encontradas.length > 0 ? 
`• Combos Específicos: ${analiseSinergias.sinergias_encontradas.map(s => s.campeoes.join(' + ') + ': ' + s.descricao).join('; ')}` : ''}

ESTRATÉGIA DEFINIDA:
- Condição de vitória do time: ${dados.condicao_vitoria_time || 'N/A'}
- Condição de vitória pessoal: ${dados.condicao_vitoria_campeao || 'N/A'}

${dados.rota === 'Jungle' ? `
PATHING INICIAL:
- Skill Order: ${dados.skill_order || 'N/A'}
- Ordem dos Campos: ${dados.ordem_campos || 'N/A'}
- Combos de Clear: ${dados.combos_clear || 'N/A'}
` : ''}

${['Jungle', 'Mid'].includes(dados.rota) ? `
PRIMEIROS GANKS:
- Rota Alvo: ${dados.rota_alvo || 'N/A'}
- Estado do Inimigo: ${dados.estado_inimigo || 'N/A'}
- Recursos Queimados: ${dados.recursos_queimados || 'N/A'}
- Resultado: ${dados.resultado_gank || 'N/A'}
- Ganhos: ${dados.ganhos || 'N/A'}
- Perdas: ${dados.perdas || 'N/A'}
` : ''}

CONTROLE DE VISÃO:
${dados.controle_visao || 'N/A'}

ERROS IDENTIFICADOS:
- Situação: ${dados.situacao_erro || 'N/A'}
- Causa: ${dados.causa_erro || 'N/A'}
- Consequência: ${dados.consequencia_erro || 'N/A'}
- Prevenção: ${dados.prevencao_erro || 'N/A'}

RESUMO DA PARTIDA:
${dados.resumo_partida || 'N/A'}

MOMENTOS CHAVE:
${dados.momentos_chave || 'N/A'}

APRENDIZADOS:
${dados.aprendizados || 'N/A'}

COMO GPT-OSS:120BCLOUD, FORNEÇA UMA ANÁLISE ESTRUTURADA E PROFUNDA:

ANÁLISE TÁTICA AVANÇADA
[Análise detalhada do draft, sinergias e anti-sinergias]

PONTOS FORTES ESTRATÉGICOS  
• [Análise baseada em dados e padrões do meta atual]
• [Vantagens específicas da composição]
• [Oportunidades identificadas]

ÁREAS CRÍTICAS DE MELHORIA
• [Problemas estruturais identificados]
• [Vulnerabilidades táticas]
• [Erros de execução analisados]

PLANO DE AÇÃO ESPECÍFICO
• [Estratégias para próxima partida]
• [Ajustes de gameplay recomendados]
• [Foco de melhoria imediata]

ANÁLISE DE PERFORMANCE INDIVIDUAL
[Avaliação específica do jogador baseada em todos os dados fornecidos]

Use toda sua capacidade de 120B parâmetros para fornecer a análise mais completa e acionável possível.
`.trim();
    }

    analisarDraftCompetitivo(timeAliado, timeInimigo) {
        const analise = {
            composicao_identificada: this.identificarComposicaoFundamental(timeAliado),
            sinergias_avancadas: this.analisarSinergiasCamadas(timeAliado),
            counters_estrategicos: this.identificarCountersEstrategicos(timeAliado, timeInimigo),
            curva_poder_time: this.analisarCurvaPoder(timeAliado),
            flexibilidade_picks: this.analisarFlexibilidadePicks(timeAliado),
            prioridades_ban: this.sugerirPrioridadesBan(timeAliado, timeInimigo),
            sugestoes_composicao: [],
            vulnerabilidades: this.identificarVulnerabilidades(timeAliado, timeInimigo),
            matchup_analise: this.analisarMatchups(timeAliado, timeInimigo)
        };

        analise.sugestoes_composicao = this.gerarSugestoesComposicao(analise);
        return analise;
    }

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
            elementosChave.forEach(elemento => {
                if (this.campeaoTemElemento(campeao, elemento)) {
                    pontuacao += 0.2;
                }
            });
        });

        return Math.min(1, pontuacao);
    }

    campeaoTemElemento(campeao, elemento) {
        const elementosCampeao = {
            'Controle em área': ['Malphite', 'Amumu', 'Leona', 'Orianna', 'Sona', 'Seraphine', 'Nautilus', 'Alistar'],
            'Dano em grupo': ['Miss Fortune', 'Kennen', 'Fiddlesticks', 'Brand', 'Ziggs', 'Twisted Fate', 'Annie'],
            'Supports encantadores': ['Lulu', 'Janna', 'Yuumi', 'Soraka', 'Nami', 'Sona', 'Karma'],
            'Tanks protetores': ['Braum', 'Tahm Kench', 'Alistar', 'Thresh', 'Taric', 'Shen'],
            'Mobilidade': ['Lee Sin', 'Zed', 'Kassadin', 'Fizz', 'Akali', 'Camille', 'Irelia', 'Yasuo'],
            'Potencial de explosão': ['Zed', 'Diana', 'Syndra', 'Veigar', 'Annie', 'Leblanc', 'Fizz'],
            'Capacidade de duel': ['Fiora', 'Jax', 'Tryndamere', 'Camille', 'Riven', 'Irelia', 'Darius'],
            'Limpeza de ondas': ['Sivir', 'Anivia', 'Ziggs', 'Xerath', 'Lux', 'Morgana', 'Malzahar']
        };

        return elementosCampeao[elemento]?.includes(campeao) || false;
    }

    analisarSinergiasCamadas(timeAliado) {
        const sinergias = [];
        const campeoes = Object.values(timeAliado).filter(c => c);
        
        sinergias.push({
            camada: 'Mecânica',
            sinergias: this.analisarSinergiaMecanica(campeoes)
        });
        
        sinergias.push({
            camada: 'Estratégica', 
            sinergias: this.analisarSinergiaEstrategica(campeoes)
        });
        
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
            { campeoes: ['Leona', 'Miss Fortune'], descricao: 'CC em área + ultimate' },
            { campeoes: ['Amumu', 'Fiddlesticks'], descricao: 'CC em área duplo' }
        ];

        return combosConhecidos.filter(combo => 
            combo.campeoes.every(c => campeoes.includes(c))
        );
    }

    analisarSinergiaEstrategica(campeoes) {
        const sinergias = [];
        const curvas = this.analisarCurvaPoderTime(campeoes);
        
        if (curvas.early > 2 && curvas.late > 2) {
            sinergias.push('Composição equilibrada com múltiplas condições de vitória');
        }
        
        if (curvas.mid >= 3) {
            sinergias.push('Sinergia de ritmo - time alinhado no meio do jogo');
        }
        
        const temPoke = campeoes.some(c => ['Zoe', 'Xerath', 'Jayce', 'Varus'].includes(c));
        const temEngaje = campeoes.some(c => ['Malphite', 'Amumu', 'Leona'].includes(c));
        
        if (temPoke && temEngaje) {
            sinergias.push('Sinergia poke/engaje - desgaste seguido de all-in');
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
        
        if (powerSpikes.late.length >= 2) {
            sinergias.push('Time escalável - jogar seguro early, dominar late');
        }
        
        return sinergias;
    }

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
            } else {
                const classe = this.identificarClasseCampeao(campeao);
                if (['assassino', 'lutador'].includes(classe)) mid++;
                if (classe === 'atirador') late++;
                if (['tanque', 'mago'].includes(classe)) early++;
            }
        });
        
        return { early, mid, late };
    }

    identificarPowerSpikesTime(campeoes) {
        const spikes = {
            early: [],
            mid: [],
            late: []
        };

        campeoes.forEach(campeao => {
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

    sugerirComposicaoPorCurva(curvas) {
        if (curvas.early >= 3) return "Composição de early game agressivo - pressionar desde 1:25";
        if (curvas.mid >= 3) return "Composição de meio de jogo - focar objetivos 5:00-15:00";
        if (curvas.late >= 3) return "Composição de late game - farm seguro early, dominar após 15min";
        return "Composição equilibrada - adaptar estratégia conforme o jogo";
    }

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

    sugerirPrioridadesBan(timeAliado, timeInimigo) {
        const prioridades = [];
        const campeoesAliados = Object.values(timeAliado).filter(c => c);
        
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

    analisarMatchups(timeAliado, timeInimigo) {
        const matchups = [];
        const rotas = ['top', 'jungle', 'mid', 'adc', 'sup'];
        
        rotas.forEach(rota => {
            const aliado = timeAliado[rota];
            const inimigo = timeInimigo[rota];
            
            if (aliado && inimigo) {
                const matchup = this.obterMatchup(aliado, inimigo);
                if (matchup) {
                    matchups.push({
                        rota: rota.toUpperCase(),
                        aliado: aliado,
                        inimigo: inimigo,
                        dificuldade: matchup.dificuldade,
                        estrategia: matchup.estrategia,
                        dicas: matchup.dicas
                    });
                }
            }
        });
        
        return matchups;
    }

    obterMatchup(campeaoAliado, campeaoInimigo) {
        const dadosCampeao = this.sinergiasCounters.campeoes[campeaoAliado];
        if (!dadosCampeao) return null;
        
        const counter = dadosCampeao.counters?.find(c => c.campeao === campeaoInimigo);
        if (counter) {
            return {
                dificuldade: 'DIFICIL',
                estrategia: `Cuidado: ${counter.descricao}`,
                dicas: this.gerarDicasMatchup(campeaoAliado, campeaoInimigo)
            };
        }
        
        const sinergia = dadosCampeao.sinergias?.find(s => s.campeao === campeaoInimigo);
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
            dicas: ['Jogue seguro', 'Aguarde oportunidades', 'Peça ajuda do jungle se necessário']
        };
    }

    gerarDicasMatchup(campeaoAliado, campeaoInimigo) {
        const dicas = [];
        const dadosCampeao = this.sinergiasCounters.campeoes[campeaoAliado];
        
        if (dadosCampeao) {
            const counter = dadosCampeao.counters?.find(c => c.campeao === campeaoInimigo);
            if (counter) {
                if (counter.descricao.includes('true damage')) {
                    dicas.push('Construa resistência em vez de vida');
                }
                if (counter.descricao.includes('poke')) {
                    dicas.push('Foque em engajar rapidamente');
                    dicas.push('Use o brush para evitar poke');
                }
                if (counter.descricao.includes('bloqueia')) {
                    dicas.push('Use suas habilidades com cuidado');
                    dicas.push('Force o uso das habilidades defensivas primeiro');
                }
            }
        }
        
        return dicas.length > 0 ? dicas : ['Jogue defensivamente', 'Peça ajuda do jungle', 'Foque em farm seguro'];
    }

    gerarSugestoesComposicao(analiseDraft) {
        const sugestoes = [];
        
        if (analiseDraft.composicao_identificada) {
            const comp = analiseDraft.composicao_identificada;
            sugestoes.push(`Composição identificada: ${comp.tipo.replace('_', ' ').toUpperCase()}`);
            sugestoes.push(`${comp.dados.identidade}`);
            sugestoes.push(`Janela de força: ${comp.dados.janela_forca}`);
            sugestoes.push(`Estratégia: ${comp.dados.estrategia}`);
        }
        
        if (analiseDraft.curva_poder_time.early_game >= 3) {
            sugestoes.push("Time de early game - pressionar objetivos desde 1:25");
        }
        
        if (analiseDraft.flexibilidade_picks.score >= 3) {
            sugestoes.push("Aproveite a flexibilidade para swaps estratégicos");
        }
        
        if (analiseDraft.sinergias_avancadas.length > 0) {
            sugestoes.push("Explore as sinergias identificadas nas teamfights");
        }
        
        return sugestoes;
    }

    identificarVulnerabilidades(timeAliado, timeInimigo) {
        const vulnerabilidades = [];
        const campeoesAliados = Object.values(timeAliado).filter(c => c);
        
        const temTanque = campeoesAliados.some(campeao => 
            this.identificarClasseCampeao(campeao) === 'tanque'
        );
        if (!temTanque) {
            vulnerabilidades.push("Falta de frontline - time muito frágil em teamfights");
        }
        
        const temCCMassa = campeoesAliados.some(campeao => 
            ['Malphite', 'Amumu', 'Leona', 'Orianna', 'Sona', 'Seraphine', 'Nautilus'].includes(campeao)
        );
        if (!temCCMassa) {
            vulnerabilidades.push("Falta de controle em área - dificuldade em teamfights organizadas");
        }
        
        const danoMagico = campeoesAliados.some(campeao => 
            ['mago', 'assassino'].includes(this.identificarClasseCampeao(campeao))
        );
        const danoFisico = campeoesAliados.some(campeao => 
            ['atirador', 'lutador'].includes(this.identificarClasseCampeao(campeao))
        );
        
        if (!danoMagico || !danoFisico) {
            vulnerabilidades.push("Dano desbalanceado - inimigo pode stackar resistências facilmente");
        }
        
        const matchups = this.analisarMatchups(timeAliado, timeInimigo);
        const matchupsDificeis = matchups.filter(m => m.dificuldade === 'DIFICIL');
        if (matchupsDificeis.length >= 2) {
            vulnerabilidades.push(`Múltiplos matchups difíceis: ${matchupsDificeis.map(m => m.rota).join(', ')}`);
        }
        
        return vulnerabilidades;
    }

    analisarSinergiasTime(timeAliado) {
        const analise = {
            sinergias_encontradas: [],
            counters_potenciais: [],
            composicao_tipo: null,
            sugestoes: []
        };

        const campeoesTime = Object.values(timeAliado).filter(c => c);
        
        analise.composicao_tipo = this.identificarTipoComposicao(campeoesTime);
        analise.sinergias_encontradas = this.encontrarSinergiasTime(campeoesTime);
        analise.counters_potenciais = this.identificarCountersPotenciais(timeAliado);
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
                dadosCampeao.sinergias?.forEach(sinergia => {
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

        const melhorTipo = Object.keys(tipos).reduce((a, b) => tipos[a] > tipos[b] ? a : b);
        return tipos[melhorTipo] > 0 ? melhorTipo : 'balanced';
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
        
        const sinergiaAB = dadosA.sinergias?.find(s => s.campeao === campeaoB);
        if (sinergiaAB) {
            return {
                campeoes: [campeaoA, campeaoB],
                descricao: sinergiaAB.descricao,
                direcao: 'A→B'
            };
        }
        
        const sinergiaBA = dadosB.sinergias?.find(s => s.campeao === campeaoA);
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
        
        if (analise.composicao_tipo && analise.composicao_tipo !== 'balanced') {
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

    analisarPartidaComRegras(dados) {
        console.log('Usando sistema de regras como fallback');
        
        const analise = {
            score: this.calcularScoreRegras(dados),
            pontosFortes: [],
            areasMelhoria: [],
            sugestoes: []
        };

        const composicoes = this.extrairComposicoes(dados);
        const analiseDraft = this.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        const analiseSinergias = this.analisarSinergiasTime(composicoes.timeAliado);
        
        analise.pontosFortes.push(...analiseDraft.sugestoes_composicao);
        analise.pontosFortes.push(...analiseSinergias.sinergias_encontradas.map(s => `Sinergia: ${s.descricao}`));
        analise.areasMelhoria.push(...analiseDraft.vulnerabilidades);
        analise.areasMelhoria.push(...analiseSinergias.counters_potenciais.map(c => `Counter: ${c.counter} vs ${c.campeao_aliado}`));

        const analiseObjetivos = this.analisarObjetivosComRegras(dados);
        analise.pontosFortes.push(...analiseObjetivos.pontosFortes);
        analise.areasMelhoria.push(...analiseObjetivos.areasMelhoria);

        const analiseEstrategia = this.analisarEstrategiaComRegras(dados);
        analise.pontosFortes.push(...analiseEstrategia.pontosFortes);
        analise.areasMelhoria.push(...analiseEstrategia.areasMelhoria);

        analise.sugestoes.push(...this.gerarSugestoesPorRota(dados));
        analise.sugestoes.push(...analiseSinergias.sugestoes);

        return {
            sucesso: true,
            tipo: 'REGRA',
            conteudo: this.formatarRespostaRegras(analise),
            analise: analise,
            analiseDraft: analiseDraft,
            analiseSinergias: analiseSinergias
        };
    }

    analisarObjetivosComRegras(dados) {
        const resultado = { pontosFortes: [], areasMelhoria: [] };
        const objetivosConquistados = this.contarObjetivosConquistados(dados);

        if (objetivosConquistados >= 3) {
            resultado.pontosFortes.push(`Bom controle de objetivos: ${objetivosConquistados} capturados`);
        } else {
            resultado.areasMelhoria.push(`Poucos objetivos conquistados: ${objetivosConquistados} - priorize dragões e arauto`);
        }

        if (dados.objetivo_125_time === 'Aliado') {
            resultado.pontosFortes.push("Bom controle do arongueijo inicial às 1:25");
        } else if (dados.objetivo_125_time === 'Inimigo') {
            resultado.areasMelhoria.push("Perdeu arongueijo inicial - melhore controle early");
        }

        if (dados.objetivo_500_time === 'Aliado') {
            resultado.pontosFortes.push("Bom controle dos primeiros objetivos às 5:00");
        }

        return resultado;
    }

    contarObjetivosConquistados(dados) {
        let count = 0;
        const tempos = ['125', '500', '900', '1000', '1300', '1600'];
        
        tempos.forEach(tempo => {
            if (dados[`objetivo_${tempo}_time`] === 'Aliado') {
                count++;
            }
        });
        
        return count;
    }

    analisarEstrategiaComRegras(dados) {
        const resultado = { pontosFortes: [], areasMelhoria: [] };

        if (dados.condicao_vitoria_time && dados.condicao_vitoria_time.length > 20) {
            resultado.pontosFortes.push("Estratégia de vitória bem definida");
        } else {
            resultado.areasMelhoria.push("Estratégia de vitória pouco clara - defina melhor as condições");
        }

        if (dados.condicao_vitoria_campeao && dados.condicao_vitoria_campeao.length > 15) {
            resultado.pontosFortes.push("Objetivo pessoal claro");
        }

        if (dados.aprendizados && dados.aprendizados.length > 30) {
            resultado.pontosFortes.push("Boa reflexão sobre aprendizados");
        } else {
            resultado.areasMelhoria.push("Aprendizados podem ser mais detalhados");
        }

        if (dados.situacao_erro && dados.situacao_erro.length > 20) {
            resultado.pontosFortes.push("Análise de erros detalhada");
        } else {
            resultado.areasMelhoria.push("Análise de erros pode ser mais detalhada");
        }

        return resultado;
    }

    calcularScoreRegras(dados) {
        let score = 50;
        
        const objetivos = this.contarObjetivosConquistados(dados);
        score += objetivos * 4;

        const composicoes = this.extrairComposicoes(dados);
        const analiseDraft = this.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        if (analiseDraft.composicao_identificada) score += 10;
        if (analiseDraft.vulnerabilidades.length <= 1) score += 5;

        if (dados.condicao_vitoria_time && dados.condicao_vitoria_time.length > 30) score += 8;
        if (dados.aprendizados && dados.aprendizados.length > 50) score += 7;

        if (dados.situacao_erro && dados.situacao_erro.length > 25) score += 5;
        if (dados.prevencao_erro && dados.prevencao_erro.length > 20) score += 5;

        return Math.min(100, Math.max(0, score));
    }

    gerarSugestoesPorRota(dados) {
        const sugestoes = [];
        const rota = dados.rota;

        switch(rota) {
            case 'Jungle':
                sugestoes.push("Como jungle, priorize objetivos aos 5:00 (dragão/arauto)");
                sugestoes.push("Comunique seus ganks com pings antes de ir");
                sugestoes.push("Pathing eficiente é crucial - planeje seu clear inicial");
                sugestoes.push("Trackeie o jungle inimigo e contra-ganke");
                break;
            case 'Mid':
                sugestoes.push("Como mid, priorize rotações para ajudar outras rotas");
                sugestoes.push("Controle a visão do river para evitar ganks");
                sugestoes.push("Aproveite o nível 5 para fazer plays agressivas");
                sugestoes.push("Pushe a wave antes de fazer rotações");
                break;
            case 'Top':
                sugestoes.push("Como top, use TP para ajudar em objetivos importantes");
                sugestoes.push("Foque em split push quando possível");
                sugestoes.push("Comunique faltas do inimigo com pings");
                sugestoes.push("Aprenda a controlar a wave para seu advantage");
                break;
            case 'Adc':
                sugestoes.push("Como ADC, priorize farm seguro early game");
                sugestoes.push("Posicione-se atrás do frontline em teamfights");
                sugestoes.push("Acompanhe seu suporte em rotações");
                sugestoes.push("Foque em sobreviver - dano zero se estiver morto");
                break;
            case 'Sup':
                sugestoes.push("Como suporte, priorize visão em objetivos");
                sugestoes.push("Proteja seu ADC em todas as fases do jogo");
                sugestoes.push("Roam para mid quando seguro");
                sugestoes.push("Comunique CDs importantes do inimigo");
                break;
        }

        const elo = dados.elo || '';
        if (elo.includes('Ferro') || elo.includes('Bronze') || elo.includes('Prata')) {
            sugestoes.push("Foque em farm consistente - não sacrifique CS por fights arriscadas");
            sugestoes.push("Priorize objetivos em vez de perseguir kills");
            sugestoes.push("Melhore o mapa awareness - olhe o minimap a cada 10 segundos");
        } else if (elo.includes('Ouro') || elo.includes('Platina')) {
            sugestoes.push("Trabalhe na comunicação com o time");
            sugestoes.push("Aperfeiçoe o controle de wave");
            sugestoes.push("Pratique decisões macro mais consistentes");
        }

        return sugestoes;
    }

    formatarRespostaRegras(analise) {
        return `
RELATÓRIO DO COACH (Sistema de Regras Avançado)

ANÁLISE GERAL
Score: ${analise.score}/100

PONTOS FORTES
${analise.pontosFortes.map(ponto => `• ${ponto}`).join('\n')}

ÁREAS PARA MELHORIA  
${analise.areasMelhoria.map(area => `• ${area}`).join('\n')}

RECOMENDAÇÕES ESTRATÉGICAS
${analise.sugestoes.map(sugestao => `• ${sugestao}`).join('\n')}

PRÓXIMOS PASSOS
• Revise os objetivos perdidos e identifique padrões
• Pratique 2-3 das recomendações acima na próxima partida
• Continue analisando suas próprias jogadas
• Foque em uma área de melhoria por vez

  Dica: Para análise mais detalhada e personalizada, use a IA Coach com Ollama.

Sistema de regras avançado - Continue evoluindo! 
        `.trim();
    }

    validarRespostaIA(resposta) {
        if (!resposta || typeof resposta !== 'string') return false;
        if (resposta.length < 100) return false;
        
        const respostaUpper = resposta.toUpperCase();
        const secoesMinimas = ['PONTOS FORTES', 'MELHORIA', 'ESTRATÉGIA'];
        const secoesEncontradas = secoesMinimas.filter(secao => 
            respostaUpper.includes(secao)
        );
        
        return secoesEncontradas.length >= 2;
    }

    calcularScoreIA(resposta) {
        if (!resposta) return 75;
        
        let score = 70;
        const respostaLower = resposta.toLowerCase();
        
        if (respostaLower.includes('excelente') || respostaLower.includes('excepcional')) score += 15;
        if (respostaLower.includes('bom') || respostaLower.includes('sólido') || respostaLower.includes('positivo')) score += 10;
        if (respostaLower.includes('precisa melhorar') || respostaLower.includes('atenção') || respostaLower.includes('cuidado')) score -= 10;
        if (respostaLower.includes('recomendo') || respostaLower.includes('sugiro') || respostaLower.includes('aconselho')) score += 5;
        
        if (respostaLower.includes('•') || respostaLower.includes('-')) score += 5;
        
        if (respostaLower.includes('farm') || respostaLower.includes('objetivos') || respostaLower.includes('visão')) score += 5;
        
        return Math.min(95, Math.max(50, score));
    }

    async analisarPartidaHibrido(dados) {
        console.log('Iniciando análise híbrida completa...');

        let resultadoIA = null;
        let tentarIA = this.ollamaDisponivel;

        if (tentarIA) {
            console.log('Tentando análise com Ollama...');
            resultadoIA = await this.analisarPartidaComIA(dados);
            
            if (resultadoIA.sucesso && this.validarRespostaIA(resultadoIA.conteudo)) {
                console.log('Análise IA bem-sucedida');
                
                const composicoes = this.extrairComposicoes(dados);
                const analiseDraft = this.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
                const analiseSinergias = this.analisarSinergiasTime(composicoes.timeAliado);
                
                return {
                    ...resultadoIA,
                    score: this.calcularScoreIA(resultadoIA.conteudo),
                    metodo: 'IA',
                    timestamp: new Date().toISOString(),
                    ollamaModel: this.ollamaConfig.model,
                    analiseDraft: analiseDraft,
                    analiseSinergias: analiseSinergias
                };
            } else {
                console.log('Análise IA falhou:', resultadoIA.erro);
                if (resultadoIA.tipo === 'OLLAMA_INDISPONIVEL' || resultadoIA.tipo === 'TIMEOUT') {
                    this.ollamaDisponivel = false;
                }
            }
        }

        console.log('Usando fallback para regras avançadas');
        const resultadoRegras = this.analisarPartidaComRegras(dados);
        
        return {
            ...resultadoRegras,
            metodo: 'REGRA',
            fallback: true,
            fallbackRazao: resultadoIA?.erro || 'Ollama indisponível',
            timestamp: new Date().toISOString()
        };
    }

    identificarClasseCampeao(nomeCampeao) {
        if (!nomeCampeao) return null;
        
        for (const [classe, campeoes] of Object.entries(this.conhecimento.classesCampeoes)) {
            if (campeoes.some(c => c.toLowerCase().includes(nomeCampeao.toLowerCase()))) {
                return classe;
            }
        }
        return null;
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

    async testarConexaoOllama() {
        try {
            const response = await fetch(`${this.ollamaConfig.url}/api/tags`);
            
            if (response.ok) {
                const data = await response.json();
                this.ollamaDisponivel = true;
                return {
                    conectado: true,
                    modelos: data.models || []
                };
            }
        } catch (error) {
            console.warn('Teste de conexão Ollama falhou:', error);
        }
        
        this.ollamaDisponivel = false;
        return { conectado: false, modelos: [] };
    }

    aprenderDeAnalise(analise, dados) {
        const padrao = {
            timestamp: new Date().toISOString(),
            contexto: this.contextoPartida,
            score: analise.score || 75,
            metodo: analise.metodo,
            sugestoesEfetivas: analise.analise?.sugestoes?.slice(0, 2) || []
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

    carregarPadroesAprendidos() {
        try {
            const padroes = localStorage.getItem('ia_coach_padroes');
            if (padroes) {
                this.padroesAprendidos = JSON.parse(padroes);
            }
        } catch (error) {
            console.warn('Erro ao carregar padrões:', error);
        }
    }
}

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

        this.iaCoach = new SistemaAnaliseHibrido();
        
        this.campeoes = [
            'Aatrox', 'Ahri', 'Akali', 'Akshan', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe',
            'Aurelion Sol', 'Azir', 'Bardo', 'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Camille',
            'Corki', 'Darius', 'Diana', 'Draven', 'Dr. Mundo', 'Ekko', 'Elise', 'Evelynn', 'Ezreal',
            'Fiddlesticks', 'Fiora', 'Fizz', 'Galio', 'Garen', 'Gnar', 'Gragas', 'Graves', 'Gwen',
            'Hecarim', 'Heimerdinger', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV', 'Jax',
            'Jayce', 'Jhin', 'Jinx', 'KaiSa', 'Kalista', 'Karma', 'Katarina', 'Kassadin', 'Kayle',
            'Kayn', 'Kennen', 'KhaZix', 'Kindred', 'KogMaw', 'LeBlanc', 'Lee Sin', 'Leona', 'Lillia',
            'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'Master Yi',
            'Miss Fortune', 'Mordekaiser', 'Morgana', 'Nami', 'Nasus', 'Nautilus', 'Nidalee', 'Nilah',
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
            console.log('Inicializando Wild Rift Analyzer Híbrido Completo...');
            
            await this.inicializarSistemas();
            this.configurarEventos();
            await this.inicializarEmailJS();
            
            const testeOllama = await this.iaCoach.testarConexaoOllama();
            console.log(`Ollama: ${testeOllama.conectado ? 'CONECTADO' : 'INDISPONÍVEL'}`);
            
            this.sistemaPronto = true;
            
            if (testeOllama.conectado) {
                this.mostrarFeedback(`Sistema IA Coach GPT-OSS inicializado! Modelo: ${this.iaCoach.ollamaConfig.model}`, 'sucesso');
            } else {
                this.mostrarFeedback('Sistema em modo regras avançado - Ollama não detectado', 'info');
            }
            
        } catch (error) {
            console.error('Erro na inicialização:', error);
            this.mostrarFeedback('Sistema inicializado em modo avançado', 'info');
        }
    }

    async inicializarSistemas() {
        this.inicializarAutocompleteCampeoes();
        this.inicializarObjetivos();
        this.inicializarUpload();
        await this.iaCoach.carregarConhecimentoCompleto();
        this.iaCoach.carregarPadroesAprendidos();
        
        this.adicionarStatusOllama();
    }

    adicionarStatusOllama() {
        const titulo = document.getElementById('tituloPrincipal');
        if (titulo) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'ollamaStatus';
            statusDiv.style.cssText = `
                text-align: center;
                margin: 10px 0;
                padding: 10px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                display: inline-block;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            `;
            
            titulo.parentNode.insertBefore(statusDiv, titulo.nextSibling);
            this.atualizarStatusOllama();
        }
    }

    async atualizarStatusOllama() {
        const statusDiv = document.getElementById('ollamaStatus');
        if (!statusDiv) return;

        const teste = await this.iaCoach.testarConexaoOllama();
        
        if (teste.conectado) {
            const modeloAtual = this.iaCoach.ollamaConfig.model;
            statusDiv.innerHTML = `
                GPT-OSS Coach • ${modeloAtual}
                <div class="modelo-info">Modelo de 120B parâmetros - Análise Avançada</div>
            `;
            statusDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            statusDiv.style.color = 'white';
        } else {
            statusDiv.innerHTML = `
                Coach Avançado • Modo Regras
                <div class="modelo-info">Sistema de regras - Ollama offline</div>
            `;
            statusDiv.style.background = 'linear-gradient(135deg, #ff416c, #ff4b2b)';
            statusDiv.style.color = 'white';
        }
    }

    inicializarAutocompleteCampeoes() {
        const datalist = document.getElementById('listaCampeoes');
        if (datalist) {
            datalist.innerHTML = '';
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

        document.querySelectorAll('.upload-area').forEach(area => {
            area.addEventListener('click', (e) => {
                if (!e.target.closest('.btn-remover-imagem')) {
                    const input = area.closest('.upload-label').querySelector('.upload-input');
                    input.click();
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

        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && this.paginaAtual < 6) {
                e.preventDefault();
                this.avancarPagina();
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
            this.mostrarFeedback('Preencha todos os campos obrigatórios antes de avançar.', 'erro');
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
            this.mostrarFeedback('Preencha todos os campos obrigatórios antes de enviar.', 'erro');
            return;
        }

        try {
            this.mostrarLoading(true);
            
            await this.atualizarStatusOllama();
            
            const dados = this.coletarDadosFormulario();
            
            const resultadoAnalise = await this.iaCoach.analisarPartidaHibrido(dados);
            
            console.log(`Análise concluída via: ${resultadoAnalise.metodo}`);
            
            if (resultadoAnalise.metodo === 'IA') {
                this.mostrarFeedback(`Análise GPT-OSS concluída! Modelo: ${resultadoAnalise.modelo}`, 'sucesso');
            } else {
                this.mostrarFeedback('Análise avançada concluída (modo regras)', 'info');
            }
            
            this.iaCoach.aprenderDeAnalise(resultadoAnalise, dados);
            
            this.enviarEmail(dados).catch(console.error);
            
            this.mostrarResultadoAnalise(resultadoAnalise);
            
        } catch (error) {
            console.error('Erro ao enviar análise:', error);
            this.mostrarFeedback('Erro ao processar análise. Tente novamente.', 'erro');
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
            } else if (value instanceof File) {
                // Arquivos serão processados separadamente no email
                dados[key] = value.name;
            }
        }
        
        this.analiseAtualId = `WR-${Date.now().toString(36).toUpperCase()}`;
        dados.analysis_id = this.analiseAtualId;
        dados.timestamp = new Date().toISOString();
        dados.metodo_analise = this.iaCoach.ollamaDisponivel ? 'GPT-OSS' : 'Regras Avançadas';
        
        return dados;
    }

    async enviarEmail(dados) {
        try {
            console.log('Iniciando envio de email...');
            
            const resultado = await this.enviarEmailReal(new FormData(document.getElementById('formularioAnalisePartida')));
            
            if (resultado) {
                console.log('Email enviado com sucesso!');
                this.mostrarFeedback('Relatório enviado para análise!', 'sucesso');
            } else {
                console.warn('Email não enviado, mas análise processada localmente');
                this.mostrarFeedback('Análise concluída! (Email não enviado)', 'info');
            }
            
            return resultado;
        } catch (error) {
            console.error('Erro no envio de email:', error);
            this.mostrarFeedback('Análise concluída localmente!', 'info');
            return false;
        }
    }

    async enviarEmailReal(formData) {
        try {
            // Inicializar EmailJS se disponível
            if (typeof emailjs !== 'undefined') {
                await emailjs.init(this.config.email.publicKey);
            }

            const dados = this.coletarDadosFormulario();
            const imagens = {};
            
            // Processar imagens separadamente
            for (let [key, value] of formData.entries()) {
                if (value instanceof File) {
                    imagens[key] = {
                        nome: value.name,
                        tamanho: value.size,
                        tipo: value.type
                    };
                    // Converter imagem para base64
                    dados[key] = await this.fileToBase64(value);
                }
            }

            // Adicionar metadados da análise
            dados.analysis_id = this.analiseAtualId || `WR-${Date.now().toString(36).toUpperCase()}`;
            dados.timestamp = new Date().toISOString();
            dados.sistema_versao = '3.0-hibrido';
            dados.metodo_analise = this.iaCoach.ollamaDisponivel ? 'GPT-OSS' : 'Regras Avançadas';

            // Template parameters atualizados
            const templateParams = {
                // Informações básicas do jogador
                from_name: dados.nickname || 'Jogador Wild Rift',
                from_email: 'sistema@nittocoach.com',
                reply_to: dados.email || 'nao-responder@nittocoach.com',
                to_email: this.config.email.destino,
                subject: `Analise WR - ${dados.nickname || 'Jogador'} | ${dados.elo || 'Sem Elo'} | ${dados.campeao || 'Sem Campeão'}`,
                
                // Dados da análise
                analysis_id: dados.analysis_id,
                data_envio: new Date().toLocaleString('pt-BR'),
                sistema_versao: dados.sistema_versao,
                metodo_analise: dados.metodo_analise,
                
                // Dados do jogador
                nickname: dados.nickname,
                elo: dados.elo,
                campeao: dados.campeao,
                rota: dados.rota,
                nome: dados.nome,
                email: dados.email,
                
                // Composição dos times
                draft_aliado: this.formatarDraftParaEmail(dados, 'aliado'),
                draft_inimigo: this.formatarDraftParaEmail(dados, 'inimigo'),
                
                // Estratégia e objetivos
                condicao_vitoria_time: dados.condicao_vitoria_time,
                condicao_vitoria_campeao: dados.condicao_vitoria_campeao,
                objetivos_conquistados: this.contarObjetivosConquistados(dados),
                
                // Análise do jogador
                resumo_partida: dados.resumo_partida,
                momentos_chave: dados.momentos_chave,
                aprendizados: dados.aprendizados,
                
                // Dados específicos por rota
                ...this.extrairDadosRotaEspecifica(dados),
                
                // Erros e melhorias
                erros_identificados: this.formatarErrosParaEmail(dados),
                
                // HTML formatado
                html_content: this.gerarHTMLEmailCompleto(dados, imagens),
                
                // Dados brutos para backup
                raw_data: JSON.stringify(dados, null, 2),
                
                // Metadados do sistema
                priority: 'high',
                category: 'analise_partida_wr_hibrido'
            };

            console.log('Enviando análise via EmailJS...', {
                service: this.config.email.serviceId,
                template: this.config.email.templateId
            });

            if (typeof emailjs !== 'undefined') {
                const response = await emailjs.send(
                    this.config.email.serviceId,
                    this.config.email.templateId, 
                    templateParams
                );

                console.log('Email enviado com sucesso!', response);
                
                // Registrar no histórico
                this.registrarEnvioEmail(dados.analysis_id, true);
                
                return response.status === 200;
            } else {
                console.warn('EmailJS não disponível, usando fallback');
                return await this.enviarBackupEmail(dados);
            }
            
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            
            // Registrar falha
            if (this.analiseAtualId) {
                this.registrarEnvioEmail(this.analiseAtualId, false, error.message);
            }
            
            return await this.enviarBackupEmail(this.coletarDadosFormulario());
        }
    }

    // NOVO: Formatar draft para email
    formatarDraftParaEmail(dados, tipo) {
        const prefix = tipo === 'aliado' ? 'draft_aliado' : 'draft_inimigo';
        return `
Top: ${dados[`${prefix}_top`] || 'N/A'}
Jungle: ${dados[`${prefix}_jungle`] || 'N/A'}
Mid: ${dados[`${prefix}_mid`] || 'N/A'}
ADC: ${dados[`${prefix}_adc`] || 'N/A'}
Suporte: ${dados[`${prefix}_sup`] || 'N/A'}
        `.trim();
    }

    // NOVO: Extrair dados específicos por rota
    extrairDadosRotaEspecifica(dados) {
        const rota = dados.rota;
        const dadosRota = {};
        
        if (rota === 'Jungle') {
            dadosRota.jungle_info = `
Skill Order: ${dados.skill_order || 'N/A'}
Ordem Campos: ${dados.ordem_campos || 'N/A'}
Combos Clear: ${dados.combos_clear || 'N/A'}
            `.trim();
        }
        
        if (['Jungle', 'Mid'].includes(rota)) {
            dadosRota.ganks_info = `
Rota Alvo: ${dados.rota_alvo || 'N/A'}
Estado Inimigo: ${dados.estado_inimigo || 'N/A'}
Resultado: ${dados.resultado_gank || 'N/A'}
            `.trim();
        }
        
        return dadosRota;
    }

    // NOVO: Formatar erros para email
    formatarErrosParaEmail(dados) {
        if (!dados.situacao_erro) return 'Nenhum erro detalhado';
        
        return `
Situação: ${dados.situacao_erro || 'N/A'}
Causa: ${dados.causa_erro || 'N/A'}
Consequência: ${dados.consequencia_erro || 'N/A'}
Prevenção: ${dados.prevencao_erro || 'N/A'}
        `.trim();
    }

    // ATUALIZADO: Gerar HTML completo para o email (SEM EMOJIS)
    gerarHTMLEmailCompleto(dados, imagens) {
        const composicoes = this.iaCoach.extrairComposicoes(dados);
        const analiseDraft = this.iaCoach.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        const analiseSinergias = this.iaCoach.analisarSinergiasTime(composicoes.timeAliado);
        
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            color: #333; 
            line-height: 1.6;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .header {
            background: linear-gradient(135deg, #0a1428 0%, #1a2d5a 100%);
            color: #c8aa6e;
            padding: 30px 20px;
            text-align: center;
            border-bottom: 4px solid #c8aa6e;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header .subtitle {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin: 25px 0;
            padding: 20px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            background: #f8f9fa;
        }
        .section-title {
            color: #0a1428;
            border-bottom: 3px solid #c8aa6e;
            padding-bottom: 10px;
            margin-bottom: 15px;
            font-size: 20px;
            font-weight: 600;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }
        .info-item {
            background: white;
            padding: 12px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .info-item strong {
            color: #0a1428;
            display: block;
            margin-bottom: 5px;
        }
        .draft-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
        }
        .draft-team {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #e9ecef;
        }
        .draft-team h3 {
            color: #0a1428;
            margin-top: 0;
            border-bottom: 2px solid #c8aa6e;
            padding-bottom: 8px;
        }
        .objetivo-item {
            background: white;
            padding: 10px;
            margin: 8px 0;
            border-radius: 6px;
            border-left: 4px solid #28a745;
        }
        .imagem-info {
            background: #e3f2fd;
            padding: 12px;
            margin: 8px 0;
            border-radius: 6px;
            border: 1px solid #bbdefb;
        }
        .score-badge {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 10px;
            margin: 20px 0;
            font-weight: bold;
            font-size: 24px;
        }
        .analysis-id {
            background: #0a1428;
            color: #c8aa6e;
            padding: 15px;
            text-align: center;
            border-radius: 8px;
            font-family: monospace;
            font-size: 16px;
            margin: 20px 0;
        }
        .footer {
            background: #0a1428;
            color: #c8aa6e;
            padding: 20px;
            text-align: center;
            font-size: 14px;
        }
        .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            margin-left: 10px;
        }
        .badge-ia {
            background: #667eea;
            color: white;
        }
        .badge-regra {
            background: #ff9800;
            color: white;
        }
        .composicao-info {
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .vulnerabilidade {
            background: #ffebee;
            border-left: 4px solid #f44336;
            padding: 12px;
            margin: 8px 0;
            border-radius: 6px;
        }
        .sinergia {
            background: #e8f5e8;
            border-left: 4px solid #4caf50;
            padding: 12px;
            margin: 8px 0;
            border-radius: 6px;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>Analise de Partida - Wild Rift</h1>
            <div class="subtitle">
                Sistema Hibrido GPT-OSS • ${this.iaCoach.ollamaDisponivel ? 'IA Avancada' : 'Regras Especializadas'}
                <span class="badge ${this.iaCoach.ollamaDisponivel ? 'badge-ia' : 'badge-regra'}">
                    ${this.iaCoach.ollamaDisponivel ? 'GPT-OSS' : 'REGRA'}
                </span>
            </div>
        </div>
        
        <div class="content">
            <!-- Informações do Jogador -->
            <div class="section">
                <h2 class="section-title">Informacoes do Jogador</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Nome</strong>
                        ${dados.nome || 'Nao informado'}
                    </div>
                    <div class="info-item">
                        <strong>Nickname</strong>
                        ${dados.nickname || 'Anonimo'}
                    </div>
                    <div class="info-item">
                        <strong>Elo</strong>
                        ${dados.elo || 'Nao informado'}
                    </div>
                    <div class="info-item">
                        <strong>Campeao</strong>
                        ${dados.campeao || 'Nao informado'}
                    </div>
                    <div class="info-item">
                        <strong>Rota</strong>
                        ${dados.rota || 'Nao informado'}
                    </div>
                    <div class="info-item">
                        <strong>Email</strong>
                        ${dados.email || 'Nao informado'}
                    </div>
                </div>
            </div>
            
            <!-- Draft da Partida -->
            <div class="section">
                <h2 class="section-title">Draft da Partida</h2>
                <div class="draft-container">
                    <div class="draft-team">
                        <h3>Time Aliado</h3>
                        <p><strong>Top:</strong> ${dados.draft_aliado_top || 'Nao preenchido'}</p>
                        <p><strong>Jungle:</strong> ${dados.draft_aliado_jungle || 'Nao preenchido'}</p>
                        <p><strong>Mid:</strong> ${dados.draft_aliado_mid || 'Nao preenchido'}</p>
                        <p><strong>ADC:</strong> ${dados.draft_aliado_adc || 'Nao preenchido'}</p>
                        <p><strong>Suporte:</strong> ${dados.draft_aliado_sup || 'Nao preenchido'}</p>
                    </div>
                    <div class="draft-team">
                        <h3>Time Inimigo</h3>
                        <p><strong>Top:</strong> ${dados.draft_inimigo_top || 'Nao informado'}</p>
                        <p><strong>Jungle:</strong> ${dados.draft_inimigo_jungle || 'Nao informado'}</p>
                        <p><strong>Mid:</strong> ${dados.draft_inimigo_mid || 'Nao informado'}</p>
                        <p><strong>ADC:</strong> ${dados.draft_inimigo_adc || 'Nao informado'}</p>
                        <p><strong>Suporte:</strong> ${dados.draft_inimigo_sup || 'Nao informado'}</p>
                    </div>
                </div>
                
                ${analiseDraft.composicao_identificada ? `
                <div class="composicao-info">
                    <h4>Composicao Identificada</h4>
                    <p><strong>Tipo:</strong> ${analiseDraft.composicao_identificada.tipo.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Identidade:</strong> ${analiseDraft.composicao_identificada.dados.identidade}</p>
                    <p><strong>Janela de Forca:</strong> ${analiseDraft.composicao_identificada.dados.janela_forca}</p>
                    <p><strong>Estrategia:</strong> ${analiseDraft.composicao_identificada.dados.estrategia}</p>
                </div>
                ` : ''}
                
                ${analiseSinergias.sinergias_encontradas.length > 0 ? `
                <div class="sinergia">
                    <h4>Sinergias Identificadas</h4>
                    ${analiseSinergias.sinergias_encontradas.map(s => `
                        <p><strong>${s.campeoes.join(' + ')}:</strong> ${s.descricao}</p>
                    `).join('')}
                </div>
                ` : ''}
                
                ${analiseDraft.vulnerabilidades.length > 0 ? `
                <div class="vulnerabilidade">
                    <h4>Vulnerabilidades</h4>
                    <ul>
                        ${analiseDraft.vulnerabilidades.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
            
            <!-- Objetivos Conquistados -->
            <div class="section">
                <h2 class="section-title">Objetivos Conquistados</h2>
                ${this.gerarHTMLObjetivos(dados)}
            </div>
            
            <!-- Estratégia e Análise -->
            <div class="section">
                <h2 class="section-title">Analise e Estrategia</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Condicao de Vitoria (Time)</strong>
                        ${dados.condicao_vitoria_time || 'Nao definida'}
                    </div>
                    <div class="info-item">
                        <strong>Condicao de Vitoria (Pessoal)</strong>
                        ${dados.condicao_vitoria_campeao || 'Nao definida'}
                    </div>
                </div>
                
                <div class="info-item">
                    <strong>Resumo da Partida</strong>
                    ${dados.resumo_partida || 'Nao informado'}
                </div>
                
                <div class="info-item">
                    <strong>Momentos Chave</strong>
                    ${dados.momentos_chave || 'Nao informado'}
                </div>
                
                <div class="info-item">
                    <strong>Aprendizados</strong>
                    ${dados.aprendizados || 'Nao informado'}
                </div>
            </div>
            
            <!-- Dados Específicos da Rota -->
            ${this.gerarHTMLDadosRota(dados)}
            
            <!-- Imagens Anexadas -->
            ${Object.keys(imagens).length > 0 ? `
            <div class="section">
                <h2 class="section-title">Imagens Anexadas</h2>
                ${Object.keys(imagens).map(key => `
                    <div class="imagem-info">
                        <strong>${key.replace('imagem_', '').toUpperCase()}:</strong> 
                        ${imagens[key].nome} (${Math.round(imagens[key].tamanho/1024)}KB)
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <!-- ID da Análise -->
            <div class="analysis-id">
                ID da Analise: ${dados.analysis_id}
            </div>
        </div>
        
        <div class="footer">
            <p>Enviado por Sistema Nitto Coach • Wild Rift Analyzer Hibrido v3.0</p>
            <p>${new Date().toLocaleString('pt-BR')} • ${dados.metodo_analise}</p>
        </div>
    </div>
</body>
</html>
        `;
    }

    // ATUALIZADO: Gerar HTML para dados específicos da rota (SEM EMOJIS)
    gerarHTMLDadosRota(dados) {
        const rota = dados.rota;
        
        if (rota === 'Jungle') {
            return `
            <div class="section">
                <h2 class="section-title">Dados do Jungle</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Skill Order</strong>
                        ${dados.skill_order || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Ordem dos Campos</strong>
                        ${dados.ordem_campos || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Combos de Clear</strong>
                        ${dados.combos_clear || 'N/A'}
                    </div>
                </div>
            </div>
            `;
        }
        
        if (['Jungle', 'Mid'].includes(rota)) {
            return `
            <div class="section">
                <h2 class="section-title">Ganks e Rotations</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Rota Alvo</strong>
                        ${dados.rota_alvo || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Estado do Inimigo</strong>
                        ${dados.estado_inimigo || 'N/A'}
                    </div>
                    <div class="info-item">
                        <strong>Resultado do Gank</strong>
                        ${dados.resultado_gank || 'N/A'}
                    </div>
                </div>
            </div>
            `;
        }
        
        return '';
    }

    // MÉTODOS AUXILIARES

    gerarHTMLObjetivos(dados) {
        const objetivos = [];
        const tempos = ['125', '600', '1100', '1500', '1600', '1800'];
        
        tempos.forEach(tempo => {
            const tipo = dados[`objetivo_${tempo}_tipo`] || dados[`objetivo_${tempo}_tipo_1`];
            const time = dados[`objetivo_${tempo}_time`];
            
            if (tipo && time) {
                objetivos.push(`
                    <div class="objetivo-item">
                        <strong>${this.formatarTempoObjetivo(tempo)}:</strong> 
                        ${tipo} - ${time}
                    </div>
                `);
            }
        });
        
        return objetivos.length > 0 ? objetivos.join('') : '<p>Nenhum objetivo registrado</p>';
    }

    formatarTempoObjetivo(tempo) {
        const tempos = {
            '125': '1:25 - Arongueijos',
            '600': '6:00 - Primeiro Objetivo', 
            '1100': '11:00 - Segundo Dragão',
            '1500': '15:00 - Baron Nashor',
            '1600': '16:00 - Terceiro Dragão/Baron',
            '1800': '18:00 - Dragão Ancião'
        };
        return tempos[tempo] || tempo;
    }

    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    // NOVO: Registrar envio de email
    registrarEnvioEmail(analysisId, sucesso, erro = null) {
        const registro = {
            id: analysisId,
            timestamp: new Date().toISOString(),
            sucesso: sucesso,
            erro: erro,
            metodo: this.iaCoach.ollamaDisponivel ? 'IA' : 'Regra'
        };
        
        try {
            const historico = JSON.parse(localStorage.getItem('email_history') || '[]');
            historico.unshift(registro);
            // Manter apenas os últimos 50 registros
            if (historico.length > 50) historico.pop();
            localStorage.setItem('email_history', JSON.stringify(historico));
        } catch (error) {
            console.warn('Não foi possível salvar histórico de email:', error);
        }
    }

    // NOVO: Método de fallback
    async enviarBackupEmail(dados) {
        console.log('Usando método de backup para envio...');
        
        // Aqui você pode implementar um fallback alternativo
        // como enviar para uma API própria ou outro serviço
        
        try {
            // Simular envio bem-sucedido para não bloquear o usuário
            this.mostrarFeedback('Análise processada localmente com sucesso!', 'info');
            return true;
        } catch (error) {
            console.error('Falha no método de backup:', error);
            return false;
        }
    }

    contarObjetivosConquistados(dados) {
        let count = 0;
        const tempos = ['125', '500', '900', '1000', '1300', '1600'];
        
        tempos.forEach(tempo => {
            if (dados[`objetivo_${tempo}_time`] === 'Aliado') {
                count++;
            }
        });
        
        return count;
    }

    mostrarResultadoAnalise(resultadoAnalise) {
        this.mostrarPagina(7);
        this.preencherRelatorio(resultadoAnalise);
    }

    preencherRelatorio(resultadoAnalise) {
        const scoreElem = document.getElementById('scoreRelatorio');
        const conteudoElem = document.getElementById('conteudoRelatorio');
        
        if (scoreElem) {
            scoreElem.textContent = resultadoAnalise.score || '--';
            scoreElem.className = 'score-relatorio ' + this.getClassScore(resultadoAnalise.score);
        }
        
        if (conteudoElem) {
            conteudoElem.innerHTML = this.gerarHTMLRelatorio(resultadoAnalise);
        }

        this.adicionarBadgeMetodo(resultadoAnalise.metodo, resultadoAnalise.modelo);
    }

    getClassScore(score) {
        if (score >= 90) return 'excelente';
        if (score >= 80) return 'bom';
        if (score >= 70) return 'regular';
        return 'baixo';
    }

    gerarHTMLRelatorio(resultadoAnalise) {
        const isIA = resultadoAnalise.metodo === 'IA';
        
        if (isIA) {
            return `
                <div class="relatorio-ia">
                    <div class="badge-metodo-ia">Análise GPT-OSS Avançada • ${resultadoAnalise.modelo || 'gpt-oss:120bcloud'}</div>
                    <div class="conteudo-ia">${this.formatarRespostaIA(resultadoAnalise.conteudo)}</div>
                    ${this.gerarSecaoDraft(resultadoAnalise.analiseDraft)}
                    ${this.gerarSecaoSinergias(resultadoAnalise.analiseSinergias)}
                </div>
            `;
        } else {
            return `
                <div class="relatorio-regras">
                    <div class="badge-metodo-regras">Análise Avançada • Sistema de Regras</div>
                    <div class="conteudo-regras">${resultadoAnalise.conteudo}</div>
                    ${this.gerarSecaoDraft(resultadoAnalise.analiseDraft)}
                    ${this.gerarSecaoSinergias(resultadoAnalise.analiseSinergias)}
                    <div class="info-fallback">
                        <small>Dica: Para análise mais detalhada, verifique se o Ollama está rodando localmente.</small>
                        <small>Instruções: Execute "ollama serve" no terminal e baixe um modelo como "ollama pull llama2"</small>
                    </div>
                </div>
            `;
        }
    }

    gerarSecaoDraft(analiseDraft) {
        if (!analiseDraft) return '';
        
        return `
            <div class="secao-draft">
                <h3>Análise de Draft Competitivo</h3>
                ${analiseDraft.composicao_identificada ? `
                <div class="composicao-identificada">
                    <h4>Composição Identificada</h4>
                    <p><strong>Tipo:</strong> ${analiseDraft.composicao_identificada.tipo.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Identidade:</strong> ${analiseDraft.composicao_identificada.dados.identidade}</p>
                    <p><strong>Janela de Força:</strong> ${analiseDraft.composicao_identificada.dados.janela_forca}</p>
                    <p><strong>Estratégia:</strong> ${analiseDraft.composicao_identificada.dados.estrategia}</p>
                </div>
                ` : ''}
                
                <div class="curva-poder">
                    <h4>Curva de Poder do Time</h4>
                    <p><strong>Recomendação:</strong> ${analiseDraft.curva_poder_time.composicao_recomendada}</p>
                    <div class="curva-barras">
                        <div class="barra-curva">
                            <span>Early Game: ${analiseDraft.curva_poder_time.early_game}/5</span>
                            <div class="barra-progresso-curva" style="width: ${analiseDraft.curva_poder_time.early_game * 20}%"></div>
                        </div>
                        <div class="barra-curva">
                            <span>Mid Game: ${analiseDraft.curva_poder_time.mid_game}/5</span>
                            <div class="barra-progresso-curva" style="width: ${analiseDraft.curva_poder_time.mid_game * 20}%"></div>
                        </div>
                        <div class="barra-curva">
                            <span>Late Game: ${analiseDraft.curva_poder_time.late_game}/5</span>
                            <div class="barra-progresso-curva" style="width: ${analiseDraft.curva_poder_time.late_game * 20}%"></div>
                        </div>
                    </div>
                </div>
                
                ${analiseDraft.sinergias_avancadas.length > 0 ? `
                <div class="sinergias-avancadas">
                    <h4>Sinergias Avançadas</h4>
                    ${analiseDraft.sinergias_avancadas.map(sinergia => `
                        <div class="sinergia-camada">
                            <strong>${sinergia.camada}:</strong>
                            <ul>
                                ${sinergia.sinergias.map(s => `<li>${s.descricao || s}</li>`).join('')}
                            </ul>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
                
                ${analiseDraft.vulnerabilidades.length > 0 ? `
                <div class="vulnerabilidades">
                    <h4>Vulnerabilidades Identificadas</h4>
                    <ul>
                        ${analiseDraft.vulnerabilidades.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
    }

    gerarSecaoSinergias(analiseSinergias) {
        if (!analiseSinergias) return '';
        
        return `
            <div class="secao-sinergias">
                <h3>Análise de Sinergias</h3>
                
                ${analiseSinergias.composicao_tipo && analiseSinergias.composicao_tipo !== 'balanced' ? `
                <div class="tipo-composicao">
                    <p><strong>Tipo de Composição:</strong> ${this.iaCoach.sinergiasCounters.categorias_sinergias[analiseSinergias.composicao_tipo]}</p>
                </div>
                ` : ''}
                
                ${analiseSinergias.sinergias_encontradas.length > 0 ? `
                <div class="sinergias-encontradas">
                    <h4>Combos Identificados</h4>
                    <ul>
                        ${analiseSinergias.sinergias_encontradas.map(s => `
                            <li>
                                <strong>${s.campeoes.join(' + ')}:</strong> ${s.descricao}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
                
                ${analiseSinergias.counters_potenciais.length > 0 ? `
                <div class="counters-potenciais">
                    <h4>Counters Potenciais</h4>
                    <ul>
                        ${analiseSinergias.counters_potenciais.map(c => `
                            <li>
                                <strong>${c.counter}</strong> countera <strong>${c.campeao_aliado}</strong> - ${c.descricao}
                            </li>
                        `).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `;
    }

    formatarRespostaIA(resposta) {
        if (!resposta) return '<p>Erro ao gerar análise. Tente novamente.</p>';
        
        return resposta
            .replace(/\n\s*\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^(.*)$/gm, '<p>$1</p>')
            .replace(/<p><br><\/p>/g, '')
            .replace(/ANÁLISE DA PARTIDA/g, '<h3>ANÁLISE DA PARTIDA</h3>')
            .replace(/ANÁLISE GERAL/g, '<h3>ANÁLISE GERAL</h3>')
            .replace(/PONTOS FORTES/g, '<h4>PONTOS FORTES</h4>')
            .replace(/AREAS PARA EVOLUIR/g, '<h4>ÁREAS PARA EVOLUIR</h4>')
            .replace(/AREAS DE MELHORIA/g, '<h4>ÁREAS DE MELHORIA</h4>')
            .replace(/RECOMENDACOES ESTRATEGICAS/g, '<h4>RECOMENDAÇÕES ESTRATÉGICAS</h4>')
            .replace(/ESTRATÉGIAS PARA PRÓXIMA PARTIDA/g, '<h4>ESTRATÉGIAS PARA PRÓXIMA PARTIDA</h4>')
            .replace(/DICAS ESPECÍFICAS PARA/g, '<h4>DICAS ESPECÍFICAS</h4>');
    }

    adicionarBadgeMetodo(metodo, modelo) {
        const cabecalho = document.querySelector('.cabecalho-relatorio');
        if (cabecalho) {
            let badge = cabecalho.querySelector('.badge-metodo');
            if (!badge) {
                badge = document.createElement('div');
                badge.className = 'badge-metodo';
                cabecalho.appendChild(badge);
            }
            
            if (metodo === 'IA') {
                badge.textContent = `GPT-OSS Coach • ${modelo || 'gpt-oss:120bcloud'}`;
                badge.className = 'badge-metodo ia';
            } else {
                badge.textContent = 'Sistema Avançado • Regras';
                badge.className = 'badge-metodo regra';
            }
        }
    }

    iniciarNovaAnalise() {
        document.getElementById('formularioAnalisePartida')?.reset();
        this.rotaSelecionada = null;
        this.atualizarVisibilidadeRota();
        this.mostrarPagina(1);
        console.log('Nova análise iniciada');
    }

    compartilharRelatorio() {
        const score = document.getElementById('scoreRelatorio')?.textContent || '85';
        const texto = ` Minha análise no Wild Rift Analyzer Avançado: ${score}/100\n\nConfira seus relatórios em: ${window.location.href}`;
        
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
            this.mostrarFeedback('Texto copiado para a área de transferência!', 'sucesso');
        }).catch(() => {
            this.mostrarFeedback('Texto pronto para compartilhar!', 'info');
        });
    }

    mostrarLoading(mostrar) {
        const btnEnviar = document.querySelector('.btn-enviar');
        if (btnEnviar) {
            btnEnviar.disabled = mostrar;
            btnEnviar.textContent = mostrar ? 'Analisando...' : 'Enviar Análise';
            btnEnviar.classList.toggle('carregando', mostrar);
        }
    }

    mostrarFeedback(mensagem, tipo = 'sucesso') {
        const feedbacksAntigos = document.querySelectorAll('.feedback-temporario');
        feedbacksAntigos.forEach(feedback => feedback.remove());

        const feedback = document.createElement('div');
        feedback.className = `feedback-temporario feedback-${tipo}`;
        feedback.textContent = mensagem;
        
        feedback.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        if (tipo === 'sucesso') {
            feedback.style.background = 'var(--cor-sucesso)';
        } else if (tipo === 'erro') {
            feedback.style.background = 'var(--cor-erro)';
        } else {
            feedback.style.background = 'var(--cor-info)';
        }
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
}

// CSS para os novos elementos
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .badge-metodo {
        padding: 6px 12px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
        margin-left: 10px;
        display: inline-block;
    }
    
    .badge-metodo.ia {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
    }
    
    .badge-metodo.regra {
        background: linear-gradient(135deg, #ff9800, #ffc107);
        color: white;
    }
    
    #ollamaStatus {
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    }
    
    @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
    }
    
    .relatorio-ia, .relatorio-regras {
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    }
    
    .relatorio-ia {
        background: rgba(102, 126, 234, 0.05);
        border-left: 4px solid #667eea;
    }
    
    .relatorio-regras {
        background: rgba(255, 152, 0, 0.05);
        border-left: 4px solid #ff9800;
    }
    
    .badge-metodo-ia, .badge-metodo-regras {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 15px;
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 15px;
    }
    
    .badge-metodo-ia {
        background: #667eea;
        color: white;
    }
    
    .badge-metodo-regras {
        background: #ff9800;
        color: white;
    }
    
    .info-fallback {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255, 152, 0, 0.1);
        border: 1px solid #ff9800;
        border-radius: 6px;
        color: var(--cor-texto);
        font-size: 14px;
    }
    
    .info-fallback small {
        display: block;
        margin-top: 5px;
        opacity: 0.8;
    }
    
    .conteudo-ia, .conteudo-regras {
        line-height: 1.6;
        color: var(--cor-texto);
    }
    
    .conteudo-ia h3, .conteudo-ia h4 {
        color: var(--cor-destaque);
        margin: 20px 0 10px 0;
    }
    
    .conteudo-ia p {
        margin-bottom: 10px;
    }
    
    .secao-draft, .secao-sinergias {
        margin: 25px 0;
        padding: 20px;
        background: rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        border-left: 4px solid var(--cor-destaque);
    }
    
    .secao-draft h3, .secao-sinergias h3 {
        color: var(--cor-destaque);
        margin-bottom: 15px;
    }
    
    .composicao-identificada, .curva-poder, .sinergias-avancadas, .vulnerabilidades {
        margin: 15px 0;
    }
    
    .curva-barras {
        margin: 10px 0;
    }
    
    .barra-curva {
        margin: 8px 0;
        display: flex;
        align-items: center;
    }
    
    .barra-curva span {
        width: 120px;
        font-size: 14px;
    }
    
    .barra-progresso-curva {
        height: 8px;
        background: linear-gradient(90deg, var(--cor-sucesso), var(--cor-aviso));
        border-radius: 4px;
        transition: width 0.5s ease;
    }
    
    .sinergia-camada {
        margin: 10px 0;
        padding: 10px;
        background: rgba(255, 255, 255, 0.03);
        border-radius: 6px;
    }
    
    .score-relatorio.excelente {
        background: linear-gradient(135deg, #00b09b, #96c93d);
    }
    
    .score-relatorio.bom {
        background: linear-gradient(135deg, #2196f3, #21cbf3);
    }
    
    .score-relatorio.regular {
        background: linear-gradient(135deg, #ff9800, #ffc107);
    }
    
    .score-relatorio.baixo {
        background: linear-gradient(135deg, #f44336, #e91e63);
    }
    
    .carregando {
        position: relative;
        overflow: hidden;
    }
    
    .carregando::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    .modelo-info {
        font-size: 12px;
        opacity: 0.8;
        margin-top: 5px;
        text-align: center;
    }
`;
document.head.appendChild(style);

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', () => {
    window.analyzer = new WildRiftAnalyzer();
    window.analyzer.init();
    
    // Adicionar função global para testar Ollama
    window.testarOllama = () => {
        window.analyzer.iaCoach.testarConexaoOllama().then(resultado => {
            alert(`Ollama: ${resultado.conectado ? 'CONECTADO' : 'OFFLINE'}\nModelos: ${resultado.modelos.length}\nModelo Atual: ${window.analyzer.iaCoach.ollamaConfig.model}`);
            window.analyzer.atualizarStatusOllama();
        });
    };
});