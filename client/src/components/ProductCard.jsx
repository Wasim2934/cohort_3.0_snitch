import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addCartItem } from "../features/store.js";

export function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [size, setSize] = useState(
    product.sizes?.find((item) => item.stock > 0)?.size || "",
  );
  const [added, setAdded] = useState(false);
  const availableSizes = product.sizes?.filter((item) => item.stock > 0) || [];
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: product.price?.currency || "INR",
    maximumFractionDigits: 0,
  }).format(product.price?.amount || 0);

  async function addToBag() {
    if (!size) return;
    if (!user) {
      navigate("/login", { state: { from: "/shop" } });
      return;
    }
    try {
      await dispatch(
        addCartItem({ productId: product._id, quantity: 1, size }),
      ).unwrap();
      setAdded(true);
      window.setTimeout(() => setAdded(false), 1800);
    } catch {
      /* ShopPage renders the request error. */
    }
  }

  return (
    <article className="product-card group">
      <div className="product-image-wrap">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="product-image"
            loading="lazy"
          />
        ) : (
          <div className="image-fallback">SN / 01</div>
        )}
        <span className="image-index">NEW / 0{availableSizes.length}</span>
      </div>
      <div className="product-info">
        <div className="product-title-row">
          <h3>{product.title}</h3>
          <span className="product-price">{price}</span>
        </div>
        <p className="product-description">{product.description}</p>
        <div className="product-buy-row">
          <label className="size-select-wrap">
            <span className="sr-only">Choose size</span>
            <select
              aria-label={`Choose size for ${product.title}`}
              value={size}
              onChange={(event) => setSize(event.target.value)}
            >
              {availableSizes.length ? (
                availableSizes.map((item) => (
                  <option key={item.size} value={item.size}>
                    {item.size}
                  </option>
                ))
              ) : (
                <option value="">Out of stock</option>
              )}
            </select>
          </label>
          <button className="add-button" onClick={addToBag} disabled={!size}>
            {added ? (
              "Added"
            ) : (
              <>
                <ShoppingBag size={16} /> Add to bag
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
