import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ইউজার ইতিমধ্যে লগইন করা থাকলে সরাসরি ড্যাশবোর্ডে নিয়ে যাবে
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/admin/dashboard");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // লগইন হ্যান্ডলার সাবমিশন ফাংশন
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      // ইমেইল বা পাসওয়ার্ড ভুল হলে বাংলা মেসেজ দেখাবে
      setError("ভুল ইমেইল অথবা পাসওয়ার্ড! দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #111111 0%, #1a1a2a 100%)",
      padding: "20px"
    }}>
      <div className="card shadow-lg border-0" style={{
        maxWidth: "420px",
        width: "100%",
        borderRadius: "20px",
        overflow: "hidden",
        background: "#ffffff"
      }}>
        <div className="card-body p-4 p-md-5">
          {/* লোগো ও ব্র্যান্ডিং */}
          <div className="text-center mb-4">
            <div style={{
              background: "linear-gradient(135deg, #ff6b00, #ff8c00)",
              color: "white",
              width: "55px",
              height: "55px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "15px",
              fontWeight: "900",
              fontSize: "28px",
              margin: "0 auto 15px",
              boxShadow: "0 5px 15px rgba(255, 107, 0, 0.3)"
            }}>E</div>
            <h4 className="fw-bold mb-1" style={{ color: "#111" }}>Eagle Dev's</h4>
            <p className="text-muted small">কন্ট্রোল প্যানেল — সিকিউর লগইন</p>
          </div>

          {/* ইরর অ্যালার্ট */}
          {error && (
            <div className="alert alert-danger py-2 px-3 small border-0 mb-3" style={{ borderRadius: "10px" }}>
              <i className="fas fa-exclamation-circle me-2"></i> {error}
            </div>
          )}

          {/* লগইন ফর্ম */}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">এডমিন ইমেইল</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 text-muted" style={{ borderRadius: "10px 0 0 10px" }}>
                  <i className="fas fa-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control bg-light border-0 py-2"
                  style={{ borderRadius: "0 10px 10px 0", fontSize: "14px" }}
                  placeholder="admin@eagledevs.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-dark">এডমিন পাসওয়ার্ড</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0 text-muted" style={{ borderRadius: "10px 0 0 10px" }}>
                  <i className="fas fa-lock"></i>
                </span>
                <input
                  type="password"
                  className="form-control bg-light border-0 py-2"
                  style={{ borderRadius: "0 10px 10px 0", fontSize: "14px" }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-custom w-100 py-2.5 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
              style={{ borderRadius: "10px" }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  যাচাই করা হচ্ছে...
                </>
              ) : (
                <>
                  লগইন করুন <i className="fas fa-sign-in-alt"></i>
                </>
              )}
            </button>
          </form>

          {/* হোমপেজে ফেরার বাটন */}
          <div className="text-center mt-4">
            <Link to="/" className="text-muted small text-decoration-none">
              <i className="fas fa-arrow-left me-1"></i> প্রধান ওয়েবসাইটে ফিরে যান
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}