class Validacao {
    constructor() {
        this.regras = {
            nickname: /^[a-zA-Z0-9_]{2,16}$/,
            campeao: /^[a-zA-Z\s]{2,20}$/
        };
    }

    init() {
        this.configurarValidacaoRealTime();
        console.log('✅ Validacao inicializado');
    }

    configurarValidacaoRealTime() {
        document.addEventListener('blur', (e) => {
            if (e.target.matches('[data-validate]')) {
                this.validarCampo(e.target);
            }
        }, true);
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
        }

        campo.setCustomValidity(mensagem);
        this.mostrarFeedback(campo, valido, mensagem);
        return valido;
    }

    mostrarFeedback(campo, valido, mensagem) {
        campo.classList.toggle('erro', !valido);
        
        const feedbackExistente = campo.parentNode.querySelector('.feedback');
        if (feedbackExistente) {
            feedbackExistente.remove();
        }

        if (!valido && mensagem) {
            const feedback = document.createElement('div');
            feedback.className = 'feedback erro';
            feedback.textContent = mensagem;
            feedback.style.cssText = 'color: var(--cor-erro); font-size: 12px; margin-top: 4px;';
            campo.parentNode.appendChild(feedback);
        }
    }

    validarFormulario() {
        const campos = document.querySelectorAll('[required], [data-validate]');
        let valido = true;

        campos.forEach(campo => {
            if (!this.validarCampo(campo)) {
                valido = false;
            }
        });

        return valido;
    }
}