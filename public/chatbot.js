// ChatBot Widget Loader
class ChatBot {
  constructor(config) {
    this.config = config;
    this.init();
  }

  async init() {
    // Create iframe for the chatbot
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.bottom = '20px';
    iframe.style.right = '20px';
    iframe.style.width = '400px';
    iframe.style.height = '600px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    
    // Get the current script URL to determine the widget URL
    const currentScript = document.currentScript || document.querySelector('script[src*="chatbot.js"]');
    const scriptUrl = new URL(currentScript.src);
    const widgetUrl = new URL('/widget', scriptUrl.origin);
    widgetUrl.searchParams.set('empresaId', this.config.empresaId);
    
    // Set the src to our widget URL with the company ID
    iframe.src = widgetUrl.toString();
    
    // Add iframe to the specified container or body
    const container = document.getElementById(this.config.container) || document.body;
    container.appendChild(iframe);
  }
}

// Make ChatBot available globally
window.ChatBot = ChatBot;