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
    
    function generateArticleHtml(article) {
        return `<article>
            <img src ="${article.imageUrl}" alt ="${article.altTxt}">
            <h3 class="productName">${article.name}</h3>
            <p class="productDescription">
                ${article.description}
            </p>
            <!-- we should not access an underscore prefixed property by convention it used to mean private property -->
            <a href="./product.html?_id=${article._id}">show more</a>
        </article>`
    }
    
    //-------------------------------------------
    // Afficher les produits de l'api sur la page d'acceuil (index)
    //-------------------------------------------
    function lesKanaps(articles) {
        let zoneArticle = document.querySelector("#items");
        
        const articlesHtml = articles.map(generateArticleHtml)
        zoneArticle.innerHTML = articlesHtml.join("\r\n")
    };
})()