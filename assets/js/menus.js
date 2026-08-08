// assets/js/menus.js
async function initMenus() {
  await loadMenus();
  setupMenuEvents();
}

async function loadMenus() {
  try {
    const result = await pb.collection('menus').getList(1, 50, { sort: 'created' });
    renderMenuList(result.items);
  } catch (error) {
    document.getElementById('menuList').innerHTML = `<p class="text-red-500">${error.message}</p>`;
  }
}

function renderMenuList(menus) {
  const container = document.getElementById('menuList');
  if (!menus.length) {
    container.innerHTML = '<p class="text-center text-muted">No hay platos, ¡agrega uno!</p>';
    return;
  }
  let html = '';
  menus.forEach(m => {
    const badge = `badge-${m.tipo}`;
    const tipoLabel = { breakfast: 'Desayuno', lunch: 'Almuerzo', dinner: 'Cena' }[m.tipo] || m.tipo;
    html += `
      <div class="flex flex-wrap items-center justify-between bg-white/70 p-3 rounded-xl shadow-sm border border-gray-100">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="badge ${badge}">${tipoLabel}</span>
          <span class="font-semibold text-gray-800">${m.nombre}</span>
          <span class="text-sm text-muted">S/ ${Number(m.precio).toFixed(2)}</span>
        </div>
        <div class="flex gap-2 mt-2 md:mt-0">
          <button onclick="editMenu('${m.id}')" class="btn btn-warning btn-sm"><i class="fas fa-edit"></i></button>
          <button onclick="deleteMenu('${m.id}')" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>
        </div>
      </div>
    `;
  });
  container.innerHTML = html;
}

function setupMenuEvents() {
  const form = document.getElementById('menuForm');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const editId = document.getElementById('editId').value;
    const tipo = document.getElementById('tipo').value;
    const nombre = document.getElementById('nombre').value.trim();
    const precio = parseFloat(document.getElementById('precio').value);

    if (!nombre || isNaN(precio) || precio < 0) {
      alert('Datos inválidos');
      return;
    }

    const data = { tipo, nombre, precio };
    try {
      if (editId) {
        await pb.collection('menus').update(editId, data);
      } else {
        await pb.collection('menus').create(data);
      }
      resetMenuForm();
      loadMenus();
      alert(editId ? 'Actualizado' : 'Agregado');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });

  document.getElementById('cancelBtn').addEventListener('click', resetMenuForm);
}

window.editMenu = async function(id) {
  try {
    const record = await pb.collection('menus').getOne(id);
    document.getElementById('editId').value = record.id;
    document.getElementById('tipo').value = record.tipo;
    document.getElementById('nombre').value = record.nombre;
    document.getElementById('precio').value = record.precio;
    document.getElementById('submitBtn').innerHTML = '<i class="fas fa-sync-alt"></i> Actualizar';
    document.getElementById('cancelBtn').classList.remove('hidden');
  } catch (error) {
    alert('Error al cargar datos: ' + error.message);
  }
};

window.deleteMenu = async function(id) {
  if (!confirm('¿Eliminar este plato?')) return;
  try {
    await pb.collection('menus').delete(id);
    loadMenus();
  } catch (error) {
    alert('Error: ' + error.message);
  }
};

function resetMenuForm() {
  document.getElementById('editId').value = '';
  document.getElementById('tipo').value = 'breakfast';
  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('submitBtn').innerHTML = '<i class="fas fa-save"></i> Guardar';
  document.getElementById('cancelBtn').classList.add('hidden');
}