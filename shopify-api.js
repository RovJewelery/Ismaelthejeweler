window.IsmaShopify = (() => {
  const config = {
    storeDomain: 'ismathejeweler.myshopify.com',
    storefrontAccessToken: 'a64db960e8543815cdca9654a96e3a2d',
    apiVersion: '2026-07',
    customerAccountUrl: '',
  };

  let cart = null;

  function isConfigured() {
    return Boolean(config.storeDomain && config.storefrontAccessToken);
  }

  async function storefrontRequest(query, variables = {}) {
    if (!isConfigured()) {
      console.info('Add your Shopify Storefront API domain and token in shopify-api.js.');
      return null;
    }

    const response = await fetch(`https://${config.storeDomain}/api/${config.apiVersion}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': config.storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API request failed: ${response.status}`);
    }

    const payload = await response.json();
    if (payload.errors) {
      throw new Error(payload.errors.map((error) => error.message).join(', '));
    }
    return payload;
  }

  async function fetchProducts(first = 48) {
    const query = `
      query Products($first: Int!) {
        products(first: $first) {
          nodes {
            ...ProductCard
          }
        }
      }
      ${productCardFragment}
    `;
    const data = await storefrontRequest(query, { first });
    return mapProductNodes(data?.data?.products?.nodes);
  }

  async function fetchProductsByCollection(handle, first = 48) {
    const query = `
      query CollectionProducts($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          products(first: $first) {
            nodes {
              ...ProductCard
            }
          }
        }
      }
      ${productCardFragment}
    `;
    const data = await storefrontRequest(query, { handle, first });
    return mapProductNodes(data?.data?.collection?.products?.nodes);
  }

  async function searchProducts(searchTerm, first = 48) {
    const query = `
      query SearchProducts($query: String!, $first: Int!) {
        products(first: $first, query: $query) {
          nodes {
            ...ProductCard
          }
        }
      }
      ${productCardFragment}
    `;
    const data = await storefrontRequest(query, { query: searchTerm, first });
    return mapProductNodes(data?.data?.products?.nodes);
  }

  async function fetchProductByHandle(handle) {
    const query = `
      query Product($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          descriptionHtml
          availableForSale
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount currencyCode } }
          variants(first: 100) {
            nodes {
              id
              title
              availableForSale
              price { amount currencyCode }
              compareAtPrice { amount currencyCode }
            }
          }
        }
      }
    `;
    const data = await storefrontRequest(query, { handle });
    return mapProduct(data?.data?.product);
  }

  async function createCart() {
    if (cart) return cart;
    const query = `
      mutation CartCreate {
        cartCreate {
          cart {
            ...CartFields
          }
          userErrors { field message }
        }
      }
      ${cartFragment}
    `;
    const data = await storefrontRequest(query);
    cart = mapCart(data?.data?.cartCreate?.cart) || cart;
    return cart;
  }

  async function addItemToCart(variantId, quantity = 1) {
    if (!variantId) return null;
    if (!cart) await createCart();
    if (!cart?.id) return null;

    const query = `
      mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors { field message }
        }
      }
      ${cartFragment}
    `;
    const data = await storefrontRequest(query, {
      cartId: cart.id,
      lines: [{ merchandiseId: variantId, quantity }],
    });
    cart = mapCart(data?.data?.cartLinesAdd?.cart) || cart;
    return cart;
  }

  async function updateCartQuantity(lineId, quantity) {
    if (!cart?.id || !lineId) return null;
    const query = `
      mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors { field message }
        }
      }
      ${cartFragment}
    `;
    const data = await storefrontRequest(query, {
      cartId: cart.id,
      lines: [{ id: lineId, quantity }],
    });
    cart = mapCart(data?.data?.cartLinesUpdate?.cart) || cart;
    return cart;
  }

  function getCart() {
    return cart;
  }

  function redirectToCheckout() {
    if (cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
      return;
    }
    alert('Cart is ready. Add Shopify Storefront API settings in shopify-api.js to enable checkout.');
  }

  function openCustomerAccount() {
    if (config.customerAccountUrl) {
      window.location.href = config.customerAccountUrl;
      return;
    }
    alert('Customer login is ready. Add your Shopify customer account URL in shopify-api.js.');
  }

  const productCardFragment = `
    fragment ProductCard on Product {
      id
      title
      handle
      availableForSale
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount currencyCode } }
      variants(first: 1) {
        nodes { id }
      }
    }
  `;

  const cartFragment = `
    fragment CartFields on Cart {
      id
      checkoutUrl
      totalQuantity
      cost { totalAmount { amount currencyCode } }
      lines(first: 50) {
        nodes {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              product { title }
            }
          }
        }
      }
    }
  `;

  function mapProductNodes(nodes = []) {
    return nodes.map(mapProduct).filter(Boolean);
  }

  function mapProduct(product) {
    if (!product) return null;
    const price = product.priceRange?.minVariantPrice || product.variants?.nodes?.[0]?.price;
    const compareAt = product.compareAtPriceRange?.minVariantPrice || product.variants?.nodes?.[0]?.compareAtPrice;
    return {
      id: product.id,
      title: product.title,
      handle: product.handle,
      descriptionHtml: product.descriptionHtml,
      image: product.featuredImage?.url,
      imageAlt: product.featuredImage?.altText,
      available: Boolean(product.availableForSale),
      amount: Number(price?.amount || 0),
      currencyCode: price?.currencyCode || 'USD',
      price: formatMoney(price),
      compareAtAmount: Number(compareAt?.amount || 0),
      compareAtPrice: compareAt ? formatMoney(compareAt) : '',
      onSale: compareAt && Number(compareAt.amount) > Number(price?.amount || 0),
      variantId: product.variants?.nodes?.[0]?.id,
      variants: product.variants?.nodes?.map((variant) => ({
        id: variant.id,
        title: variant.title,
        available: Boolean(variant.availableForSale),
        price: formatMoney(variant.price),
      })) || [],
    };
  }

  function mapCart(shopifyCart) {
    if (!shopifyCart) return null;
    return {
      id: shopifyCart.id,
      checkoutUrl: shopifyCart.checkoutUrl,
      totalQuantity: shopifyCart.totalQuantity || 0,
      cost: formatMoney(shopifyCart.cost?.totalAmount),
      lines: shopifyCart.lines?.nodes?.map((line) => ({
        id: line.id,
        quantity: line.quantity,
        title: line.merchandise?.product?.title || 'Product',
        variantTitle: line.merchandise?.title,
        price: formatMoney(line.cost?.totalAmount),
      })) || [],
    };
  }

  function formatMoney(price) {
    if (!price) return '';
    return formatMoneyValue(Number(price.amount), price.currencyCode || 'USD');
  }

  function formatMoneyValue(amount, currencyCode = 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(Number(amount || 0));
  }

  return {
    config,
    isConfigured,
    fetchProducts,
    fetchProductsByCollection,
    searchProducts,
    fetchProductByHandle,
    createCart,
    addItemToCart,
    updateCartQuantity,
    getCart,
    redirectToCheckout,
    openCustomerAccount,
    formatMoneyValue,
  };
})();
