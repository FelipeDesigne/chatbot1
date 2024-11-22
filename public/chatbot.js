// ChatBot Widget Loader
class ChatBot {
  constructor(config) {
    this.config = config;
    this.isOpen = false;
    this.init();
  }

  createStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .chatbot-widget-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
      }

      .chatbot-toggle-button {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #0066ff;
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
        bottom: 100px;
        right: 20px;
        width: 400px;
        height: 600px;
        border: none;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        transition: transform 0.3s ease, opacity 0.3s ease;
        transform-origin: bottom right;
      }

      .chatbot-iframe.closed {
        transform: scale(0.8);
        opacity: 0;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  createToggleButton() {
    const button = document.createElement('button');
    button.className = 'chatbot-toggle-button';
    button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
      </svg>
    `;
    button.onclick = () => this.toggleChat();
    return button;
  }

  async init() {
    this.createStyles();

    // Create container
    const container = document.createElement('div');
    container.className = 'chatbot-widget-container';

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.className = 'chatbot-iframe closed';
    
    // Get the current script URL to determine the widget URL
    const currentScript = document.currentScript || document.querySelector('script[src*="chatbot.js"]');
    const scriptUrl = new URL(currentScript.src);
    const widgetUrl = new URL('/widget', scriptUrl.origin);
    widgetUrl.searchParams.set('empresaId', this.config.empresaId);
    
    // Set the src to our widget URL with the company ID
    iframe.src = widgetUrl.toString();

    // Create toggle button
    const toggleButton = this.createToggleButton();
    
    // Add elements to container
    container.appendChild(iframe);
    container.appendChild(toggleButton);

    // Add container to body
    document.body.appendChild(container);

    this.iframe = iframe;
    this.toggleButton = toggleButton;
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.iframe.classList.remove('closed');
    } else {
      this.iframe.classList.add('closed');
    }
  }
}

// Make ChatBot available globally
window.ChatBot = ChatBot;