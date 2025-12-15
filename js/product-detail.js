// Product detail page script
(async function(){
  const path = window.location.pathname; // /kapoorfoodindia_wesbite/products/<slug>/ or /products/<slug>/
  const parts = path.split('/').filter(Boolean);
  // slug assumed last non-empty segment not equal to 'products'
  const slugIndex = parts.lastIndexOf('products');
  const slug = slugIndex >=0 ? parts[slugIndex+1] : null;
  if(!slug){return;}
  const dataPath = slugIndex >=0 ? Array(parts.length - slugIndex).fill('..').join('/') + '/data/products.json' : 'data/products.json';
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
  const imageSrc = (product.images && product.images.length ? `/${product.images[0]}` : '');
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
