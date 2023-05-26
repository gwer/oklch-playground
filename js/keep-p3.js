class KeepP3 extends HTMLElement {
  updateAttrs(forced = false) {
    if (!this.rendered && !forced) {
      return;
    }

    this.value = this.getAttribute('value');
    this.checkbox.value = this.value;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const tmpl = document
      .getElementById('tmpl-keep-p3')
      .content.cloneNode(true);
    this.checkbox = tmpl.getElementById('checkbox');
    this.btnMapping = tmpl.getElementById('button-mapping');
    this.shadow.append(tmpl);
    this.updateAttrs(true);

    if (!this.rendered) {
      this.checkbox.addEventListener('change', (e) => {
        this.dispatchEvent(
          new CustomEvent('keep-p3-change', {
            bubbles: true,
            composed: true,
            detail: {
              value: e.target.checked,
            },
          })
        );
      });

      this.btnMapping.addEventListener('click', (e) => {
        this.dispatchEvent(
          new CustomEvent('keep-p3-mapping', {
            bubbles: true,
            composed: true,
          })
        );
      });
    }

    this.rendered = true;
  }

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback() {
    this.updateAttrs();
  }
}

customElements.define('keep-p3', KeepP3);
