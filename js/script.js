function main() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      var stands = JSON.parse(this.responseText).stands;

      var zones = document.querySelectorAll("rect, path");
      for (var i = 0; i < zones.length; i++) {
        zones[i].addEventListener("click", function () {
          onStandClicked(this.id,stands[this.id]);
        });
      }

      var select = document.getElementById("expo-select");
      buildSidebar(stands,select.value);
      select.addEventListener("change", function () {
        onSidebarChanged(stands,this.value);
      });
    }
  };
  xhttp.open("GET",'js/package.json',true);
  xhttp.send();
}

function hide(popup_id) {
  if (popup_id === "all") {
    hide("popup-exposant");
    hide("popup-liste");
    hide("popup-spe");
    hide("popup-conferences");
  } else {
    document.getElementById(popup_id).style.display = "none";
  }
}

function show(popup_id) {
  document.getElementById(popup_id).style.display = "";
}

function popupColor(color) {
  var texts = document.getElementsByClassName("colored");
  for (var i = 0; i < texts.length; i++) {
    texts[i].style.color = color;
  }

  var infos = document.getElementsByClassName("bgcolored");
  for (var i = 0; i < infos.length; i++) {
    infos[i].style.backgroundColor = color;
  }
}

function nomStand(id) {
  switch (id) {
    case "ecole":
      return "Espace Écoles";
      break;
    case "startups1":
    case "startups2":
      return "Start Up";
      break;
    default:
      return id;
  }
}

function couleurType(type) {
  switch (type) {
    case "telephonie":
      return "#fa7024";
    case "informatique":
      return "#2c47ea";
    case "industrie":
      return "#4ab744";
    case "banque":
      return "#e41818";
    case "auditconseil":
      return "#fcc507";
    case "partenaire":
      return "#944f64";
    case "startup":
      return "#d8d4d4";
    case "ecole":
      return "#d47fa4";
    default:
      return "#606060";

  }
}

/* --------------------------- Suite à un click sur un stand -----------------------------*/

function onStandClicked(id,exposant) {
  hide("all");
  if (id === "conferences") {
    popupColor(couleurType())
    show("popup-conferences")
  } else if (Array.isArray(exposant)) {
    buildPopupListe(id,exposant);
    show("popup-liste");
  } else {
    buildPopupExposant(id,exposant);
    show("popup-exposant");
  }
}

/* --------------------------- Popup Liste -----------------------------*/

function buildPopupListe(id,exposants) {
  var parent = document.getElementById("popup-liste");
  parent.innerHTML = "";

  var row;
  for (var i = 0; i < exposants.length; i++) {
    if (i%4 === 0) {
      row = document.createElement("div");
      row.className = "row";
      parent.appendChild(row);
    }

    var lien = document.createElement("div");
    lien.className = "col-3";
    if (exposants[i].type !== "ecole") {
      lien.addEventListener("click",function () {
        hide("all");
        buildPopupExposant(id,exposants[i]);
        show("popup-exposant");
      });
    }
    row.appendChild(lien);

    var image = document.createElement("div");
    image.className = "img-container logo-liste";
    image.style.backgroundImage = "url(" + exposants[i].image + ")";
    lien.appendChild(image);

    var nom = document.createElement("h2");
    nom.className = "nom-liste";
    nom.innerHTML = exposants[i].nom;
    lien.appendChild(nom);
  }
  var close_bar = document.createElement("div");
  close_bar.className = "close-bar";
  parent.appendChild(close_bar);

  var bouton = document.createElement("button");
  bouton.className = "bgcolored bold";
  bouton.innerHTML = "Fermer";
  bouton.addEventListener("click",function () {
    hide("popup-liste");
  });
  close_bar.appendChild(bouton);

  popupColor(couleurType());
}

/* --------------------------- Popup Exposant -----------------------------*/

function buildPopupExposant(id,exposant) {
  document.getElementById("logo-exposant").style.backgroundImage = "url('" + exposant.image + "')";
  document.getElementById("nom-exposant").innerHTML = exposant.nom + " (" + nomStand(id) + ")";
  document.getElementById("presentation").innerHTML = exposant.presentation;

  /* On affiche seulement les champs "courts" communiqués */
  var informations = "";
  if (exposant.creation !== "") {
    informations += '<li class="bgcolored"><span class="bold">Date de création : </span>' + exposant.creation + '</li>';
  }
  if (exposant.revenu !== "" || exposant.revenufr !== "") {
    var revenu;
    if (exposant.revenufr === "") {
      revenu = exposant.revenu;
    } else if (exposant.revenu === "") {
      revenu = exposant.revenufr;
    } else {
      revenu = exposant.revenu + ' (Monde) / ' + exposant.revenufr + ' (France)';
    }
    informations += '<li class="bgcolored"><span class="bold">Chiffre d\'affaire : </span>' + revenu + '</li>';
  }
  if (exposant.staff !== "" || exposant.stafffr !== "") {
    var staff;
    if (exposant.stafffr === "") {
      staff = exposant.staff;
    } else if (exposant.staff === "") {
      staff = exposant.stafffr;
    } else {
      staff = exposant.staff + ' (Monde) / ' + exposant.stafffr + ' (France)';
    }
    informations += '<li class="bgcolored"><span class="bold">Effectifs : </span>' + staff + '</li>'
  }
  if (exposant.salaire !== "") {
    informations += '<li class="bgcolored"><span class="bold">Salaire : </span>' + exposant.salaire + '</li>'
  }
  document.getElementById("informations").innerHTML = informations;

  document.getElementById("implantation").innerHTML = (exposant.implantation === "" ? "N.C." : exposant.implantation);
  document.getElementById("typedestage").innerHTML = (exposant.typedestage === "" ? "N.C." : exposant.typedestage);
  document.getElementById("recrutement").innerHTML = (exposant.recrutement === "" ? "N.C." : exposant.recrutement);

  switch (exposant.type) {
    case "telephonie":
      document.getElementById("type").innerHTML = "Opérateurs / Constructeurs Télécom";
      break;
    case "informatique":
      document.getElementById("type").innerHTML = "IT";
      break;
    case "industrie":
      document.getElementById("type").innerHTML = "Industrie";
      break;
    case "banque":
      document.getElementById("type").innerHTML = "Banque";
      break;
    case "auditconseil":
      document.getElementById("type").innerHTML = "Audit / Conseil";
      break;
    case "partenaire":
      document.getElementById("type").innerHTML = "Partenaires";
      break;
    case "startup":
      document.getElementById("type").innerHTML = "Start-Ups";
      break;
    case "ecole":
      document.getElementById("type").innerHTML = "Écoles";
      break;
    default:
      document.getElementById("type").innerHTML = "Autre";
      break;
  }
  popupColor(couleurType(exposant.type))
}

/* --------------------------- Sidebar -----------------------------*/

function buildSidebar(stands,value) {
  var parent = document.getElementById("exposant-list");
  parent.innerHTML = "";

  for (var id in stands) {
    if (Array.isArray(stands[id])) {
      for (var i in stands[id]) {
        if (value === "all") {
          addExposantToSidebar(id,stands[id][i],parent);
        } else {
          if (value === stands[id][i].type) {
            addExposantToSidebar(id,stands[id][i],parent);
          }
        }
      }
    } else {
      if (value === "all") {
        addExposantToSidebar(id,stands[id],parent);
      } else {
        if (value === stands[id].type) {
          addExposantToSidebar(id,stands[id],parent);
        }
      }
    }
  }
}

function addExposantToSidebar(id,exposant,parent) {
  var exposantLi = document.createElement("li");
  exposantLi.innerHTML = exposant.nom + " (" + nomStand(id) + ")";
  /* exposantLi.appendChild(document.createTextNode(exposant.nom + " (" + nomStand(id) + ")")); */
  exposantLi.style.backgroundColor = couleurType(exposant.type)
  if (exposant.type !== "ecole") {
    exposantLi.addEventListener("click", function () {
      onSidebarClicked(id,exposant);
    });
  }
  parent.appendChild(exposantLi);
}

/* -------------------- Suite à une action sur la sidebar --------------------*/

function onSidebarClicked(id,exposant) {
  hide("all");
  buildPopupExposant(id,exposant);
  show("popup-exposant");
}

function onSidebarChanged(stands,value) {
  buildSidebar(stands,value)
}

/* ----------------- On oublie pas d'exécuter main() quand même ------------- */

main();
