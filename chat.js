// ============================================
//  KIP SMART LIVING — LIVE CHAT ENGINE
//  Fully driven by data/chat.json
// ============================================

const KipChat = {
  isOpen: false,
  config: null,
  _pendingProactive: null,

  async loadConfig() {
    try {
      const res = await fetch('./chat.json');
      this.config = await res.json();
    } catch (err) {
      console.error('Chat config failed to load:', err);
      this.config = {
        agent: { name: "Kip Assistant", avatar: "🤖", status: "Online now", welcomeMessage: "Hello 👋 How can I help?", typingDelay: 900 },
        quickReplies: [],
        autoReplies: [],
        fallbackResponses: ["Thanks! Try browsing our products."],
        proactiveMessages: []
      };
    }
  },

  async init() {
    await this.loadConfig();
    this.render();
    this.bindEvents();
    this.scheduleProactiveMessages();
    if (!document.getElementById('kip-chat-style')) {
      const style = document.createElement('style');
      style.id = 'kip-chat-style';
      style.textContent = `@keyframes typingDot { 0%,100%{opacity:0.3;transform:scale(1)} 50%{opacity:1;transform:scale(1.4)} }`;
      document.head.appendChild(style);
    }
  },

  render() {
    const { agent, quickReplies } = this.config;
    const quickBtns = quickReplies.map((r, i) =>
      `<button class="quick-reply" data-index="${i}">${r.label}</button>`
    ).join('');

    const html = `
      <button class="chat-bubble" id="chatBubble" aria-label="Open chat">
        💬
        <div class="chat-notification" id="chatNotif" style="display:none">1</div>
      </button>
      <div class="chat-panel" id="chatPanel" role="dialog" aria-label="Live chat">
        <div class="chat-header">
          <div class="chat-avatar">${agent.avatar}</div>
          <div class="chat-header-info">
            <div class="chat-header-name">${agent.name}</div>
            <div class="chat-header-status">${agent.status}</div>
          </div>
          <button class="chat-close" id="chatClose" aria-label="Close chat">✕</button>
        </div>
        <div class="chat-messages" id="chatMessages">
          <div class="chat-msg">
            <div class="chat-msg-bubble">${agent.welcomeMessage.replace(/\n/g, '<br>')}</div>
            <div class="chat-msg-time">Just now</div>
          </div>
        </div>
        <div class="chat-quick-replies">
          <div class="quick-reply-title">Quick options:</div>
          <div class="quick-replies-grid" id="quickRepliesGrid">${quickBtns}</div>
        </div>
        <div class="chat-input-row">
          <input type="text" class="chat-input" id="chatInput" placeholder="Type a message..." autocomplete="off">
          <button class="chat-send" id="chatSend" aria-label="Send">➤</button>
        </div>
      </div>`;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);
  },

  bindEvents() {
    document.getElementById('chatBubble').addEventListener('click', () => this.toggle());
    document.getElementById('chatClose').addEventListener('click', () => this.close());
    document.querySelectorAll('.quick-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.currentTarget.dataset.index);
        const reply = this.config.quickReplies[idx];
        if (!reply) return;
        this.sendUserMessage(reply.label);
        setTimeout(() => this.sendBotMessage(reply.response), this.config.agent.typingDelay);
      });
    });
    const input = document.getElementById('chatInput');
    document.getElementById('chatSend').addEventListener('click', () => this.handleUserInput());
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') this.handleUserInput(); });
  },

  handleUserInput() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    this.sendUserMessage(text);
    setTimeout(() => this.matchAndReply(text), this.config.agent.typingDelay);
  },

  matchAndReply(userText) {
    const lower = userText.toLowerCase();
    const match = this.config.autoReplies.find(rule =>
      rule.keywords.some(kw => lower.includes(kw.toLowerCase()))
    );
    const reply = match
      ? match.response
      : this.config.fallbackResponses[Math.floor(Math.random() * this.config.fallbackResponses.length)];
    this.sendBotMessage(reply);
  },

  sendUserMessage(text) {
    const messages = document.getElementById('chatMessages');
    const msg = document.createElement('div');
    msg.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:14px;';
    msg.innerHTML = `
      <div>
        <div style="background:var(--blue);color:white;padding:10px 16px;border-radius:18px 18px 4px 18px;font-size:0.88rem;display:inline-block;max-width:85%;line-height:1.5">${this.escapeHtml(text)}</div>
        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:4px;text-align:right;padding-right:4px">You · just now</div>
      </div>`;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  },

  sendBotMessage(text) {
    const messages = document.getElementById('chatMessages');
    const delay = this.config.agent.typingDelay;
    const typing = document.createElement('div');
    typing.className = 'chat-msg typing-indicator';
    typing.innerHTML = `<div class="chat-msg-bubble" style="padding:12px 18px">
      <span style="display:inline-flex;gap:4px;align-items:center">
        <span style="width:6px;height:6px;background:#94A3B8;border-radius:50%;animation:typingDot 1s infinite 0s"></span>
        <span style="width:6px;height:6px;background:#94A3B8;border-radius:50%;animation:typingDot 1s infinite 0.2s"></span>
        <span style="width:6px;height:6px;background:#94A3B8;border-radius:50%;animation:typingDot 1s infinite 0.4s"></span>
      </span>
    </div>`;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
    setTimeout(() => {
      typing.remove();
      const msg = document.createElement('div');
      msg.className = 'chat-msg';
      msg.innerHTML = `<div class="chat-msg-bubble">${text}</div><div class="chat-msg-time">${this.config.agent.name} · just now</div>`;
      messages.appendChild(msg);
      messages.scrollTop = messages.scrollHeight;
    }, delay);
  },

  scheduleProactiveMessages() {
    if (!this.config.proactiveMessages?.length) return;
    this.config.proactiveMessages.forEach((pm) => {
      setTimeout(() => {
        if (!this.isOpen) {
          const notif = document.getElementById('chatNotif');
          if (notif) { notif.style.display = 'flex'; notif.textContent = '1'; }
          this._pendingProactive = pm.message;
        }
      }, pm.delaySeconds * 1000);
    });
  },

  toggle() { this.isOpen ? this.close() : this.open(); },

  open() {
    this.isOpen = true;
    document.getElementById('chatPanel').classList.add('open');
    document.getElementById('chatNotif').style.display = 'none';
    document.getElementById('chatInput').focus();
    if (this._pendingProactive) {
      setTimeout(() => this.sendBotMessage(this._pendingProactive), 400);
      this._pendingProactive = null;
    }
  },

  close() {
    this.isOpen = false;
    document.getElementById('chatPanel').classList.remove('open');
  },

  escapeHtml(text) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(text));
    return d.innerHTML;
  }
};

document.addEventListener('DOMContentLoaded', () => KipChat.init());
