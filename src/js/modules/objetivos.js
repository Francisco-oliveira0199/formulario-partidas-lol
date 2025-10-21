class ObjectiveSystem {
    constructor() {
        this.objetivosSelecionados = new Set();
    }

    init() {
        this.configurarEventos();
        console.log('✅ ObjectiveSystem inicializado (HTML estático)');
    }

    configurarEventos() {
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
            if (e.target.matches('.btn-avancar') && document.getElementById('pagina4').classList.contains('ativo')) {
                if (!this.validarTodosObjetivos()) {
                    e.preventDefault();
                    this.mostrarErroGeral();
                }
            }
        });
    }

    toggleOpcoesObjetivo(checkbox) {
        const grupo = checkbox.closest('.objetivo-grupo');
        const opcoes = grupo.querySelector('.objetivo-opcoes');
        
        if (checkbox.checked) {
            grupo.classList.add('ativo');
            opcoes.classList.remove('oculta');
            this.objetivosSelecionados.add(grupo.dataset.tempo);
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
        return valido;
    }

    contemNenhum(selects) {
        return Array.from(selects).some(select => 
            select.value === 'Nenhum' || select.value === 'Nenhum (não foi feito)'
        );
    }

    validarTodosObjetivos() {
        const grupos = document.querySelectorAll('.objetivo-grupo');
        let valido = true;

        grupos.forEach(grupo => {
            if (!this.validarObjetivo(grupo)) {
                valido = false;
                
                // Scroll para o primeiro objetivo com erro
                if (valido === false) {
                    grupo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });

        return valido;
    }

    mostrarErroGeral() {
        const gruposComErro = document.querySelectorAll('.objetivo-grupo.erro');
        if (gruposComErro.length > 0) {
            alert('⚠️ Por favor, complete as informações dos objetivos selecionados antes de avançar.');
        }
    }

    // Método para coletar dados dos objetivos (útil para o envio do formulário)
    coletarDadosObjetivos() {
        const dados = {};
        const grupos = document.querySelectorAll('.objetivo-grupo');
        
        grupos.forEach(grupo => {
            const tempo = grupo.dataset.tempo.replace(':', '');
            const checkbox = grupo.querySelector('.objetivo-checkbox');
            
            if (checkbox.checked) {
                const selects = grupo.querySelectorAll('.select-objetivo');
                const radioSelecionado = grupo.querySelector('.objetivo-time input[type="radio"]:checked');
                
                // Para objetivo duplo (6:00)
                if (grupo.dataset.tempo === '6:00') {
                    dados[`objetivo_${tempo}_tipo_1`] = selects[0]?.value || '';
                    dados[`objetivo_${tempo}_tipo_2`] = selects[1]?.value || '';
                } else {
                    dados[`objetivo_${tempo}_tipo`] = selects[0]?.value || '';
                }
                
                dados[`objetivo_${tempo}_time`] = radioSelecionado?.value || '';
            }
        });
        
        return dados;
    }
}