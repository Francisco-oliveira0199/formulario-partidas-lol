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
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        let proximaPagina = this.paginaAtual + 1;
        
        // CORREÇÃO: Se não for Jungle e estiver na página 1, pular para página 3
        if (!isJungle && this.paginaAtual === 1) {
            proximaPagina = 3;
        }
        
        if (proximaPagina <= this.totalPaginas) {
            this.irParaPagina(proximaPagina);
        }
    }

    voltarPagina() {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        let paginaAnterior = this.paginaAtual - 1;
        
        // CORREÇÃO: Se não for Jungle e estiver na página 3, voltar para página 1
        if (!isJungle && this.paginaAtual === 3) {
            paginaAnterior = 1;
        }
        
        if (paginaAnterior >= 1) {
            this.irParaPagina(paginaAnterior);
        }
    }

    irParaPagina(numero) {
        if (this.validarPaginaAtual()) {
            this.ocultarPaginaAtual();
            this.mostrarPagina(numero);
            this.atualizarProgresso(numero);
            this.atualizarBotoes(numero);
            this.paginaAtual = numero;
            
            // Atualizar página atual no DraftSystem
            if (window.analyzer && window.analyzer.modulos.draft) {
                window.analyzer.modulos.draft.paginaAtual = numero;
            }
        }
    }

    validarPaginaAtual() {
        const camposObrigatorios = document.querySelectorAll(`#pagina${this.paginaAtual} [required]`);
        let valido = true;

        camposObrigatorios.forEach(campo => {
            if (!campo.checkValidity()) {
                campo.classList.add('erro');
                valido = false;
                
                // Scroll para o primeiro campo com erro
                if (valido === false) {
                    campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
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
            
            // Scroll para o topo da página
            setTimeout(() => {
                pagina.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    atualizarProgresso(numero) {
        document.querySelectorAll('.barra-progresso').forEach((barra, index) => {
            const numeroBarra = index + 1;
            barra.classList.toggle('ativo', numeroBarra === numero);
            barra.classList.toggle('concluido', numeroBarra < numero);
            
            // CORREÇÃO: Ocultar visualmente a página 2 no progresso se não for Jungle
            const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
            const isJungle = rotaSelecionada === 'Jungle';
            
            if (numeroBarra === 2 && !isJungle) {
                barra.style.opacity = '0.3';
            } else {
                barra.style.opacity = '1';
            }
        });
    }

    atualizarBotoes(numero) {
        const btnVoltar = document.querySelector('.btn-voltar');
        if (btnVoltar) {
            btnVoltar.disabled = numero === 1;
        }
        
        // Atualizar texto do botão avançar na última página
        const btnAvancar = document.querySelector('.btn-avancar');
        if (btnAvancar && numero === this.totalPaginas) {
            btnAvancar.style.display = 'none';
        } else if (btnAvancar) {
            btnAvancar.style.display = 'block';
        }
    }

    getProximaPagina() {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        if (!isJungle && this.paginaAtual === 1) {
            return 3; // Pular página 2 se não for Jungle
        }
        
        return this.paginaAtual + 1;
    }
}