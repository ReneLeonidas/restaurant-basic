// assets/js/dashboard.js
async function loadDashboard() {
    try {
        const result = await pb.collection('sales').getList(1, 10, {
            sort: '-created',
            expand: 'menu_id'
        });
        const sales = result.items;
        renderRecentSales(sales);
        calculateTotals(sales);
    } catch (error) {
        document.getElementById('recentSales').innerHTML = `<p class="text-red-500">Error: ${error.message}</p>`;
    }
}

function renderRecentSales(sales) {
    const container = document.getElementById('recentSales');
    if (!sales.length) {
        container.innerHTML = '<p class="text-center text-muted">Aún no hay ventas</p>';
        return;
    }
    let html = '';
    sales.forEach(sale => {
        const menuName = sale.expand?.menu_id?.nombre || 'Desconocido';
        const tipoLabel = { breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena' }[sale.tipo_comida] || sale.tipo_comida;
        const fecha = new Date(sale.fecha).toLocaleString();
        html += `
      <div class="flex justify-between items-center bg-white/60 p-3 rounded-xl shadow-sm border border-gray-100">
        <div>
          <span class="font-semibold">${menuName}</span>
          <span class="text-sm text-muted ml-2">x${sale.cantidad}</span>
          <span class="text-xs text-muted ml-2">${fecha}</span>
          <span class="text-xs bg-yellow-200 px-2 py-0.5 rounded-full ml-1">${tipoLabel}</span>
        </div>
        <span class="font-bold text-pink-600">S/ ${(sale.total || 0).toFixed(2)}</span>
      </div>
    `;
    });
    container.innerHTML = html;
}

function calculateTotals(sales) {
    let total = 0, breakfast = 0, lunch = 0, dinner = 0;
    sales.forEach(s => {
        const val = s.total || 0;
        total += val;
        if (s.tipo_comida === 'breakfast') breakfast += val;
        else if (s.tipo_comida === 'lunch') lunch += val;
        else if (s.tipo_comida === 'dinner') dinner += val;
    });
    document.getElementById('totalRevenue').textContent = `S/ ${total.toFixed(2)}`;
    document.getElementById('breakfastRevenue').textContent = `S/ ${breakfast.toFixed(2)}`;
    document.getElementById('lunchRevenue').textContent = `S/ ${lunch.toFixed(2)}`;
    document.getElementById('dinnerRevenue').textContent = `S/ ${dinner.toFixed(2)}`;
}