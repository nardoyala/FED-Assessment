const Products = {

  /**
   * Takes a JSON representation of the products and renders cards to the DOM
   * @param {Object} productsJson 
   */
  displayProducts: productsJson => {

    // Render the products here
    const root = document.getElementById("root");
    const products = productsJson.data.products.edges;
    root.innerHTML = Products.generateProductCards(products)

  },

  state: {
    storeUrl: "https://api-demo-store.myshopify.com/api/2020-07/graphql",
    contentType: "application/json",
    accept: "application/json",
    accessToken: "b8385e410d5a37c05eead6c96e30ccb8"
  },

  /**
   * Sets up the query string for the GraphQL request
   * @returns {String} A GraphQL query string
   */
  query: () => `
    {
      products(first:12) {
        edges {
          node {
            id
            handle
            title
            tags
            images(first:1) {
              edges {
                node {
                  originalSrc
                }
              }
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `,

  /**
   * Fetches the products via GraphQL then runs the display function
   */
  handleFetch: async () => {
    const root = document.getElementById("root");
    root.innerHTML = `<div class="loader"></div>`
    const productsResponse = await fetch(Products.state.storeUrl, {
      method: "POST",
      headers: {
        "Content-Type": Products.state.contentType,
        "Accept": Products.state.accept,
        "X-Shopify-Storefront-Access-Token": Products.state.accessToken
      }, 
      body: JSON.stringify({
        query: Products.query()
      })
    });
    const productsResponseJson = await productsResponse.json();
    Products.displayProducts(productsResponseJson);
  },

  /**
   * Generates the html for the product cards
   */
  generateProductCards: (products) => {
    const view = `
      <div class="products">
        ${products.map((product) => `
          <div class="product__card">
            <figure class="product__card__thumbnail">
              <img src="${product.node.images.edges[0].node.originalSrc}" alt="${product.node.title}" />
            </figure>
            <h4 class="product__card__title">${product.node.title}</h4>
            <span class="product__card__price">$ ${product.node.priceRange.minVariantPrice.amount}</span>
            <div class="product__card__tags">
            ${product.node.tags.map((tag) => {
              return (`
                  <a href="#">${tag}</a>
                  `)
                }).join('')}
            </div>
            <button class="add-button" type="button">Add to cart</button>
          </div>
        `).join('')}
      </div>
    `
    return view;
  },

  /**
   * Sets up the click handler for the fetch button
   */
  initialize: () => {
    // Add click handler to fetch button
    const fetchButton = document.querySelector(".fetchButton");
    if (fetchButton) {
      fetchButton.addEventListener("click", Products.handleFetch);
    }
  }

};

document.addEventListener('DOMContentLoaded', () => {
  Products.initialize();
});