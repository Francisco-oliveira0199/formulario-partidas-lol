// validacao.js - VERSÃO COM VALIDAÇÃO INTELIGENTE
class Validacao {
    constructor() {
        this.regras = {
            nickname: /^[a-zA-Z0-9_]{2,16}$/,
            campeao: /^[a-zA-Z\s]{2,20}$/,
            elo: /.+/ // Qualquer valor não vazio
        };
    }

    init() {
        this.configurarValidacaoRealTime();
        this.configurarValidacaoCampeoes();
        console.log('✅ Validacao inicializado');
    }

    configurarValidacaoRealTime() {
        // Validação em tempo real para campos com data-validate
        document.addEventListener('blur', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validarCampo(e.target);
            }
        }, true);

        // Validação para campos required
        document.addEventListener('input', (e) => {
            if (e.target.matches('[required]')) {
                this.validarCampoObrigatorio(e.target);
            }
        });
    }

    configurarValidacaoCampeoes() {
        // Validação para campos de campeões com datalist
        document.addEventListener('input', (e) => {
            if (e.target.matches('input[list="listaCampeoes"]')) {
                this.validarCampeao(e.target);
            }
        });
    }

    validarCampo(campo) {
        const tipo = campo.dataset.validate;
        const valor = campo.value.trim();
        let valido = true;
        let mensagem = '';

        switch(tipo) {
            case 'nickname':
                valido = this.regras.nickname.test(valor);
                mensagem = valido ? '' : 'Nickname deve ter 2-16 caracteres (letras, números, _)';
                break;
            case 'campeao':
                valido = this.regras.campeao.test(valor);
                mensagem = valido ? '' : 'Nome de campeão inválido';
                break;
            case 'elo':
                valido = this.regras.elo.test(valor);
                mensagem = valido ? '' : 'Selecione um elo válido';
                break;
        }

        campo.setCustomValidity(mensagem);
        this.mostrarFeedback(campo, valido, mensagem);
        return valido;
    }

    validarCampoObrigatorio(campo) {
        const valor = campo.value.trim();
        const valido = valor !== '';
        
        campo.classList.toggle('erro', !valido);
        
        // Limpar feedback anterior
        this.limparFeedback(campo);
        
        if (!valido) {
            this.mostrarFeedback(campo, false, 'Este campo é obrigatório');
        }
        
        return valido;
    }

    validarCampeao(campo) {
        const valor = campo.value.trim();
        
        // Se estiver vazio, não validar (deixa para o required)
        if (!valor) {
            campo.setCustomValidity('');
            this.limparFeedback(campo);
            return true;
        }

        // Verificar se é um campeão válido (case insensitive)
        const campeoes = Array.from(document.getElementById('listaCampeoes').options)
            .map(opt => opt.value.toLowerCase());
        
        const valido = campeoes.includes(valor.toLowerCase());
        const mensagem = valido ? '' : 'Campeão não reconhecido. Use a lista de sugestões.';

        campo.setCustomValidity(mensagem);
        this.mostrarFeedback(campo, valido, mensagem);
        return valido;
    }

    mostrarFeedback(campo, valido, mensagem) {
        campo.classList.toggle('erro', !valido);
        
        // Limpar feedback anterior
        this.limparFeedback(campo);

        if (!valido && mensagem) {
            const feedback = document.createElement('div');
            feedback.className = 'feedback erro';
            feedback.textContent = mensagem;
            feedback.style.cssText = 'color: var(--cor-erro); font-size: 12px; margin-top: 4px;';
            campo.parentNode.appendChild(feedback);
        }
    }

    limparFeedback(campo) {
        const feedbackExistente = campo.parentNode.querySelector('.feedback');
        if (feedbackExistente) {
            feedbackExistente.remove();
        }
    }

    validarFormularioCompleto() {
        const campos = document.querySelectorAll('[required], [data-validate]');
        let valido = true;
        let primeiroErro = null;

        campos.forEach(campo => {
            let campoValido = true;
            
            if (campo.hasAttribute('required')) {
                campoValido = this.validarCampoObrigatorio(campo);
            }
            
            if (campo.hasAttribute('data-validate')) {
                campoValido = this.validarCampo(campo) && campoValido;
            }
            
            if (!campoValido && !primeiroErro) {
                primeiroErro = campo;
            }
            
            valido = campoValido && valido;
        });

        // Scroll para o primeiro erro se houver
        if (!valido && primeiroErro) {
            primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primeiroErro.focus();
        }

        return valido;
    }

    // Método para validar uma página específica
    validarPagina(numeroPagina) {
        const pagina = document.getElementById(`pagina${numeroPagina}`);
        if (!pagina) return true;

        const campos = pagina.querySelectorAll('[required], [data-validate]');
        let valido = true;
        let primeiroErro = null;

        // Filtrar apenas campos visíveis
        const camposVisiveis = Array.from(campos).filter(campo => {
            return campo.offsetParent !== null && 
                   campo.closest('.oculta') === null;
        });

        camposVisiveis.forEach(campo => {
            let campoValido = true;
            
            if (campo.hasAttribute('required')) {
                campoValido = this.validarCampoObrigatorio(campo);
            }
            
            if (campo.hasAttribute('data-validate')) {
                campoValido = this.validarCampo(campo) && campoValido;
            }
            
            if (!campoValido && !primeiroErro) {
                primeiroErro = campo;
            }
            
            valido = campoValido && valido;
        });

        if (!valido && primeiroErro) {
            primeiroErro.scrollIntoView({ behavior: 'smooth', block: 'center' });
            primeiroErro.focus();
        }

        return valido;
    }
}