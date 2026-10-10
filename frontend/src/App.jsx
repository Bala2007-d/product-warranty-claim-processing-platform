
import { useEffect, useState } from "react";
import "./App.css";

const API = "/api";

export default function App() {
  const [page, setPage] = useState("login");
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
  }

  if (!user) {
    return (
      <div className="app">
        <div className="card">
          <h1>Product Warranty</h1>
          <p className="subtitle">Warranty Claim Processing Platform</p>

          {message && <p className="message">{message}</p>}

          {page === "register" ? (
            <>
              <h2>Create Account</h2>
              <form onSubmit={handleRegister}>
                <label>Full Name</label>
                <input
                  required
                  value={register.full_name}
                  onChange={(e) =>
                    setRegister({ ...register, full_name: e.target.value })
                  }
                  placeholder="Full name"
                />

                <label>Email</label>
                <input
                  required
                  type="email"
                  value={register.email}
                  onChange={(e) =>
                    setRegister({ ...register, email: e.target.value })
                  }
                  placeholder="Email"
                />

                <label>Password</label>
                <input
                  required
                  type="password"
                  value={register.password}
                  onChange={(e) =>
                    setRegister({ ...register, password: e.target.value })
                  }
                  placeholder="Password"
                />

                <label>Phone</label>
                <input
                  value={register.phone}
                  onChange={(e) =>
                    setRegister({ ...register, phone: e.target.value })
                  }
                  placeholder="Phone number"
                />

                <button type="submit">Register</button>
              </form>

              <p>
                Already registered?{" "}
                <button className="link" onClick={() => setPage("login")}>
                  Login
                </button>
              </p>
            </>
          ) : (
            <>
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                <label>Email</label>
                <input
                  required
                  type="email"
                  value={login.email}
                  onChange={(e) =>
                    setLogin({ ...login, email: e.target.value })
                  }
                  placeholder="Email"
                />

                <label>Password</label>
                <input
                  required
                  type="password"
                  value={login.password}
                  onChange={(e) =>
                    setLogin({ ...login, password: e.target.value })
                  }
                  placeholder="Password"
                />

                <button type="submit">Login</button>
              </form>

              <p>
                New user?{" "}
                <button className="link" onClick={() => setPage("register")}>
                  Register
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="card dashboard">
        <h1>Product Warranty</h1>
        <p className="subtitle">Warranty Claim Processing Platform</p>
        <p>Welcome, {user.full_name}</p>

        <nav>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button
            onClick={() => {
              setPage("products");
              loadProducts();
            }}
          >
            Products
          </button>
          <button onClick={() => setPage("addProduct")}>Add Product</button>
          <button
            onClick={() => {
              setPage("claims");
              loadClaims();
            }}
          >
            Claims
          </button>
          <button onClick={() => setPage("addClaim")}>Add Claim</button>
        </nav>

        {message && <p className="message">{message}</p>}

        {page === "dashboard" && (
          <section>
            <h2>Dashboard</h2>
            <div className="stats">
              <div className="stat">
                <h3>{products.length}</h3>
                <p>Products</p>
              </div>
              <div className="stat">
                <h3>{claims.length}</h3>
                <p>Warranty Claims</p>
              </div>
            </div>
            <p>Manage your registered products and warranty claims here.</p>
          </section>
        )}

        {page === "products" && (
          <section>
            <h2>My Products</h2>

            {products.length === 0 ? (
              <p>No products found. Add your first product.</p>
            ) : (
              <div className="list">
                {products.map((item) => (
                  <article className="item" key={item.product_id}>
                    <h3>{item.product_name}</h3>
                    <p><b>Brand:</b> {item.brand}</p>
                    <p><b>Model:</b> {item.model || "-"}</p>
                    <p><b>Serial Number:</b> {item.serial_number || "-"}</p>
                    <p><b>Purchase Date:</b> {item.purchase_date || "-"}</p>
                    <p>
                      <b>Warranty:</b> {item.warranty_period} months
                    </p>
                    <p>
                      <b>Warranty End:</b> {item.warranty_end_date || "-"}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "addProduct" && (
          <section>
            <h2>Add Product</h2>
            <form onSubmit={handleAddProduct}>
              <label>Product Name</label>
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

              <label>Serial Number</label>
              <input
                required
                value={product.serial_number}
                onChange={(e) =>
                  setProduct({ ...product, serial_number: e.target.value })
                }
              />

              <label>Purchase Date</label>
              <input
                type="date"
                value={product.purchase_date}
                onChange={(e) =>
                  setProduct({ ...product, purchase_date: e.target.value })
                }
              />

              <label>Warranty Period (months)</label>
              <input
                required
                type="number"
                min="1"
                value={product.warranty_period}
                onChange={(e) =>
                  setProduct({ ...product, warranty_period: e.target.value })
                }
              />

              <button type="submit">Add Product</button>
            </form>
          </section>
        )}

        {page === "claims" && (
          <section>
            <h2>Warranty Claims</h2>

            {claims.length === 0 ? (
              <p>No claims found.</p>
            ) : (
              <div className="list">
                {claims.map((item) => (
                  <article className="item" key={item.id}>
                    <h3>Claim #{item.id}</h3>
                    <p><b>Customer:</b> {item.customer_name}</p>
                    <p><b>Product:</b> {item.product_name}</p>
                    <p><b>Serial Number:</b> {item.serial_number}</p>
                    <p><b>Issue:</b> {item.issue}</p>
                    <p><b>Status:</b> {item.status}</p>

                    <label>Update Status</label>
                    <select
                      value={item.status}
                      onChange={(e) =>
                        handleUpdateStatus(item.id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                    <button
                      className="danger"
                      onClick={() => handleDeleteClaim(item.id)}
                    >
                      Delete Claim
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {page === "addClaim" && (
          <section>
            <h2>Submit Warranty Claim</h2>
            <form onSubmit={handleAddClaim}>
              <label>Customer Name</label>
              <input
                required
                value={claim.customer_name}
                onChange={(e) =>
                  setClaim({ ...claim, customer_name: e.target.value })
                }
              />

              <label>Product Name</label>
              <input
                required
                value={claim.product_name}
                onChange={(e) =>
                  setClaim({ ...claim, product_name: e.target.value })
                }
              />

              <label>Serial Number</label>
              <input
                required
                value={claim.serial_number}
                onChange={(e) =>
                  setClaim({ ...claim, serial_number: e.target.value })
                }
              />

              <label>Issue Description</label>
              <textarea
                required
                value={claim.issue}
                onChange={(e) =>
                  setClaim({ ...claim, issue: e.target.value })
                }
              />

              <button type="submit">Submit Claim</button>
            </form>
          </section>
        )}

        <button className="logout" onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
