class ColorController {
  constructor(ControlsRegistry) {
    this.controlsRegistry = new ControlsRegistry();
    this.currentColorOklch = null;
    this.displayColorRgb = null;
    this.displayColorOklch = null;
    this.setColor('#0080ff');
    this.keepP3 = false;

    document.addEventListener('color-change', (e) => {
      const { colorModel, param, value } = e.detail;

      this.updateColor(colorModel, param, value);
    });

    document.addEventListener('keep-p3-change', (e) => {
      const { value } = e.detail;

      this.keepP3 = value;

      this.setColor(culori.toGamut('p3')(this.currentColorOklch));
      this.updateControls();
    });

    document.addEventListener('keep-p3-mapping', (e) => {
      this.setColor(culori.toGamut('p3')(this.currentColorOklch));
      this.updateControls();
    });
  }

  setColor(color) {
    color = typeof color === 'string' ? culori.parse(color) : color;

    this.currentColorOklch = culori.formatCss(color);
    this.displayColorRgb = culori.formatHex(culori.toGamut('p3')(color));
    this.displayColorP3 = culori.formatCss(culori.toGamut('p3')(color));
    this.displayColorOklch = culori.formatCss(
      culori.converter('oklch')(culori.toGamut('p3')(color))
    );
    this.displayColorOklch = culori.formatCss(
      culori.converter('oklch')(culori.toGamut('p3')(color))
    );

    helpers.updateCssVar('color-rgb', this.displayColorRgb);
    helpers.updateCssVar('color-oklch', this.displayColorP3);

    helpers.updateCssVar(
      'color-hsl-lighten',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'hsl', 'l', +0.02)
      )
    );
    helpers.updateCssVar(
      'color-hsl-darken',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'hsl', 'l', -0.02)
      )
    );
    helpers.updateCssVar(
      'color-oklch-lighten',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'oklch', 'l', +0.02)
      )
    );
    helpers.updateCssVar(
      'color-oklch-darken',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'oklch', 'l', -0.02)
      )
    );

    helpers.updateCssVar(
      'color-hsl-lighten-more',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'hsl', 'l', +0.2)
      )
    );
    helpers.updateCssVar(
      'color-hsl-darken-more',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'hsl', 'l', -0.2)
      )
    );
    helpers.updateCssVar(
      'color-oklch-lighten-more',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'oklch', 'l', +0.2)
      )
    );
    helpers.updateCssVar(
      'color-oklch-darken-more',
      culori.formatHex(
        helpers.changeColorRelative(this.displayColorRgb, 'oklch', 'l', -0.2)
      )
    );
  }

  updateColor(colorModel, param, value) {
    const newColor = culori.converter(colorModel)(this.currentColorOklch);

    Object.entries(this.controlsRegistry.controls[colorModel]).forEach(
      ([param, control]) => {
        if (control) {
          newColor[param] = Number(control.value);
        }
      }
    );

    newColor[param] = Number(value);

    if (colorModel === 'oklch') {
      this.setColor(newColor);
    } else {
      this.setColor(culori.clampRgb(newColor));
    }
    this.updateControls();
  }

  updateControls() {
    Object.entries(this.controlsRegistry.controls).forEach(
      ([model, params]) => {
        const color = culori.converter(model)(
          model === 'oklch'
            ? this.keepP3
              ? culori.toGamut('p3')(this.currentColorOklch)
              : this.currentColorOklch
            : culori.toGamut('rgb')(this.currentColorOklch)
        );

        Object.entries(params).forEach(([param, control]) => {
          if (control) {
            control.setAttribute('value', color[param] || 0);
          }
        });
      }
    );
  }

  addControl(control) {
    this.controlsRegistry.addControl(control);
    setTimeout(() => this.updateControls()); // he-he
  }
}

const colorController = new ColorController(ControlsRegistry);
