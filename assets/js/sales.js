// assets/js/sales.js
let menus = [];
let currentFilter = 'all';

async function initSales() {
  await loadMenus();
  await loadSales('all');
  setupEventListeners();
}

async function loadMenus() {
  try {
    const result = await pb.collection('menus').getList(1, 50, { sort: 'nombre' });
    menus = result.items;
    populateMenuSelect();
  } catch (error) {
    console.error(error);
  }
}

function populateMenuSelect() {
  const select = document.getElementById('menuSelect');
  select.innerHTML = '<option value="">Seleccionar</option>';
  menus.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id;
    opt.textContent = `${m.nombre} (${m.tipo}) - S/ ${Number(m.precio).toFixed(2)}`;
    select.appendChild(opt);
  });
  updatePriceAndTotal();
}

function updatePriceAndTotal() {
  const selectedId = document.getElementById('menuSelect').value;
  const qty = parseInt(document.getElementById('cantidad').value) || 0;
  const menu = menus.find(m => m.id === selectedId);
  const price = menu ? menu.precio : 0;
  document.getElementById('displayPrice').textContent = price ? `S/ ${price.toFixed(2)}` : '—';
  document.getElementById('displayTotal').textContent = `S/ ${(price * qty).toFixed(2)}`;
}

function setupEventListeners() {
  document.getElementById('menuSelect').addEventListener('change', updatePriceAndTotal);
  document.getElementById('cantidad').addEventListener('input', updatePriceAndTotal);

  document.getElementById('saleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const tipo_comida = document.getElementById('tipoComida').value;
    const menu_id = document.getElementById('menuSelect').value;
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    const notas = document.getElementById('notas').value.trim();

    if (!menu_id) { alert('Selecciona un menú'); return; }
    const menu = menus.find(m => m.id === menu_id);
    if (!menu) { alert('Menú no encontrado'); return; }

    const data = {
      tipo_comida,
      menu_id,
      cantidad,
      precio_unitario: menu.precio,
      total: cantidad * menu.precio,
      notas,
      fecha: new Date().toISOString()
    };

    try {
      await pb.collection('sales').create(data);
      alert('Venta registrada');
      document.getElementById('notas').value = '';
      document.getElementById('cantidad').value = 1;
      loadSales(currentFilter);
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.dataset.filter;
      loadSales(currentFilter);
    });
  });
}

async function loadSales(filter) {
  try {
    const filterParam = filter !== 'all' ? `tipo_comida="${filter}"` : '';
    const result = await pb.collection('sales').getList(1, 50, {
      sort: '-created',
      expand: 'menu_id',
      filter: filterParam
    });
    renderSales(result.items);
  } catch (error) {
    document.getElementById('salesList').innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

function renderSales(sales) {
  const container = document.getElementById('salesList');
  if (!sales.length) {
    container.innerHTML = '<p class="text-center text-muted">No hay ventas</p>';
    return;
  }
  let html = '';
  sales.forEach(s => {
    const menuName = s.expand?.menu_id?.nombre || 'Desconocido';
    const tipoLabel = { breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena' }[s.tipo_comida] || s.tipo_comida;
    const badge = `badge-${s.tipo_comida}`;
    const fecha = new Date(s.fecha).toLocaleString();
    html += `
      <div class="flex flex-wrap justify-between items-center bg-white/70 p-3 rounded-xl shadow-sm border border-gray-100">
        <div>
          <span class="font-semibold text-gray-800">${menuName}</span>
          <span class="text-sm text-muted ml-2">x${s.cantidad}</span>
          <span class="badge ${badge} ml-2">${tipoLabel}</span>
          <div class="text-xs text-muted mt-1">${fecha} ${s.notas ? '· ' + s.notas : ''}</div>
        </div>
        <span class="font-bold text-purple-600">S/ ${(s.total || 0).toFixed(2)}</span>
      </div>
    `;
  });
  container.innerHTML = html;
}