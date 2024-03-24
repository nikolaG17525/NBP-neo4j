export class Igrac {
  constructor(imeIgraca, godinaRodjenja, brojNaDresu, pozicija, kapiten) {
    this.imeIgraca = imeIgraca;
    this.godinaRodjenja = godinaRodjenja;
    this.brojNaDresu = brojNaDresu;
    this.pozicija = pozicija;
    this.kapiten = kapiten;
  }

  nacrtajIgraca(mesto) {
    const igracDiv = document.createElement("div");
    igracDiv.classList.add("red-tabele");

    const imeIgracaHeading = document.createElement("p");
    imeIgracaHeading.textContent = this.imeIgraca;
    imeIgracaHeading.classList.add("ime-igraca");

    const pozicijaHeading = document.createElement("p");
    pozicijaHeading.textContent = this.pozicija;
    pozicijaHeading.classList.add("pozicija");

    igracDiv.appendChild(imeIgracaHeading);
    igracDiv.appendChild(pozicijaHeading);

    mesto.appendChild(igracDiv);
  }
}
