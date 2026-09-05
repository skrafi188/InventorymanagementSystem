import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from './api.js';

const today = new Date().toISOString().slice(0, 10);
const yearStart = `${new Date().getFullYear()}-01-01`;

const emptyPurchase = {
  vendorId: '',
  materialCategoryId: '',
  materialTypeId: '',
  brandName: '',
  unitId: '',
  quantity: '',
  purchaseAmount: '',
  purchaseDate: today
};

function normalizeList(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.vendors)) return data.vendors;
  if (Array.isArray(data?.categories)) return data.categories;
  return [];
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [materialTypes, setMaterialTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [report, setReport] = useState([]);
  const [purchaseResult, setPurchaseResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [purchase, setPurchase] = useState(emptyPurchase);
  const [reportFilters, setReportFilters] = useState({
    vendorId: '',
    fromDate: yearStart,
    toDate: today
  });

  const loadMasterData = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [vendorData, categoryData, typeData, unitData] =
        await Promise.all([
          api.getVendors(),
          api.getCategories(),
          api.getTypes(),
          api.getUnits()
        ]);

      setVendors(normalizeList(vendorData));
      setCategories(normalizeList(categoryData));
      setMaterialTypes(normalizeList(typeData));
      setUnits(normalizeList(unitData));
    } catch (e) {
      setError(`Unable to load master data: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);

  const selectedCategory = useMemo(
    () => categories.find(c => c.categoryId === purchase.materialCategoryId),
    [categories, purchase.materialCategoryId]
  );

  const filteredTypes = useMemo(
    () =>
      materialTypes.filter(
        t =>
          !purchase.materialCategoryId ||
          t.categoryId === purchase.materialCategoryId
      ),
    [materialTypes, purchase.materialCategoryId]
  );

  const filteredUnits = useMemo(
    () =>
      units.filter(
        u =>
          !purchase.materialCategoryId ||
          u.categoryId === purchase.materialCategoryId
      ),
    [units, purchase.materialCategoryId]
  );

  function updatePurchase(field, value) {
    setPurchase(current => ({ ...current, [field]: value }));

    if (field === 'materialCategoryId') {
      setPurchase(current => ({
        ...current,
        materialCategoryId: value,
        materialTypeId: '',
        unitId: ''
      }));
    }
  }

  async function submitPurchase(event) {
    event.preventDefault();
    setError('');
    setNotice('');
    setPurchaseResult(null);

    const vendor = vendors.find(v => v.vendorId === purchase.vendorId);

    if (!vendor) return setError('Please select a vendor.');
    if (!purchase.materialCategoryId)
      return setError('Please select a material category.');
    if (!purchase.materialTypeId)
      return setError('Please select a material type.');
    if (!purchase.brandName.trim())
      return setError('Brand name is required.');
    if (!purchase.unitId) return setError('Please select a unit.');

    if (!purchase.quantity || Number(purchase.quantity) <= 0) {
      return setError('Quantity must be greater than zero.');
    }

    if (!purchase.purchaseAmount || Number(purchase.purchaseAmount) <= 0) {
      return setError('Purchase amount must be greater than zero.');
    }

    if (!purchase.purchaseDate)
      return setError('Purchase date is required.');

    setSaving(true);

    try {
      const payload = {
        vendorName: vendor.vendorName,
        materialCategoryId: purchase.materialCategoryId,
        materialTypeId: purchase.materialTypeId,
        brandName: purchase.brandName.trim(),
        unitId: purchase.unitId,
        quantity: Number(purchase.quantity),
        purchaseAmount: Number(purchase.purchaseAmount),
        purchaseDate: purchase.purchaseDate
      };

      console.log("PURCHASE PAYLOAD:", payload);

      const result = await api.addPurchase(payload);

      setPurchaseResult(result);
      setNotice(
        result?.message || 'Purchase details added successfully.'
      );
      setPurchase(emptyPurchase);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

  async function submitReport(event) {
    event.preventDefault();
    setError('');
    setNotice('');

    const vendor = vendors.find(
      v => v.vendorId === reportFilters.vendorId
    );

    if (!vendor)
      return setError('Please select a vendor for the report.');

    if (!reportFilters.fromDate || !reportFilters.toDate) {
      return setError('From date and to date are required.');
    }

    if (reportFilters.fromDate > reportFilters.toDate) {
      return setError('From date cannot be after to date.');
    }

    setReportLoading(true);

    try {
      const data = await api.getPurchaseReport({
        vendorName: vendor.vendorName,
        fromDate: reportFilters.fromDate,
        toDate: reportFilters.toDate
      });

      setReport(normalizeList(data));
    } catch (e) {
      setReport([]);
      setError(e.message);
    } finally {
      setReportLoading(false);
    }
  }

  const totals = useMemo(
    () => ({
      quantity: report.reduce(
        (sum, row) => sum + Number(row.quantity || 0),
        0
      ),
      amount: report.reduce(
        (sum, row) => sum + Number(row.purchaseAmount || 0),
        0
      )
    }),
    [report]
  );

  function clearMessages() {
    setError('');
    setNotice('');
  }

  function navigate(page) {
    clearMessages();
    setActivePage(page);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">IMS</div>

          <div>
            <strong>Inventory</strong>
            <span>Management System</span>
          </div>
        </div>

        <div className="side-label">MAIN MENU</div>

        <nav>
          <button
            className={
              activePage === 'dashboard'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => navigate('dashboard')}
          >
            <span>⌂</span> Dashboard
          </button>

          <button
            className={
              activePage === 'purchase'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => navigate('purchase')}
          >
            <span>＋</span> Purchase Entry
          </button>

          <button
            className={
              activePage === 'report'
                ? 'nav-item active'
                : 'nav-item'
            }
            onClick={() => navigate('report')}
          >
            <span>▤</span> Purchase Report
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="service-dot"></div>

          <div>
            <strong>Microservices</strong>
            <span>Connected UI</span>
          </div>
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">
              IMS /{' '}
              {activePage === 'dashboard'
                ? 'Dashboard'
                : activePage === 'purchase'
                ? 'Purchase Entry'
                : 'Purchase Report'}
            </div>

            <h1>
              {activePage === 'dashboard'
                ? 'Dashboard'
                : activePage === 'purchase'
                ? 'Purchase Entry'
                : 'Vendor-wise Purchase Report'}
            </h1>
          </div>

          <button
            className="refresh-button"
            onClick={loadMasterData}
            disabled={loading}
          >
            ↻ {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </header>

        {notice && (
          <div className="alert success">
            <span>✓</span>
            {notice}
          </div>
        )}

        {error && (
          <div className="alert error">
            <span>!</span>
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {activePage === 'dashboard' && (
          <Dashboard
            vendors={vendors}
            categories={categories}
            materialTypes={materialTypes}
            units={units}
            loading={loading}
            navigate={navigate}
          />
        )}

        {activePage === 'purchase' && (
          <PurchasePage
            vendors={vendors}
            categories={categories}
            filteredTypes={filteredTypes}
            filteredUnits={filteredUnits}
            selectedCategory={selectedCategory}
            purchase={purchase}
            saving={saving}
            updatePurchase={updatePurchase}
            submitPurchase={submitPurchase}
            purchaseResult={purchaseResult}
          />
        )}

        {activePage === 'report' && (
          <ReportPage
            vendors={vendors}
            categories={categories}
            materialTypes={materialTypes}
            units={units}
            filters={reportFilters}
            setFilters={setReportFilters}
            submit={submitReport}
            loading={reportLoading}
            report={report}
            totals={totals}
          />
        )}
      </section>
    </div>
  );
}

function Dashboard({
  vendors,
  categories,
  materialTypes,
  units,
  loading,
  navigate
}) {
  const cards = [
    {
      label: 'Vendors',
      value: vendors.length,
      icon: 'V',
      cls: 'blue'
    },
    {
      label: 'Material Categories',
      value: categories.length,
      icon: 'C',
      cls: 'purple'
    },
    {
      label: 'Material Types',
      value: materialTypes.length,
      icon: 'M',
      cls: 'orange'
    },
    {
      label: 'Units',
      value: units.length,
      icon: 'U',
      cls: 'green'
    }
  ];

  return (
    <>
      <section className="welcome">
        <div>
          <div className="eyebrow">GLORIA TEXTILES</div>

          <h2>Welcome to Inventory Management System</h2>

          <p>
            Manage material purchases and view vendor-wise purchase
            information from one place.
          </p>
        </div>

        <button
          className="primary"
          onClick={() => navigate('purchase')}
        >
          + New Purchase
        </button>
      </section>

      <section className="stats">
        {cards.map(card => (
          <article className="stat-card" key={card.label}>
            <div className={`stat-icon ${card.cls}`}>
              {card.icon}
            </div>

            <div>
              <span>{card.label}</span>

              <strong>
                {loading ? '—' : card.value}
              </strong>
            </div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">WORKFLOW</span>
              <h3>Purchase Management</h3>
            </div>
          </div>

          <div className="workflow">
            <div className="workflow-step">
              <b>1</b>

              <div>
                <strong>Select vendor</strong>
                <span>
                  Choose the supplier for the purchase.
                </span>
              </div>
            </div>

            <div className="workflow-step">
              <b>2</b>

              <div>
                <strong>Select material</strong>
                <span>
                  Choose category, material type and unit.
                </span>
              </div>
            </div>

            <div className="workflow-step">
              <b>3</b>

              <div>
                <strong>Enter purchase details</strong>
                <span>
                  Add brand, quantity, amount and date.
                </span>
              </div>
            </div>

            <div className="workflow-step">
              <b>4</b>

              <div>
                <strong>Save & report</strong>
                <span>
                  Save the purchase and review vendor reports.
                </span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel service-panel">
          <div className="panel-title">
            <div>
              <span className="eyebrow">BACKEND</span>
              <h3>Microservice Status</h3>
            </div>
          </div>

          <ServiceRow
            name="Material Service"
            port="8088"
            online={
              categories.length > 0 ||
              materialTypes.length > 0 ||
              units.length > 0
            }
          />

          <ServiceRow
            name="Vendor Service"
            port="8087"
            online={vendors.length > 0}
          />

          <ServiceRow
            name="Inventory Service"
            port="8082"
            online
          />
        </article>
      </section>
    </>
  );
}

function ServiceRow({ name, port, online }) {
  return (
    <div className="service-row">
      <div
        className={
          online ? 'status-dot online' : 'status-dot'
        }
      ></div>

      <div>
        <strong>{name}</strong>
        <span>localhost:{port}</span>
      </div>

      <em>
        {online ? 'Ready' : 'Check service'}
      </em>
    </div>
  );
}

function PurchasePage({
  vendors,
  categories,
  filteredTypes,
  filteredUnits,
  selectedCategory,
  purchase,
  saving,
  updatePurchase,
  submitPurchase,
  purchaseResult
}) {
  return (
    <div className="single-column">
      <section className="panel form-panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">TRANSACTION</span>

            <h3>Add Purchase Details</h3>

            <p>
              Enter the purchase information required by the
              Inventory Management System.
            </p>
          </div>
        </div>

        <form onSubmit={submitPurchase}>
          <div className="form-grid">
            <Field label="Vendor" required>
              <select
                value={purchase.vendorId}
                onChange={e =>
                  updatePurchase(
                    'vendorId',
                    e.target.value
                  )
                }
              >
                <option value="">Select vendor</option>

                {vendors.map(v => (
                  <option
                    key={v.vendorId}
                    value={v.vendorId}
                  >
                    {v.vendorName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Material Category" required>
              <select
                value={purchase.materialCategoryId}
                onChange={e =>
                  updatePurchase(
                    'materialCategoryId',
                    e.target.value
                  )
                }
              >
                <option value="">Select category</option>

                {categories.map(c => (
                  <option
                    key={c.categoryId}
                    value={c.categoryId}
                  >
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              label="Material Type"
              required
              hint={
                selectedCategory
                  ? `Category: ${selectedCategory.categoryName}`
                  : ''
              }
            >
              <select
                value={purchase.materialTypeId}
                onChange={e =>
                  updatePurchase(
                    'materialTypeId',
                    e.target.value
                  )
                }
                disabled={!purchase.materialCategoryId}
              >
                <option value="">
                  {purchase.materialCategoryId
                    ? 'Select material type'
                    : 'Select category first'}
                </option>

                {filteredTypes.map(t => (
                  <option
                    key={t.typeId}
                    value={t.typeId}
                  >
                    {t.typeName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Unit" required>
              <select
                value={purchase.unitId}
                onChange={e =>
                  updatePurchase(
                    'unitId',
                    e.target.value
                  )
                }
                disabled={!purchase.materialCategoryId}
              >
                <option value="">
                  {purchase.materialCategoryId
                    ? 'Select unit'
                    : 'Select category first'}
                </option>

                {filteredUnits.map(u => (
                  <option
                    key={u.unitId}
                    value={u.unitId}
                  >
                    {u.unitName}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Brand Name" required>
              <input
                value={purchase.brandName}
                onChange={e =>
                  updatePurchase(
                    'brandName',
                    e.target.value
                  )
                }
                placeholder="Enter brand name"
              />
            </Field>

            <Field label="Quantity" required>
              <input
                type="number"
                min="1"
                step="1"
                value={purchase.quantity}
                onChange={e =>
                  updatePurchase(
                    'quantity',
                    e.target.value
                  )
                }
                placeholder="Enter quantity"
              />
            </Field>

            <Field label="Purchase Amount" required>
              <div className="input-prefix">
                <span>₹</span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={purchase.purchaseAmount}
                  onChange={e =>
                    updatePurchase(
                      'purchaseAmount',
                      e.target.value
                    )
                  }
                  placeholder="0.00"
                />
              </div>
            </Field>

            <Field label="Purchase Date" required>
              <input
                type="date"
                value={purchase.purchaseDate}
                max={today}
                onChange={e =>
                  updatePurchase(
                    'purchaseDate',
                    e.target.value
                  )
                }
              />
            </Field>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary"
              disabled={saving}
            >
              {saving
                ? 'Saving Purchase...'
                : 'Save Purchase'}
            </button>
          </div>
        </form>

        {purchaseResult?.purchase && (
          <div className="result-card">
            <div className="result-check">✓</div>

            <div>
              <strong>
                Purchase #
                {purchaseResult.purchase.purchaseId} saved
              </strong>

              <span>
                {purchaseResult.message}
              </span>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  children
}) {
  return (
    <label className="field">
      <span>
        {label} {required && <b>*</b>}
      </span>

      {children}

      {hint && <small>{hint}</small>}
    </label>
  );
}

function ReportPage({
  vendors,
  categories,
  materialTypes,
  units,
  filters,
  setFilters,
  submit,
  loading,
  report,
  totals
}) {
  const selectedVendor = vendors.find(
    v => v.vendorId === filters.vendorId
  );

  return (
    <div className="single-column">
      <section className="panel">
        <div className="panel-title">
          <div>
            <span className="eyebrow">REPORTING</span>

            <h3>Vendor-wise Purchase Report</h3>

            <p>
              Filter purchase transactions by vendor and date
              range.
            </p>
          </div>
        </div>

        <form
          className="report-filters"
          onSubmit={submit}
        >
          <Field label="Vendor" required>
            <select
              value={filters.vendorId}
              onChange={e =>
                setFilters(f => ({
                  ...f,
                  vendorId: e.target.value
                }))
              }
            >
              <option value="">Select vendor</option>

              {vendors.map(v => (
                <option
                  key={v.vendorId}
                  value={v.vendorId}
                >
                  {v.vendorName}
                </option>
              ))}
            </select>
          </Field>

          <Field label="From Date" required>
            <input
              type="date"
              value={filters.fromDate}
              onChange={e =>
                setFilters(f => ({
                  ...f,
                  fromDate: e.target.value
                }))
              }
            />
          </Field>

          <Field label="To Date" required>
            <input
              type="date"
              value={filters.toDate}
              onChange={e =>
                setFilters(f => ({
                  ...f,
                  toDate: e.target.value
                }))
              }
            />
          </Field>

          <button
            className="primary report-button"
            disabled={loading}
          >
            {loading
              ? 'Generating...'
              : 'Generate Report'}
          </button>
        </form>
      </section>

      {selectedVendor && (
        <section className="panel vendor-info">
          <div className="panel-title">
            <div>
              <span className="eyebrow">
                VENDOR DETAILS
              </span>

              <h3>{selectedVendor.vendorName}</h3>
            </div>
          </div>

          <div className="vendor-details-grid">
            <div>
              <span>Contact Person</span>

              <strong>
                {selectedVendor.contactPerson || '—'}
              </strong>
            </div>

            <div>
              <span>Contact Number</span>

              <strong>
                {selectedVendor.contactNumber || '—'}
              </strong>
            </div>

            <div>
              <span>Address</span>

              <strong>
                {selectedVendor.vendorAddress || '—'}
              </strong>
            </div>
          </div>
        </section>
      )}

      <section className="stats report-stats">
        <article className="stat-card compact">
          <div className="stat-icon blue">#</div>

          <div>
            <span>Total Records</span>
            <strong>{report.length}</strong>
          </div>
        </article>

        <article className="stat-card compact">
          <div className="stat-icon purple">Q</div>

          <div>
            <span>Total Quantity</span>
            <strong>{totals.quantity}</strong>
          </div>
        </article>

        <article className="stat-card compact">
          <div className="stat-icon green">₹</div>

          <div>
            <span>Total Amount</span>

            <strong>
              ₹{totals.amount.toFixed(2)}
            </strong>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="panel-title inline">
          <div>
            <span className="eyebrow">RESULTS</span>
            <h3>Purchase Transactions</h3>
          </div>

          <span className="record-count">
            {report.length} records
          </span>
        </div>

        {report.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">▤</div>

            <strong>No report data</strong>

            <span>
              Select a vendor and date range, then generate
              the report.
            </span>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Material Type</th>
                  <th>Brand</th>
                  <th>Unit</th>
                  <th>Qty</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {report.map(row => {
                  /*
                   * Convert the IDs returned by the purchase
                   * report into their proper names using the
                   * master data already loaded from the
                   * Material Service.
                   */

                  const category = categories.find(
                    c =>
                      c.categoryId ===
                      row.materialCategoryId
                  );

                  const materialType =
                    materialTypes.find(
                      t =>
                        t.typeId ===
                        row.materialTypeId
                    );

                  const unit = units.find(
                    u =>
                      u.unitId === row.unitId
                  );

                  return (
                    <tr key={row.purchaseId}>
                      <td>
                        <strong>
                          #{row.purchaseId}
                        </strong>
                      </td>

                      <td>
                        {formatDate(
                          row.purchaseDate
                        )}
                      </td>

                      <td>
                        {row.vendorName || '—'}
                      </td>

                      <td>
                        {category?.categoryName ||
                          row.materialCategoryName ||
                          row.materialCategoryId ||
                          '—'}
                      </td>

                      <td>
                        {materialType?.typeName ||
                          row.materialTypeName ||
                          row.materialTypeId ||
                          '—'}
                      </td>

                      <td>
                        {row.brandName || '—'}
                      </td>

                      <td>
                        {unit?.unitName ||
                          row.materialUnitName ||
                          row.unitId ||
                          '—'}
                      </td>

                      <td>
                        {row.quantity ?? '—'}
                      </td>

                      <td>
                        ₹
                        {Number(
                          row.purchaseAmount || 0
                        ).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return '—';

  const text = String(value);

  if (/^\d{4}-\d{2}-\d{2}/.test(text)) {
    return text.slice(0, 10);
  }

  return text;
}