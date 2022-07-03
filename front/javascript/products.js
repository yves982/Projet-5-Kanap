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

fetch('http://localhost:3000/api/products')
.then((res) => res.json())
.then((objetProduits) => {
    // execution de la fonction lesProduits
    lesProduits(objetProduits);
})
.catch((err)=> {
    document.querySelector('.items').innerHTML = "<h1>Error</h1>"
    console.log("Error" + err);
});
//-------------------------------------------
//-------------------------------------------
// affichage des produits détaillés provenant de l'api 
//-------------------------------------------
function lesProduits(produit) {
    // déclaration des différents élément provenant du HTML products 
    let imageAlt = document.querySelector("article div.item__img");
    let titre = document.querySelector("#title");
    let prix = document.querySelector("#price");
    let description = document.querySelector("#description");
    let couleurOption = document.querySelector("#colors");
    // boucle for
    for (let choix of produit) {
        // si l'id définit par l'url = un _id on récupère ses éléments pour les produits à ajouter
        if (id == choix._id) {
            // ajout des élements de façon dynamique
            imageAlt.innerHTML = `<img src="${choix.imageUrl}" alt="${choix.altTxt}">`;
            titre.textContent = `${choix.name}`;
            prix.textContent = `${choix.price}`;
            description.textContent = `${choix.description}`;
            // on ajoute le prix également dans le panier (ça servira pour le compteur total)
            articleClient.prix = `${choix.price}`;
            // boucle pour chercher les couleurs pour chaque produit en fonction de sa clef/valeur (la logique: tableau dans un tableau = boucle dans boucle)
            for (let couleur of choix.colors)  {
                // ajout des balises d'option couleur avec leur valeur
                couleurOption.innerHTML += `<option value = "${couleur}>${couleur}</option>`;
            }
        }
    }
    console.log("affichage effectué")
};
//-------------------------------------------
// Choix des couleurs de façon dynamique
//-------------------------------------------
// Définition des variables

//-------------------------------------------
// Choix des quantités de façon dynamique
//-------------------------------------------
