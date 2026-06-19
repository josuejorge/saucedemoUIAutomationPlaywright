import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';

export default class EvidenceReporter implements Reporter {
  private readonly outputDir: string;

  constructor(options: { outputDir?: string } = {}) {
    this.outputDir = path.resolve(options.outputDir ?? 'evidence');
  }

  onBegin(): void {
    fs.mkdirSync(this.outputDir, { recursive: true });
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const html = this.buildHtml(test, result);
    const filename = this.slug(`${test.parent.title}__${test.title}`) + '.html';
    fs.writeFileSync(path.join(this.outputDir, filename), html, 'utf-8');
  }

  // ── private ────────────────────────────────────────────────────────────────

  private buildHtml(test: TestCase, result: TestResult): string {
    const status = result.status === 'passed' ? 'PASS' : 'FAIL';
    const color = status === 'PASS' ? '#198754' : '#dc3545';
    const duration = (result.duration / 1000).toFixed(2);
    const startTime = new Date(result.startTime).toLocaleString('pt-BR');
    const now = new Date().toLocaleString('pt-BR');

    const userSteps = result.steps.filter(s => s.category === 'test');

    let stepsHtml = '';
    for (const step of userSteps) {
      const ok = !step.error;
      const icon = ok ? '✓' : '✗';
      const stepColor = ok ? '#198754' : '#dc3545';
      const dur = (step.duration / 1000).toFixed(2);

      const attachment = result.attachments.find(
        a => a.name === step.title && a.contentType === 'image/png'
      );

      let imgHtml = '';
      if (attachment) {
        const b64 = this.readBase64(attachment);
        if (b64) {
          imgHtml = `<div class="shot"><img src="data:image/png;base64,${b64}" alt="${this.esc(step.title)}"></div>`;
        }
      }

      stepsHtml += `
        <div class="step">
          <div class="step-header">
            <span class="step-icon" style="color:${stepColor}">${icon}</span>
            <span class="step-name">${this.esc(step.title)}</span>
            <span class="step-dur">${dur}s</span>
          </div>
          ${imgHtml}
        </div>`;
    }

    if (!stepsHtml) {
      stepsHtml = '<p class="muted">Nenhum step registrado. Use a fixture <code>step</code> nos testes.</p>';
    }

    const errorHtml = result.error?.message
      ? `<div class="card"><h2>Mensagem de Falha</h2><pre class="error-msg">${this.esc(result.error.message)}</pre></div>`
      : '';

    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Evidência — ${this.esc(test.title)}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; background: #f0f2f5; color: #212529; line-height: 1.5; }

    .banner { background: ${color}; color: #fff; padding: 28px 40px; }
    .banner small { display: block; font-size: .8rem; opacity: .75; margin-bottom: 6px; }
    .banner h1 { font-size: 1.4rem; font-weight: 600; }
    .badge { display: inline-block; margin-top: 10px; background: rgba(255,255,255,.25);
              border-radius: 20px; padding: 3px 16px; font-size: .85rem; font-weight: 700; }

    main { max-width: 980px; margin: 28px auto; padding: 0 16px;
            display: flex; flex-direction: column; gap: 18px; }

    .card { background: #fff; border-radius: 10px; box-shadow: 0 1px 4px rgba(0,0,0,.08);
             padding: 24px 28px; }
    h2 { font-size: .8rem; font-weight: 600; color: #6c757d; text-transform: uppercase;
          letter-spacing: .07em; margin-bottom: 16px; }

    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .field label { display: block; font-size: .7rem; color: #adb5bd; text-transform: uppercase;
                    letter-spacing: .05em; margin-bottom: 3px; }
    .field span { font-size: .95rem; }

    .status-PASS { color: #198754; font-weight: 700; }
    .status-FAIL { color: #dc3545; font-weight: 700; }

    .step { margin-bottom: 20px; border-left: 3px solid #e9ecef; padding-left: 14px; }
    .step-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
    .step-icon { font-size: 1rem; min-width: 18px; }
    .step-name { font-weight: 500; font-size: .95rem; flex: 1; }
    .step-dur { font-size: .78rem; color: #adb5bd; white-space: nowrap; }
    .shot img { max-width: 100%; border: 1px solid #dee2e6; border-radius: 6px;
                 box-shadow: 0 2px 8px rgba(0,0,0,.06); }

    .error-msg { background: #fff5f5; border-left: 4px solid #dc3545; padding: 14px 18px;
                  border-radius: 4px; font-size: .85rem; white-space: pre-wrap; word-break: break-word; }

    .muted { color: #adb5bd; font-style: italic; }
    footer { text-align: center; font-size: .75rem; color: #adb5bd; padding: 24px 0 32px; }
  </style>
</head>
<body>
  <div class="banner">
    <small>${this.esc(test.parent.title)}</small>
    <h1>${this.esc(test.title)}</h1>
    <div class="badge">${status}</div>
  </div>
  <main>
    <div class="card">
      <h2>Metadados</h2>
      <div class="meta-grid">
        <div class="field"><label>Início</label><span>${startTime}</span></div>
        <div class="field"><label>Duração</label><span>${duration}s</span></div>
        <div class="field"><label>Suite</label><span>${this.esc(test.parent.title)}</span></div>
        <div class="field"><label>Status</label><span class="status-${status}">${status}</span></div>
      </div>
    </div>
    ${errorHtml}
    <div class="card">
      <h2>Passo a Passo</h2>
      ${stepsHtml}
    </div>
  </main>
  <footer>Gerado em ${now} · Playwright Evidence Reporter</footer>
</body>
</html>`;
  }

  private readBase64(attachment: { path?: string; body?: Buffer }): string {
    try {
      if (attachment.path && fs.existsSync(attachment.path)) {
        return fs.readFileSync(attachment.path).toString('base64');
      }
      if (attachment.body) {
        return Buffer.from(attachment.body).toString('base64');
      }
    } catch { /* ignore */ }
    return '';
  }

  private slug(text: string): string {
    return text.replace(/[^\w-]/g, '_').slice(0, 80);
  }

  private esc(text: string): string {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
