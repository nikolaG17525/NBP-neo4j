import { Klub } from "./klub.js";
import { Igrac } from "./igrac.js";
import { Utakmica } from "./utakmica.js";

var dugmeTabela = document.querySelector(".tabela");
var dugmeIgraci = document.querySelector(".igraci");
var dugmeUtakmice = document.querySelector(".utakmice");
var dugmeAdmin = document.querySelector(".admin-dugme");

var main1 = document.querySelector(".hero-main-1");
var main2 = document.querySelector(".hero-main-2");

main1.classList.add("sakrij");
main2.classList.add("sakrij");

dugmeTabela.addEventListener("click", function () {
  isprazniDiv(main1);
  isprazniDiv(main2);
  main1.classList.remove("sakrij");
  main2.classList.remove("sakrij");
  nacrtajFormuZaPrikazTabele(main1);
});

dugmeIgraci.addEventListener("click", function () {
  isprazniDiv(main1);
  isprazniDiv(main2);
  main1.classList.remove("sakrij");
  main2.classList.add("sakrij");
  nacrtajFormuZaIzborKlubaIgraca(main1);
});

dugmeUtakmice.addEventListener("click", function () {
  isprazniDiv(main1);
  isprazniDiv(main2);
  main1.classList.remove("sakrij");
  main2.classList.add("sakrij");
  nacrtajFormuZaIzborKlubaUtakmica(main1);
});

dugmeAdmin.addEventListener("click", function () {
  isprazniDiv(main1);
  isprazniDiv(main2);
  main1.classList.remove("sakrij");
  main2.classList.add("sakrij");
  nacrtajAdminPanel(main1);
});

function isprazniDiv(imeDiva) {
  if (imeDiva.hasChildNodes()) {
    while (imeDiva.firstChild) {
      imeDiva.removeChild(imeDiva.firstChild);
    }
  }
}

function nacrtajFormuZaIzborKlubaIgraca(imeDiva) {
  const podDiv = document.createElement("div");
  podDiv.classList.add("div-klub-igraci");
  const selectElement = document.createElement("select");

  const opcije = ["Crvena Zvezda", "Partizan", "TSC", "Cukaricki"];
  opcije.forEach((opcija) => {
    const option = document.createElement("option");
    option.text = opcija;
    option.value = opcija;
    selectElement.appendChild(option);
  });

  const dugme = document.createElement("button");
  dugme.textContent = "Prikaži igrace";

  // Dodavanje event listenera na dugme
  dugme.addEventListener("click", function () {
    const selektovanaVrednost = selectElement.value;
    fetch(
      `https://localhost:7127/api/Neo4j/api/getPlayers?teamName=${selektovanaVrednost}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        isprazniDiv(main2);
        var i = 1;
        data.forEach((el) => {
          const igrac = new Igrac(
            el.name,
            el.birthYear,
            el.number,
            el.position,
            el.isCaptain
          );
          igrac.nacrtajIgraca(main2);
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
    main2.classList.remove("sakrij");
  });

  podDiv.appendChild(selectElement);
  podDiv.appendChild(dugme);
  imeDiva.appendChild(podDiv);
}

function nacrtajFormuZaIzborKlubaUtakmica(imeDiva) {
  const podDiv = document.createElement("div");
  podDiv.classList.add("div-klub-strana");
  const selectClub = document.createElement("select");
  const opcije = [
    "Crvena Zvezda",
    "Partizan",
    "Cukaricki",
    "TSC",
    "Mladost Lucani",
    "Radnicki Kragujevac",
    "Vojvodina",
    "Novi Pazar",
    "Napredak",
    "Spartak",
    "Vozdovac",
    "Javor",
    "IMT",
    "Radnicki Nis",
    "Zeleznicar Pancevo",
    "Radnik Surdulica",
  ];
  opcije.forEach((opcija) => {
    const option = document.createElement("option");
    option.text = opcija;
    option.value = opcija;
    selectClub.appendChild(option);
  });

  const selectSide = document.createElement("select");
  const opcije2 = ["home", "away"];
  opcije2.forEach((opcija) => {
    const option = document.createElement("option");
    option.text = opcija;
    option.value = opcija;
    selectSide.appendChild(option);
  });

  const dugme = document.createElement("button");
  dugme.textContent = "Prikaži utakmice";

  // Dodavanje event listenera na dugme
  dugme.addEventListener("click", function () {
    const selektovanKlub = selectClub.value;
    const selektovanaStrana = selectSide.value;
    fetch(
      `https://localhost:7127/api/Neo4j/api/getGames?teamName=${selektovanKlub}&side=${selektovanaStrana}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        isprazniDiv(main2);
        var i = 1;
        data.forEach((el) => {
          const igrac = new Utakmica(
            el.host,
            el.guest,
            el.hostGoals,
            el.guestGoals,
            el.round
          );
          igrac.nacrtajUtakmicu(main2);
        });
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
    main2.classList.remove("sakrij");
  });

  podDiv.appendChild(selectClub);
  podDiv.appendChild(selectSide);
  podDiv.appendChild(dugme);
  imeDiva.appendChild(podDiv);
}

function nacrtajFormuZaPrikazTabele(imeDiva) {
  const podDiv = document.createElement("div");
  podDiv.classList.add("div-tabela-opis");
  const pElement1 = document.createElement("p");
  pElement1.textContent = "Klub";

  const pElement2 = document.createElement("p");
  pElement2.textContent = "Bodovi";

  fetch("https://localhost:7127/api/Neo4j/api/getClubs")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var i = 1;
      data.forEach((el) => {
        const klub = new Klub(i++ + ". " + el.name, el.points);
        klub.nacrtajKlub(main2);
      });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

  podDiv.appendChild(pElement1);
  podDiv.appendChild(pElement2);
  imeDiva.appendChild(podDiv);
}

function nacrtajAdminPanel(imeDiva) {
  var adminPanelDiv = document.createElement("div");
  adminPanelDiv.className = "admin-panel-div";

  var dodajUtakmicuDiv = document.createElement("div");
  dodajUtakmicuDiv.className = "dodaj-utakmicu-div";

  var selectTeam1 = document.createElement("select");
  var selectTeam2 = document.createElement("select");
  var klubovi = [
    "Crvena Zvezda",
    "Partizan",
    "Cukaricki",
    "TSC",
    "Mladost Lucani",
    "Radnicki Kragujevac",
    "Vojvodina",
    "Novi Pazar",
    "Napredak",
    "Spartak",
    "Vozdovac",
    "Javor",
    "IMT",
    "Radnicki Nis",
    "Zeleznicar Pancevo",
    "Radnik Surdulica",
  ];
  klubovi.forEach((klub) => {
    var option1 = document.createElement("option");
    option1.text = klub;
    selectTeam1.add(option1);
    var option2 = document.createElement("option");
    option2.text = klub;
    selectTeam2.add(option2);
  });

  var selectGoals1 = document.createElement("select");
  selectGoals1.classList.add("select-broj");
  var selectGoals2 = document.createElement("select");
  selectGoals2.classList.add("select-broj");
  for (var i = 0; i <= 10; i++) {
    var option1 = document.createElement("option");
    option1.text = i;
    selectGoals1.add(option1);
    var option2 = document.createElement("option");
    option2.text = i;
    selectGoals2.add(option2);
  }

  var selectRound = document.createElement("select");
  selectRound.classList.add("select-broj");
  for (var i = 1; i <= 30; i++) {
    var option = document.createElement("option");
    option.text = i;
    selectRound.add(option);
  }

  var addButton = document.createElement("button");
  addButton.textContent = "Dodaj utakmicu";

  addButton.addEventListener("click", function () {
    fetch(
      `https://localhost:7127/api/Neo4j/api/CreateNewGame?hostName=${
        selectTeam1.value
      }&hostGoals=${parseInt(selectGoals1.value)}&guestName=${
        selectTeam2.value
      }&guestGoals=${parseInt(selectGoals2.value)}&round=${parseInt(
        selectRound.value
      )}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      console.error("Error:", error);
    });
    alert(
      `Dodali ste utakmicu.\n${selectTeam1.value}-${selectTeam2.value}\n${selectGoals1.value}:${selectGoals2.value}`
    );
  });

  dodajUtakmicuDiv.appendChild(selectTeam1);
  dodajUtakmicuDiv.appendChild(selectGoals1);
  dodajUtakmicuDiv.appendChild(selectGoals2);
  dodajUtakmicuDiv.appendChild(selectTeam2);
  dodajUtakmicuDiv.appendChild(selectRound);
  dodajUtakmicuDiv.appendChild(addButton);

  //Postavi trenera
  var postaviTreneraDiv = document.createElement("div");
  postaviTreneraDiv.className = "postavi-trenera-div";

  var postaviTreneraDivLevi = document.createElement("div");
  postaviTreneraDivLevi.className = "postavi-trenera-div-levi";

  var postaviTreneraDivDesni = document.createElement("div");
  postaviTreneraDivDesni.className = "postavi-trenera-div-desni";

  var selectTeam = document.createElement("select");
  var selectCoach = document.createElement("select");

  klubovi.forEach((klub) => {
    var option = document.createElement("option");
    option.text = klub;
    selectTeam.add(option);
  });

  fetch("https://localhost:7127/api/Neo4j/api/getFreeCoaches")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var i = 1;
      data.forEach((el) => {
        var option = document.createElement("option");
        option.text = el.name;
        selectCoach.add(option);
      });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

  var setCoachBtn = document.createElement("button");
  setCoachBtn.textContent = "Postavi trenera";

  setCoachBtn.addEventListener("click", function () {
    fetch(
      `https://localhost:7127/api/Neo4j/api/setNewCoach?teamName=${selectTeam.value}&coachName=${selectCoach.value}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      console.error("Error:", error);
    });
    alert(
      `Postavili ste novog trenera.\n${selectTeam.value}-${selectCoach.value}`
    );
  });

  postaviTreneraDivLevi.appendChild(selectTeam);
  postaviTreneraDivLevi.appendChild(selectCoach);

  postaviTreneraDivDesni.appendChild(setCoachBtn);

  postaviTreneraDiv.appendChild(postaviTreneraDivLevi);
  postaviTreneraDiv.appendChild(postaviTreneraDivDesni);

  //Obrisi trenera
  var obrisiTreneraDiv = document.createElement("div");
  obrisiTreneraDiv.className = "obrisi-trenera-div";

  var selectCoachToRemove = document.createElement("select");

  fetch("https://localhost:7127/api/Neo4j/api/getFreeCoaches")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      var i = 1;
      data.forEach((el) => {
        var option = document.createElement("option");
        option.text = el.name;
        selectCoachToRemove.add(option);
      });
    })
    .catch((error) => {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    });

  var deleteCoachBtn = document.createElement("button");
  deleteCoachBtn.textContent = "Penzionisi trenera";

  deleteCoachBtn.addEventListener("click", function () {
    fetch(
      `https://localhost:7127/api/Neo4j/api/deleteCoach?coachName=${selectCoachToRemove.value}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).catch((error) => {
      console.error("Error:", error);
    });
    alert(`Penzionisali ste trenera.\n${selectCoachToRemove.value}`);
  });

  obrisiTreneraDiv.appendChild(selectCoachToRemove);
  obrisiTreneraDiv.appendChild(deleteCoachBtn);

  adminPanelDiv.appendChild(dodajUtakmicuDiv);
  adminPanelDiv.appendChild(postaviTreneraDiv);
  adminPanelDiv.appendChild(obrisiTreneraDiv);
  imeDiva.appendChild(adminPanelDiv);
}
