import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadCart } from "../features/store.js";

function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: price?.currency || "INR",
    maximumFractionDigits: 0,
  }).format(price?.amount || 0);
}

export function CartPage() {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.catalog);
  useEffect(() => {
    dispatch(loadCart());
  }, [dispatch]);
  const items = cart?.products?.filter((item) => item.product) || [];
  const total = items.reduce(
    (sum, item) => sum + (item.product.price?.amount || 0) * item.quantity,
    0,
  );
  const currency = items[0]?.product.price?.currency || "INR";

  return (
    <main className="interior-page cart-page">
      <Link className="back-link" to="/shop">
        <ArrowLeft size={16} /> Back to the shop
      </Link>
      <div className="interior-heading">
        <div>
          <p className="eyebrow">
            YOUR EDIT / {items.length.toString().padStart(2, "0")} ITEMS
          </p>
          <h1>
            Shopping <em>bag.</em>
          </h1>
        </div>
        <ShoppingBag size={28} strokeWidth={1.3} />
      </div>
      {error && (
        <p className="inline-error" role="alert">
          {error}
        </p>
      )}
      {loading && !cart ? (
        <div className="loading-state">Opening your bag...</div>
      ) : items.length ? (
        <div className="cart-layout">
          <div className="cart-items">
            {items.map((item, index) => (
              <article
                className="cart-item"
                key={`${item.product._id}-${item.size}`}
              >
                {item.product.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.title} />
                ) : (
                  <div className="cart-image-fallback">SN / 0{index + 1}</div>
                )}
                <div className="cart-item-copy">
                  <p className="eyebrow">
                    {item.size} / QTY {item.quantity}
                  </p>
                  <h2>{item.product.title}</h2>
                  <p>{item.product.description}</p>
                </div>
                <strong>
                  {formatPrice({
                    ...item.product.price,
                    amount: item.product.price.amount * item.quantity,
                  })}
                </strong>
              </article>
            ))}
          </div>
          <aside className="order-summary">
            <p className="eyebrow">ORDER SUMMARY</p>
            <div>
              <span>Subtotal</span>
              <strong>
                {new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency,
                  maximumFractionDigits: 0,
                }).format(total)}
              </strong>
            </div>
            <div>
              <span>Delivery</span>
              <span>Calculated at checkout</span>
            </div>
            <button type="button" className="checkout-button" disabled>
              Checkout <ArrowRight size={17} />
            </button>
            <p className="checkout-note">Checkout is not available just yet.</p>
          </aside>
        </div>
      ) : (
        <div className="empty-state cart-empty">
          <span className="empty-mark">SN.</span>
          <h3>A little room for something good.</h3>
          <p>{error || "Your bag is empty for now."}</p>
          <Link className="primary-link" to="/shop">
            Find your next favourite <ArrowRight size={17} />
          </Link>
        </div>
      )}
    </main>
  );
}
