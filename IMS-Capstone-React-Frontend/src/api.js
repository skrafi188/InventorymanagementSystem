const MATERIAL_API_BASE =
  import.meta.env.VITE_MATERIAL_API_BASE || 'http://localhost:8088';

const VENDOR_API_BASE =
  import.meta.env.VITE_VENDOR_API_BASE || 'http://localhost:8087';

const INVENTORY_API_BASE =
  import.meta.env.VITE_INVENTORY_API_BASE || 'http://localhost:8082';

async function request(base, path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  const type = response.headers.get('content-type') || '';
  const data = type.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof data === 'string'
        ? data
        : data?.message || data?.error || `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}

export const api = {
  getVendors: () =>
    request(VENDOR_API_BASE, '/vendor/controller/getVendors'),

  getCategories: () =>
    request(MATERIAL_API_BASE, '/material/controller/getMaterialCategories'),

  getCategoryById: (categoryId) =>
    request(
      MATERIAL_API_BASE,
      `/material/controller/getMaterialCategoryById/${encodeURIComponent(categoryId)}`
    ),

  getTypes: () =>
    request(MATERIAL_API_BASE, '/type/controller/getTypeDetails'),

  getTypesByCategory: (categoryId) =>
    request(
      MATERIAL_API_BASE,
      `/type/controller/getTypeDetailsByCategoryId/${encodeURIComponent(categoryId)}`
    ),

  getUnits: () =>
    request(MATERIAL_API_BASE, '/unit/controller/getUnitDetails'),

  getUnitsByCategory: (categoryId) =>
    request(
      MATERIAL_API_BASE,
      `/unit/controller/getUnitsByCategoryId/${encodeURIComponent(categoryId)}`
    ),

  getPurchaseEntry: () =>
    request(INVENTORY_API_BASE, '/purchaseEntry'),

  getInventoryCategories: () =>
    request(INVENTORY_API_BASE, '/categories'),

  getInventoryVendors: () =>
    request(INVENTORY_API_BASE, '/vendors'),

  getUnitAndTypeList: (materialCategoryId) =>
    request(INVENTORY_API_BASE, '/getUnitAndTypeList', {
      method: 'POST',
      body: JSON.stringify({ materialCategoryId })
    }),

  addPurchase: (payload) =>
    request(INVENTORY_API_BASE, '/addPurchaseDetail', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  getPurchaseReport: (payload) =>
    request(INVENTORY_API_BASE, '/report/controller/getPurchaseDetails', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
};