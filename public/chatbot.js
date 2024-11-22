// Chatbot Widget
class ChatbotWidget {
    constructor(empresaId) {
        this.empresaId = empresaId;
        this.isOpen = false;
        this.init();
    }

    init() {
        // Criar os estilos
        const style = document.createElement('style');
        style.textContent = `
            .chatbot-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 999999;
            }

            .chatbot-button {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: #0066ff;
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
                transition: transform 0.2s;
            }

            .chatbot-button:hover {
                transform: scale(1.1);
            }

            .chatbot-button svg {
                width: 30px;
                height: 30px;
                fill: white;
            }

            .chatbot-frame {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 380px;
                height: 500px;
                border-radius: 10px;
                background: white;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                border: none;
                transition: all 0.3s;
                opacity: 1;
                transform: scale(1);
            }

            .chatbot-frame.hidden {
                opacity: 0;
                transform: scale(0.8);
                pointer-events: none;
            }

            @media (max-width: 480px) {
                .chatbot-frame {
                    width: 100%;
                    height: 100%;
                    bottom: 0;
                    right: 0;
                    border-radius: 0;
                }
            }
        `;
        document.head.appendChild(style);

        // Criar container
        const container = document.createElement('div');
        container.className = 'chatbot-container';

        // Criar botão
        const button = document.createElement('button');
        button.className = 'chatbot-button';
        button.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
        `;
        button.onclick = () => this.toggleChat();

        // Criar iframe
        const iframe = document.createElement('iframe');
        iframe.className = 'chatbot-frame hidden';
        
        // Obter URL base do script atual
        const baseUrl = new URL(document.currentScript.src).origin;
        iframe.src = `${baseUrl}/widget?empresaId=${this.empresaId}`;

        // Adicionar elementos
        container.appendChild(iframe);
        container.appendChild(button);
        document.body.appendChild(container);

        this.iframe = iframe;
        this.button = button;
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.iframe.classList.remove('hidden');
        } else {
            this.iframe.classList.add('hidden');
        }
    }
}

// Inicializar o widget
window.initChatbot = function(empresaId) {
    return new ChatbotWidget(empresaId);
};