class ObjectiveSystem {
    constructor() {
        this.objetivos = [
            { tempo: '6:00', nome: 'Primeiro Dragão', tipo: 'dragão' },
            { tempo: '11:00', nome: 'Segundo Dragão', tipo: 'dragão' },
            { tempo: '15:00', nome: 'Baron Nashor', tipo: 'baron' },
            { tempo: '16:00', nome: 'Terceiro Dragão ou Baron', tipo: 'ambos' },
            { tempo: '18:00', nome: 'Dragão Ancião', tipo: 'ancião' }
        ];
    }

    init() {
        this.renderizarObjetivos();
        this.configurarEventos();
        console.log('✅ ObjectiveSystem inicializado');
    }

    renderizarObjetivos() {
        const container = document.getElementById('objetivosContainer');
        if (!container) return;

        container.innerHTML = this.objetivos.map(objetivo => `
            <div class="objetivo-grupo" data-tempo="${objetivo.tempo}">
                <div class="objetivo-cabecalho">
                    <label class="checkbox-objetivo">
                        <input type="checkbox" name="objetivo_${objetivo.tempo.replace(':', '')}_ativo" value="sim">
                        <span class="checkmark"></span>
                        <span class="tempo-objetivo">${objetivo.tempo} - ${objetivo.nome}</span>
                    </label>
                </div>
                <div class="objetivo-opcoes oculta">
                    ${this.gerarOpcoes(objetivo)}
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

    gerarOpcoes(objetivo) {
        const opcoes = {
            'dragão': [
                { value: 'Fogo', label: ' Dragão de Fogo' },
                { value: 'Gelo', label: ' Dragão de Gelo' },
                { value: 'Montanha', label: ' Dragão de Montanha' },
                { value: 'Oceano', label: ' Dragão de Oceano' },
                { value: 'Orquestra', label: ' Arauto ' }
            ],
            'baron': [
                { value: 'Baron', label: ' Baron Nashor' }
            ],
            'ancião': [
                { value: 'Ancião', label: ' Dragão Ancião' }
            ],
            'ambos': [
                { value: 'Fogo', label: ' Dragão de Fogo' },
                { value: 'Gelo', label: ' Dragão de Gelo' },
                { value: 'Montanha', label: ' Dragão de Montanha' },
                { value: 'Oceano', label: ' Dragão de Oceano' },
                { value: 'Baron', label: ' Baron Nashor' }
            ]
        };

        const opcoesTipo = opcoes[objetivo.tipo] || [];
        
        return `
            <select name="objetivo_${objetivo.tempo.replace(':', '')}_tipo" class="select-objetivo">
                <option value="">Selecione...</option>
                ${opcoesTipo.map(opcao => 
                    `<option value="${opcao.value}">${opcao.label}</option>`
                ).join('')}
                <option value="Nenhum">⚪ Nenhum (não foi feito)</option>
            </select>
        `;
    }

    configurarEventos() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('.checkbox-objetivo input[type="checkbox"]')) {
                this.toggleOpcoesObjetivo(e.target);
            }
            
            if (e.target.matches('.select-objetivo, .objetivo-time input[type="radio"]')) {
                this.validarObjetivo(e.target.closest('.objetivo-grupo'));
            }
        });
    }

    toggleOpcoesObjetivo(checkbox) {
        const grupo = checkbox.closest('.objetivo-grupo');
        const opcoes = grupo.querySelector('.objetivo-opcoes');
        
        if (checkbox.checked) {
            grupo.classList.add('ativo');
            opcoes.classList.remove('oculta');
            opcoes.classList.add('visivel');
        } else {
            grupo.classList.remove('ativo');
            opcoes.classList.add('oculta');
            opcoes.classList.remove('visivel');
            
            const select = opcoes.querySelector('.select-objetivo');
            const radios = opcoes.querySelectorAll('input[type="radio"]');
            if (select) select.value = '';
            radios.forEach(radio => radio.checked = false);
        }
    }

    validarObjetivo(grupo) {
        const checkbox = grupo.querySelector('input[type="checkbox"]');
        const select = grupo.querySelector('.select-objetivo');
        const radios = grupo.querySelectorAll('.objetivo-time input[type="radio"]');
        
        if (!checkbox.checked) return true;

        const tipoSelecionado = select?.value;
        const timeSelecionado = Array.from(radios).some(radio => radio.checked);
        const valido = tipoSelecionado && (tipoSelecionado === 'Nenhum' || timeSelecionado);

        grupo.classList.toggle('erro', !valido);
        return valido;
    }

    validarTodosObjetivos() {
        const grupos = document.querySelectorAll('.objetivo-grupo');
        let valido = true;

        grupos.forEach(grupo => {
            if (!this.validarObjetivo(grupo)) {
                valido = false;
            }
        });

        return valido;
    }
}