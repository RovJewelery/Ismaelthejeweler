# IsmaTheJeweler Shopify Storefront Build Prompt

Build a custom Shopify-connected jewelry storefront for my jewelry brand, `IsmaTheJeweler`.

Use the provided screenshots only as inspiration for layout, structure, and general storefront functionality. Do not copy Que&Co branding, do not use the Que&Co name, do not use their logo, and do not use, copy, recreate, or include any of the photos from the screenshots. This is not a Que&Co website. It should be an original storefront for my own jewelry brand.

Most important: anything related to photos should not be used photo-wise. The screenshots are only for the rest of the design, layout, pages, navigation, and Shopify functionality. The owner will create and add the homepage photos, product photos, hero images, and other media later. Wherever photos belong, leave the space blank and make the placeholder label obvious.

Use the provided `Isma` logo artwork as the brand logo direction/assets. The storefront name should be `IsmaTheJeweler`, but the visual logo may use the supplied Isma script/diamond mark where appropriate in the header and branding areas.

## Overall Style

- Minimal luxury jewelry storefront.
- Clean white header.
- Centered logo area using the provided Isma logo artwork.
- Thin uppercase navigation with wide letter spacing.
- No free-shipping announcement bar.
- Black-and-white design foundation.
- Product grid should feel clean, premium, and simple.
- Do not use the screenshot photos as assets.
- Leave image areas blank with obvious placeholders.

## Required Navigation

The main navigation must include working links/buttons for:

- Home
- Shop
- Custom
- Portfolio
- Search icon/button
- Account/login icon/button
- Cart icon/button

## Home Page

- The Home button must link to the homepage.
- Do not recreate the screenshot homepage photo.
- Leave the homepage hero media area blank as a placeholder.
- Add a clear placeholder label such as: `Homepage hero image/video placeholder`.
- Include room for a headline and primary call-to-action, but make the image/video area easy for the owner to replace later.
- The “Shop All” button should link to the main Shop page.

## Shop Page

- The Shop button must work.
- The Shop navigation should include a dropdown menu with these categories:
  - Pendants
  - Watches
  - Bracelets
  - Earrings
  - Rings
  - Engagement Rings
  - Sets
  - Chains
  - Misc
- Every category, including Misc, must have its own page.
- The main Shop page should show all products.
- Product data must come from the Shopify API.
- Product images should be pulled from Shopify when available.
- If no product image is available, show a blank product image placeholder.
- Product availability must be determined by Shopify inventory data.
- Product prices must come from Shopify.
- Product sorting should work, including:
  - Alphabetically, A-Z
  - Alphabetically, Z-A
  - Price, low to high
  - Price, high to low
- Filters should include:
  - Availability
  - Price
- Clicking a product should open a product detail page.

## Product Detail Pages

Each product page should connect to Shopify product data and include:

- Product image area
- Product title
- Price
- Sale price, if applicable
- Original price, if applicable
- Savings amount, if applicable
- Availability status
- Variant/product options from Shopify
- Quantity selector
- Add to cart button

If a product is sold out:

- Show `Sold Out`
- Disable the add-to-cart button

## Search

- The search button/icon must work.
- Users should be able to search Shopify products by:
  - Product name
  - Category
  - Description
  - Tags
- Search results should display in the same visual style as the Shop product grid.

## Cart

- The cart button/icon must work.
- Cart functionality should connect to Shopify cart/checkout APIs.
- Users should be able to:
  - Add products to cart
  - Update quantity
  - Remove products
  - Proceed to Shopify checkout
- Shopify should handle checkout, payment, taxes, shipping, delivery, and order processing.

## Customer Login

- The account/login button must work.
- Login should connect to Shopify customer accounts.
- Customers should be able to log in through Shopify’s customer account system.

## Custom Jewelry Page

- The Custom button must link to a custom jewelry inquiry page.
- The page should use the same clean, minimalist luxury jewelry styling.
- Do not use any screenshot photos.
- Include the title:
  - `Custom Jewelry Inquiry`
- Include this text:
  - `Enter your idea and budget inside of the comment box below.`
  - `Custom orders start at $2,000.`
- Include a contact form with:
  - Name
  - Email
  - Phone Number
  - Message
  - Send button
- Form submissions should either:
  - Send to the store email, or
  - Save as a Shopify/customer inquiry record, depending on the chosen implementation.

## Portfolio Page

- The Portfolio button must link to a portfolio page.
- Leave the portfolio page empty for now.
- Include only the shared site header/navigation and a clear blank content area.
- Add a placeholder label such as: `Portfolio content placeholder`.

## Shopify API Requirements

The storefront should act as the front-end experience while Shopify handles the backend.

Shopify should handle:

- Product data
- Product variants/options
- Product availability
- Inventory
- Prices
- Cart
- Customer login
- Checkout
- Payment
- Shipping
- Delivery
- Taxes
- Order management

## Important Media Rule

Do not use the screenshot images or photos in the final site.

Only use the screenshots to understand:

- Layout
- Navigation structure
- Typography direction
- Spacing
- Product grid style
- Form style
- Overall black-and-white luxury look

All photo areas should remain blank placeholders until the owner adds the final media.
