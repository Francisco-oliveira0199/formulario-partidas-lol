class UploadSystem {
    constructor() {
        this.maxFileSize = 5 * 1024 * 1024; // 5MB
        this.allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    }

    init() {
        this.configurarUploads();
        console.log('✅ UploadSystem inicializado');
    }

    configurarUploads() {
        document.addEventListener('change', (e) => {
            if (e.target.matches('.upload-input')) {
                this.processarUpload(e.target);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn-remover-imagem')) {
                this.removerImagem(e.target);
            }
        });

        // Configurar drag and drop
        this.configurarDragAndDrop();
    }

    configurarDragAndDrop() {
        const uploadAreas = document.querySelectorAll('.upload-area');
        
        uploadAreas.forEach(area => {
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
    }

    processarUpload(input) {
        const file = input.files[0];
        if (!file) return;

        // Validar tipo de arquivo
        if (!this.allowedTypes.includes(file.type)) {
            this.mostrarErro(input, 'Tipo de arquivo não permitido. Use PNG, JPG ou WebP.');
            return;
        }

        // Validar tamanho do arquivo
        if (file.size > this.maxFileSize) {
            this.mostrarErro(input, 'Arquivo muito grande. Máximo 5MB.');
            return;
        }

        // Criar preview
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
            
            this.limparMensagem(uploadArea);
        };

        reader.readAsDataURL(file);
    }

    removerImagem(btn) {
        const uploadArea = btn.closest('.upload-area');
        const input = uploadArea.closest('.upload-label').querySelector('.upload-input');
        const placeholder = uploadArea.querySelector('.upload-placeholder');
        const preview = uploadArea.querySelector('.upload-preview');
        
        // Limpar input
        input.value = '';
        
        // Mostrar placeholder
        placeholder.classList.remove('oculta');
        preview.classList.add('oculta');
        uploadArea.classList.remove('com-imagem', 'erro');
        
        this.limparMensagem(uploadArea);
    }

    mostrarErro(input, mensagem) {
        const uploadArea = input.closest('.upload-label').querySelector('.upload-area');
        uploadArea.classList.add('erro');
        
        this.limparMensagem(uploadArea);
        
        const mensagemElem = document.createElement('div');
        mensagemElem.className = 'upload-mensagem erro';
        mensagemElem.textContent = mensagem;
        uploadArea.appendChild(mensagemElem);
        
        // Limpar input
        input.value = '';
    }

    limparMensagem(uploadArea) {
        const mensagemExistente = uploadArea.querySelector('.upload-mensagem');
        if (mensagemExistente) {
            mensagemExistente.remove();
        }
    }

    // Coletar dados das imagens para envio (será usado no FormData)
    coletarDadosImagens(formData) {
        const inputs = document.querySelectorAll('.upload-input');
        
        inputs.forEach(input => {
            if (input.files[0]) {
                formData.append(input.name, input.files[0]);
            }
        });
    }
}