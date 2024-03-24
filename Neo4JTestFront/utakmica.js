export class Utakmica {
  constructor(imeDomacina, imeGosta, goloviDomacin, goloviGost, kolo) {
    this.imeDomacina = imeDomacina;
    this.imeGosta = imeGosta;
    this.goloviDomacin = goloviDomacin;
    this.goloviGost = goloviGost;
    this.kolo = kolo;
  }

  nacrtajUtakmicu(mesto) {
    const utakmicaDiv = document.createElement("div");
    utakmicaDiv.classList.add("red-utakmica");

    const imeDomacinaHeading = document.createElement("p");
    imeDomacinaHeading.textContent = this.imeDomacina;
    imeDomacinaHeading.classList.add("ime-domacina");

    const goloviDomacinHeading = document.createElement("p");
    goloviDomacinHeading.textContent = this.goloviDomacin;
    goloviDomacinHeading.classList.add("golovi-domacina");

    const goloviGostHeading = document.createElement("p");
    goloviGostHeading.textContent = this.goloviGost;
    goloviGostHeading.classList.add("golovi-gosta");

    const imeGostaHeading = document.createElement("p");
    imeGostaHeading.textContent = this.imeGosta;
    imeGostaHeading.classList.add("ime-gosta");

    utakmicaDiv.appendChild(imeDomacinaHeading);
    utakmicaDiv.appendChild(goloviDomacinHeading);
    utakmicaDiv.appendChild(goloviGostHeading);
    utakmicaDiv.appendChild(imeGostaHeading);

    mesto.appendChild(utakmicaDiv);
  }
}
