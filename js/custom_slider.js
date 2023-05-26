class CustomSlider extends HTMLElement {
  constructor() {
    super();
  }

  updateAttrs(forced = false) {
    if (!this.rendered && !forced) {
      return;
    }

    this.colorModel = this.getAttribute('model');
    this.param = this.getAttribute('param');
    this.value = this.getAttribute('value');
    this.min = this.getAttribute('min');
    this.max = this.getAttribute('max');
    this.step = this.getAttribute('step');

    this.sliderControl.setAttribute('min', this.min);
    this.sliderControl.setAttribute('max', this.max);
    this.sliderControl.setAttribute('step', this.step);
    this.sliderControl.value = this.value;

    this.shadow.getElementById('value').innerText =
      Math.round(this.value * 1000) / 1000;
  }

  connectedCallback() {
    this.shadow = this.attachShadow({ mode: 'open' });
    const tmpl = document
      .getElementById('tmpl-custom-slider')
      .content.cloneNode(true);
    this.sliderControl = tmpl.getElementById('slider');
    this.shadow.append(tmpl);
    this.updateAttrs(true);

    if (!this.rendered) {
      this.sliderControl.addEventListener('input', (e) => {
        this.dispatchEvent(
          new CustomEvent('color-change', {
            bubbles: true,
            composed: true,
            detail: {
              value: e.target.value,
              colorModel: this.colorModel,
              param: this.param,
            },
          })
        );
      });

      colorController.addControl(this);
    }

    this.rendered = true;
  }

  disconnectedCallback() {}

  static get observedAttributes() {
    return ['value'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.updateAttrs();
  }
}

customElements.define('custom-slider', CustomSlider);
