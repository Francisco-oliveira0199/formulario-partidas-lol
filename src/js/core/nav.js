// nav.js - VERSÃO CORRIGIDA
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
        
        // CORREÇÃO: Lógica simplificada - Jungle segue sequência normal
        // Não-Jungle pula da página 1 para página 3
        if (!isJungle && this.paginaAtual === 1) {
            proximaPagina = 3;
        }
        
        console.log(`🔄 Avançando: ${this.paginaAtual} → ${proximaPagina} (Jungle: ${isJungle})`);
        
        if (proximaPagina <= this.totalPaginas) {
            this.irParaPagina(proximaPagina);
        }
    }

    voltarPagina() {
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        let paginaAnterior = this.paginaAtual - 1;
        
        // CORREÇÃO: Lógica de voltar corrigida
        if (!isJungle && this.paginaAtual === 3) {
            paginaAnterior = 1;
        } else if (isJungle && this.paginaAtual === 3) {
            paginaAnterior = 2; // Jungle volta da 3 para 2 normalmente
        }
        
        console.log(`🔄 Voltando: ${this.paginaAtual} → ${paginaAnterior} (Jungle: ${isJungle})`);
        
        if (paginaAnterior >= 1) {
            this.irParaPagina(paginaAnterior);
        }
    }

    irParaPagina(numero) {
        console.log(`🎯 Navegando para página ${numero}`);
        
        if (this.validarPaginaAtual()) {
            this.ocultarTodasPaginas();
            this.mostrarPagina(numero);
            this.atualizarProgresso(numero);
            this.atualizarBotoes(numero);
            this.paginaAtual = numero;
            
            // Atualizar página atual no DraftSystem
            if (window.analyzer && window.analyzer.modulos.draft) {
                window.analyzer.modulos.draft.paginaAtual = numero;
                // Forçar atualização da visibilidade ao mudar de página
                setTimeout(() => {
                    window.analyzer.modulos.draft.atualizarVisibilidadeRota();
                }, 100);
            }
        }
    }

    ocultarTodasPaginas() {
        document.querySelectorAll('.pagina').forEach(pagina => {
            pagina.classList.remove('ativo');
        });
    }

    validarPaginaAtual() {
        const paginaAtual = document.getElementById(`pagina${this.paginaAtual}`);
        let camposObrigatorios = paginaAtual.querySelectorAll('[required]');
        
        // CORREÇÃO: Filtrar campos que estão visíveis
        camposObrigatorios = Array.from(camposObrigatorios).filter(campo => {
            const elementoPai = campo.closest('.jungle-only, .jungle-mid-only');
            if (elementoPai && elementoPai.classList.contains('oculta')) {
                return false; // Ignorar campos em elementos ocultos
            }
            return true;
        });
        
        let valido = true;

        camposObrigatorios.forEach(campo => {
            if (!campo.checkValidity()) {
                campo.classList.add('erro');
                valido = false;
                
                // Scroll para o primeiro campo com erro
                if (valido === false) {
                    campo.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    campo.focus();
                }
            } else {
                campo.classList.remove('erro');
            }
        });

        if (!valido) {
            alert('Por favor, preencha todos os campos obrigatórios antes de avançar.');
        }

        return valido;
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
        const rotaSelecionada = document.querySelector('input[name="rota"]:checked')?.value;
        const isJungle = rotaSelecionada === 'Jungle';
        
        document.querySelectorAll('.barra-progresso').forEach((barra, index) => {
            const numeroBarra = index + 1;
            
            // Estados principais
            const estaAtiva = numeroBarra === numero;
            const foiConcluida = numeroBarra < numero;
            const ehPagina2 = numeroBarra === 2;
            
            // Resetar classes
            barra.classList.remove('ativo', 'concluido', 'ignorada', 'com-erro');
            
            // Aplicar classes conforme estado
            if (estaAtiva) {
                barra.classList.add('ativo');
            } else if (foiConcluida) {
                barra.classList.add('concluido');
            }
            
            // Página 2 fica "ignorada" se não for Jungle
            if (!isJungle && ehPagina2) {
                barra.classList.add('ignorada');
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
        const btnEnviar = document.querySelector('.btn-enviar');
        
        if (btnAvancar && btnEnviar) {
            if (numero === this.totalPaginas) {
                btnAvancar.style.display = 'none';
                btnEnviar.style.display = 'block';
            } else {
                btnAvancar.style.display = 'block';
                btnEnviar.style.display = 'none';
            }
        }
    }
}