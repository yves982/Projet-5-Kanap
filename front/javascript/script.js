// use an IIFE to avoid global namespace pollution: YLA
(function(){
    fetch('http://localhost:3000/api/products')
        .then((res)=> res.json())
        .then((objetProduits)=> {
            // appel fonction affichage produits.
            lesKanaps(objetProduits);
        })
        .catch((err) => {
            document.querySelector(".titles").innerHTML = "<h1> Error  </h1>";
            console.error("Error" + err);
        });
    
    //-------------------------------------------
    // Afficher les produits de l'api sur la page d'acceuil (index)
    //-------------------------------------------
    function lesKanaps(articles) {
        // déclaration de variable de la zone d'article
        let zoneArticle = document.querySelector("#items");
        
        // boucle pour chaque indice(nommé 'article') dans index
        for (let article of articles) {
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