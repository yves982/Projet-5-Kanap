// Différencier la page confirmation et panier 
const page = document.location.href;
// ---------------------------------------
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
//-------------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier 
//-------------------------------------------
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
//-------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//-------------------------------------------
function affiche(indexe){
    // Déclaration et pointage de la zone d'affichage (modif dans le DOM)
    let zoneAffichagePanier = document.querySelector("#cart__items");
    // On créer les affichages des produits de façon dynamique via un map et introduction de dataset dans le code 
    zoneAffichagePanier.innerHTML += indexe.map((choix) =>
    `<article class="cart__item" data-id="${choix._id}" data-couleur="${choix.couleur}" data-quantité="${choix.quantité}"> 
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
    ).join(""); // On remplace les virgules de jonctions des objets du tableau par un vide
    // On reste à l'écoute des modifs de qté pour l'affichage & actualiser les données
    totalProduit();
}
//-------------------------------------------
// fonction modifQuantité on modifie dynamiquement les quantités du panier
//-------------------------------------------
function modifQuantité() {
    const cart = document.querySelectorAll(".cart__item");
    /* manière de regarder ce que l'on a d'affiché dynamiquement grace au dataset
   cart.forEach((cart) => {console.log("item panier en dataset: " + " " + cart.dataset.id + " " + cart.dataset.couleur + " " + cart.dataset.quantité); }); */
  // On écoute ce qu'il se passe dans itemQuantity de l'article concerné
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
        // vérification d'information de la valeur du clic et son positionnement dans les articles
        let panier = JSON.parse(localStorage.getItem("panierStocké"));
        // boucle pour modifier la qté du produit du panier grâce à la nouvelle valeur
        for (article of panier)
        if (
            article._id === cart.dataset.id && 
            cart.dataset.couleur === article.couleur
        ) {
            article.quantité = eq.target.value;
            localStorage.panierStocké = JSON.stringify(panier);
            // on met à jour le dataset quantité 
            cart.dataset.quantité = eq.target.value;
            // On joue la fonction pour actualiser les données
            totalProduit();
        }
    });
  });
}
//-------------------------------------------
// Fonction de suppression des articles du Panier 
//-------------------------------------------
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
//-------------------------------------------
// Fonction ajout nombre total produit & coût total prix à ne pas afficher dans le LocalStorage => via API 
//-------------------------------------------
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
//-------------------------------------------
// Formulaire
//-------------------------------------------
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
    adresse.classList.add("regex_email")
    // On pointe les éléments qui ont la classe .regex_texte
    var regexTexte = document.querySelectorAll(".regex_texte");
    // Modification du type d'input type email en texte à cause d'un comportement non voulut vis à vis de la regex
    document.querySelector("#email").setAttribute("type", "text");
}
//-------------------------------------------
// Regex
//-------------------------------------------
// Début regex qui valide les caratères a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ
// regexLettre => pour partie infos personnelles (ligne 213)
let regexLettre =  /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
// Début regex qui valide les caratères chiffre lettre et caratères spéciaux a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ
// regexChiffreLettre => pour partie adresse (ligne 250)
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
// regexValidEmail pour partie MAIL  (ligne 278)
let regexValidEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regexMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+\=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//-------------------------------------------
// PARTIE INFOS PERSONNELLES Ecoute et attribution de point (pour sécurité au clic) si ces champs sont ok d'après la regex
//-------------------------------------------
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
//-------------------------------------------
// le champ écouté via la regex regexLettre fera réagir, grâce à texteInfo, la zone concernée
//-------------------------------------------
texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);
//-------------------------------------------
// PARTIE ADRESSE Ecoute et attribution (pour la sécurité) si ces champs sont validé d'après la Regex
//-------------------------------------------
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
//------------------------------------
// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
//--------------------------------------------------------------
//-------------------------------------------
// PARTIE MAIL Ecoute et attribution (pour la sécurité) si ces champs sont validé d'après la Regex
//-------------------------------------------
if (page.match("cart")) {
    let regexEmail = document.querySelector(".regex_email");
    regexEmail.addEventListener("input", (e) => {
        // La valeur sera la valeur de l'input dynamique
        value = e.target.value;
        let regexMatch = valeur.match(regexMatchEmail);
        // Quand le résultat sera correct, le console.log affichera une autre réponse que nulle; regexValide sera la valeur de la réponse regex 0 ou -1
        let regexValide = valeur.match(regexValidEmail)
        if (regexValide === 0 && regexMatch !== null) {
            contactClient.email = email.value;
            contactClient.regexEmail = 1;
        } else {
            contactClient.regexEmail = 0;
        }
        localStorage.contactClient = JSON.stringify(contactClient);
        couleurRegex(regexValide, valeur, regexEmail);
        valideClic();
    });
}
//-------------------------------------------
// Partie texte sous champ email (message d'erreur si regex invalide ou valide ...)
//-------------------------------------------
if (page.match("cart")) {
    email.addEventListener("input", (e) => {
        // La valeur sera la valeur de l'input en dynamique
        valeur = e.target.value;
        let regexMatch = valeur.match(regexMatchEmail);
        let regexValide = valeur.match(regexValidEmail);
        // si valeur est toujours une string vide et la regex # de 0 
        if (valeur === "" && regexMatch === null) {
            document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
            document.querySelector("#emailErrorMsg").style.color = "white";
            // si la valeur n'est plus une string vide et la regex # de 0 
        } else if (regexValide !== 0) {
            document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
            document.querySelector("#emailErrorMsg").style.color = "white";
        } else if (valeur != "" && regexMatch == null) {
            document.querySelector("#emailErrorMsg").innerHTML = "Caractère accepté. Forme email pas encore conforme";
            document.querySelector("#emailErrorMsg").style.color = "white";
        } else {
            document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
            document.querySelector("#emailErrorMsg").style.color = "white";
        }
    });
}
