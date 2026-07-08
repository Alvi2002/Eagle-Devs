import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ফায়ারবেস অথেনটিকেশন স্টেট পরীক্ষা করা হচ্ছে
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // অথেনটিকেশন চেক করার সময় লোডার স্ক্রিন
    return (
      <div style={{
        height: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        background: "#f8f9fa"
      }}>
        <div className="spinner-border" style={{color: "#ff6b00", width: "3rem", height: "3rem"}} role="status">
          <span className="visually-hidden">যাচাই করা হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // যদি এডমিন লগইন করা না থাকে, তবে লগইন পেজে পাঠিয়ে দেবে
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // লগইন করা থাকলে ড্যাশবোর্ডের কন্টেন্ট দেখাবে
  return children;
}