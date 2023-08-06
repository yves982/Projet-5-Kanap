// use an IIFE to avoid global namespace pollution: YLA
(function(){
    // Récupération des données de l'API.
    fetch('http://localhost:3000/api/products')
        //Réponse en json.
        .then((res)=> res.json())
        //Réponse obtenue en json => objectProduits.
        .then((objetProduits)=> {
            // Infos en console sur ce qui est récupéré sous forme de tableau.
            console.table(objetProduits);
            // appel fonction affichage produits.
            lesKanaps(objetProduits);
        })
        // si erreur => remplacer le titre  par une erreur 404 + renvoi msg d'erreur en console.
        .catch((err) => {
            document.querySelector(".titles").innerHTML = "<h1> Error  </h1>";
            console.log("Error" + err);
        });
    
    //-------------------------------------------
    // Afficher les produits de l'api sur la page d'acceuil (index)
    //-------------------------------------------
    function lesKanaps(index) {
        // déclaration de variable de la zone d'article
        let zoneArticle = document.querySelector("#items");
        // boucle pour chaque indice(nommé 'article') dans index
        for (let article of index) {
            /* création et ajout des zones d'articles, insertion de l'adresse produit via chemin produit + paramètres(son id);
            la page index est http://127.0.0.1:5500/front/html/index.html donc la page du produit sera http://127.0.0.1:5500/front/html/product.html 
            (d'ou le ./product.html) pour rajouter son paramètre on met ? puis la clé (ici _id) associé (=) à sa valeur dynamique ${article._id} */

            zoneArticle.innerHTML += `<a href="./product.html?_id=${article._id}">
        <article>
            <img src ="${article.imageUrl}" alt ="${article.altTxt}">
            <h3 class="productName">${article.name}</h3>
            <p class="productDescription">${article.description}</p>
        </article>
    </a>`;
        }
    };
})()