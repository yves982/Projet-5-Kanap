// Appel de la ressource de l'API product si on est sur la page panier
if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
    .then((res) => res.json())
    .then((objetProduits) => {
        console.log(objetProduits);
        // appel de la fonction affichagePanier
        affichagePanier(objetProduits);
    })
    .catch((err) => {
        document.querySelector("#cartAndFormContainer").innerHTML = "<h1> Error </h1>"
        console.log(" Error" + err);
    });
} else {
    console.log("sur page confirmation");
}
//-------------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier
//-------------------------------------------
//-------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//-------------------------------------------