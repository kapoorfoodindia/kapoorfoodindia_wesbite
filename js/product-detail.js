// Product detail page script
(async function(){
  const path = window.location.pathname; // /kapoorfoodindia_wesbite/products/<slug>/ or /products/<slug>/
  const parts = path.split('/').filter(Boolean);
  // slug assumed last non-empty segment not equal to 'products'
  const slugIndex = parts.lastIndexOf('products');
  const slug = slugIndex >=0 ? parts[slugIndex+1] : null;
  if(!slug){return;}
  // On GitHub Pages, use absolute base /<repo>/data/products.json
  const isGhPages = window.location.hostname.endsWith('github.io');
  let dataPath;
  if (isGhPages) {
    const repo = parts[0] || '';
    dataPath = `/${repo}/data/products.json`;
  } else {
    dataPath = slugIndex >=0 ? Array(parts.length - slugIndex).fill('..').join('/') + '/data/products.json' : 'data/products.json';
  }
  try {
    const resp = await fetch(dataPath);
    const data = await resp.json();
    const product = data.products.find(p=>p.slug===slug);
    if(!product){
      document.getElementById('productDetail').innerHTML = '<p>Product not found.</p>';
      return;
    }
    renderProduct(product);
  } catch(e){
    console.error(e);
  }
})();

function renderProduct(product){
  const container = document.getElementById('productDetail');
  if(!container) return;
  // Build an image URL that works both locally and on GitHub Pages
  const isGhPages = window.location.hostname.endsWith('github.io');
  let base = '/';
  if (isGhPages) {
    const segs = window.location.pathname.split('/').filter(Boolean);
    const repo = segs[0] || '';
    base = `/${repo}/`;
  }
  const imageSrc = (product.images && product.images.length ? `${base}${product.images[0]}` : '');
  const imageHtml = imageSrc ? `<img src='${imageSrc}' alt='${product.name}' class='detail-image' loading='lazy' decoding='async' onerror="this.style.display='none'">` : '';
  container.innerHTML = `
    <h1 class='detail-title'>${product.name}</h1>
    <div class='detail-grid'>
      <div class='detail-media'>
        ${imageHtml}
      </div>
      <div class='detail-content'>
        <p class='detail-description'>${product.description}</p>
        ${product.features?`<ul class='detail-features'>${product.features.map(f=>`<li>${f}</li>`).join('')}</ul>`:''}
      </div>
    </div>
  `;
}
