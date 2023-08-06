//-------------------------------------------
// Récupération de l'id du produit via l' URL
//-------------------------------------------
//la variable params récupère l'url de la page   https://qastack.fr/programming/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
(function(){
  //console.log(document.location);  https://developer.mozilla.org/fr/docs/Web/API/Document/location
  const params = new URLSearchParams(document.location.search);
  const id = params.get("_id");
  console.log(id);

  fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then(leProduit)
      .catch((err) => {
        document.querySelector(".item").innerHTML = "<h1>Error</h1>";
        console.log("erreur , sur ressource api: " + err);
      });

  let articleClient = {};
  articleClient._id = id;
//-------------------------------------------
// fonction d'affichage du produit de l'api
//-------------------------------------------
  function leProduit(produit) {
    // to log objects, use JSON.stringify
    // to log anything don't break your logic flow : put logs close to the code they relate to,
    // here in redering logic.
    console.log(JSON.stringify(produit))
    
    // guard also called early return
    if (id !== produit._id) {
      return;
    }
    
    // N.B: article is the wrong HTML node for this (ul/li would have been better): article != item
    // an article is meant for a central block of text
    // here we've just a list of items, all of them have descriptions, but likely short ones
    
    // do not update the dom item by item, replace a block : less rerenders => more reactive UI
    // especially if your list of items is lengthy (ok we'll probably paginate the results, still).
    document.querySelector("section.item").innerHTML = `<article>
            <div class="item__img">
                <img src="${produit.imageUrl}" alt="${produit.altTxt}">
            </div>
            <div class="item__content">

              <div class="item__content__titlePrice">
                <h1 id="title">${produit.name}</h1>
                <p>Prix : <span id="price">${produit.price}</span>€</p>
              </div>

              <div class="item__content__description">
                <p class="item__content__description__title">Description :</p>
                <p id="description">${produit.description}</p>
              </div>

              <div class="item__content__settings">
                <div class="item__content__settings__color">
                  <label for="color-select">Choisir une couleur :</label>
                  <select name="color-select" id="colors">
                      ${produit.colors.map(color => `<option value="${color}">${color}</option>`).join('\r\n')}
                  </select>
                </div>

                <div class="item__content__settings__quantity">
                  <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                  <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                </div>
              </div>

              <div class="item__content__addButton">
                <button id="addToCart">Ajouter au panier</button>
              </div>

            </div>
          </article>`
    console.log("affichage effectué");
  }
//-------------------------------------------
// choix couleur dynamique
//-------------------------------------------
// définition des variables
  let choixCouleur = document.querySelector("#colors");
// On écoute ce qu'il se passe dans #colors
  choixCouleur.addEventListener("input", (ec) => {
    let couleurProduit;
    // on récupère la valeur de la cible de l'évenement dans couleur
    couleurProduit = ec.target.value;
    // on ajoute la couleur à l'objet panierClient
    articleClient.couleur = couleurProduit;
    //ça reset la couleur et le texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    console.log(couleurProduit);
  });
//-------------------------------------------
// choix quantité dynamique
//--------------------------------------------
// définition des variables
  let choixQuantité = document.querySelector('input[id="quantity"]');
  let quantitéProduit;
// On écoute ce qu'il se passe dans input[name="itemQuantity"]
  choixQuantité.addEventListener("input", (eq) => {
    // on récupère la valeur de la cible de l'évenement dans couleur
    quantitéProduit = eq.target.value;
    // on ajoute la quantité à l'objet panierClient
    articleClient.quantité = quantitéProduit;
    //ça reset la couleur et le texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    console.log(quantitéProduit);
  });
//-------------------------------------------
// conditions de validation du clic via le bouton ajouter au panier
//-------------------------------------------
// déclaration variable
  let choixProduit = document.querySelector("#addToCart");
// On écoute ce qu'il se passe sur le bouton #addToCart pour faire l'action :
  choixProduit.addEventListener("click", () => {
    //conditions de validation du bouton ajouter au panier
    if (
        // les valeurs sont créées dynamiquement au click, et à l'arrivée sur la page, tant qu'il n'y a pas d'action sur la couleur et/ou la quantité, c'est 2 valeurs sont undefined.
        articleClient.quantité < 1 ||
        articleClient.quantité > 100 ||
        articleClient.quantité === undefined ||
        articleClient.couleur === "" ||
        articleClient.couleur === undefined
    ) {
      // joue l'alerte
      alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
      // si ça passe le controle
    } else {
      // joue panier
      Panier();
      console.log("clic effectué");
      //effet visuel d'ajout de produit
      document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
      document.querySelector("#addToCart").textContent = "Produit ajouté !";
    }
  });
//-------------------------------------------
// Déclaration des tableaux utiles 
//-------------------------------------------
// déclaration tableau qui sera le 1er, unique et destiné à initialiser le panier
  let choixProduitClient = [];
// déclaration tableau qui sera ce qu'on récupère du local storage appelé panierStocké et qu'on convertira en JSon (importance dans Panier())
  let produitsEnregistrés = [];
// déclaration tableau qui sera un choix d'article/couleur non effectué donc non présent dans le panierStocké
  let produitsTemporaires = [];
// déclaration tableau qui sera la concaténation des produitsEnregistrés et de produitsTemporaires
  let produitsAValider = [];
///-------------------------------------------
// fonction ajoutPremierProduit qui ajoute l'article choisi dans le tableau vierge
//-------------------------------------------
  function ajoutPremierProduit() {
    console.log(produitsEnregistrés);
    //si produitsEnregistrés est null c'est qu'il n'a pas été créé
    if (produitsEnregistrés === null) {
      // pousse le produit choisit dans choixProduitClient
      choixProduitClient.push(articleClient);
      console.log(articleClient);
      // dernière commande, envoit choixProduitClient dans le local storage sous le nom de panierStocké de manière JSON stringifié
      return (localStorage.panierStocké = JSON.stringify(choixProduitClient));
    }
  }
//-------------------------------------------
// fonction ajoutAutreProduit qui ajoute l'article dans le tableau non vierge et fait un tri
///------------------------------------------- 
  function ajoutAutreProduit() {
    // vide/initialise produitsAValider pour recevoir les nouvelles données
    produitsAValider = [];
    // pousse le produit choisit dans produitsTemporaires
    produitsTemporaires.push(articleClient);
    // combine produitsTemporaires et/dans produitsEnregistrés, ça s'appele produitsAValider
    // autre manière de faire: produitsAValider = produitsEnregistrés.concat(produitsTemporaires);
    produitsAValider = [...produitsEnregistrés, ...produitsTemporaires];
    //fonction pour trier et classer les id puis les couleurs https://www.azur-web.com/astuces/javascript-trier-tableau-objet
    produitsAValider.sort(function triage(a, b) {
      if (a._id < b._id) return -1;
      if (a._id > b._id) return 1;
      if (a._id = b._id){
        if (a.couleur < b.couleur) return -1;
        if (a.couleur > b.couleur) return 1;
      }
      return 0;
    });
    // vide/initialise produitsTemporaires maintenant qu'il a été utilisé
    produitsTemporaires = [];
    // dernière commande, envoit produitsAValider dans le local storage sous le nom de panierStocké de manière JSON stringifié
    return (localStorage.panierStocké = JSON.stringify(produitsAValider));
  }
//-------------------------------------------
// fonction Panier qui ajuste la quantité si le produit est déja dans le tableau, sinon le rajoute si tableau il y a, ou créé le tableau avec un premier article choisi 
//-------------------------------------------
  function Panier() {
    // variable qui sera ce qu'on récupère du local storage appelé panierStocké et qu'on a convertit en JSon
    produitsEnregistrés = JSON.parse(localStorage.getItem("panierStocké"));
    // si produitEnregistrés existe (si des articles ont déja été choisit et enregistrés par le client)
    if (produitsEnregistrés) {
      for (let choix of produitsEnregistrés) {
        //comparateur d'égalité des articles actuellement choisit et ceux déja choisit
        if (choix._id === id && choix.couleur === articleClient.couleur) {
          //information client
          alert("RAPPEL: Vous aviez déja choisit cet article.");
          // on modifie la quantité d'un produit existant dans le panier du localstorage
          //définition de additionQuantité qui est la valeur de l'addition de l'ancienne quantité parsée et de la nouvelle parsée pour le même produit
          let additionQuantité = parseInt(choix.quantité) + parseInt(quantitéProduit);
          // on convertit en JSON le résultat précédent dans la zone voulue
          choix.quantité = JSON.stringify(additionQuantité);
          // dernière commande, on renvoit un nouveau panierStocké dans le localStorage
          return (localStorage.panierStocké = JSON.stringify(produitsEnregistrés));
        }
      }
      // appel fonction ajoutAutreProduit si la boucle au dessus ne retourne rien donc n'a pas d'égalité
      return ajoutAutreProduit();
    }
    // appel fonction ajoutPremierProduit si produitsEnregistrés n'existe pas
    return ajoutPremierProduit();
  }
//--------------------------------------------------------------------------------------------------
})()