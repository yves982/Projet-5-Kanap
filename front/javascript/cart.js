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
function affiche(indexé){
    // Déclaration et pointage de la zone d'affichage (modif dans le DOM)
    let zoneAffichagePanier = document.querySelector("#cart__items");
    // On créer les affichages des produits de façon dynamique via un map et introduction de dataset dans le code 
    zoneAffichagePanier.innerHTML += indexé.map((choix) =>
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
// Fonction ajout nombre total produit & coût total
//-------------------------------------------
function totalProduit() {
    let panier = JSON.parse(localStorage.getItem("panierStocké"));
    // Déclaration variable en trant que nombre
    let totalArticle = 0;
    // Déclaration variable en trant que nombre
    let prixCombiné = 0;
    // Déclaration variable en trant que nombre
    let totalPrix = 0;
    // Ajout de toutes les qtés d'articles du panier + calcul prix total
    for (let article of panier) {
        totalArticle += JSON.parse(article.quantité);
        prixCombiné = JSON.parse(article.quantité) * JSON.parse(article.prix);
        totalPrix += prixCombiné;
    }
    // Pointer l'endroit pour afficher le nb article 
    document.querySelector("#totalQuantity").textContent = totalArticle;
    // Pointer l'endroit pour afficher le prix total
    document.querySelector("#totalPrice").textContent = totalPrix;
}