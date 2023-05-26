class ControlsRegistry {
  constructor() {
    this.controls = {
      oklch: {
        l: null,
        c: null,
        h: null,
      },
      hsl: {
        h: null,
        s: null,
        l: null,
      },
      rgb: {
        r: null,
        g: null,
        b: null,
      },
    };
  }

  addControl(control) {
    if (!(control.colorModel in this.controls)) {
      throw new Error(`Invalid color model ${control.colorModel}`);
    }

    if (!(control.param in this.controls[control.colorModel])) {
      throw new Error(
        `Invalid color param ${control.colorModel}:${control.param}`
      );
    }

    this.controls[control.colorModel][control.param] = control;
  }
}
