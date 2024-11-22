(function(window) {
  // Armazenar configurações globais
  var defaultConfig = {
    position: 'bottom-right',
    color: '#0066ff',
    greeting: 'Olá! Como posso ajudar?',
    language: 'pt-br'
  };

  // Classe principal do ChatBot
  function ChatBotSDK() {
    this.queue = [];
    this.config = { ...defaultConfig };
    this.isOpen = false;
    this.initialized = false;
  }

  ChatBotSDK.prototype.createStyles = function() {
    var style = document.createElement('style');
    style.textContent = `
      .chatbot-widget-container {
        position: fixed;
        ${this.config.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
        bottom: 20px;
        z-index: 9999;
      }

      .chatbot-toggle-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: ${this.config.color};
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        transition: transform 0.3s ease;
      }

      .chatbot-toggle-button:hover {
        transform: scale(1.1);
      }

      .chatbot-toggle-button svg {
        width: 30px;
        height: 30px;
        fill: white;
      }

      .chatbot-iframe {
        position: fixed;
        ${this.config.position === 'bottom-right' ? 'right: 20px;' : 'left: 20px;'}
        bottom: 100px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform-origin: ${this.config.position === 'bottom-right' ? 'bottom right' : 'bottom left'};
        background-color: white;
      }

      .chatbot-iframe.closed {
        transform: scale(0.8);
        opacity: 0;
        pointer-events: none;
      }

      @media (max-width: 480px) {
        .chatbot-iframe {
          width: 100%;
          height: 100%;
          right: 0;
          left: 0;
          bottom: 0;
          border-radius: 0;
        }
      }
    `;
    document.head.appendChild(style);
  };

  ChatBotSDK.prototype.createToggleButton = function() {
    var button = document.createElement('button');
    button.className = 'chatbot-toggle-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    `;
    var self = this;
    button.onclick = function() { self.toggleChat(); };
    return button;
  };

  ChatBotSDK.prototype.init = function() {
    if (this.initialized) return;
    this.initialized = true;

    this.createStyles();

    // Criar container
    var container = document.createElement('div');
    container.className = 'chatbot-widget-container';

    // Criar iframe
    var iframe = document.createElement('iframe');
    iframe.className = 'chatbot-iframe closed';
    
    // Obter URL base do script atual
    var currentScript = document.currentScript || document.querySelector('script[src*="chatbot.js"]');
    var scriptUrl = new URL(currentScript.src);
    var baseUrl = scriptUrl.origin + scriptUrl.pathname.replace('chatbot.js', '');
    
    // Configurar URL do iframe com parâmetros
    var iframeUrl = new URL('widget', baseUrl);
    iframeUrl.searchParams.set('empresaId', window.ChatBotID);
    iframeUrl.searchParams.set('greeting', this.config.greeting);
    iframeUrl.searchParams.set('language', this.config.language);
    
    iframe.src = iframeUrl.toString();

    // Criar botão de toggle
    var toggleButton = this.createToggleButton();
    
    // Adicionar elementos ao container
    container.appendChild(iframe);
    container.appendChild(toggleButton);

    // Adicionar ao body
    document.body.appendChild(container);

    this.iframe = iframe;
    this.toggleButton = toggleButton;

    // Processar fila de comandos
    this.processQueue();
  };

  ChatBotSDK.prototype.toggleChat = function() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.iframe.classList.remove('closed');
    } else {
      this.iframe.classList.add('closed');
    }
  };

  ChatBotSDK.prototype.processQueue = function() {
    while (this.queue.length > 0) {
      var args = this.queue.shift();
      this.handleCommand.apply(this, args);
    }
  };

  ChatBotSDK.prototype.handleCommand = function(command, options) {
    switch (command) {
      case 'config':
        this.config = { ...this.config, ...options };
        break;
      case 'open':
        if (!this.isOpen) this.toggleChat();
        break;
      case 'close':
        if (this.isOpen) this.toggleChat();
        break;
    }
  };

  // Função global do ChatBot
  window.ChatBot = function() {
    var instance = window.ChatBot.instance;
    if (!instance) {
      instance = new ChatBotSDK();
      window.ChatBot.instance = instance;
    }

    if (instance.initialized) {
      instance.handleCommand.apply(instance, arguments);
    } else {
      instance.queue.push(arguments);
    }
  };

  // Inicializar quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      window.ChatBot.instance.init();
    });
  } else {
    window.ChatBot.instance.init();
  }

})(window);