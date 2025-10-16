class EstilosManager {
    constructor() {
        this.campeoes = this.carregarCampeoes();
        this.estado = {
            modificado: false,
            backup: null
        };
    }

    init() {
        this.configurarAutoComplete();
        this.configurarValidacao();
        this.configurarBackup();
        this.configurarEventos();
        console.log('✅ EstilosManager inicializado');
    }

    carregarCampeoes() {
        return [
            'Aatrox', 'Ahri', 'Akali', 'Alistar', 'Amumu', 'Anivia', 'Annie', 'Ashe', 'Aurelion Sol',
            'Blitzcrank', 'Brand', 'Braum', 'Bardo', 'Caitlyn', 'Camille', 'Corki', 'Darius', 'Diana', 'Draven',
            'Dr. Mundo', 'Ekko', 'Elise', 'Evelynn', 'Ezreal', 'Fiddlesticks', 'Fiora', 'Fizz', 'Galio',
            'Garen', 'Gragas', 'Graves', 'Gwen', 'Hecarim', 'Illaoi', 'Irelia', 'Ivern', 'Janna', 'Jarvan IV',
            'Jax', 'Jayce', 'Jhin', 'Jinx', 'KaiSa', 'Kalista', 'Karma', 'Katarina', 'Kayle', 'Kayn',
            'Kennen', 'KhaZix', 'Kindred', 'KogMaw', 'LeBlanc', 'Lee Sin', 'Leona', 'Lillia', 'Lissandra',
            'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar', 'Maokai', 'Master Yi', 'Miss Fortune', 'Mordekaiser',
            'Morgana', 'Nami', 'Nasus', 'Nautilus', 'Nidalee', 'Nocturne', 'Nunu & Willump', 'Olaf', 'Orianna',
            'Ornn', 'Pantheon', 'Poppy', 'Pyke', 'Qiyana', 'Quinn', 'Rakan', 'Rammus', 'RekSai', 'Rell',
            'Renekton', 'Rengar', 'Riven', 'Rumble', 'Ryze', 'Samira', 'Sejuani', 'Senna', 'Seraphine',
            'Sett', 'Shaco', 'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona', 'Soraka',
            'Swain', 'Sylas', 'Syndra', 'Tahm Kench', 'Taliyah', 'Talon', 'Taric', 'Teemo', 'Thresh',
            'Tristana', 'Trundle', 'Tryndamere', 'Twisted Fate', 'Twitch', 'Udyr', 'Urgot', 'Varus',
            'Vayne', 'Veigar', 'VelKoz', 'Vi', 'Viego', 'Viktor', 'Vladimir', 'Volibear', 'Warwick',
            'Wukong', 'Xayah', 'Xerath', 'Xin Zhao', 'Yasuo', 'Yone', 'Yorick', 'Yuumi', 'Zac', 'Zed',
            'Ziggs', 'Zilean', 'Zoe', 'Zyra'
        ];
    }

    configurarAutoComplete() {
        const datalist = document.getElementById('listaCampeoes');
        if (!datalist) return;

        this.campeoes.forEach(campeao => {
            const option = document.createElement('option');
            option.value = campeao;
            datalist.appendChild(option);
        });
    }

    configurarValidacao() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('[required]')) {
                this.validarCampo(e.target);
            }
            
            if (e.target.matches('input[list="listaCampeoes"]')) {
                this.validarCampeao(e.target);
            }
        });
    }

    validarCampo(campo) {
        const valido = campo.checkValidity();
        campo.classList.toggle('erro', !valido);
        return valido;
    }

    validarCampeao(campo) {
        const valor = campo.value.trim();
        const valido = !valor || this.campeoes.some(c => 
            c.toLowerCase() === valor.toLowerCase()
        );

        campo.setCustomValidity(valido ? '' : 'Campeão não reconhecido');
        this.validarCampo(campo);
        return valido;
    }

    configurarBackup() {
        setInterval(() => {
            if (this.estado.modificado) {
                this.salvarBackup();
            }
        }, 30000);
    }

    salvarBackup() {
        try {
            const dados = this.coletarDados();
            localStorage.setItem('backup_analise', JSON.stringify({
                dados,
                timestamp: Date.now()
            }));
            this.atualizarStatusBackup('sucesso');
        } catch (error) {
            console.warn('Erro no backup:', error);
            this.atualizarStatusBackup('erro');
        }
    }

    coletarDados() {
        const dados = {};
        const campos = document.querySelectorAll('input, textarea, select');
        
        campos.forEach(campo => {
            if (campo.name && !campo.name.startsWith('_')) {
                if (campo.type === 'checkbox') {
                    dados[campo.name] = campo.checked ? campo.value || 'Sim' : 'Não';
                } else if (campo.type === 'radio') {
                    if (campo.checked) dados[campo.name] = campo.value;
                } else {
                    dados[campo.name] = campo.value;
                }
            }
        });

        return dados;
    }

    configurarEventos() {
        document.addEventListener('input', () => {
            this.estado.modificado = true;
        });
    }

    atualizarStatusBackup(estado) {
        const statusElem = document.getElementById('backupStatus');
        if (statusElem) {
            statusElem.textContent = {
                'salvando': '🔄 Salvando...',
                'sucesso': '✅ Backup salvo',
                'erro': '❌ Erro no backup'
            }[estado] || '';
            
            statusElem.className = `backup-status ${estado}`;
        }
    }
}