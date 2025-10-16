class Navigation {
    constructor() {
        this.paginaAtual = 1;
        this.totalPaginas = 6;
    }

    init() {
        this.configurarNavegacao();
        this.configurarTeclado();
        console.log('✅ Navigation inicializado');
    }

    configurarNavegacao() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-avancar')) {
                this.avancarPagina();
            } else if (e.target.matches('.btn-voltar')) {
                this.voltarPagina();
            }
        });
    }

    configurarTeclado() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                this.avancarPagina();
            } else if (e.key === 'ArrowLeft') {
                this.voltarPagina();
            }
        });
    }

    avancarPagina() {
        if (this.paginaAtual < this.totalPaginas) {
            this.irParaPagina(this.paginaAtual + 1);
        }
    }

    voltarPagina() {
        if (this.paginaAtual > 1) {
            this.irParaPagina(this.paginaAtual - 1);
        }
    }

    irParaPagina(numero) {
        if (this.validarPaginaAtual()) {
            this.ocultarPaginaAtual();
            this.mostrarPagina(numero);
            this.atualizarProgresso(numero);
            this.atualizarBotoes(numero);
            this.paginaAtual = numero;
        }
    }

    validarPaginaAtual() {
        const camposObrigatorios = document.querySelectorAll(`#pagina${this.paginaAtual} [required]`);
        let valido = true;

        camposObrigatorios.forEach(campo => {
            if (!campo.checkValidity()) {
                campo.classList.add('erro');
                valido = false;
            }
        });

        return valido;
    }

    ocultarPaginaAtual() {
        const paginaAtual = document.getElementById(`pagina${this.paginaAtual}`);
        if (paginaAtual) {
            paginaAtual.classList.remove('ativo');
        }
    }

    mostrarPagina(numero) {
        const pagina = document.getElementById(`pagina${numero}`);
        if (pagina) {
            pagina.classList.add('ativo');
        }
    }

    atualizarProgresso(numero) {
        document.querySelectorAll('.barra-progresso').forEach((barra, index) => {
            barra.classList.toggle('ativo', index + 1 === numero);
            barra.classList.toggle('concluido', index + 1 < numero);
        });
    }

    atualizarBotoes(numero) {
        const btnVoltar = document.querySelector('.btn-voltar');
        if (btnVoltar) {
            btnVoltar.disabled = numero === 1;
        }
    }
}