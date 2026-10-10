
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api";

export default function App() {
  const [page, setPage] = useState("login");
  const [loginMode, setLoginMode] = useState("customer");
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [claims, setClaims] = useState([]);
  const [message, setMessage] = useState("");

  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [product, setProduct] = useState({
    product_name: "",
    brand: "",
    model: "",
    serial_number: "",
    purchase_date: "",
    warranty_period: 12,
  });

  const [claim, setClaim] = useState({
    customer_name: "",
    product_name: "",
    serial_number: "",
    issue: "",
  });

  async function request(path, options = {}, auth = true) {
    const headers = { "Content-Type": "application/json" };

    if (auth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Request failed");
    }

    return data;
  }

  async function loadProducts() {
    try {
      const data = await request("/products");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadClaims() {
    try {
      const data = await request("/claims");
      setClaims(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  useEffect(() => {
    if (user && token) {
      loadProducts();
      loadClaims();
    }
  }, [user, token]);

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    try {
      const data = await request(
        "/login",
        { method: "POST", body: JSON.stringify(login) },
        false
      );

      if (
        (loginMode === "admin" && data.user.role !== "Admin") ||
        (loginMode === "customer" && data.user.role === "Admin")
      ) {
        throw new Error(
          loginMode === "admin"
            ? "This account does not have administrator access."
            : "Please use the administrator sign-in."
        );
      }

      setToken(data.access_token);
      setUser(data.user);
      setPage("dashboard");
      setMessage("Login successful");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");

    try {
      await request(
        "/register",
        { method: "POST", body: JSON.stringify(register) },
        false
      );

      setMessage("Registration successful. Please login.");
      setPage("login");
      setLoginMode("customer");
      setRegister({
        full_name: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault();
    setMessage("");

    try {
      await request("/products", {
        method: "POST",
        body: JSON.stringify({
          ...product,
          purchase_date: product.purchase_date || null,
          warranty_period: Number(product.warranty_period),
        }),
      });

      setMessage("Product added successfully");
      setProduct({
        product_name: "",
        brand: "",
        model: "",
        serial_number: "",
        purchase_date: "",
        warranty_period: 12,
      });

      await loadProducts();
      setPage("products");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleAddClaim(e) {
    e.preventDefault();
    setMessage("");

    try {
      await request("/claims", {
        method: "POST",
        body: JSON.stringify(claim),
      });

      setMessage("Claim submitted successfully");
      setClaim({
        customer_name: "",
        product_name: "",
        serial_number: "",
        issue: "",
      });

      await loadClaims();
      setPage("claims");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleUpdateStatus(id, status) {
    setMessage("");

    try {
      await request(`/claims/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setMessage("Claim status updated");
      await loadClaims();
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleDeleteClaim(id) {
    if (!window.confirm("Delete this claim?")) return;

    setMessage("");

    try {
      await request(`/claims/${id}`, { method: "DELETE" });
      setMessage("Claim deleted successfully");
      await loadClaims();
    } catch (error) {
      setMessage(error.message);
    }
  }

  function logout() {
    setUser(null);
    setToken("");
    setProducts([]);
    setClaims([]);
    setMessage("");
    setPage("login");
    setLoginMode("customer");
  }

  const isAdmin = user?.role === "Admin";

  if (!user) {
    return (
      <div className={`auth-page ${loginMode === "admin" ? "auth-admin" : ""}`}>
        <div className="auth-shell">
          <section className="auth-panel">
            <div className="auth-form-wrap">
              <div className="auth-brand">
                <span className="brand-mark">P</span>
                <span>Product Warranty</span>
              </div>
              {page === "register" ? (
                <>
                  <div className="form-heading">
                    <span className="eyebrow">GET STARTED</span>
                    <h2>Create your account</h2>
                    <p>Register to manage your products and warranty claims.</p>
                  </div>
                  {message && <p className="message" role="status">{message}</p>}
                  <form className="auth-form" onSubmit={handleRegister}>
                    <label htmlFor="register-name">Full name</label>
                    <input
                      id="register-name"
                      autoComplete="name"
                      required
                      value={register.full_name}
                      onChange={(e) =>
                        setRegister({ ...register, full_name: e.target.value })
                      }
                      placeholder="Your full name"
                    />
                    <label htmlFor="register-email">Email address</label>
                    <input
                      id="register-email"
                      autoComplete="email"
                      required
                      type="email"
                      value={register.email}
                      onChange={(e) =>
                        setRegister({ ...register, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />
                    <label htmlFor="register-password">Password</label>
                    <input
                      id="register-password"
                      autoComplete="new-password"
                      required
                      type="password"
                      value={register.password}
                      onChange={(e) =>
                        setRegister({ ...register, password: e.target.value })
                      }
                      placeholder="Create a password"
                    />
                    <label htmlFor="register-phone">Phone <span className="optional-label">Optional</span></label>
                    <input
                      id="register-phone"
                      autoComplete="tel"
                      value={register.phone}
                      onChange={(e) =>
                        setRegister({ ...register, phone: e.target.value })
                      }
                      placeholder="Your phone number"
                    />
                    <button className="primary-button" type="submit">
                      Create account <span aria-hidden="true">→</span>
                    </button>
                  </form>
                  <p className="auth-switch">
                    Already have an account?{" "}
                    <button className="text-button" onClick={() => setPage("login")}>
                      Sign in
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <div className="form-heading">
                    <span className="eyebrow">
                      {loginMode === "admin" ? "ADMIN CONSOLE" : "WELCOME BACK"}
                    </span>
                    <h2>
                      {loginMode === "admin" ? "Administrator sign in" : "Sign in to your account"}
                    </h2>
                    <p>
                      {loginMode === "admin"
                        ? "Access claim reviews and platform management."
                        : "Enter your details to continue to your workspace."}
                    </p>
                  </div>
                  <div className="login-mode-switch" aria-label="Choose sign-in portal">
                    <button
                      className={loginMode === "customer" ? "selected" : ""}
                      type="button"
                      onClick={() => {
                        setLoginMode("customer");
                        setMessage("");
                      }}
                    >
                      Customer
                    </button>
                    <button
                      className={loginMode === "admin" ? "selected" : ""}
                      type="button"
                      onClick={() => {
                        setLoginMode("admin");
                        setMessage("");
                      }}
                    >
                      Admin
                    </button>
                  </div>
                  {message && <p className="message" role="alert">{message}</p>}
                  <form className="auth-form" onSubmit={handleLogin}>
                    <label htmlFor="login-email">Email address</label>
                    <input
                      id="login-email"
                      autoComplete="email"
                      required
                      type="email"
                      value={login.email}
                      onChange={(e) =>
                        setLogin({ ...login, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />
                    <label htmlFor="login-password">Password</label>
                    <input
                      id="login-password"
                      autoComplete="current-password"
                      required
                      type="password"
                      value={login.password}
                      onChange={(e) =>
                        setLogin({ ...login, password: e.target.value })
                      }
                      placeholder="Enter your password"
                    />
                    <button className="primary-button" type="submit">
                      {loginMode === "admin" ? "Open admin console" : "Sign in"}
                      <span aria-hidden="true">→</span>
                    </button>
                  </form>
                  {loginMode === "customer" ? (
                    <p className="auth-switch">
                      New user?{" "}
                      <button className="text-button" onClick={() => setPage("register")}>
                        Create an account
                      </button>
                    </p>
                  ) : (
                    <p className="secure-note"><span aria-hidden="true">♢</span> Secure access for authorized administrators</p>
                  )}
                </>
              )}
              <p className="auth-legal">Product Warranty Claim Processing Platform</p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={`workspace ${isAdmin ? "admin-workspace" : "customer-workspace"}`}>
      <aside className="sidebar">
        <a className="workspace-brand" href="#" onClick={(e) => { e.preventDefault(); setPage("dashboard"); }}>
          Product Warranty
        </a>
        <div className="sidebar-section-label">{isAdmin ? "ADMINISTRATION" : "WORKSPACE"}</div>
        <nav className="workspace-nav" aria-label="Main navigation">
          <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>
            <span className="nav-icon">⌂</span> Overview
          </button>
          <button
            className={page === "products" ? "active" : ""}
            onClick={() => {
              setPage("products");
              loadProducts();
            }}
          >
            <span className="nav-icon">▦</span> {isAdmin ? "All products" : "My products"}
          </button>
          {!isAdmin && (
            <button className={page === "addProduct" ? "active" : ""} onClick={() => setPage("addProduct")}>
              <span className="nav-icon">＋</span> Add a product
            </button>
          )}
          <button
            className={page === "claims" ? "active" : ""}
            onClick={() => {
              setPage("claims");
              loadClaims();
            }}
          >
            <span className="nav-icon">▤</span> {isAdmin ? "Claim reviews" : "My claims"}
          </button>
          {!isAdmin && (
            <button className={page === "addClaim" ? "active" : ""} onClick={() => setPage("addClaim")}>
              <span className="nav-icon">＋</span> Submit a claim
            </button>
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="help-card">
            <span className="help-spark">✦</span>
            <strong>{isAdmin ? "Admin workspace" : "Need a hand?"}</strong>
            <p>{isAdmin ? "Review and manage warranty activity." : "Your warranty details are always close by."}</p>
          </div>
          <div className="profile-card">
            <div className="avatar">{user.full_name?.charAt(0)?.toUpperCase() || "U"}</div>
            <div className="profile-copy">
              <strong>{user.full_name}</strong>
              <span>{isAdmin ? "Administrator" : "Customer"}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="workspace-topbar">
          <div>
            <span className="topbar-kicker">{isAdmin ? "ADMIN CONSOLE" : "YOUR ACCOUNT"}</span>
            <p>{isAdmin ? "Admin dashboard" : "Customer dashboard"}</p>
          </div>
          <div className="topbar-actions">
            <div className={`role-pill ${isAdmin ? "admin-role-pill" : ""}`}>
              <span /> {isAdmin ? "Admin portal" : "Customer portal"}
            </div>
            <button className="logout-button" onClick={logout}>Logout</button>
          </div>
        </header>
        <div className="page-content">
          {message && <p className="message workspace-message" role="status">{message}</p>}

        {page === "dashboard" && (
          <section className="page-section">
            <div className="page-title-row">
              <div>
                <h1>{isAdmin ? "Admin dashboard" : `Welcome, ${user.full_name.split(" ")[0]}`}</h1>
                <p>{isAdmin ? "View products and manage warranty claims." : "View your products and warranty claims."}</p>
              </div>
              {!isAdmin && (
                <button className="primary-button compact-button" onClick={() => setPage("addClaim")}>
                  Submit a claim <span aria-hidden="true">→</span>
                </button>
              )}
            </div>
            <div className="stats">
              <div className="stat stat-purple">
                <span className="stat-icon">▦</span>
                <div><strong>{products.length}</strong><p>{isAdmin ? "Registered products" : "My products"}</p></div>
              </div>
              <div className="stat stat-blue">
                <span className="stat-icon">▤</span>
                <div><strong>{claims.length}</strong><p>{isAdmin ? "Total claims" : "Warranty claims"}</p></div>
              </div>
              {isAdmin && (
                <div className="stat stat-amber">
                  <span className="stat-icon">◷</span>
                  <div><strong>{claims.filter((item) => item.status === "Pending").length}</strong><p>Awaiting review</p></div>
                </div>
              )}
            </div>
            {isAdmin ? (
              <div className="welcome-card">
                <div>
                  <h2>Claims to review</h2>
                  <p>Open the claims page to view submissions and update their status.</p>
                </div>
                <button className="secondary-button" onClick={() => { setPage("claims"); loadClaims(); }}>
                  Review claims <span aria-hidden="true">→</span>
                </button>
              </div>
            ) : (
              <div className="welcome-card customer-welcome">
                <div>
                  <h2>Manage your warranties</h2>
                  <p>Add a product or submit a warranty claim using the menu.</p>
                </div>
              </div>
            )}
          </section>
        )}

        {page === "products" && (
          <section className="page-section">
            <div className="page-title-row">
              <div>
                <h1>{isAdmin ? "All products" : "My products"}</h1>
                <p>{isAdmin ? "Products registered across the platform." : "Products registered to your account."}</p>
              </div>
            </div>

            {products.length === 0 ? (
              <div className="empty-state"><h2>No products found</h2><p>{isAdmin ? "There are no registered products." : "Add a product to get started."}</p></div>
            ) : (
              <div className="list">
                {products.map((item) => (
                  <article className="item" key={item.product_id}>
                    <div className="item-heading"><span className="item-icon">▦</span><div><h3>{item.product_name}</h3><span>{item.brand}{item.model ? ` · ${item.model}` : ""}</span></div></div>
                    <div className="item-details">
                      <p><b>Serial number</b><span>{item.serial_number || "—"}</span></p>
                      <p><b>Purchase date</b><span>{item.purchase_date || "—"}</span></p>
                      <p><b>Warranty period</b><span>{item.warranty_period} months</span></p>
                      <p><b>Warranty ends</b><span>{item.warranty_end_date || "—"}</span></p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "addProduct" && (
          <section className="page-section form-page">
            <div className="page-title-row">
              <div><h1>Add a product</h1><p>Enter the product and warranty details.</p></div>
            </div>
            <form onSubmit={handleAddProduct}>
              <label htmlFor="product-name">Product name</label>
              <input
                id="product-name"
                required
                value={product.product_name}
                onChange={(e) =>
                  setProduct({ ...product, product_name: e.target.value })
                }
              />

              <label htmlFor="product-brand">Brand</label>
              <input
                id="product-brand"
                required
                value={product.brand}
                onChange={(e) =>
                  setProduct({ ...product, brand: e.target.value })
                }
              />

              <label htmlFor="product-model">Model <span className="optional-label">Optional</span></label>
              <input
                id="product-model"
                value={product.model}
                onChange={(e) =>
                  setProduct({ ...product, model: e.target.value })
                }
              />

              <label htmlFor="product-serial">Serial number</label>
              <input
                id="product-serial"
                required
                value={product.serial_number}
                onChange={(e) =>
                  setProduct({ ...product, serial_number: e.target.value })
                }
              />

              <label htmlFor="product-purchase-date">Purchase date</label>
              <input
                id="product-purchase-date"
                type="date"
                value={product.purchase_date}
                onChange={(e) =>
                  setProduct({ ...product, purchase_date: e.target.value })
                }
              />

              <label htmlFor="product-warranty">Warranty period (months)</label>
              <input
                id="product-warranty"
                required
                type="number"
                min="1"
                value={product.warranty_period}
                onChange={(e) =>
                  setProduct({ ...product, warranty_period: e.target.value })
                }
              />

              <button className="primary-button form-submit" type="submit">Save product <span aria-hidden="true">→</span></button>
            </form>
          </section>
        )}

        {page === "claims" && (
          <section className="page-section">
            <div className="page-title-row">
              <div><h1>{isAdmin ? "Claim reviews" : "My claims"}</h1><p>{isAdmin ? "Review claims and update their status." : "View the status of your warranty claims."}</p></div>
            </div>

            {claims.length === 0 ? (
              <div className="empty-state"><h2>No claims found</h2><p>{isAdmin ? "There are no customer claims to review." : "Submit a claim to see it here."}</p></div>
            ) : (
              <div className="list">
                {claims.map((item) => (
                  <article className="item" key={item.id}>
                    <div className="claim-heading">
                      <div><span className="eyebrow">CLAIM #{item.id}</span><h3>{item.product_name}</h3></div>
                      <span className={`status-badge status-${item.status?.toLowerCase()}`}>{item.status}</span>
                    </div>
                    <div className="claim-details">
                      <p><b>Customer</b><span>{item.customer_name}</span></p>
                      <p><b>Serial number</b><span>{item.serial_number}</span></p>
                      <p className="claim-issue"><b>Issue</b><span>{item.issue}</span></p>
                    </div>
                    <div className="claim-actions">
                      {isAdmin && (
                        <label className="status-control">
                          <span>Update status</span>
                          <select
                            aria-label={`Update status for claim ${item.id}`}
                            value={item.status}
                            onChange={(e) =>
                              handleUpdateStatus(item.id, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </label>
                      )}
                      <button className="danger-button" onClick={() => handleDeleteClaim(item.id)}>
                        Delete claim
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "addClaim" && (
          <section className="page-section form-page">
            <div className="page-title-row">
              <div><h1>Submit a claim</h1><p>Enter your product information and describe the issue.</p></div>
            </div>
            <form onSubmit={handleAddClaim}>
              <label htmlFor="claim-customer">Customer name</label>
              <input
                id="claim-customer"
                required
                value={claim.customer_name}
                onChange={(e) =>
                  setClaim({ ...claim, customer_name: e.target.value })
                }
              />

              <label htmlFor="claim-product">Product name</label>
              <input
                id="claim-product"
                required
                value={claim.product_name}
                onChange={(e) =>
                  setClaim({ ...claim, product_name: e.target.value })
                }
              />

              <label htmlFor="claim-serial">Serial number</label>
              <input
                id="claim-serial"
                required
                value={claim.serial_number}
                onChange={(e) =>
                  setClaim({ ...claim, serial_number: e.target.value })
                }
              />

              <label htmlFor="claim-issue">Issue description</label>
              <textarea
                id="claim-issue"
                required
                value={claim.issue}
                onChange={(e) =>
                  setClaim({ ...claim, issue: e.target.value })
                }
              />

              <button className="primary-button form-submit" type="submit">Submit claim <span aria-hidden="true">→</span></button>
            </form>
          </section>
        )}
        </div>
        <footer className="workspace-footer">Product Warranty Claim Processing Platform</footer>
      </main>
    </div>
  );
}
