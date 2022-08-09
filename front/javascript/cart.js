// Différencier la page confirmation et panier 
const page = document.location.href;
//---------------------------------------
// Appel de la ressource de l'API product si on est sur la page panier
if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
        console.log(objetProduits);
        // appel de la fonction affichagePanier
        affichagePanier(objetProduits);
    })
    .catch((err) => {
        document.querySelector("#cartAndFormContainer").innerHTML = "<h1> Error </h1>"
        console.log(" Error" + err);
    });
} else {
    console.log("sur page confirmation");
}
//---------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier 
//---------------------------------------
function affichagePanier(index) {
    // on récupère le panier converti 
    let panier = JSON.parse(localStorage.getItem("panierStocké"));
    // si il y a un panier avec une taille différente de 0 (<0)
    if (panier && panier.length != 0) {
        // zone de correspondance clef/valeur de l'API et du panier
        for (let choix of panier) {
            console.log(choix)
            for (let g = 0, h = index.length; g < h; g++) {
                if (choix._id === index[g]._id) {
                    // Création des valeurs pour l'affichage
                    choix.name = index[g].name;
                    choix.prix = index[g].price; 
                    choix.image = index[g].imageUrl;
                    choix.description = index[g].description;
                    choix.alt = index[g].altTxt;
                }
            }
        }
        // Crée l'affichage si les conditions sont remplit
        affiche(panier);
    } else {
        // si il n'y a pas de panier, on créer un H1 informatif avec les qtés appropriés
        document.querySelector("#totalQuantity").innerHTML = "0";
        document.querySelector("#totalPrice").innerHTML = "0";
        document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
    }
    // rester à l'écoute grâce aux fonctions suivantes pour modifier l'affichage
    modifQuantité();
    suppression();
}
//---------------------------------------
//Fonction d'affichage d'un panier (tableau)
//---------------------------------------
function affiche(indexé) {
    // on déclare et on pointe la zone d'affichage
    let zonePanier = document.querySelector("#cart__items");
    // on créait les affichages des produits du panier via un map et introduction de dataset dans le code
    zonePanier.innerHTML += indexé.map((choix) => 
    `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}" data-prix="${choix.prix}"> 
      <div class="cart__item__img">
        <img src="${choix.image}" alt="${choix.alt}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${choix.name}</h2>
          <span>couleur : ${choix.couleur}</span>
          <p data-prix="${choix.prix}">${choix.prix} €</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${choix.quantité}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem" data-id="${choix._id}" data-couleur="${choix.couleur}">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`
      ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
    // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
    totalProduit();
  }
//---------------------------------------
// fonction modifQuantité on modifie dynamiquement les quantités du panier
//---------------------------------------
function modifQuantité() {
    const cart = document.querySelectorAll(".cart__item");
    /* manière de regarder ce que l'on a d'affiché dynamiquement grace au dataset
     cart.forEach((cart) => {console.log("item panier en dataset: " + " " + cart.dataset.id + " " + cart.dataset.couleur + " " + cart.dataset.quantité); }); */
    // On écoute ce qu'il se passe dans itemQuantity de l'article concerné
    cart.forEach((cart) => {
      cart.addEventListener("change", (eq) => {
        // vérification d'information de la valeur du clic et son positionnement dans les articles
        let panier = JSON.parse(localStorage.getItem("panierStocké"));
        // boucle pour modifier la quantité du produit du panier grace à la nouvelle valeur
        for (article of panier)
          if (
            article._id === cart.dataset.id &&
            cart.dataset.couleur === article.couleur
          ) {
            article.quantité = eq.target.value;
            localStorage.panierStocké = JSON.stringify(panier);
            // on met à jour le dataset quantité
            cart.dataset.quantité = eq.target.value;
            // on joue la fonction pour actualiser les données
            totalProduit();
          }
      });
    });
  }
//---------------------------------------
// Fonction de suppression des articles du Panier 
//---------------------------------------
function suppression() {
  // Déclaration des variables
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  // Pour chaque éléments cartdelete
  cartdelete.forEach((cartdelete) => {
    // On écoute s'il y a un clic dans l'article concerné
    cartdelete.addEventListener("click", ()=> {
      // Appel de la ressource du local storage
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (let d = 0, c = panier.length; d < c; d++)
        if ( 
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {
          // Déclaration de variable utile pour la suppression
          const num = [d];
          // Création d'un tableau miroir (cf mutation)
          let nouveauPanier = JSON.parse(localStorage.getItem("panierStocké"));
          // Suppression de 1 élément à l'indice num
          nouveauPanier.splice(num, 1);
          // Affichage informatif
          if (nouveauPanier && nouveauPanier.length == 0) {
              // Si il n'y a pas de panier, on créé un H1 informatif avec qté appropriés 
              document.querySelector("#totalQuantity").innerHTML = "0"
              document.querySelector("#totalPrice").innerHTML = "0"
              document.querySelector("h1").innerHTML = "Vous n'avez pas d'article dans votre panier";
          }
          // On renvoit le nouveau panier converti dans le local storage puis on lance la fonction
          localStorage.panierStocké = JSON.stringify(nouveauPanier);
          totalProduit();
          // On recharge la page qui s'affiche sans le produit grâce au nouveau panier
          return location.reload();
        }
    });
  });  
}
//---------------------------------------
// Fonction ajout nombre total produit & coût total prix à ne pas afficher dans le LocalStorage => via API 
//---------------------------------------
function totalProduit() {
  // déclaration variable en tant que nombre
  let totalArticle = 0;
  // déclaration variable en tant que nombre
  let totalPrix = 0;
  // on pointe l'élément
  const cart = document.querySelectorAll(".cart__item");
  // pour chaque élément cart
  cart.forEach((cart) => {
    //je récupère les quantités des produits grâce au dataset
    totalArticle += JSON.parse(cart.dataset.quantité);
    // je créais un opérateur pour le total produit grâce au dataset
    totalPrix += cart.dataset.quantité * cart.dataset.prix;
  });
  // je pointe l'endroit d'affichage nombre d'article
  document.getElementById("totalQuantity").textContent = totalArticle;
  // je pointe l'endroit d'affichage du prix total
  document.getElementById("totalPrice").textContent = totalPrix;
}
//---------------------------------------
// Formulaire
//---------------------------------------
// les données du client seront stockées dans ce tableau pour la commande sur page panier
if (page.match("cart")) {
  var contactClient = {};
  localStorage.contactClient = JSON.stringify(contactClient);
  // On pointe les inputs nom prénom et ville 
  var prenom = document.querySelector("#firstName");
  prenom.classList.add("regex_texte");
  var nom = document.querySelector("#lastName");
  nom.classList.add("regex_texte");
  var ville = document.querySelector("#city");
  ville.classList.add("regex_texte");
  // On pointe l'input adresse
  var adresse = document.querySelector("#address");
  adresse.classList.add("regex_adresse");
  // On pointe l'input email
  var email = document.querySelector("#email");
  email.classList.add("regex_email")
  // On pointe les éléments qui ont la classe .regex_texte
  var regexTexte = document.querySelectorAll(".regex_texte");
  // Modification du type d'input type email en texte à cause d'un comportement non voulut vis à vis de la regex
  document.querySelector("#email").setAttribute("type", "text");
}
//---------------------------------------
// Regex
//---------------------------------------
// Début regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ
// regexLettre => pour partie infos personnelles (ligne 213)
let regexLettre =  /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// Début regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ
// regexChiffreLettre => pour partie adresse (ligne 250)
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
// regexValidEmail pour partie MAIL  (ligne 278)
let regexValidEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regexMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//---------------------------------------
// PARTIE INFOS PERSONNELLES Ecoute et attribution de point (pour sécurité au clic) si ces champs sont ok d'après la regex
//---------------------------------------
if (page.match("cart")) {
    regexTexte.forEach((regexTexte) =>
        regexTexte.addEventListener("input", (e)=> {
            // La valeur sera la valeur de l'input dynamique
            valeur = e.target.value;
            // regNormal sera la valeur de la réponse regex, 0 ou -1
            let regNormal = valeur.search(regexLettre);
            if (regNormal === 0) {
                contactClient.firstName = prenom.value;
                contactClient.lastName = nom.value;
                contactClient.city = ville.value;
            }
            if (
                contactClient.city !== "" &&
                contactClient.lastName !== "" &&
                contactClient.firstName !== "" &&
                regNormal === 0
            ) {
                contactClient.regexNormal = 3;
            } else {
                contactClient.regexNormal = 0;
            }
            localStorage.contactClient = JSON.stringify(contactClient);
            couleurRegex(regNormal, valeur, regexTexte);
            valideClic();
        })
    );
}
//---------------------------------------
// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
//---------------------------------------
texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);
//---------------------------------------
// PARTIE ADRESSE Ecoute et attribution (pour la sécurité) si ces champs sont validé d'après la Regex
//---------------------------------------
if (page.match("cart")) {
    let regexAdresse = document.querySelector(".regex_adresse");
    regexAdresse.addEventListener("input", (e) => {
      // valeur sera la valeur de l'input en dynamique
      valeur = e.target.value;
      // regNormal sera la valeur de la réponse regex, 0 ou -1
      let regAdresse = valeur.search(regexChiffreLettre);
      if (regAdresse == 0) {
        contactClient.address = adresse.value;
      }
      if (contactClient.address !== "" && regAdresse === 0) {
        contactClient.regexAdresse = 1;
      } else {
        contactClient.regexAdresse = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      couleurRegex(regAdresse, valeur, regexAdresse);
      valideClic();
    });
}
//---------------------------------------
// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
//---------------------------------------
texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
//---------------------------------------
//---------------------------------------
// PARTIE MAIL Ecoute et attribution (pour la sécurité) si ces champs sont validé d'après la Regex
//---------------------------------------
if (page.match("cart")) {
  let regexEmail = document.querySelector(".regex_email");
  regexEmail.addEventListener("input", (e) => {
    // valeur de l'input en dynamique
    valeur = e.target.value;
    let regMatch = valeur.match(regexMatchEmail);
    // quand le resultat sera correct, le console log affichera une autre réponse que null; regValide sera la valeur de la réponse regex, 0 ou -1
    let regValide = valeur.search(regexValidEmail);
    if (regValide === 0 && regMatch !== null) {
      contactClient.email = email.value;
      contactClient.regexEmail = 1;
    } else {
      contactClient.regexEmail = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regValide, valeur, regexEmail);
    valideClic();
  });
}
//---------------------------------------
// Partie texte sous champ email (message d'erreur si regex invalide ou valide ...)
//---------------------------------------
if (page.match("cart")) {
  email.addEventListener("input", (e) => {
    // Valeur de l'input en dynamique
    valeur = e.target.value;
    let regMatch = valeur.match(regexMatchEmail);
    let regValide = valeur.search(regexValidEmail);
    // si valeur est toujours une string vide et la regex #te de 0 (regex à -1 et le champ est vide mais pas d'erreur)
    if (valeur === "" && regMatch === null) {
      document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // si valeur n'est plus une string vide et la regex #te de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
    } else if ( regValide !== 0) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // pour le reste des cas (quand la regex ne trouve aucune erreur et est à 0 peu importe le champ car il est validé par la regex)
    } else if (valeur != "" && regMatch == null) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caratères acceptés pour ce champ. Forme email pas encore conforme";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else {
      document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
      document.querySelector("#emailErrorMsg").style.color = "white";
    }
  });
}
//---------------------------------------
// Fonction couleurRegex qui modifie la couleur de l'input au remplissage du formulaire (aide visuelle + accessibilité)
//---------------------------------------
// On détermine une valeur de départ à la valeur qui sera une string
let valeurEcoute = "";
// Function à 3 arguments réutilisables, la regex, la valeur d'écoute et la réponse à l'écoute
function couleurRegex(regSearch, valeurEcoute, inputAction) {
  // Si la valeur est tjrs une string vide et la regex #te de 0 (regex à -1 & champ vide mais pas d'erreur)
  if (valeurEcoute === "" && regSearch != 0) {
    inputAction.style.backgroundColor = "white";
    inputAction.style.color = "black";
    // Si la valeur n'est plus une string et la regex #te de 0 (regex à -1 & champ pas vide => erreur)
  } else if (valeurEcoute !== "" && regSearch != 0) {
    inputAction.style.backgroundColor = "rgb(220, 50, 50)";
    inputAction.style.color = "white";
    // Pour le reste des cas (quand la regex ne trouve aucune erreur et est à 0 peut importe le champ car validé par la regex)
  } else {
    inputAction.style.backgroundColor = "rgb(0, 138, 0)";
    inputAction.style.color = "white";
  }
}
//---------------------------------------
// Function affichage individuel des paragraphes sous input (sauf email car déjà réalisé)
//---------------------------------------
function texteInfo(regex, pointage, zoneEcoute) {
      if (page.match("cart")) {
      zoneEcoute.addEventListener("input", (e) => {
      // Valeur de l'input dynamique
      valeur = e.target.value;
      index = valeur.search(regex);
      // Si la valeur est tjrs une string vide et la regex #te de 0 (regex à -1 et le champ est vide mais sans erreur)
      if (valeur === "" && index != 0) {
        document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
        document.querySelector(pointage).style.color = "white";
        // Si la valeur n'est plus une string vide et la regex #te de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
      } else if (valeur !== "" && index != 0) {
        document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
        document.querySelector(pointage).style.color = "white";
        // Pour le reste des cas (quand la regex ne trouve aucune erreur et est à 0 peu importe le champ car validé par la regex)
      } else {
      document.querySelector(pointage).innerHTML = "Caratères acceptés pour ce champ.";
      document.querySelector(pointage).style.color = "white";
      }
    });
  }
}
//---------------------------------------
// Function validation / acces au clic du bouton formulaire
//---------------------------------------
let commande = document.querySelector("#order");
// La fonction sert à valider le clic de commande de manière interactive
function valideClic() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (somme === 5) {
    commande.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    commande.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}
//---------------------------------------
// Envoi de la commande
//---------------------------------------
if (page.match("cart")) {
  commande.addEventListener("click", (e) => {
    // Empêche de recharger la page, on prévient le reload du bouton
    e.preventDefault();
    valideClic();
    envoiPaquet();
  });
}
//---------------------------------------
// Function récupération des id puis mise dans un tableau
//---------------------------------------
// Définition du panier quine comportera que les id des produits choisi du local storage
let panierId = [];
function tableauId() {
// Appel des ressources
let panier = JSON.parse(localStorage.getItem("panierStocké"));
// Récupération des id produit dans panierId
if (panier && panier.length > 0) {
  for (let indice of panier) {
    panierId.push(indice._id);
  }
} else {
  console.log("le panier est vide");
  document.querySelector("#order").setAttribute("value", "Panier vide!");
}
}
//---------------------------------------
// Function récupération des données client et panier avant transformation
//---------------------------------------
let contactRef;
let commandeFinale;
function paquet() {
  contactRef = JSON.parse(localStorage.getItem("contactClient"));
  // Définition de l'objet commande
  commandeFinale = {
    contact: {
      firstName: contactRef.firstName,
      lastName: contactRef.lastName,
      address: contactRef.address,
      city: contactRef.city,
      email: contactRef.email,
    },
    products: panierId,
  };
}
//---------------------------------------
// Function validation de l'envoi
//---------------------------------------
function envoiPaquet() {
  tableauId();
  paquet();
  // Vision sur le paquet que l'on veut envoyer
  console.log(commandeFinale);
  let somme = contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  //  Si le panierId contient des articles et que le clic est autorisé
  if (panierId.length != 0 && somme === 5) {
    // Envoi à la ressoource API
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeFinale),
    })
      .then((res) => res.json())
      .then((data) => {
        // Envoyer à la page confirmation
        window.location.href = `/front/html/confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}
//---------------------------------------
// Function affichage du numéro de commande + vider le local storage lorqu'on est sur la page confirmation
//---------------------------------------
(function Commande() {
  if (page.match("confirmation")) {
    sessionStorage.clear();
    localStorage.clear();
    // Valeur du numero de coommande
    let numCom = new URLSearchParams(document.location.search).get("commande");
    // Merci et mise en page
    document.querySelector("#orderId").innerHTML = `<br>${numCom}<br>Merci pour votre achat`;
    console.log("valeur de l'orderId venant de l'url: " + numCom);
    // Réinitialisation du numéro de commande
    numCom = undefined;
  } else {
    console.log("sur page cart");
  }
})();
