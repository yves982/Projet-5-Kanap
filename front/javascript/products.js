//-------------------------------------------
// Récupération de l'ID du produit via l'URL
//-------------------------------------------
// la variable params récupère l'url de la page source : https://qastack.fr/programming/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const params = new URLSearchParams(document.location.search);
// la variable id récupère la valeur du paramètre _id
const id = params.get("_id");
console.log(id);
//-------------------------------------------
// Récupération des produits de l'api + traitement des données (cf script.js)
//-------------------------------------------

fetch("http://localhost:3000/api/products")
.then((res) => res.json())
    .then((objetProduits) => {
        // execution de la fonction afficahgeProduits
        affichageProduits(objetProduits);
    })
    .catch((err)=> {
        document.querySelector('.item').innerHTML = "<h1>Error</h1>"
        console.log("Error" + err);
    });
//-------------------------------------------
// Création de l'objet articleClient
//-------------------------------------------
// Déclaration de l'objet articleClient prêt à être modifié par les fonctions suivantes d'évènements
let articleClient = {}
// Id du produit
articleClient._id = id;
//-------------------------------------------
// affichage des produits détaillés provenant de l'api 
//-------------------------------------------
function affichageProduits(produit) {
    // déclaration des différents élément provenant du HTML products 
    const imageAlt = document.querySelector("article div.item__img");
    const titre = document.querySelector("#title");
    const prix = document.querySelector("#price");
    const description = document.querySelector("#description");
    const couleurOption = document.querySelector("#colors");
    // boucle for
    for (const choix of produit) {
        // si l'id définit par l'url = un _id on récupère ses éléments pour les produits à ajouter
        if (id === choix._id) {
            // ajout des élements de façon dynamique
            imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
            titre.textContent = `${choix.name}`;
            prix.textContent = `${choix.price}`;
            description.textContent = `${choix.description}`;
            // on ajoute le prix également dans le panier (ça servira pour le compteur total)
            articleClient.prix = `${choix.price}`;
            // boucle pour chercher les couleurs pour chaque produit en fonction de sa clef/valeur (la logique: tableau dans un tableau = boucle dans boucle)
            for (const couleur of choix.colors)  {
                // ajout des balises d'option couleur avec leur valeur
                couleurOption.innerHTML += `<option value="${couleur}">${couleur}</option>`;
            }
        }
    }
    console.log("affichage effectué")
};
//-------------------------------------------
// Choix des couleurs de façon dynamique
//-------------------------------------------
// Définition des variables
const choixCouleur = document.querySelector("#colors");
//On écoute ce qu'il se passe dans #colors
choixCouleur.addEventListener("input", (ecolors)=> {
    let couleurProduit;
    // On récupère la valeur de la cible de l'évent dans colors
    couleurProduit = ecolors.target.value;
    // On ajoute la couleur à l'objet panierClient
    articleClient.couleur = couleurProduit;
    // reset  couleur & texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    console.log(couleurProduit);
})
//-------------------------------------------
// Choix des quantités de façon dynamique
//-------------------------------------------
// Définition des variables
const choixQuantité = document.querySelector('input[id ="quantity"]');
let quantitéProduit;
// On écoute ce qu'il se passe dans input[name = "itemQuantity"]
choixQuantité.addEventListener("input", (eqté)=> {
    // On récup la valeur de la cible de l'event 
    quantitéProduit = eqté.target.value;
    // On add la qté à l'objet panierClient
    articleClient.quantité = quantitéProduit;
    // reset  couleur & texte du bouton si il y a une action sur les inputs dans le cas d'une autre commande du même produit
    document.querySelector("#addToCart").style.color = "white";
    document.querySelector("#addToCart").textContent = "Ajouter au panier";
    console.log(quantitéProduit);
});
//-------------------------------------------
// Condition de validation au clic via le btn "ajouter au panier"
//-------------------------------------------
//déclaration de la variable
const choixProduit = document.querySelector("#addToCart");
// On écoute ce qu'il se passe sur le btn #addToCart pour réaliser l'action
choixProduit.addEventListener("click", () => {
    // conditions de validation du bouton ajouter au panier
    if (
        /* les valeurs sont créées dynamiquement au click & à l'arrivé sur la page. 
        Tant qu'il n'y a pas d'action sur la couleur &/ou qté => undefined. */
        articleClient.quantité < 1 ||
        articleClient.quantité > 100 ||
        articleClient.quantité === undefined ||
        articleClient.couleur === "" ||
        articleClient.couleur === undefined

    ) {
        // Jouer l'alerte
        alert("Pour valider le choix de cet artcile, veuillez renseigner une couleur ainsi qu'une quantité ")
        // Si OK
    } else {
        // Lancer panier (fonction à réaliser)
        Panier();
        console.log("clic effectué");
        // Effet visuel de l'ajout au panier
        document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
        document.querySelector("#addToCart").textContent = "Produit ajouté !";
    }
});
//-------------------------------------------
// Déclaration des tableaux 
//-------------------------------------------
// Déclaration du tableau d'initialisation du panier
const choixProduitClient = [];
// Déclaration du tableau qui permet de récupérer les infos du local storage "panierStocké" à convertir en JSON
const produitsEnregistrés = [];
// Déclaration du tableau choix couleur / quantité non effectué  => non présent dans panier stocké 
const produitsTemporaires = [];
// Déclaration du tableau qui sera la concaténation entre "produitsEnregistré & produitsTemporaires"
const produitsAValider = [];
//-------------------------------------------
// Fonction ajoutPremierProduit qui ajoute l'article dans un tabeau vierge 
//-------------------------------------------
function ajoutPremierProduit () {
    console.log(produitsEnregistrés);
    // if produit enregistré = null => pas été créé
    if (produitsEnregistrés === null) {
        // pousser le produit choisit dans choixProduitClient
        choixProduitClient.push(articleClient);
        console.log(articleClient);
        //
        return (localStorage.panierStocké = JSON.stringify(choixProduitClient));
    }
}
//-------------------------------------------
// Fonction ajoutAutreProduit qui ajoute l'article dans le tableau non vierge et fait un tri
//-------------------------------------------