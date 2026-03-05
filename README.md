# ⚡ Kip Smart Living Enterprise

Modern affiliate marketing website for kitchen gadgets and smart home devices.

## 🚀 Quick Setup (Do These Before Going Live)

### 1. Replace YOUR-USERNAME
Find and replace `YOUR-USERNAME` in these files:
- `sitemap.xml` → replace with your real GitHub username
- `robots.txt` → replace with your real GitHub username  
- All `.html` files → replace with your real GitHub username

Example: `YOUR-USERNAME.github.io/kip-smart-living` → `johnsmith.github.io/kip-smart-living`

### 2. Add Your Google Form
Open `contact.html` and find:
```
src="PASTE_YOUR_GOOGLE_FORM_EMBED_URL_HERE"
```
Replace with your Google Form embed URL.

### 3. Add Amazon Affiliate Links
Open `data/products.json` and replace every:
```
"link": "https://amazon.com"
```
With your real Amazon Associates tracking URL.

### 4. Update Daily
Only edit `data/products.json` to update products.
Only edit `data/chat.json` to update chat responses.

## 📁 File Structure
```
index.html          ← Homepage
kitchen.html        ← Kitchen gadgets page
smart-home.html     ← Smart home page
deals.html          ← Deals page
blog.html           ← Blog listing
post.html           ← Blog post template
about.html          ← About us
contact.html        ← Contact form (Google Forms)
privacy.html        ← Privacy policy (Amazon required)
terms.html          ← Terms of service
404.html            ← Custom error page
robots.txt          ← Google crawl instructions
sitemap.xml         ← Google index map
css/style.css       ← All styling
js/products.js      ← Product rendering engine
js/chat.js          ← Live chat engine
js/blog.js          ← Blog engine
data/products.json  ← ALL products (edit this daily)
data/chat.json      ← Chat responses (edit anytime)
```

## 📧 Contact
kipenterpise@gmail.com
