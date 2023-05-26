const helpers = {
  updateCssVar(key, val) {
    const root = document.querySelector(':root');

    root.style.setProperty(`--${key}`, val);
  },

  changeColorRelative(color, model, param, value) {
    const newColor = culori.converter(model)(color);

    newColor[param] += value;

    return culori.toGamut('p3')(newColor);
  },
};
