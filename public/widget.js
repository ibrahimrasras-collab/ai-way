(function () {
  const script = document.currentScript as HTMLScriptElement;
  const chatbotId = script?.getAttribute('data-chatbot-id');
  if (!chatbotId) return;

  const container = document.createElement('div');
  container.id = 'aiway-widget';
  document.body.appendChild(container);

  let isOpen = false;
  let messages: { role: string; content: string }[] = [];

  container.innerHTML = `
    <style>
      #aiway-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: -apple-system, sans-serif; }
      #aiway-toggle { width: 56px; height: 56px; border-radius: 50%; background: #3b82f6; color: white; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); font-size: 24px; }
      #aiway-chat { display: none; position: absolute; bottom: 70px; right: 0; width: 380px; height: 500px; background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.15); overflow: hidden; flex-direction: column; }
      #aiway-chat.open { display: flex; }
      #aiway-header { padding: 16px; background: #3b82f6; color: white; font-weight: 600; }
      #aiway-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
      .aiway-msg { padding: 10px 14px; border-radius: 8px; max-width: 85%; font-size: 14px; line-height: 1.5; }
      .aiway-msg.user { background: #3b82f6; color: white; align-self: flex-end; }
      .aiway-msg.bot { background: #f1f5f9; color: #1e293b; align-self: flex-start; }
      #aiway-input { display: flex; gap: 8px; padding: 12px; border-top: 1px solid #e2e8f0; }
      #aiway-input input { flex: 1; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 14px; outline: none; }
      #aiway-input button { padding: 10px 16px; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; }
    </style>
    <button id="aiway-toggle">💬</button>
    <div id="aiway-chat">
      <div id="aiway-header">Chat with us</div>
      <div id="aiway-messages"></div>
      <div id="aiway-input">
        <input type="text" placeholder="Type a message..." id="aiway-text" />
        <button id="aiway-send">Send</button>
      </div>
    </div>
  `;

  const toggle = container.querySelector('#aiway-toggle') as HTMLButtonElement;
  const chat = container.querySelector('#aiway-chat') as HTMLDivElement;
  const messagesDiv = container.querySelector('#aiway-messages') as HTMLDivElement;
  const input = container.querySelector('#aiway-text') as HTMLInputElement;
  const sendBtn = container.querySelector('#aiway-send') as HTMLButtonElement;

  function renderMessages() {
    messagesDiv.innerHTML = messages
      .map(
        (m) =>
          `<div class="aiway-msg ${m.role}">${m.content.replace(/</g, '&lt;')}</div>`
      )
      .join('');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  toggle.onclick = () => {
    isOpen = !isOpen;
    chat.classList.toggle('open', isOpen);
    toggle.textContent = isOpen ? '✕' : '💬';
  };

  async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    messages.push({ role: 'user', content: text });
    renderMessages();
    input.value = '';

    try {
      const res = await fetch('/api/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, chatbotId }),
      });
      const data = await res.json();
      messages.push({ role: 'bot', content: data.message });
    } catch {
      messages.push({ role: 'bot', content: 'Sorry, something went wrong.' });
    }
    renderMessages();
  }

  sendBtn.onclick = sendMessage;
  input.onkeydown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };
})();
