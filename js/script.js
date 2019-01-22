function main() {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let stands = JSON.parse(this.responseText).stands;

      let zones = document.querySelectorAll("rect, path");
      for (let i = 0; i < zones.length; i++) {
        zones[i].addEventListener("click", function () {
          onStandClicked(this.id,stands[this.id]);
        });
      }

      let select = document.getElementById("expo-select");
      buildSidebar(stands,select.value);
      select.addEventListener("change", function () {
        onSidebarChanged(stands,this.value);
      });
    }
  }
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
  let texts = document.getElementsByClassName("colored");
  for (let i = 0; i < texts.length; i++) {
    texts[i].style.color = color;
  }

  let infos = document.getElementsByClassName("bgcolored");
  for (let i = 0; i < infos.length; i++) {
    infos[i].style.backgroundColor = color;
  }
}

function nomStand(id) {
  switch (id) {
    case "ecoles":
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
    case "abac":
      return "#fd5d47";
      break;
    case "detbtp":
      return "#fcc507";
      break;
    case "devlog":
      return "#4165fd";
      break;
    case "induelec":
      return "#612390";
      break;
    case "telecomssii":
      return "#0c8245";
      break;
    case "startups":
      return "#3e81cc";
      break;
    case "ecoles":
      return "#d05b7f";
      break;
    default:
      return "#606060";
      break;
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
  let parent = document.getElementById("popup-liste");
  parent.innerHTML = "";

  let row;
  for (let i = 0; i < exposants.length; i++) {
    if (i%4 === 0) {
      row = document.createElement("div");
      row.className = "row";
      parent.appendChild(row);
    }

    let lien = document.createElement("div");
    lien.className = "col-3";
    if (exposants[i].type !== "ecoles") {
      lien.addEventListener("click",function () {
        hide("all");
        buildPopupExposant(id,exposants[i]);
        show("popup-exposant");
      });
    }
    row.appendChild(lien);

    let image = document.createElement("div");
    image.className = "img-container logo-liste";
    image.style.backgroundImage = "url(" + exposants[i].image + ")";
    lien.appendChild(image);

    let nom = document.createElement("h2");
    nom.className = "nom-liste";
    nom.innerHTML = exposants[i].nom;
    lien.appendChild(nom);
  }
  let close_bar = document.createElement("div");
  close_bar.className = "close-bar";
  parent.appendChild(close_bar);

  let bouton = document.createElement("button");
  bouton.className = "bgcolored bold";
  bouton.innerHTML = "Fermer"
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
  let informations = "";
  if (exposant.creation !== "") {
    informations += '<li class="bgcolored"><span class="bold">Date de création : </span>' + exposant.creation + '</li>';
  }
  if (exposant.revenu !== "" || exposant.revenufr !== "") {
    let revenu;
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
    let staff;
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
    case "abac":
      document.getElementById("type").innerHTML = "Assurance - Banques - Audit - Conseil";
      break;
    case "detbtp":
      document.getElementById("type").innerHTML = "Défense - Énergie - Transport - BTP";
      break;
    case "devlog":
      document.getElementById("type").innerHTML = "Développement de Logiciels";
      break;
    case "induelec":
      document.getElementById("type").innerHTML = "Industrie - Électronique";
      break;
    case "telecomssii":
      document.getElementById("type").innerHTML = "Opérateurs de Télécommunication - SSII";
      break;
    case "startups":
      document.getElementById("type").innerHTML = "Start-Ups";
      break;
    case "ecoles":
      document.getElementById("type").innerHTML = "Écoles";
      break;
    default:
      document.getElementById("type").innerHTML = "";
      break;
  }
  popupColor(couleurType(exposant.type))
}

/* --------------------------- Sidebar -----------------------------*/

function buildSidebar(stands,value) {
  let parent = document.getElementById("exposant-list");
  parent.innerHTML = "";

  for (let id in stands) {
    if (Array.isArray(stands[id])) {
      for (let i in stands[id]) {
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
  let exposantLi = document.createElement("li");
  exposantLi.innerHTML = exposant.nom + " (" + nomStand(id) + ")";
  /* exposantLi.appendChild(document.createTextNode(exposant.nom + " (" + nomStand(id) + ")")); */
  exposantLi.style.backgroundColor = couleurType(exposant.type)
  if (exposant.type !== "ecoles") {
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
