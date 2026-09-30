import { useEffect } from "react";
import { createBrowserRouter, Link, Navigate, Outlet, RouterProvider, useLocation } from "react-router-dom";
import { ArrowRight, CircleUserRound, LogOut, ShoppingBag } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { clearSession, saveSession } from "./features/auth/authSlice.js";
import { persistSession, request } from "./lib/api.js";
import { CartPage } from "./pages/CartPage.jsx";
import { AuthPage } from "./pages/AuthPage.jsx";
import { SellerPage } from "./pages/SellerPage.jsx";
import { ShopPage } from "./pages/ShopPage.jsx";

function Layout() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  function signOut() {
    localStorage.removeItem("snitch-session");
    dispatch(clearSession());
  }

  return (
    <div className="app-shell">
      <div className="announcement">Considered essentials, made for everyday motion <ArrowRight size={14} /></div>
      <header className="site-header">
        <Link className="wordmark" to="/shop" aria-label="Snitch home">snitch<span>.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link className={location.pathname === "/shop" ? "active" : ""} to="/shop">Shop</Link>
          {user?.role === "seller" && <Link className={location.pathname.startsWith("/seller") ? "active" : ""} to="/seller">Studio</Link>}
        </nav>
        <div className="header-actions">
          {user ? <span className="welcome-label">Hi, {user.name?.split(" ")[0]}</span> : <Link className="header-login" to="/login"><CircleUserRound size={17} /> Sign in</Link>}
          {user?.role !== "seller" && <Link className="icon-link" to="/cart" aria-label="View cart"><ShoppingBag size={19} /><span>Cart</span></Link>}
          {user && <button className="icon-link signout-button" onClick={signOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>}
        </div>
      </header>
      <Outlet />
      <footer className="site-footer"><Link className="wordmark footer-mark" to="/shop">snitch<span>.</span></Link><span>Wear what moves you.</span><span>© 2026 Snitch Studio</span></footer>
    </div>
  );
}

function ProtectedRoute({ seller = false }) {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (seller && user.role !== "seller") return <Navigate to="/shop" replace />;
  return <Outlet />;
}

function HomeRedirect() {
  const user = useSelector((state) => state.auth.user);
  return <Navigate to={user?.role === "seller" ? "/seller" : "/shop"} replace />;
}

const router = createBrowserRouter([
    {
      element: <Layout />,
      children: [
        { path: "/", element: <HomeRedirect /> },
        { path: "/shop", element: <ShopPage /> },
        { path: "/login", element: <AuthPage mode="login" /> },
        { path: "/register", element: <AuthPage mode="register" /> },
        { element: <ProtectedRoute />, children: [{ path: "/cart", element: <CartPage /> }] },
        { element: <ProtectedRoute seller />, children: [
          { path: "/seller", element: <SellerPage /> },
          { path: "/seller/create", element: <SellerPage create /> },
        ] },
        { path: "*", element: <HomeRedirect /> },
      ],
    },
  ]);

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    let active = true;
    const session = localStorage.getItem("snitch-session");
    if (!session) return undefined;
    try {
      dispatch(saveSession(JSON.parse(session)));
    } catch {
      localStorage.removeItem("snitch-session");
    }
    request("/auth/refresh", { auth: false, method: "POST" })
      .then((result) => { if (active) { persistSession(result.data); dispatch(saveSession(result.data)); } })
      .catch(() => { if (active) { localStorage.removeItem("snitch-session"); dispatch(clearSession()); } });
    return () => { active = false; };
  }, [dispatch]);

  return <RouterProvider router={router} />;
}