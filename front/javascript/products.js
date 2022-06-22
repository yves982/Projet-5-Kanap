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
}).catch((err)=> {
    document.querySelector('.items').innerHTML = "<h1>Error 404 </h1>"
    console.log("Error 404, sur les ressources de l'API:" + err);
});
//-------------------------------------------