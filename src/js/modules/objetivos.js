// objetivos.js - VERSÃO COMPLETA E CORRIGIDA
class ObjectiveSystem {
    constructor() {
        this.objetivosSelecionados = new Set();
    }

    init() {
        this.configurarEventos();
        console.log('✅ ObjectiveSystem inicializado com interação completa');
    }

    configurarEventos() {
        // CORREÇÃO: Evento de clique no cabeçalho do objetivo
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
            
            // Evento para remover erro ao clicar em qualquer lugar do grupo
            const grupo = e.target.closest('.objetivo-grupo');
            if (grupo && grupo.classList.contains('erro')) {
                grupo.classList.remove('erro');
            }
        });

        // Eventos de change para selects e radios
        document.addEventListener('change', (e) => {
            if (e.target.matches('.objetivo-checkbox')) {
                this.toggleOpcoesObjetivo(e.target);
            }
            
            if (e.target.matches('.select-objetivo, .objetivo-time input[type="radio"]')) {
                this.validarObjetivo(e.target.closest('.objetivo-grupo'));
            }
        });

        // Validar objetivos ao tentar avançar de página
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-avancar')) {
                const paginaAtiva = document.querySelector('.pagina.ativo');
                if (paginaAtiva && paginaAtiva.id === 'pagina4') {
                    if (!this.validarTodosObjetivos()) {
                        e.preventDefault();
                        this.mostrarErroGeral();
                    }
                }
            }
        });

        // CORREÇÃO: Inicializar objetivos que já estão checked
        this.inicializarObjetivosPreSelecionados();
    }

    inicializarObjetivosPreSelecionados() {
        const checkboxes = document.querySelectorAll('.objetivo-checkbox:checked');
        checkboxes.forEach(checkbox => {
            this.toggleOpcoesObjetivo(checkbox);
        });
    }

    toggleOpcoesObjetivo(checkbox) {
        const grupo = checkbox.closest('.objetivo-grupo');
        const opcoes = grupo.querySelector('.objetivo-opcoes');
        
        if (checkbox.checked) {
            grupo.classList.add('ativo');
            opcoes.classList.remove('oculta');
            this.objetivosSelecionados.add(grupo.dataset.tempo);
            
            // Focar no primeiro select quando abrir
            setTimeout(() => {
                const primeiroSelect = opcoes.querySelector('.select-objetivo');
                if (primeiroSelect) primeiroSelect.focus();
            }, 100);
        } else {
            grupo.classList.remove('ativo', 'erro');
            opcoes.classList.add('oculta');
            this.objetivosSelecionados.delete(grupo.dataset.tempo);
            
            // Limpar seleções
            const selects = opcoes.querySelectorAll('.select-objetivo');
            const radios = opcoes.querySelectorAll('input[type="radio"]');
            
            selects.forEach(select => select.value = '');
            radios.forEach(radio => radio.checked = false);
        }
    }

    validarObjetivo(grupo) {
        const checkbox = grupo.querySelector('.objetivo-checkbox');
        const selects = grupo.querySelectorAll('.select-objetivo');
        const radios = grupo.querySelectorAll('.objetivo-time input[type="radio"]');
        
        if (!checkbox.checked) {
            grupo.classList.remove('erro');
            return true;
        }

        // Validação especial para objetivo duplo (6:00)
        const isObjetivoDuplo = grupo.dataset.tempo === '6:00';
        let tipoValido = false;

        if (isObjetivoDuplo) {
            // Para objetivo duplo, pelo menos um select deve estar preenchido
            tipoValido = Array.from(selects).some(select => select.value && select.value !== '');
        } else {
            // Para objetivos normais, o select principal deve estar preenchido
            tipoValido = selects[0]?.value && selects[0].value !== '';
        }

        const timeSelecionado = Array.from(radios).some(radio => radio.checked);
        
        // Para "Nenhum", não precisa selecionar time
        const valido = tipoValido && (this.contemNenhum(selects) || timeSelecionado);

        grupo.classList.toggle('erro', !valido);
        
        if (!valido) {
            this.animacaoErro(grupo);
        }
        
        return valido;
    }

    contemNenhum(selects) {
        return Array.from(selects).some(select => 
            select.value === 'Nenhum' || select.value === 'Nenhum (não foi feito)'
        );
    }

    animacaoErro(grupo) {
        grupo.style.animation = 'none';
        setTimeout(() => {
            grupo.style.animation = 'tremor 0.3s ease-in-out';
        }, 10);
    }

    validarTodosObjetivos() {
        const grupos = document.querySelectorAll('.objetivo-grupo');
        let valido = true;
        let primeiroErro = null;

        grupos.forEach(grupo => {
            if (!this.validarObjetivo(grupo)) {
                valido = false;
                
                // Encontrar o primeiro erro para scroll
                if (!primeiroErro) {
                    primeiroErro = grupo;
                }
            }
        });

        // Scroll para o primeiro objetivo com erro
        if (!valido && primeiroErro) {
            primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        return valido;
    }

    mostrarErroGeral() {
        const gruposComErro = document.querySelectorAll('.objetivo-grupo.erro');
        if (gruposComErro.length > 0) {
            const mensagem = `⚠️ Complete as informações de ${gruposComErro.length} objetivo(s) antes de avançar:\n\n` +
                Array.from(gruposComErro).map(grupo => {
                    const tempo = grupo.querySelector('.tempo-texto').textContent.trim();
                    return `• ${tempo}`;
                }).join('\n');
            
            alert(mensagem);
        }
    }

    // Método para coletar dados dos objetivos (útil para o envio do formulário)
    coletarDadosObjetivos() {
        const dados = {};
        const grupos = document.querySelectorAll('.objetivo-grupo');
        
        grupos.forEach(grupo => {
            const tempo = grupo.dataset.tempo.replace(':', '');
            const checkbox = grupo.querySelector('.objetivo-checkbox');
            
            if (checkbox && checkbox.checked) {
                const selects = grupo.querySelectorAll('.select-objetivo');
                const radioSelecionado = grupo.querySelector('.objetivo-time input[type="radio"]:checked');
                
                // Marcar como ativo
                dados[`objetivo_${tempo}_ativo`] = 'Sim';
                
                // Para objetivo duplo (6:00)
                if (grupo.dataset.tempo === '6:00') {
                    dados[`objetivo_${tempo}_tipo_1`] = selects[0]?.value || '';
                    dados[`objetivo_${tempo}_tipo_2`] = selects[1]?.value || '';
                } else {
                    dados[`objetivo_${tempo}_tipo`] = selects[0]?.value || '';
                }
                
                dados[`objetivo_${tempo}_time`] = radioSelecionado?.value || 'Nenhum';
            } else {
                // Marcar como não ativo
                dados[`objetivo_${tempo}_ativo`] = 'Não';
                dados[`objetivo_${tempo}_tipo`] = 'Não selecionado';
                dados[`objetivo_${tempo}_time`] = 'Nenhum';
            }
        });
        
        return dados;
    }

    // Método para resetar todos os objetivos
    resetarObjetivos() {
        const grupos = document.querySelectorAll('.objetivo-grupo');
        
        grupos.forEach(grupo => {
            const checkbox = grupo.querySelector('.objetivo-checkbox');
            const opcoes = grupo.querySelector('.objetivo-opcoes');
            
            checkbox.checked = false;
            grupo.classList.remove('ativo', 'erro');
            opcoes.classList.add('oculta');
            
            // Limpar seleções
            const selects = opcoes.querySelectorAll('.select-objetivo');
            const radios = opcoes.querySelectorAll('input[type="radio"]');
            
            selects.forEach(select => select.value = '');
            radios.forEach(radio => radio.checked = false);
        });
        
        this.objetivosSelecionados.clear();
    }

    // Método para obter estatísticas dos objetivos
    obterEstatisticas() {
        const total = document.querySelectorAll('.objetivo-grupo').length;
        const selecionados = this.objetivosSelecionados.size;
        const completos = Array.from(document.querySelectorAll('.objetivo-grupo'))
            .filter(grupo => {
                const checkbox = grupo.querySelector('.objetivo-checkbox');
                return checkbox.checked && this.validarObjetivo(grupo);
            }).length;
        
        return {
            total,
            selecionados,
            completos,
            percentual: Math.round((completos / Math.max(selecionados, 1)) * 100)
        };
    }
}