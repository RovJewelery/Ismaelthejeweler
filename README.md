# IsmaTheJeweler Website

This is a custom jewelry storefront for IsmaTheJeweler. It is built as a regular static website for GitHub Pages, Netlify, or Vercel, with Shopify Storefront API hooks for products, variants, inventory, cart, checkout, and customer login.

## Editing

- Replace `assets/isma-logo.png` to change the logo.
- The Que&Co screenshots are inspiration only. Do not use their name, logo, or photos.
- Edit `index.html` only for shared shell content such as the header/footer.
- Edit `app.js` for page content and behavior.
- Edit `styles.css` for spacing, colors, and layout.
- Add Shopify API settings inside `shopify-api.js`.
- All homepage, feature, product fallback, and portfolio media areas are intentionally blank placeholders until final IsmaTheJeweler media is added.

## Shopify API

In `shopify-api.js`, fill in:

```js
storeDomain: 'your-store.myshopify.com',
storefrontAccessToken: 'your-storefront-access-token',
apiVersion: '2026-07',
customerAccountUrl: 'https://your-account-login-url'
```

Only use a Shopify Storefront API token that is safe for public storefront use. Do not put private Admin API credentials in this website.

## Routes

- `#/` Home
- `#/shop` All products
- `#/shop/pendants`
- `#/shop/watches`
- `#/shop/bracelets`
- `#/shop/earrings`
- `#/shop/rings`
- `#/shop/engagement-rings`
- `#/shop/sets`
- `#/shop/chains`
- `#/shop/misc`
- `#/custom`
- `#/portfolio`
- `#/contact`
