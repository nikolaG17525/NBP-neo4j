export class Klub {
  constructor(imeKluba, brojBodova) {
    this.imeKluba = imeKluba;
    this.brojBodova = brojBodova;
  }

  nacrtajKlub(mesto) {
    const klubDiv = document.createElement("div");
    klubDiv.classList.add("red-tabele");

    const imeKlubaHeading = document.createElement("p");
    imeKlubaHeading.textContent = this.imeKluba;
    imeKlubaHeading.classList.add("ime-kluba");

    const brojBodovaHeading = document.createElement("p");
    brojBodovaHeading.textContent = this.brojBodova;
    brojBodovaHeading.classList.add("broj-bodova");

    klubDiv.appendChild(imeKlubaHeading);
    klubDiv.appendChild(brojBodovaHeading);

    mesto.appendChild(klubDiv);
  }
}
