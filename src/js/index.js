// index.js - SISTEMA IA COACH HÍBRIDO COMPLETO PARA WILD RIFT (VERSÃO HÍBRIDA OTIMIZADA COMPLETA)

class NgrokService {
    constructor(sistemaAnalise) {
        this.sistemaAnalise = sistemaAnalise;
        this.ngrokUrl = localStorage.getItem('ngrokUrl') || 'https://terisa-ciliolate-parthenogenetically.ngrok-free.dev';
        this.modelPadrao = "gpt-oss:120b-cloud";
        this.timeout = 45000;
        this.disponivel = false;
        this.modelosDisponiveis = [];
    }

    async testarConexao() {
        if (!this.ngrokUrl || this.ngrokUrl === 'https://terisa-ciliolate-parthenogenetically.ngrok-free.dev') {
            return { 
                conectado: false, 
                erro: 'URL do Ngrok não configurada',
                instrucoes: 'Configure a URL do Ngrok na página de configuração'
            };
        }

        try {
            console.log('Testando conexão com Ngrok:', this.ngrokUrl);
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(`${this.ngrokUrl}/api/tags`, {
                method: "GET",
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                this.disponivel = true;
                this.modelosDisponiveis = data.models || [];
                
                return {
                    conectado: true,
                    modelo: this.modelPadrao,
                    modelos: this.modelosDisponiveis,
                    url: this.ngrokUrl
                };
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.warn('Ngrok não disponível:', error);
            this.disponivel = false;
            
            return {
                conectado: false,
                erro: error.message,
                url: this.ngrokUrl
            };
        }
    }

    async analisarPartida(dadosPartida) {
        if (!this.disponivel) {
            const teste = await this.testarConexao();
            if (!teste.conectado) {
                throw new Error(`Ngrok indisponível: ${teste.erro}`);
            }
        }

        const prompt = this.construirPromptAnalise(dadosPartida);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            console.log('Enviando análise para Ngrok...', {
                url: this.ngrokUrl,
                model: this.modelPadrao,
                promptLength: prompt.length
            });

            const response = await fetch(`${this.ngrokUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: this.modelPadrao,
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
                const errorText = await response.text();
                throw new Error(`Erro Ngrok ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            
            if (!data.response || data.response.trim().length < 100) {
                throw new Error('Resposta da IA muito curta ou vazia');
            }

            console.log('Resposta da IA recebida com sucesso via Ngrok');
            return {
                sucesso: true,
                conteudo: data.response,
                modelo: this.modelPadrao,
                raw: data
            };

        } catch (error) {
            console.error('Erro na análise IA via Ngrok:', error);
            
            if (error.name === 'AbortError') {
                throw new Error('Tempo limite excedido na análise (45s)');
            }
            
            throw new Error(`Falha na análise: ${error.message}`);
        }
    }

    construirPromptAnalise(dados) {
        const composicoes = this.extrairComposicoes(dados);
        const analiseDraft = this.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        const analiseSinergias = this.analisarSinergiasTime(composicoes.timeAliado);

        return `
VOCÊ É CoaTeemo (GPT-OSS:120B-CLOUD) - UM COACH PROFISSIONAL DE WILD RIFT, ESPECIALISTA EM ANÁLISE DE PARTIDAS E DESENVOLVIMENTO TÉCNICO DE JOGADORES.

COMO ANALISTA ESPECIALIZADO, FORNEÇA UM FEEDBACK TÉCNICO, INTERPRETATIVO E HUMANO, COMO UM VERDADEIRO COACH FALANDO DIRETAMENTE COM O JOGADOR.

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
`• Composição: ${analiseDraft.composicao_identificada.tipo.replace('_', ' ').toUpperCase()}
• Identidade: ${analiseDraft.composicao_identificada.dados.identidade}
• Janela de Força: ${analiseDraft.composicao_identificada.dados.janela_forca}`
: '• Draft equilibrado - foco em execução'}

${analiseDraft.curva_poder_time ? 
`• Curva de Poder: ${analiseDraft.curva_poder_time.composicao_recomendada}
• Early: ${analiseDraft.curva_poder_time.early_game}/5
• Mid: ${analiseDraft.curva_poder_time.mid_game}/5  
• Late: ${analiseDraft.curva_poder_time.late_game}/5` : ''}

${analiseDraft.vulnerabilidades && analiseDraft.vulnerabilidades.length > 0 ? 
`• Vulnerabilidades: ${analiseDraft.vulnerabilidades.join(', ')}` : ''}

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
- Resultado: ${dados.resultado_gank || 'N/A'}
` : ''}

CONTROLE DE VISÃO:
${dados.controle_visao || 'N/A'}

ERROS IDENTIFICADOS:
- Situação: ${dados.situacao_erro || 'N/A'}
- Causa: ${dados.causa_erro || 'N/A'}
- Consequência: ${dados.consequencia_erro || 'N/A'}

RESUMO DA PARTIDA:
${dados.resumo_partida || 'N/A'}

MOMENTOS CHAVE:
${dados.momentos_chave || 'N/A'}

APRENDIZADOS:
${dados.aprendizados || 'N/A'}

FORNEÇA UMA ANÁLISE ESTRUTURADA COM:

ANÁLISE TÁTICA AVANÇADA
[Análise detalhada do draft, sinergias e estratégias com tom técnico e empático]

PONTOS FORTES ESTRATÉGICOS  
• [Vantagens específicas da composição e jogador]
• [Oportunidades identificadas no jogo]

ÁREAS CRÍTICAS DE MELHORIA
• [Problemas estruturais e erros de execução]
• [Vulnerabilidades táticas identificadas]

PLANO DE AÇÃO ESPECÍFICO
• [Estratégias para próxima partida]
• [Ajustes de gameplay recomendados]
• [Foco de melhoria imediata]

ANÁLISE DE PERFORMANCE INDIVIDUAL
[Avaliação específica do jogador baseada em todos os dados]

Use toda sua capacidade analítica para fornecer a análise mais completa e acionável possível.
`.trim();
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

    analisarDraftCompetitivo(timeAliado, timeInimigo) {
        const analise = {
            composicao_identificada: this.identificarComposicaoFundamental(timeAliado),
            sinergias_avancadas: this.analisarSinergiasCamadas(timeAliado),
            curva_poder_time: this.analisarCurvaPoder(timeAliado),
            vulnerabilidades: this.identificarVulnerabilidades(timeAliado, timeInimigo),
            sugestoes_composicao: []
        };

        analise.sugestoes_composicao = this.gerarSugestoesComposicao(analise);
        return analise;
    }

    identificarComposicaoFundamental(timeAliado) {
        const tiposComposicao = {
            "wombo_combo": {
                identidade: "Explosão de dano em área coordenada",
                janela_forca: "Mid game (5-15min)",
                elementos_chave: ["Controle em área", "Dano em grupo"],
                estrategia: "Forçar teamfights em objetivos com combos coordenados"
            },
            "protect_the_carry": {
                identidade: "Proteção máxima ao hiper carry", 
                janela_forca: "Late game (15min+)",
                elementos_chave: ["Supports encantadores", "Tanks protetores"],
                estrategia: "Jogo seguro early, proteger carry no late"
            },
            "dive_comp": {
                identidade: "Mergulho agressivo no backline",
                janela_forca: "Early-Mid game (1-10min)",
                elementos_chave: ["Mobilidade", "Potencial de explosão"],
                estrategia: "Picks agressivos e mergulhos coordenados"
            },
            "poke_comp": {
                identidade: "Desgaste a distância antes dos engajamentos",
                janela_forca: "Mid game (5-15min)",
                elementos_chave: ["Limpeza de ondas", "Dano a distância"],
                estrategia: "Poke constante antes de objetivos"
            }
        };

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
            'Limpeza de ondas': ['Sivir', 'Anivia', 'Ziggs', 'Xerath', 'Lux', 'Morgana', 'Malzahar']
        };

        return elementosCampeao[elemento]?.includes(campeao) || false;
    }

    analisarSinergiasCamadas(timeAliado) {
        const sinergias = [];
        const campeoes = Object.values(timeAliado).filter(c => c);
        
        // Análise de sinergias mecânicas
        const combosConhecidos = [
            { campeoes: ['Malphite', 'Yasuo'], descricao: 'Combo ultimate devastador' },
            { campeoes: ['Orianna', 'Jarvan IV'], descricao: 'Combo de controle de área' },
            { campeoes: ['Leona', 'Miss Fortune'], descricao: 'CC em área + ultimate' }
        ];

        const combosEncontrados = combosConhecidos.filter(combo => 
            combo.campeoes.every(c => campeoes.includes(c))
        );

        if (combosEncontrados.length > 0) {
            sinergias.push({
                camada: 'Mecânica',
                sinergias: combosEncontrados
            });
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
        
        const powerSpikes = {
            'Lee Sin': 'EARLY', 'Yasuo': 'MID', 'Vayne': 'LATE', 'Lux': 'MID',
            'Zed': 'MID', 'Jinx': 'LATE', 'Malphite': 'MID', 'Darius': 'EARLY'
        };

        campeoes.forEach(campeao => {
            const spike = powerSpikes[campeao];
            if (spike === 'EARLY') early++;
            if (spike === 'MID') mid++;
            if (spike === 'LATE') late++;
        });
        
        return { early, mid, late };
    }

    sugerirComposicaoPorCurva(curvas) {
        if (curvas.early >= 3) return "Composição de early game agressivo";
        if (curvas.mid >= 3) return "Composição de meio de jogo";
        if (curvas.late >= 3) return "Composição de late game";
        return "Composição equilibrada";
    }

    identificarVulnerabilidades(timeAliado, timeInimigo) {
        const vulnerabilidades = [];
        const campeoesAliados = Object.values(timeAliado).filter(c => c);
        
        // Verifica falta de frontline
        const temTanque = campeoesAliados.some(campeao => 
            ['Malphite', 'Amumu', 'Leona', 'Alistar', 'Braum', 'Nautilus', 'Shen'].includes(campeao)
        );
        if (!temTanque) {
            vulnerabilidades.push("Falta de frontline - time frágil em teamfights");
        }
        
        // Verifica dano desbalanceado
        const danoMagico = campeoesAliados.some(campeao => 
            ['Lux', 'Zoe', 'Xerath', 'Orianna', 'Ahri', 'Annie', 'Syndra'].includes(campeao)
        );
        const danoFisico = campeoesAliados.some(campeao => 
            ['Vayne', 'KogMaw', 'Jinx', 'KaiSa', 'Caitlyn', 'Ezreal', 'Jhin'].includes(campeao)
        );
        
        if (!danoMagico || !danoFisico) {
            vulnerabilidades.push("Dano desbalanceado - inimigo pode stackar resistências");
        }
        
        return vulnerabilidades;
    }

    gerarSugestoesComposicao(analiseDraft) {
        const sugestoes = [];
        
        if (analiseDraft.composicao_identificada) {
            const comp = analiseDraft.composicao_identificada;
            sugestoes.push(`Composição: ${comp.tipo.replace('_', ' ').toUpperCase()}`);
            sugestoes.push(`Estratégia: ${comp.dados.estrategia}`);
        }
        
        if (analiseDraft.curva_poder_time.early_game >= 3) {
            sugestoes.push("Time de early game - pressionar desde o início");
        }
        
        return sugestoes;
    }

    analisarSinergiasTime(timeAliado) {
        const campeoesTime = Object.values(timeAliado).filter(c => c);
        
        return {
            sinergias_encontradas: this.encontrarSinergiasTime(campeoesTime),
            composicao_tipo: this.identificarTipoComposicao(campeoesTime),
            sugestoes: this.gerarSugestoesSinergiasBasicas(campeoesTime)
        };
    }

    encontrarSinergiasTime(campeoes) {
        const sinergias = [];
        const combosConhecidos = [
            { campeoes: ['Malphite', 'Yasuo'], descricao: 'Combo ultimate devastador' },
            { campeoes: ['Orianna', 'Jarvan IV'], descricao: 'Combo de controle de área' }
        ];

        return combosConhecidos.filter(combo => 
            combo.campeoes.every(c => campeoes.includes(c))
        );
    }

    identificarTipoComposicao(campeoes) {
        const tipos = {
            wombo_combo: 0,
            protect_carry: 0,
            dive_comp: 0,
            poke_comp: 0
        };

        // Análise simplificada baseada em campeões chave
        campeoes.forEach(campeao => {
            if (['Malphite', 'Amumu', 'Orianna'].includes(campeao)) tipos.wombo_combo++;
            if (['Lulu', 'Janna', 'Vayne', 'KogMaw'].includes(campeao)) tipos.protect_carry++;
            if (['Lee Sin', 'Zed', 'Camille'].includes(campeao)) tipos.dive_comp++;
            if (['Zoe', 'Xerath', 'Jayce'].includes(campeao)) tipos.poke_comp++;
        });

        const melhorTipo = Object.keys(tipos).reduce((a, b) => tipos[a] > tipos[b] ? a : b);
        return tipos[melhorTipo] > 0 ? melhorTipo : 'balanced';
    }

    gerarSugestoesSinergiasBasicas(campeoes) {
        const sugestoes = [];
        
        if (campeoes.includes('Malphite') && campeoes.includes('Yasuo')) {
            sugestoes.push("Explore o combo Malphite + Yasuo em teamfights");
        }
        
        if (campeoes.includes('Lulu') && (campeoes.includes('Vayne') || campeoes.includes('KogMaw'))) {
            sugestoes.push("Proteja o hyper carry com Lulu");
        }
        
        return sugestoes;
    }

    async analisarPartidaSimplificada(dados) {
        const prompt = `
Analise rapidamente esta partida de Wild Rift:

Jogador: ${dados.nickname || 'N/A'} (${dados.elo || 'N/A'})
Campeão: ${dados.campeao || 'N/A'} - Rota: ${dados.rota || 'N/A'}

Time Aliado: ${Object.values(this.extrairComposicoes(dados).timeAliado).filter(c => c).join(', ')}
Time Inimigo: ${Object.values(this.extrairComposicoes(dados).timeInimigo).filter(c => c).join(', ')}

Resumo: ${dados.resumo_partida || 'N/A'}
Aprendizados: ${dados.aprendizados || 'N/A'}

Forneça de 3-5 pontos fortes e 3-5 áreas para melhorar de forma concisa.
        `.trim();

        try {
            const response = await fetch(`${this.ngrokUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: this.modelPadrao,
                    prompt: prompt,
                    stream: false,
                    options: {
                        temperature: 0.7,
                        num_predict: 500
                    }
                })
            });

            if (response.ok) {
                const data = await response.json();
                return {
                    sucesso: true,
                    conteudo: data.response,
                    tipo: 'rapida'
                };
            }
        } catch (error) {
            console.warn('Análise rápida falhou:', error);
        }

        return {
            sucesso: false,
            erro: 'Análise rápida indisponível'
        };
    }

    atualizarUrl(novaUrl) {
        this.ngrokUrl = novaUrl;
        localStorage.setItem('ngrokUrl', novaUrl);
        this.disponivel = false;
    }
}

class SistemaAnaliseHibrido {
    constructor() {
        this.iaAtiva = true;
        this.ngrokDisponivel = false;
        this.conhecimento = {};
        this.conhecimentoDraft = {};
        this.sinergiasCounters = {};
        this.historicoAnalises = [];
        this.padroesAprendidos = [];
        
        this.ngrokService = new NgrokService(this);
        
        this.timingsWildRift = {
            nivel_ultimate: 5,
            primeiro_obj_neutro: '1:25',
            primeiro_dragao: '5:00',
            primeiro_arauto: '5:00',
            segundo_dragao: '10:00',
            baron_nashor: '11:00',
            terceiro_dragao: '15:00',
            dragao_anciao: '19:00',
            tempo_partida_media: '15-20min'
        };
    }

    async inicializarNgrok() {
        try {
            console.log('Inicializando conexão com Ngrok...');
            
            const resultado = await this.ngrokService.testarConexao();
            this.ngrokDisponivel = resultado.conectado;
            
            console.log(`Ngrok: ${this.ngrokDisponivel ? 'CONECTADO' : 'INDISPONÍVEL'}`, resultado);
            return resultado;
            
        } catch (error) {
            console.warn('Erro ao inicializar Ngrok:', error);
            this.ngrokDisponivel = false;
            return { conectado: false, erro: error.message };
        }
    }

    async carregarConhecimentoCompleto() {
        try {
            console.log('Carregando conhecimento completo para Wild Rift...');
            
            this.conhecimento = {
                objetivos: {
                    arongueijo: {
                        beneficio: 'Gold, experiência, regenera parte da vida e garante uma área de visão em raio circular no rio e que ao passr pela área desse raio ganha move speed',
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
                        timing: '11:00',
                        prioridade: 'TIME_COMPLETO'
                    }
                },
                classesCampeoes: {
                    'tanque': ['Malphite', 'Amumu', 'Leona', 'Alistar', 'Braum', 'Nautilus', 'Shen'],
                    'lutador': ['Darius', 'Garen', 'Renekton', 'Sett', 'Jax', 'Fiora', 'Riven', 'Camille', 'Irelia'],
                    'mago': ['Lux', 'Zoe', 'Xerath', 'Orianna', 'Ahri', 'Annie', 'Syndra', 'Veigar', 'Brand'],
                    'atirador': ['Vayne', 'KogMaw', 'Jinx', 'KaiSa', 'Caitlyn', 'Ezreal', 'Jhin', 'Miss Fortune'],
                    'assassino': ['Zed', 'Talon', 'KhaZix', 'Akali', 'Fizz', 'Katarina', 'Leblanc', 'Pyke'],
                    'suporte': ['Lulu', 'Janna', 'Soraka', 'Nami', 'Yuumi', 'Sona', 'Thresh', 'Blitzcrank', 'Rakan']
                },
                powerSpikes: {
                    'Lee Sin': { niveis: [2, 3, 5], powerspike: 'EARLY', descricao: 'Dominante early game' },
                    'Yasuo': { niveis: [1, 2, 5], powerspike: 'FORTE', descricao: 'Forte com ultimate' },
                    'Vayne': { niveis: [5, 11, 15], powerspike: 'MUITO_FORTE', descricao: 'Hiper carry late game' },
                    'Lux': { niveis: [5, 9, 13], powerspike: 'FORTE', descricao: 'Burst com ultimate' },
                    'Zed': { niveis: [3, 5, 6], powerspike: 'FORTE', descricao: 'Assassino com ultimate' }
                }
            };

            console.log('Conhecimento Wild Rift carregado completamente');
            return true;

        } catch (error) {
            console.error('Erro ao carregar conhecimento:', error);
            this.conhecimento = {};
            return false;
        }
    }

    async analisarPartidaComIA(dados) {
        if (!this.ngrokDisponivel) {
            const teste = await this.inicializarNgrok();
            if (!teste.conectado) {
                return {
                    sucesso: false,
                    tipo: 'CoaTeemo_INDISPONIVEL',
                    erro: teste.erro || 'CoaTeemo não está disponível'
                };
            }
        }

        try {
            console.log('Enviando análise para Ngrok...');
            
            const resultado = await this.ngrokService.analisarPartida(dados);
            
            console.log('Resposta da IA recebida com sucesso via Ngrok');
            return {
                sucesso: true,
                tipo: 'IA',
                conteudo: resultado.conteudo,
                modelo: resultado.modelo,
                raw: resultado.raw
            };

        } catch (error) {
            console.error('Erro na análise IA via Ngrok:', error);
            
            try {
                console.log('Tentando análise simplificada...');
                const resultadoRapido = await this.ngrokService.analisarPartidaSimplificada(dados);
                
                if (resultadoRapido.sucesso) {
                    return {
                        sucesso: true,
                        tipo: 'IA_RAPIDA',
                        conteudo: resultadoRapido.conteudo,
                        modelo: this.ngrokService.modelPadrao,
                        fallback: true
                    };
                }
            } catch (errorRapido) {
                console.warn('Fallback rápido também falhou:', errorRapido);
            }
            
            return {
                sucesso: false,
                tipo: 'ERRO_IA',
                erro: error.message
            };
        }
    }

    async analisarPartidaHibrido(dados) {
        console.log('Iniciando análise híbrida completa...');

        let resultadoIA = null;

        // Tenta análise com IA primeiro
        console.log('Tentando análise com Ngrok...');
        resultadoIA = await this.analisarPartidaComIA(dados);
        
        if (resultadoIA.sucesso && this.validarRespostaIA(resultadoIA.conteudo)) {
            console.log('Análise IA bem-sucedida');
            
            const composicoes = this.ngrokService.extrairComposicoes(dados);
            const analiseDraft = this.ngrokService.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
            const analiseSinergias = this.ngrokService.analisarSinergiasTime(composicoes.timeAliado);
            
            return {
                ...resultadoIA,
                score: this.calcularScoreIA(resultadoIA.conteudo),
                metodo: 'IA',
                timestamp: new Date().toISOString(),
                ngrokModel: this.ngrokService.modelPadrao,
                analiseDraft: analiseDraft,
                analiseSinergias: analiseSinergias
            };
        } else {
            console.log('Análise IA falhou, usando fallback para regras:', resultadoIA.erro);
        }

        // Fallback para sistema de regras
        console.log('Usando fallback para regras avançadas');
        const resultadoRegras = this.analisarPartidaComRegras(dados);
        
        return {
            ...resultadoRegras,
            metodo: 'REGRA',
            fallback: true,
            fallbackRazao: resultadoIA?.erro || 'Ngrok indisponível',
            timestamp: new Date().toISOString()
        };
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

    analisarPartidaComRegras(dados) {
        console.log('Usando sistema de regras como fallback');
        
        const analise = {
            score: this.calcularScoreRegras(dados),
            pontosFortes: [],
            areasMelhoria: [],
            sugestoes: []
        };

        const composicoes = this.ngrokService.extrairComposicoes(dados);
        const analiseDraft = this.ngrokService.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        const analiseSinergias = this.ngrokService.analisarSinergiasTime(composicoes.timeAliado);
        
        // Adiciona análise de draft
        analise.pontosFortes.push(...analiseDraft.sugestoes_composicao || []);
        analise.pontosFortes.push(...(analiseSinergias.sinergias_encontradas || []).map(s => `Sinergia: ${s.descricao}`));
        analise.areasMelhoria.push(...analiseDraft.vulnerabilidades || []);

        // Análise de objetivos
        const analiseObjetivos = this.analisarObjetivosComRegras(dados);
        analise.pontosFortes.push(...analiseObjetivos.pontosFortes);
        analise.areasMelhoria.push(...analiseObjetivos.areasMelhoria);

        // Análise estratégica
        const analiseEstrategia = this.analisarEstrategiaComRegras(dados);
        analise.pontosFortes.push(...analiseEstrategia.pontosFortes);
        analise.areasMelhoria.push(...analiseEstrategia.areasMelhoria);

        // Sugestões por rota
        analise.sugestoes.push(...this.gerarSugestoesPorRota(dados));
        analise.sugestoes.push(...(analiseSinergias.sugestoes || []));

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

        return resultado;
    }

    contarObjetivosConquistados(dados) {
        let count = 0;
        const objetivos = [
            '125_1', '125_2', '500_dragao', '500_arauto', '1000', 
            '1100', '1500_dragao', '1500_baron', '1900_baron', '1900_anciao'
        ];
        
        objetivos.forEach(objetivo => {
            if (dados[`objetivo_${objetivo}_time`] === 'Aliado') {
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
        }

        return resultado;
    }

    calcularScoreRegras(dados) {
        let score = 50;
        
        const objetivos = this.contarObjetivosConquistados(dados);
        score += objetivos * 4;

        if (dados.condicao_vitoria_time && dados.condicao_vitoria_time.length > 30) score += 8;
        if (dados.aprendizados && dados.aprendizados.length > 50) score += 7;

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
                break;
            case 'Mid':
                sugestoes.push("Como mid, priorize rotações para ajudar outras rotas");
                sugestoes.push("Controle a visão do river para evitar ganks");
                sugestoes.push("Aproveite o nível 5 para fazer plays agressivas");
                break;
            case 'Top':
                sugestoes.push("Como top, use TP para ajudar em objetivos importantes");
                sugestoes.push("Foque em split push quando possível");
                sugestoes.push("Comunique faltas do inimigo com pings");
                break;
            case 'Adc':
                sugestoes.push("Como ADC, priorize farm seguro early game");
                sugestoes.push("Posicione-se atrás do frontline em teamfights");
                sugestoes.push("Foque em sobreviver - dano zero se estiver morto");
                break;
            case 'Sup':
                sugestoes.push("Como suporte, priorize visão em objetivos");
                sugestoes.push("Proteja seu ADC em todas as fases do jogo");
                sugestoes.push("Roam para mid quando seguro");
                break;
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

Sistema de análise avançado - Continue evoluindo! 
        `.trim();
    }

    async testarConexaoNgrok() {
        return await this.inicializarNgrok();
    }

    atualizarUrlNgrok(novaUrl) {
        this.ngrokService.atualizarUrl(novaUrl);
        this.ngrokDisponivel = false;
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
    }

    async init() {
        try {
            console.log('Inicializando Wild Rift Analyzer Híbrido Completo...');
            
            await this.inicializarSistemas();
            this.configurarEventos();
            await this.inicializarEmailJS();
            
            const ngrokUrlSalva = localStorage.getItem('ngrokUrl');
            if (ngrokUrlSalva && ngrokUrlSalva !== 'https://terisa-ciliolate-parthenogenetically.ngrok-free.dev') {
                document.getElementById('ngrokUrl').value = ngrokUrlSalva;
                this.iaCoach.ngrokService.ngrokUrl = ngrokUrlSalva;
            }
            
            await this.testarConexaoNgrok();
            
            this.sistemaPronto = true;
            
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
        
        this.atualizarStatusNgrok();
        this.adicionarStatusSistema();
    }

    async testarConexaoNgrok() {
        const statusDiv = document.getElementById('ngrokStatus');
        if (statusDiv) {
            statusDiv.className = 'status-conexao testando';
            statusDiv.querySelector('.status-text').textContent = 'Testando conexão com Ngrok...';
        }

        const resultado = await this.iaCoach.testarConexaoNgrok();
        
        this.atualizarStatusNgrok(resultado);
        return resultado;
    }

    atualizarStatusNgrok(resultado = null) {
        const statusDiv = document.getElementById('ngrokStatus');
        if (!statusDiv) return;

        if (!resultado) {
            statusDiv.className = 'status-conexao testando';
            statusDiv.querySelector('.status-text').textContent = 'Configurando conexão Ngrok...';
            return;
        }

        if (resultado.conectado) {
            statusDiv.className = 'status-conexao ativa';
            statusDiv.querySelector('.status-text').textContent = 
                `CoaTeemo Conectado! Modelo: ${resultado.modelo} | URL: ${new URL(resultado.url).hostname}`;
        } else {
            statusDiv.className = 'status-conexao inativa';
            statusDiv.querySelector('.status-text').textContent = 
                `CoaTeemo Offline: ${resultado.erro || 'Não conectado'}`;
        }
    }

    adicionarStatusSistema() {
        const titulo = document.getElementById('tituloPrincipal');
        if (titulo) {
            const statusDiv = document.createElement('div');
            statusDiv.id = 'sistemaStatus';
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
            this.atualizarStatusSistema();
        }
    }

    async atualizarStatusSistema() {
        const statusDiv = document.getElementById('sistemaStatus');
        if (!statusDiv) return;

        const testeNgrok = await this.iaCoach.testarConexaoNgrok();
        
        if (testeNgrok.conectado) {
            statusDiv.innerHTML = `
                Sistema IA Coach • Ngrok Ativo
                <div class="modelo-info">Modelo GPT-OSS:120B - Análise Avançada</div>
            `;
            statusDiv.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            statusDiv.style.color = 'white';
        } else {
            statusDiv.innerHTML = `
                Coach Avançado • Modo Regras
                <div class="modelo-info">Coateemo offline</div>
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

        container.innerHTML = `
            <!-- Arongueijo 1:25 -->
            <div class="objetivo-grupo" data-tempo="125_1">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_125_1_ativo">
                        <span class="checkmark"></span>
                        1:25 - Arongueijo (Primeiro)
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_125_1_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Arongueijo">Arongueijo</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_125_1_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_125_1_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Arongueijo 1:25 (Segundo) -->
            <div class="objetivo-grupo" data-tempo="125_2">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_125_2_ativo">
                        <span class="checkmark"></span>
                        1:25 - Arongueijo (Segundo)
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_125_2_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Arongueijo">Arongueijo</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_125_2_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_125_2_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Dragão 5:00 -->
            <div class="objetivo-grupo" data-tempo="500_dragao">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_500_dragao_ativo">
                        <span class="checkmark"></span>
                        5:00 - Dragão Elemental
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_500_dragao_tipo" class="select-objetivo">
                        <option value="">Selecione o dragão...</option>
                        <option value="Fogo">Dragão de Fogo</option>
                        <option value="Gelo">Dragão de Gelo</option>
                        <option value="Montanha">Dragão de Montanha</option>
                        <option value="Oceano">Dragão de Oceano</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_500_dragao_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_500_dragao_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Arauto 5:00 -->
            <div class="objetivo-grupo" data-tempo="500_arauto">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_500_arauto_ativo">
                        <span class="checkmark"></span>
                        5:00 - Arauto
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_500_arauto_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Arauto">Arauto</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_500_arauto_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_500_arauto_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Segundo Dragão 10:00 -->
            <div class="objetivo-grupo" data-tempo="1000">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1000_ativo">
                        <span class="checkmark"></span>
                        10:00 - Segundo Dragão Elemental
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_1000_tipo" class="select-objetivo">
                        <option value="">Selecione o dragão...</option>
                        <option value="Fogo">Dragão de Fogo</option>
                        <option value="Gelo">Dragão de Gelo</option>
                        <option value="Montanha">Dragão de Montanha</option>
                        <option value="Oceano">Dragão de Oceano</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1000_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1000_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Barão Nashor 11:00 -->
            <div class="objetivo-grupo" data-tempo="1100">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1100_ativo">
                        <span class="checkmark"></span>
                        11:00 - Baron Nashor
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_1100_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Baron">Baron Nashor</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1100_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1100_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Terceiro Dragão 15:00 -->
            <div class="objetivo-grupo" data-tempo="1500_dragao">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1500_dragao_ativo">
                        <span class="checkmark"></span>
                        15:00 - Terceiro Dragão Elemental
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_1500_dragao_tipo" class="select-objetivo">
                        <option value="">Selecione o dragão...</option>
                        <option value="Fogo">Dragão de Fogo</option>
                        <option value="Gelo">Dragão de Gelo</option>
                        <option value="Montanha">Dragão de Montanha</option>
                        <option value="Oceano">Dragão de Oceano</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1500_dragao_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1500_dragao_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Barão Nashor 15:00 -->
            <div class="objetivo-grupo" data-tempo="1500_baron">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1500_baron_ativo">
                        <span class="checkmark"></span>
                        15:00 - Baron Nashor
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_1500_baron_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Baron">Baron Nashor</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1500_baron_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1500_baron_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Barão Nashor 19:00 -->
            <div class="objetivo-grupo" data-tempo="1900_baron">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1900_baron_ativo">
                        <span class="checkmark"></span>
                        19:00 - Baron Nashor
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_1900_baron_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Baron">Baron Nashor</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1900_baron_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1900_baron_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Dragão Ancião 19:00 -->
            <div class="objetivo-grupo" data-tempo="1900_anciao">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1900_anciao_ativo">
                        <span class="checkmark"></span>
                        19:00 - Dragão Ancião
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <select name="objetivo_1900_anciao_tipo" class="select-objetivo">
                        <option value="">Selecione o objetivo...</option>
                        <option value="Ancião">Dragão Ancião</option>
                        <option value="Nenhum">Nenhum</option>
                    </select>
                    <div class="objetivo-time">
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1900_anciao_time" value="Aliado">
                            <span class="radio-custom"></span>
                            Time Aliado
                        </label>
                        <label class="radio-time">
                            <input type="radio" name="objetivo_1900_anciao_time" value="Inimigo">
                            <span class="radio-custom"></span>
                            Time Inimigo
                        </label>
                    </div>
                </div>
            </div>

            <!-- Objetivos após 19:00 -->
            <div class="objetivo-grupo" data-tempo="1900_plus">
                <div class="objetivo-cabecalho">
                    <span class="tempo-texto">
                        <input type="checkbox" class="objetivo-checkbox" name="objetivo_1900_plus_ativo">
                        <span class="checkmark"></span>
                        19:00+ - Objetivos após 19 minutos
                    </span>
                </div>
                <div class="objetivo-opcoes oculta">
                    <div class="form-group">
                        <textarea name="objetivo_1900_plus_descricao" placeholder="Descreva quais objetivos foram abatidos após os 19 minutos (ex: Barão adicional, Dragão Ancião, etc)"></textarea>
                    </div>
                </div>
            </div>
        `;
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

        document.querySelectorAll('.upload-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.processarUpload(e.target);
            });
        });

        document.querySelectorAll('.btn-remover-imagem').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.removerImagem(e.target);
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
            } else if (target.matches('#btnSalvarNgrok')) {
                this.salvarConfiguracaoNgrok();
            } else if (target.matches('#btnTestarNgrok') || target.matches('#btnTestarConexao')) {
                this.testarConexaoNgrok();
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

    salvarConfiguracaoNgrok() {
        const ngrokUrlInput = document.getElementById('ngrokUrl');
        const novaUrl = ngrokUrlInput.value.trim();
        
        if (!novaUrl || novaUrl === 'https://terisa-ciliolate-parthenogenetically.ngrok-free.dev') {
            this.mostrarFeedback('Por favor, insira uma URL válida do Ngrok', 'erro');
            return;
        }

        try {
            new URL(novaUrl);
            this.iaCoach.atualizarUrlNgrok(novaUrl);
            this.mostrarFeedback('URL do Ngrok salva com sucesso!', 'sucesso');
            
            setTimeout(() => this.testarConexaoNgrok(), 1000);
            
        } catch (error) {
            this.mostrarFeedback('URL inválida. Use o formato: https://terisa-ciliolate-parthenogenetically.ngrok-free.dev', 'erro');
        }
    }

    mostrarPagina(numero) {
        if (numero < 1 || numero > this.totalPaginas) return false;

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
            
            const dados = this.coletarDadosFormulario();
            const resultadoAnalise = await this.iaCoach.analisarPartidaHibrido(dados);
            
            console.log(`Análise concluída via: ${resultadoAnalise.metodo}`);
            
            if (resultadoAnalise.metodo === 'IA') {
                this.mostrarFeedback(`Análise IA concluída via Ngrok!`, 'sucesso');
            } else {
                this.mostrarFeedback('Análise avançada concluída (modo regras)', 'info');
            }
            
            await this.enviarEmail(dados);
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
            }
        }
        
        this.analiseAtualId = `WR-${Date.now().toString(36).toUpperCase()}`;
        dados.analysis_id = this.analiseAtualId;
        dados.timestamp = new Date().toISOString();
        dados.metodo_analise = this.iaCoach.ngrokDisponivel ? 'Ngrok IA' : 'Regras Avançadas';
        
        return dados;
    }

    async enviarEmail(dados) {
        try {
            console.log('Iniciando envio de email...');
            
            if (typeof emailjs !== 'undefined') {
                const templateParams = {
                    from_name: dados.nickname || 'Jogador Wild Rift',
                    to_email: this.config.email.destino,
                    subject: `Análise WR - ${dados.nickname} | ${dados.elo} | ${dados.campeao}`,
                    message: `Análise concluída via ${dados.metodo_analise}. ID: ${dados.analysis_id}`,
                    html_content: this.gerarHTMLEmailCompleto(dados)
                };

                const response = await emailjs.send(
                    this.config.email.serviceId,
                    this.config.email.templateId, 
                    templateParams
                );

                console.log('Email enviado com sucesso!', response);
                this.mostrarFeedback('Relatório enviado para análise!', 'sucesso');
                return true;
            }
            
            console.warn('EmailJS não disponível');
            this.mostrarFeedback('Análise concluída localmente!', 'info');
            return false;
            
        } catch (error) {
            console.error('Erro no envio de email:', error);
            this.mostrarFeedback('Análise concluída localmente!', 'info');
            return false;
        }
    }

    gerarHTMLEmailCompleto(dados) {
        const composicoes = this.iaCoach.ngrokService.extrairComposicoes(dados);
        const analiseDraft = this.iaCoach.ngrokService.analisarDraftCompetitivo(composicoes.timeAliado, composicoes.timeInimigo);
        const analiseSinergias = this.iaCoach.ngrokService.analisarSinergiasTime(composicoes.timeAliado);
        
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
            <h1>Análise de Partida - Wild Rift</h1>
            <div class="subtitle">
                Sistema Híbrido GPT-OSS • ${dados.metodo_analise}
                <span class="badge ${dados.metodo_analise.includes('IA') ? 'badge-ia' : 'badge-regra'}">
                    ${dados.metodo_analise.includes('IA') ? 'GPT-OSS' : 'REGRA'}
                </span>
            </div>
        </div>
        
        <div class="content">
            <div class="section">
                <h2 class="section-title">Informações do Jogador</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Nome</strong>
                        ${dados.nome || 'Não informado'}
                    </div>
                    <div class="info-item">
                        <strong>Nickname</strong>
                        ${dados.nickname || 'Anônimo'}
                    </div>
                    <div class="info-item">
                        <strong>Elo</strong>
                        ${dados.elo || 'Não informado'}
                    </div>
                    <div class="info-item">
                        <strong>Campeão</strong>
                        ${dados.campeao || 'Não informado'}
                    </div>
                    <div class="info-item">
                        <strong>Rota</strong>
                        ${dados.rota || 'Não informado'}
                    </div>
                    <div class="info-item">
                        <strong>Email</strong>
                        ${dados.email || 'Não informado'}
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2 class="section-title">Draft da Partida</h2>
                <div class="draft-container">
                    <div class="draft-team">
                        <h3>Time Aliado</h3>
                        <p><strong>Top:</strong> ${dados.draft_aliado_top || 'Não preenchido'}</p>
                        <p><strong>Jungle:</strong> ${dados.draft_aliado_jungle || 'Não preenchido'}</p>
                        <p><strong>Mid:</strong> ${dados.draft_aliado_mid || 'Não preenchido'}</p>
                        <p><strong>ADC:</strong> ${dados.draft_aliado_adc || 'Não preenchido'}</p>
                        <p><strong>Suporte:</strong> ${dados.draft_aliado_sup || 'Não preenchido'}</p>
                    </div>
                    <div class="draft-team">
                        <h3>Time Inimigo</h3>
                        <p><strong>Top:</strong> ${dados.draft_inimigo_top || 'Não informado'}</p>
                        <p><strong>Jungle:</strong> ${dados.draft_inimigo_jungle || 'Não informado'}</p>
                        <p><strong>Mid:</strong> ${dados.draft_inimigo_mid || 'Não informado'}</p>
                        <p><strong>ADC:</strong> ${dados.draft_inimigo_adc || 'Não informado'}</p>
                        <p><strong>Suporte:</strong> ${dados.draft_inimigo_sup || 'Não informado'}</p>
                    </div>
                </div>
                
                ${analiseDraft.composicao_identificada ? `
                <div class="composicao-info">
                    <h4>Composição Identificada</h4>
                    <p><strong>Tipo:</strong> ${analiseDraft.composicao_identificada.tipo.replace('_', ' ').toUpperCase()}</p>
                    <p><strong>Identidade:</strong> ${analiseDraft.composicao_identificada.dados.identidade}</p>
                    <p><strong>Janela de Força:</strong> ${analiseDraft.composicao_identificada.dados.janela_forca}</p>
                    <p><strong>Estratégia:</strong> ${analiseDraft.composicao_identificada.dados.estrategia}</p>
                </div>
                ` : ''}
                
                ${analiseSinergias.sinergias_encontradas && analiseSinergias.sinergias_encontradas.length > 0 ? `
                <div class="sinergia">
                    <h4>Sinergias Identificadas</h4>
                    ${analiseSinergias.sinergias_encontradas.map(s => `
                        <p><strong>${s.campeoes.join(' + ')}:</strong> ${s.descricao}</p>
                    `).join('')}
                </div>
                ` : ''}
                
                ${analiseDraft.vulnerabilidades && analiseDraft.vulnerabilidades.length > 0 ? `
                <div class="vulnerabilidade">
                    <h4>Vulnerabilidades</h4>
                    <ul>
                        ${analiseDraft.vulnerabilidades.map(v => `<li>${v}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
            
            <div class="section">
                <h2 class="section-title">Estratégia e Análise</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>Condição de Vitória (Time)</strong>
                        ${dados.condicao_vitoria_time || 'Não definida'}
                    </div>
                    <div class="info-item">
                        <strong>Condição de Vitória (Pessoal)</strong>
                        ${dados.condicao_vitoria_campeao || 'Não definida'}
                    </div>
                </div>
                
                <div class="info-item">
                    <strong>Resumo da Partida</strong>
                    ${dados.resumo_partida || 'Não informado'}
                </div>
                
                <div class="info-item">
                    <strong>Momentos Chave</strong>
                    ${dados.momentos_chave || 'Não informado'}
                </div>
                
                <div class="info-item">
                    <strong>Aprendizados</strong>
                    ${dados.aprendizados || 'Não informado'}
                </div>
            </div>
            
            <div class="analysis-id">
                ID da Análise: ${dados.analysis_id}
            </div>
        </div>
        
        <div class="footer">
            <p>Enviado por Sistema Nitto Coach • Wild Rift Analyzer Híbrido v4.0</p>
            <p>${new Date().toLocaleString('pt-BR')} • ${dados.metodo_analise}</p>
        </div>
    </div>
</body>
</html>
        `;
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

        this.adicionarBadgeMetodo(resultadoAnalise.metodo, resultadoAnalise.ngrokModel);
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
                    <div class="badge-metodo-ia">Análise IA Avançada • ${resultadoAnalise.ngrokModel || 'gpt-oss:120b-cloud'}</div>
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
                        <small>Dica: Para análise mais detalhada, configure o Ngrok com uma URL válida.</small>
                        <small>Instruções: Execute "ngrok http 11434" e cole a URL HTTPS gerada</small>
                    </div>
                </div>
            `;
        }
    }

    gerarSecaoDraft(analiseDraft) {
        if (!analiseDraft) return '';
        
        return `
            <div class="secao-draft">
                <h3>Análise de Draft</h3>
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
                
                ${analiseDraft.vulnerabilidades && analiseDraft.vulnerabilidades.length > 0 ? `
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
                
                ${analiseSinergias.sinergias_encontradas && analiseSinergias.sinergias_encontradas.length > 0 ? `
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
            .replace(/ANÁLISE TÁTICA AVANÇADA/g, '<h3>ANÁLISE TÁTICA AVANÇADA</h3>')
            .replace(/PONTOS FORTES ESTRATÉGICOS/g, '<h4>PONTOS FORTES ESTRATÉGICOS</h4>')
            .replace(/ÁREAS CRÍTICAS DE MELHORIA/g, '<h4>ÁREAS CRÍTICAS DE MELHORIA</h4>')
            .replace(/PLANO DE AÇÃO ESPECÍFICO/g, '<h4>PLANO DE AÇÃO ESPECÍFICO</h4>')
            .replace(/ANÁLISE DE PERFORMANCE INDIVIDUAL/g, '<h4>ANÁLISE DE PERFORMANCE INDIVIDUAL</h4>');
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
                badge.textContent = `IA Coach • ${modelo || 'gpt-oss:120b-cloud'}`;
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
        const texto = `Minha análise no Wild Rift Analyzer Avançado: ${score}/100\n\nConfira seus relatórios em: ${window.location.href}`;
        
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

// Inicialização do sistema
document.addEventListener('DOMContentLoaded', () => {
    window.analyzer = new WildRiftAnalyzer();
    window.analyzer.init();
    
    window.testarNgrok = () => {
        window.analyzer.testarConexaoNgrok();
    };
    
    window.configurarNgrok = () => {
        window.analyzer.salvarConfiguracaoNgrok();
    };
});