import { useEffect } from "react";
import { ArrowDownRight, ArrowRight, MoveUpRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { loadProducts } from "../features/store.js";
import { ProductCard } from "../components/ProductCard.jsx";

export function ShopPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.catalog);
  useEffect(() => {
    dispatch(loadProducts());
  }, [dispatch]);

  return (
    <main>
      <section className="shop-hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dot" /> THE EVERYDAY EDIT / 2026
          </p>
          <h1>
            Made to
            <br />
            <em>move</em> with you.
          </h1>
          <p className="hero-subtitle">
            Easy pieces. Thoughtful details. The kind of clothes that make
            getting dressed feel like second nature.
          </p>
          <a className="primary-link" href="#collection">
            Explore the collection <ArrowDownRight size={17} />
          </a>
          <div className="hero-note">
            <span>01 /</span> New season, same instinct.
          </div>
        </div>
        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1500&q=85"
            alt="Streetwear styling from the latest collection"
          />
          <div className="hero-photo-caption">
            <span>THE SHAPE OF NOW</span>
            <span>
              SN / 26 <MoveUpRight size={14} />
            </span>
          </div>
          <div className="hero-sticker">
            Everyday
            <br />
            uniforms
            <br />
            <strong>↗</strong>
          </div>
        </div>
        <div className="hero-bottom">
          <span>Independent style, made personal</span>
          <ArrowRight size={17} />
          <span>Scroll to explore</span>
        </div>
      </section>
      <section className="collection-section" id="collection">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE CURRENT LINEUP</p>
            <h2>
              Good things, <em>in rotation.</em>
            </h2>
          </div>
          <span className="collection-count">
            {products.length.toString().padStart(2, "0")} PIECES
          </span>
        </div>
        {error && (
          <p className="inline-error" role="alert">
            {error}
          </p>
        )}
        {loading && products.length === 0 ? (
          <div className="loading-state">Finding your next favourite...</div>
        ) : products.length ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-mark">SN.</span>
            <h3>The rail is taking shape.</h3>
            <p>New pieces will show up here as soon as they are published.</p>
          </div>
        )}
      </section>
      <section className="editorial-band">
        <div className="editorial-number">02</div>
        <p>
          Less noise.
          <br />
          <em>More you.</em>
        </p>
        <a href="#collection" aria-label="Back to collection">
          <ArrowRight size={22} />
        </a>
      </section>
    </main>
  );
}
