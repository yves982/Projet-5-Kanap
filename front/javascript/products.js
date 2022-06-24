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
    document.querySelector('.items').innerHTML = "<h1>Error 404 </h1>"
    console.log("Error 404, sur les ressources de l'API:" + err);
});
//-------------------------------------------


//-------------------------------------------
// affichage du produit provenant de l'api 
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
            
            

            for (let couleur of choix.colors)  {
                couleurOption.innerHTML += `<option value = "${couleur}>${couleur}</option>`;
            }
        }
    }
    console.log("affichage effectué")
}