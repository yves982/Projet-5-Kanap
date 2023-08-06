// use an IIFE to avoid global namespace pollution: YLA
(function(){
    fetch('http://localhost:3000/api/products')
        .then((res)=> res.json())
        .then(displayArticles)
        .catch(displayError);
    
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
    
    function generateArticlesHtml(articles) {
        const articlesHtml = articles.map(generateArticleHtml)
        return articlesHtml.join("\r\n")
    }
    
    function displayArticles(articles) {
        let zoneArticle = document.querySelector("#items");
        zoneArticle.innerHtml = generateArticlesHtml(objetProduits);
    }
    
    function displayError(err) {
        document.querySelector(".titles").innerHTML = "<h1> Error  </h1>";
        console.error("Error" + err);
    }
})()