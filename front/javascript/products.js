//-------------------------------------------
// Récupération de l'id du produit via l' URL
//-------------------------------------------
//la variable params récupère l'url de la page   https://qastack.fr/programming/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
import {ErrorContext} from "./errorHelper";

(function(){
  //console.log(document.location);  https://developer.mozilla.org/fr/docs/Web/API/Document/location
  const params = new URLSearchParams(document.location.search);
  const id = params.get("_id");
  console.log(id);

  const errCtx = new ErrorContext("ressource", ".item")
  
  fetch(`http://localhost:3000/api/products/${id}`)
      .then((res) => res.json())
      .then(generateProductHtml)
      .then(renderProduct)
      .catch(errCtx.displayThenLogError);

  let articleClient = {
    constructor(onColorChanged, onQuantityChanged, buttonHandler) {
      this.onColorChanged = onColorChanged
      this.onQuantityChanged = onQuantityChanged
      this.buttonHandler = buttonHandler
      this._id = id
    },
    
    changeColor(newColor) {
      this.color = newColor
      this.onColorChanged?.call(this, newColor)
      this.buttonHandler.onChangeValidated()
    },
    changeQuantity(newQuantity) {
      this.quantity = newQuantity
      this.onQuantityChanged?.call(this, newQuantity)
      this.buttonHandler.onChangeValidated()
    },
    
    cantAddToBasket() {
      const isUnavailable = this.quantité < 1
      const isOverbought = isUnavailable || articleClient.quantité > 100
      const hasNoQuantity = articleClient.quantité === undefined
      const hasNoColor = articleClient.couleur === "" || articleClient.couleur === undefined
      
      return  isUnavailable || isOverbought || hasNoQuantity || hasNoColor;
    }
    
  };

  let cartHandler = {
    constructor() {
      this.addCartBtn = "#addToCart"
      this.registeredProducts= []
    },

    onChangeValidated() {
      document.querySelector(this.addCartBtn).style.color = "white";
      document.querySelector(this.addCartBtn).textContent = "Ajouter au panier";
    },

    _showProductAdded() {
      document.querySelector("#addToCart").style.color = "rgb(0, 205, 0)";
      document.querySelector("#addToCart").textContent = "Produit ajouté !";
    },

    _addOtherProduct() {
      const productsToValidate = [...this.registeredProducts, articleClient].sort(function triage(a, b) {
        if (a._id < b._id) return -1;
        if (a._id > b._id) return 1;
        if (a._id === b._id){
          if (a.couleur < b.couleur) return -1;
          if (a.couleur > b.couleur) return 1;
        }
        return 0;
      });
      // dernière commande, envoit produitsAValider dans le local storage sous le nom de panierStocké de manière JSON stringifié
      localStorage.panierStocké = JSON.stringify(productsToValidate)
    },

    _addFirstProduct() {
      let choixProduitClient = [];
      console.log(this.registeredProducts);
      if (this.registeredProducts.length === 0) {
        choixProduitClient.push(articleClient);
        console.log(articleClient);
        // dernière commande, envoit choixProduitClient dans le local storage sous le nom de panierStocké de manière JSON stringifié
        localStorage.panierStocké = JSON.stringify(choixProduitClient)
      }
    },

    _addToKnownProduct(product) {
      if (product._id === id && product.couleur === articleClient.couleur) {
        let additionQuantité = parseInt(product.quantité) + parseInt(quantitéProduit);
        product.quantité = JSON.stringify(additionQuantité);

        return { product, handled: true }
      }
    },

    _saveCart() {
      let currentlyRegisteredProducts = JSON.parse(localStorage.getItem("panierStocké"));
      if ((currentlyRegisteredProducts?.length ?? 0) > 0) {
        let productHandled = false
        this._registeredProducts = this._registeredProducts.map((product) => {
          //comparateur d'égalité des articles actuellement choisit et ceux déja choisit
          const {handled, product} = this._addToKnownProduct(product)
          productHandled = handled
          return product
        })
        if(productHandled) {
          localStorage.panierStocké = JSON.stringify(produitsEnregistrés)
          alert("RAPPEL: Vous aviez déja choisit cet article.");
          return;
        }
        this._addOtherProduct();
        return
      }
      this._addFirstProduct();
      console.log("clic effectué");
    },

    addToCart(articleClient) {
      if (articleClient.cantAddToBasket()) {
        alert("Pour valider le choix de cet article, veuillez renseigner une couleur, et/ou une quantité valide entre 1 et 100");
      } else {
        this._saveCart()
        this._showProductAdded()
      }
    }
  }
  
  let component = {

    init(cartHandler, articleClient) {
      this.cartHandler = cartHandler
      this.articleClient = articleClient
    },

    _generateProductHtml(product) {
      console.log(JSON.stringify(product))
  
      // guard also called early return
      if (id !== product._id) {
        throw new Error(`invalid product passed: ${product._id}`)
      }

      // N.B: article is the wrong HTML node for this (ul/li would have been better): article != item
      // an article is meant for a central block of text
      // here we've just a list of items, all of them have descriptions, but likely short ones
  
      // do not update the dom item by item, replace a block : less rerenders => more reactive UI
      // especially if your list of items is lengthy (ok we'll probably paginate the results, still).
      return `<li>
              <div class="item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
              </div>
              <div class="item__content">
  
                <div class="item__content__titlePrice">
                  <h1 id="title">${product.name}</h1>
                  <p>Prix : <span id="price">${product.price}</span>€</p>
                </div>
  
                <div class="item__content__description">
                  <p class="item__content__description__title">Description :</p>
                  <p id="description">${product.description}</p>
                </div>
  
                <div class="item__content__settings">
                  <div class="item__content__settings__color">
                    <label for="color-select">Choisir une couleur :</label>
                    <select name="color-select" id="colors">
                        ${product.colors.map(color => `<option value="${color}">${color}</option>`).join('\r\n')}
                    </select>
                  </div>
  
                  <div class="item__content__settings__quantity">
                    <label for="itemQuantity">Nombre d'article(s) (1-100) :</label>
                    <input type="number" name="itemQuantity" min="1" max="100" value="0" id="quantity">
                  </div>
                </div>
  
                <div class="item__content__addButton">
                  <button id="addToCart">Ajouter au panier</button>
                </div>
  
              </div>
            </li>`
    },
    
    render(produit) {
      const productHtml = this._generateProductHtml(produit)
      document.querySelector("section.item").innerHTML = productHtml
      console.log("affichage effectué");
    },
    
    listen() {
      let choixCouleur = document.querySelector("#colors");
      choixCouleur.addEventListener("input", e => this.articleClient.changeColor(e.target.value.trim()))

      choixCouleur.addEventListener("input", (evt) => this.articleClient.changeColor(evt.target.value))
      let choixQuantité = document.querySelector('input[id="quantity"]');
      choixQuantité.addEventListener("input", evt => this.articleClient.changeQuantity(evt.target.value))

      let choixProduit = document.querySelector("#addToCart");
      choixProduit.addEventListener("click", this.cartHandler.addToCart);
    }
  }
  

  component.init(cartHandler, articleClient)
  return component
})()