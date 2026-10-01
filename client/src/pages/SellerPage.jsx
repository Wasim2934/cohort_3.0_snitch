import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearMessages,
  createProduct,
  loadSellerProducts,
  setProductPublished,
} from "../features/store.js";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

function CreateProductForm() {
  const dispatch = useDispatch();
  const { error, notice } = useSelector((state) => state.catalog);
  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    currency: "INR",
    sizes: Object.fromEntries(sizes.map((size) => [size, 0])),
  });
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState("");

  async function submit(event) {
    event.preventDefault();
    dispatch(clearMessages());
    setFormError("");
    if (!sizes.some((size) => Number(form.sizes[size]) > 0)) {
      setFormError("Add stock for at least one size.");
      return;
    }
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    data.append(
      "price",
      JSON.stringify({ amount: Number(form.amount), currency: form.currency }),
    );
    data.append(
      "sizes",
      JSON.stringify(
        sizes
          .filter((size) => Number(form.sizes[size]) > 0)
          .map((size) => ({ size, stock: Number(form.sizes[size]) })),
      ),
    );
    files.forEach((file) => data.append("images", file));
    setBusy(true);
    try {
      await dispatch(createProduct(data)).unwrap();
      setForm({
        title: "",
        description: "",
        amount: "",
        currency: "INR",
        sizes: Object.fromEntries(sizes.map((size) => [size, 0])),
      });
      setFiles([]);
      event.target.reset();
    } catch {
      /* API errors are rendered from Redux state. */
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="create-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">NEW PIECE / 01</p>
          <h2>
            Put it out <em>there.</em>
          </h2>
        </div>
        <Link className="back-link" to="/seller">
          <ArrowLeft size={15} /> Inventory
        </Link>
      </div>
      {(formError || error) && (
        <p className="form-error" role="alert">
          {formError || error}
        </p>
      )}
      {notice && (
        <p className="form-success" role="status">
          <Check size={16} /> {notice}{" "}
          <Link to="/seller">
            Manage inventory <ArrowRight size={15} />
          </Link>
        </p>
      )}
      <form className="product-form" onSubmit={submit}>
        <div className="form-two-col">
          <label>
            Product name
            <input
              value={form.title}
              onChange={(event) =>
                setForm({ ...form, title: event.target.value })
              }
              placeholder="Everyday overshirt"
              required
              minLength="2"
              maxLength="100"
              pattern="[A-Za-z -]+"
              title="Use letters, spaces, and hyphens"
            />
          </label>
          <div className="price-field">
            <label>
              Price
              <input
                type="number"
                value={form.amount}
                onChange={(event) =>
                  setForm({ ...form, amount: event.target.value })
                }
                placeholder="1,250"
                required
                min="0.01"
                step="0.01"
              />
            </label>
            <label className="currency-label">
              Currency
              <select
                value={form.currency}
                onChange={(event) =>
                  setForm({ ...form, currency: event.target.value })
                }
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>
        </div>
        <label>
          Description
          <textarea
            value={form.description}
            onChange={(event) =>
              setForm({ ...form, description: event.target.value })
            }
            placeholder="What makes this piece worth reaching for?"
            required
            minLength="20"
            maxLength="500"
            rows="4"
          />
          <span className="field-hint">
            {form.description.length}/500 characters · 20 minimum
          </span>
        </label>
        <fieldset className="stock-fieldset">
          <legend>Available sizes & stock</legend>
          <div className="stock-grid">
            {sizes.map((size) => (
              <label key={size}>
                <span>{size}</span>
                <input
                  type="number"
                  aria-label={`${size} stock`}
                  min="0"
                  step="1"
                  value={form.sizes[size]}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      sizes: { ...form.sizes, [size]: event.target.value },
                    })
                  }
                />
              </label>
            ))}
          </div>
        </fieldset>
        <label className="upload-field">
          <Upload size={20} />
          <span>
            <strong>Product images</strong>
            <small>Up to 5 images, max 1 MB each</small>
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => {
              const chosen = Array.from(event.target.files || []);
              if (
                chosen.length > 5 ||
                chosen.some((file) => file.size > 1024 * 1024)
              ) {
                event.target.value = "";
                setFiles([]);
              } else setFiles(chosen);
            }}
          />
          <span className="upload-action">Choose files</span>
        </label>
        {files.length > 0 && (
          <div className="file-list">
            {files.map((file) => (
              <span key={file.name}>{file.name}</span>
            ))}
            <button
              type="button"
              onClick={() => setFiles([])}
              aria-label="Remove selected images"
            >
              <X size={15} />
            </button>
          </div>
        )}
        <button
          className="submit-button create-submit"
          type="submit"
          disabled={busy}
        >
          {busy ? "Saving your piece..." : "Save as draft"}
          <ArrowRight size={17} />
        </button>
      </form>
    </section>
  );
}

function Inventory() {
  const dispatch = useDispatch();
  const { sellerProducts, loading, error, notice } = useSelector(
    (state) => state.catalog,
  );
  useEffect(() => {
    dispatch(loadSellerProducts());
  }, [dispatch]);
  useEffect(() => () => dispatch(clearMessages()), [dispatch]);

  return (
    <section className="inventory-section">
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      {notice && (
        <p className="form-success" role="status">
          <Check size={16} /> {notice}
        </p>
      )}
      <div className="inventory-table-head">
        <span>PRODUCT</span>
        <span>PRICE</span>
        <span>STOCK</span>
        <span>STATUS</span>
        <span>MANAGE</span>
      </div>
      {loading && sellerProducts.length === 0 ? (
        <div className="loading-state">Loading your collection...</div>
      ) : sellerProducts.length ? (
        sellerProducts.map((product, index) => {
          const stock =
            product.sizes?.reduce((sum, item) => sum + item.stock, 0) || 0;
          return (
            <article className="inventory-row" key={product._id}>
              {product.images?.[0] ? (
                <img src={product.images[0]} alt="" />
              ) : (
                <div className="inventory-image-fallback">0{index + 1}</div>
              )}
              <div className="inventory-product">
                <strong>{product.title}</strong>
                <span>
                  {product.sizes?.map((item) => item.size).join(" / ") ||
                    "No sizes"}
                </span>
              </div>
              <span className="inventory-price">
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: product.price?.currency || "INR",
                  maximumFractionDigits: 0,
                }).format(product.price?.amount || 0)}
              </span>
              <span className="inventory-stock">
                {stock} <small>units</small>
              </span>
              <span
                className={`status-pill ${product.published ? "published" : "draft"}`}
              >
                <i />
                {product.published ? "Published" : "Draft"}
              </span>
              <button
                className={`manage-button ${product.published ? "unlist" : "publish"}`}
                onClick={() =>
                  dispatch(
                    setProductPublished({
                      id: product._id,
                      published: !product.published,
                    }),
                  )
                }
                aria-label={`${product.published ? "Unlist" : "Publish"} ${product.title}`}
                title={product.published ? "Unlist product" : "Publish product"}
              >
                {product.published ? (
                  <>
                    <EyeOff size={16} /> Unlist
                  </>
                ) : (
                  <>
                    <Eye size={16} /> Publish
                  </>
                )}
              </button>
            </article>
          );
        })
      ) : (
        <div className="empty-state inventory-empty">
          <span className="empty-mark">SN.</span>
          <h3>Your first piece starts here.</h3>
          <p>Create a product to build your collection.</p>
          <Link className="primary-link" to="/seller/create">
            Add a product <Plus size={16} />
          </Link>
        </div>
      )}
    </section>
  );
}

export function SellerPage({ create = false }) {
  const { sellerProducts } = useSelector((state) => state.catalog);
  const publishedCount = sellerProducts.filter(
    (product) => product.published,
  ).length;
  return (
    <main className="interior-page seller-page">
      <div className="seller-topline">
        <div>
          <p className="eyebrow">SELLER STUDIO / YOUR SPACE</p>
          <h1>
            Make good <em>things.</em>
          </h1>
        </div>
        <Link className="create-product-link" to="/seller/create">
          <Plus size={17} /> New product
        </Link>
      </div>
      <div className="seller-stats">
        <div>
          <span>ALL PIECES</span>
          <strong>{sellerProducts.length.toString().padStart(2, "0")}</strong>
        </div>
        <div>
          <span>ON THE SHOP FLOOR</span>
          <strong>{publishedCount.toString().padStart(2, "0")}</strong>
        </div>
        <div>
          <span>IN DRAFT</span>
          <strong>
            {(sellerProducts.length - publishedCount)
              .toString()
              .padStart(2, "0")}
          </strong>
        </div>
      </div>
      {create ? (
        <CreateProductForm />
      ) : (
        <>
          <div className="inventory-title">
            <div>
              <p className="eyebrow">YOUR COLLECTION</p>
              <h2>
                Product <em>lineup.</em>
              </h2>
            </div>
            <span>{sellerProducts.length} TOTAL</span>
          </div>
          <Inventory />
        </>
      )}
    </main>
  );
}
