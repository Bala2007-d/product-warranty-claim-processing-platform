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
  const [loading, setLoading] = useState(false);

  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

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
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (auth && token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API}${path}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.detail || data.message || `Request failed (${response.status})`
      );
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
    setLoading(true);

    try {
      const data = await request(
        "/login",
        {
          method: "POST",
          body: JSON.stringify(login),
        },
        false
      );

      if (!data.access_token) {
        throw new Error(
          "Login API access token return pannala. Backend user_api.py check pannu."
        );
      }

      // Backend login response must include user details.
      let loggedInUser = data.user;

      // Supports APIs that return user fields directly.
      if (!loggedInUser && data.email) {
        loggedInUser = data;
      }

      if (!loggedInUser || !loggedInUser.role) {
        throw new Error(
          "Login token received, but user/role missing. Backend login API-la user details return pannanum."
        );
      }

      if (
        loginMode === "admin" &&
        loggedInUser.role !== "Admin"
      ) {
        throw new Error("This account does not have Admin access.");
      }

      if (
        loginMode === "customer" &&
        loggedInUser.role === "Admin"
      ) {
        throw new Error("Admin account-ku Admin login select pannu.");
      }

      setToken(data.access_token);
      setUser(loggedInUser);
      setPage("dashboard");
      setMessage("Login successful");
    } catch (error) {
      setMessage(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await request(
        "/register",
        {
          method: "POST",
          body: JSON.stringify(register),
        },
        false
      );

      setMessage("Registration successful. Please login.");
      setPage("login");
      setLoginMode("customer");
      setLogin({
        email: register.email,
        password: "",
      });
      setRegister({
        full_name: "",
        email: "",
        password: "",
        phone: "",
      });
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
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

    try {
      await request(`/claims/${id}`, {
        method: "DELETE",
      });

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
    setLogin({ email: "", password: "" });
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

                  {message && <p className="message" role="alert">{message}</p>}

                  <form className="auth-form" onSubmit={handleRegister}>
                    <label>Full name</label>
                    <input
                      required
                      value={register.full_name}
                      onChange={(e) =>
                        setRegister({ ...register, full_name: e.target.value })
                      }
                    />

                    <label>Email address</label>
                    <input
                      required
                      type="email"
                      value={register.email}
                      onChange={(e) =>
                        setRegister({ ...register, email: e.target.value })
                      }
                    />

                    <label>Password</label>
                    <input
                      required
                      type="password"
                      value={register.password}
                      onChange={(e) =>
                        setRegister({ ...register, password: e.target.value })
                      }
                    />

                    <label>Phone (optional)</label>
                    <input
                      value={register.phone}
                      onChange={(e) =>
                        setRegister({ ...register, phone: e.target.value })
                      }
                    />

                    <button className="primary-button" disabled={loading}>
                      {loading ? "Creating..." : "Create account →"}
                    </button>
                  </form>

                  <p className="auth-switch">
                    Already have an account?{" "}
                    <button
                      type="button"
                      className="text-button"
                      onClick={() => {
                        setPage("login");
                        setMessage("");
                      }}
                    >
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
                      {loginMode === "admin"
                        ? "Administrator sign in"
                        : "Sign in to your account"}
                    </h2>
                    <p>Enter your details to continue to your workspace.</p>
                  </div>

                  <div className="login-mode-switch">
                    <button
                      type="button"
                      className={loginMode === "customer" ? "selected" : ""}
                      onClick={() => {
                        setLoginMode("customer");
                        setMessage("");
                      }}
                    >
                      Customer
                    </button>

                    <button
                      type="button"
                      className={loginMode === "admin" ? "selected" : ""}
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
                    <label>Email address</label>
                    <input
                      required
                      type="email"
                      autoComplete="email"
                      value={login.email}
                      onChange={(e) =>
                        setLogin({ ...login, email: e.target.value })
                      }
                      placeholder="you@example.com"
                    />

                    <label>Password</label>
                    <input
                      required
                      type="password"
                      autoComplete="current-password"
                      value={login.password}
                      onChange={(e) =>
                        setLogin({ ...login, password: e.target.value })
                      }
                      placeholder="Enter your password"
                    />

                    <button
                      className="primary-button"
                      type="submit"
                      disabled={loading}
                    >
                      {loading
                        ? "Signing in..."
                        : loginMode === "admin"
                        ? "Open admin console →"
                        : "Sign in →"}
                    </button>
                  </form>

                  {loginMode === "customer" && (
                    <p className="auth-switch">
                      New user?{" "}
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => {
                          setPage("register");
                          setMessage("");
                        }}
                      >
                        Create an account
                      </button>
                    </p>
                  )}
                </>
              )}

              <p className="auth-legal">
                Product Warranty Claim Processing Platform
              </p>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={`workspace ${isAdmin ? "admin-workspace" : "customer-workspace"}`}>
      <aside className="sidebar">
        <a
          className="workspace-brand"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setPage("dashboard");
            setMessage("");
          }}
        >
          Product Warranty
        </a>

        <div className="sidebar-section-label">
          {isAdmin ? "ADMINISTRATION" : "WORKSPACE"}
        </div>

        <nav className="workspace-nav">
          <button onClick={() => setPage("dashboard")}>Overview</button>

          <button
            onClick={() => {
              setPage("products");
              loadProducts();
            }}
          >
            {isAdmin ? "All products" : "My products"}
          </button>

          {!isAdmin && (
            <button onClick={() => setPage("addProduct")}>Add a product</button>
          )}

          <button
            onClick={() => {
              setPage("claims");
              loadClaims();
            }}
          >
            {isAdmin ? "Claim reviews" : "My claims"}
          </button>

          {!isAdmin && (
            <button onClick={() => setPage("addClaim")}>Submit a claim</button>
          )}
        </nav>

        <div className="profile-card">
          <strong>{user.full_name || user.email}</strong>
          <span>{isAdmin ? "Administrator" : "Customer"}</span>
        </div>
      </aside>

      <main className="main-content">
        <header className="workspace-topbar">
          <div>
            <span>{isAdmin ? "ADMIN CONSOLE" : "YOUR ACCOUNT"}</span>
            <p>{isAdmin ? "Admin dashboard" : "Customer dashboard"}</p>
          </div>
          <button className="logout-button" onClick={logout}>Logout</button>
        </header>

        <div className="page-content">
          {message && <p className="message" role="status">{message}</p>}

          {page === "dashboard" && (
            <section className="page-section">
              <h1>
                {isAdmin
                  ? "Admin dashboard"
                  : `Welcome, ${(user.full_name || "Customer").split(" ")[0]}`}
              </h1>

              <div className="stats">
                <div className="stat">
                  <strong>{products.length}</strong>
                  <p>{isAdmin ? "Registered products" : "My products"}</p>
                </div>
                <div className="stat">
                  <strong>{claims.length}</strong>
                  <p>{isAdmin ? "Total claims" : "Warranty claims"}</p>
                </div>
                {isAdmin && (
                  <div className="stat">
                    <strong>
                      {claims.filter((item) => item.status === "Pending").length}
                    </strong>
                    <p>Awaiting review</p>
                  </div>
                )}
              </div>
            </section>
          )}

          {page === "products" && (
            <section className="page-section">
              <h1>{isAdmin ? "All products" : "My products"}</h1>

              {products.length === 0 ? (
                <p>No products found.</p>
              ) : (
                <div className="list">
                  {products.map((item) => (
                    <article className="item" key={item.product_id}>
                      <h3>{item.product_name}</h3>
                      <p>Brand: {item.brand}</p>
                      <p>Model: {item.model || "—"}</p>
                      <p>Serial number: {item.serial_number || "—"}</p>
                      <p>Purchase date: {item.purchase_date || "—"}</p>
                      <p>Warranty: {item.warranty_period} months</p>
                      <p>Warranty ends: {item.warranty_end_date || "—"}</p>
                      {isAdmin && <p>Customer: {item.customer_email || "—"}</p>}
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {page === "addProduct" && (
            <section className="page-section form-page">
              <h1>Add a product</h1>

              <form onSubmit={handleAddProduct}>
                <label>Product name</label>
                <input
                  required
                  value={product.product_name}
                  onChange={(e) =>
                    setProduct({ ...product, product_name: e.target.value })
                  }
                />

                <label>Brand</label>
                <input
                  required
                  value={product.brand}
                  onChange={(e) =>
                    setProduct({ ...product, brand: e.target.value })
                  }
                />

                <label>Model</label>
                <input
                  value={product.model}
                  onChange={(e) =>
                    setProduct({ ...product, model: e.target.value })
                  }
                />

                <label>Serial number</label>
                <input
                  required
                  value={product.serial_number}
                  onChange={(e) =>
                    setProduct({ ...product, serial_number: e.target.value })
                  }
                />

                <label>Purchase date</label>
                <input
                  type="date"
                  value={product.purchase_date}
                  onChange={(e) =>
                    setProduct({ ...product, purchase_date: e.target.value })
                  }
                />

                <label>Warranty period (months)</label>
                <input
                  required
                  type="number"
                  min="1"
                  value={product.warranty_period}
                  onChange={(e) =>
                    setProduct({ ...product, warranty_period: e.target.value })
                  }
                />

                <button className="primary-button">Save product</button>
              </form>
            </section>
          )}

          {page === "claims" && (
            <section className="page-section">
              <h1>{isAdmin ? "Claim reviews" : "My claims"}</h1>

              {claims.length === 0 ? (
                <p>No claims found.</p>
              ) : (
                <div className="list">
                  {claims.map((item) => (
                    <article className="item" key={item.id}>
                      <h3>Claim #{item.id}: {item.product_name}</h3>
                      <p>Customer: {item.customer_name}</p>
                      <p>Serial number: {item.serial_number}</p>
                      <p>Issue: {item.issue}</p>
                      <p>Status: {item.status}</p>

                      {isAdmin && (
                        <label>
                          Update status
                          <select
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

                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDeleteClaim(item.id)}
                      >
                        Delete claim
                      </button>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {page === "addClaim" && (
            <section className="page-section form-page">
              <h1>Submit a claim</h1>

              <form onSubmit={handleAddClaim}>
                <label>Customer name</label>
                <input
                  required
                  value={claim.customer_name}
                  onChange={(e) =>
                    setClaim({ ...claim, customer_name: e.target.value })
                  }
                />

                <label>Product name</label>
                <input
                  required
                  value={claim.product_name}
                  onChange={(e) =>
                    setClaim({ ...claim, product_name: e.target.value })
                  }
                />

                <label>Serial number</label>
                <input
                  required
                  value={claim.serial_number}
                  onChange={(e) =>
                    setClaim({ ...claim, serial_number: e.target.value })
                  }
                />

                <label>Issue description</label>
                <textarea
                  required
                  value={claim.issue}
                  onChange={(e) =>
                    setClaim({ ...claim, issue: e.target.value })
                  }
                />

                <button className="primary-button">Submit claim</button>
              </form>
            </section>
          )}
        </div>

        <footer className="workspace-footer">
          Product Warranty Claim Processing Platform
        </footer>
      </main>
    </div>
  );
}