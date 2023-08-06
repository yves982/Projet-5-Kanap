// use an IIFE to avoid global namespace pollution: YLA
import {ErrorContext} from "./errorHelper";

(function(){
    const errCtx = new ErrorContext("products", ".titles")
    
    fetch('http://localhost:3000/api/products')
        .then((res)=> res.json())
        .then(generateArticlesHtml)
        .then(displayArticles)
        .catch(errCtx.displayThenLogError);
    
    function generateArticleHtml(article) {
        return `<article>
            <img src ="${article.imageUrl}" alt ="${article.altTxt}">
            <h3 class="productName">${article.name}</h3>
            <p class="productDescription">
                ${article.description}
            </p>
            <!-- we should not access an underscore prefixed property by convention it used to mean private property -->
            <a href="./product.html?_id=${article._id}">show details</a>
        </article>`
    }
    
    function generateArticlesHtml(articles) {
        const articlesHtml = articles.map(generateArticleHtml)
        return articlesHtml.join("\r\n")
    }
    
    function displayArticles(articlesHtml) {
        let zoneArticle = document.querySelector("#items");
        zoneArticle.innerHtml = articlesHtml
    }
})()