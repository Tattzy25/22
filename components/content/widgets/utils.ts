import { Widget, WidgetConfig } from "./types"

export function generateEmbedCode(
  config: WidgetConfig,
  selectedWidget: Widget | null,
  baseUrl: string
): string {
  const scriptUrl = `${baseUrl}/api/widget`

  switch (config.type) {
    case 'chat':
      return `<script>
  window.AIWidgetConfig = ${JSON.stringify({
          type: config.type,
          theme: config.theme,
          position: config.position,
          size: config.size,
          title: config.title,
          subtitle: config.subtitle,
          primaryColor: config.primaryColor,
          showAvatar: config.showAvatar,
          autoOpen: config.autoOpen,
          delay: config.delay,
          apiKey: config.apiKey,
          showOnMobile: config.showOnMobile,
          showOnDesktop: config.showOnDesktop
        }, null, 2)};
</script>
<script src="${scriptUrl}"></script>`

    case 'button':
      return `<div id="ai-widget-button" class="ai-widget-button" style="
  position: fixed;
  ${config.position.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${config.position.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  z-index: 9999;
  ${!config.showOnMobile ? 'display: none;' : ''}
" data-show-mobile="${config.showOnMobile}" data-show-desktop="${config.showOnDesktop}">
  <button class="ai-widget-btn" style="
    background: ${config.primaryColor};
    color: white;
    border: none;
    border-radius: 50px;
    padding: 12px 24px;
    font-size: 16px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  " onclick="window.openAIWidget()">
    ${config.title}
  </button>
</div>
<script>
  window.openAIWidget = function() {
    window.open('${baseUrl}/chat?widget=true&apiKey=${config.apiKey}', '_blank', 'width=400,height=600,resizable=yes,scrollbars=yes');
  };

  // Responsive behavior
  function updateWidgetVisibility() {
    const isMobile = window.innerWidth < 768;
    const button = document.getElementById('ai-widget-button');
    if (button) {
      const showMobile = button.getAttribute('data-show-mobile') === 'true';
      const showDesktop = button.getAttribute('data-show-desktop') === 'true';
      button.style.display = (isMobile && showMobile) || (!isMobile && showDesktop) ? 'block' : 'none';
    }
  }

  window.addEventListener('resize', updateWidgetVisibility);
  updateWidgetVisibility();
</script>`

    case 'form':
      return `<div id="ai-contact-form" class="ai-contact-form" style="
  max-width: ${config.size === 'small' ? '300px' : config.size === 'large' ? '500px' : '400px'};
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: ${config.theme === 'dark' ? '#1f2937' : 'white'};
  color: ${config.theme === 'dark' ? 'white' : 'black'};
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
">
  <div style="text-align: center; margin-bottom: 20px;">
    ${config.showAvatar ? `<div style="width: 48px; height: 48px; background: ${config.primaryColor}; border-radius: 50%; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🤖</div>` : ''}
    <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: 600;">${config.title}</h3>
    <p style="margin: 0; color: #6b7280; font-size: 14px;">${config.subtitle}</p>
  </div>

  <form id="ai-contact-form-element" style="display: flex; flex-direction: column; gap: 16px;">
    <input
      type="text"
      name="name"
      placeholder="Your Name"
      required
      style="
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
      "
      onfocus="this.style.borderColor='${config.primaryColor}'"
      onblur="this.style.borderColor='#d1d5db'"
    />

    <input
      type="email"
      name="email"
      placeholder="Your Email"
      required
      style="
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
        transition: border-color 0.2s ease;
      "
      onfocus="this.style.borderColor='${config.primaryColor}'"
      onblur="this.style.borderColor='#d1d5db'"
    />

    <textarea
      name="message"
      placeholder="Your Message"
      rows="4"
      required
      style="
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 14px;
        box-sizing: border-box;
        resize: vertical;
        transition: border-color 0.2s ease;
      "
      onfocus="this.style.borderColor='${config.primaryColor}'"
      onblur="this.style.borderColor='#d1d5db'"
    ></textarea>

    <button
      type="submit"
      style="
        width: 100%;
        padding: 14px;
        background: ${config.primaryColor};
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      "
      onmouseover="this.style.background='${config.primaryColor}dd'; this.style.transform='translateY(-1px)'"
      onmouseout="this.style.background='${config.primaryColor}'; this.style.transform='translateY(0)'"
    >
      Send Message
    </button>
  </form>

  <div id="ai-form-status" style="margin-top: 16px; text-align: center; font-size: 14px;"></div>
</div>

<script>
  document.getElementById('ai-contact-form-element').addEventListener('submit', async function(e) {
    e.preventDefault();

    const statusDiv = document.getElementById('ai-form-status');
    const submitBtn = e.target.querySelector('button[type="submit"]');

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    statusDiv.innerHTML = '<span style="color: #6b7280;">Processing your message...</span>';

    try {
      const response = await fetch('${baseUrl}/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value,
          apiKey: '${config.apiKey}',
          widgetId: '${selectedWidget?.id || 'new'}'
        })
      });

      if (response.ok) {
        statusDiv.innerHTML = '<span style="color: #10b981;">✓ Message sent successfully!</span>';
        e.target.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      statusDiv.innerHTML = '<span style="color: #ef4444;">✗ Failed to send message. Please try again.</span>';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Message';
    }
  });
</script>`

    case 'embed':
      return `<div style="position: relative; width: 100%; ${config.height ? `height: ${config.height}px;` : 'padding-bottom: 56.25%;'}" class="ai-embed-container">
  <iframe
    src="${baseUrl}/embed?type=full&apiKey=${config.apiKey}&theme=${config.theme}&widgetId=${selectedWidget?.id || 'new'}"
    style="
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    "
    title="${config.title}"
    allowfullscreen
  ></iframe>
</div>`

    case 'popup':
      return `<script>
  window.AIWidgetConfig = ${JSON.stringify({
          type: config.type,
          theme: config.theme,
          size: config.size,
          title: config.title,
          subtitle: config.subtitle,
          primaryColor: config.primaryColor,
          showAvatar: config.showAvatar,
          autoOpen: config.autoOpen,
          delay: config.delay,
          apiKey: config.apiKey,
          showOnMobile: config.showOnMobile,
          showOnDesktop: config.showOnDesktop
        }, null, 2)};
</script>
<script src="${scriptUrl}"></script>`

    case 'sidebar':
      return `<script>
  window.AIWidgetConfig = ${JSON.stringify({
          type: config.type,
          theme: config.theme,
          position: config.position,
          size: config.size,
          title: config.title,
          subtitle: config.subtitle,
          primaryColor: config.primaryColor,
          showAvatar: config.showAvatar,
          apiKey: config.apiKey,
          showOnMobile: config.showOnMobile,
          showOnDesktop: config.showOnDesktop
        }, null, 2)};
</script>
<script src="${scriptUrl}"></script>`
  }
}

