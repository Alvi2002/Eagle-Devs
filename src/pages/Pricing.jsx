import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে লোড হওয়ার জন্য ৩টি প্যাকেজের ডিফল্ট তথ্য
const defaultPackages = [
  { id: "p1", name: "স্টার্টার", price: "৩৫০০", duration: "এককালীন পেমেন্ট", features: ["১ পেজের ল্যান্ডিং পেজ", "মোবাইল ফ্রেন্ডলি ডিজাইন", "১০ জিবি ফাস্ট হোস্টিং", "১ বছরের ডোমেইন ফ্রি", "পেমেন্ট গেটওয়ে", "এসইও অপ্টিমাইজেশন"] },
  { id: "p2", name: "উদ্যোক্তা", price: "৮০০০", duration: "এককালীন পেমেন্ট", features: ["৫ পেজের ডায়নামিক ওয়েবসাইট", "প্রিমিয়াম ডিজাইন", "আনলিমিটেড হোস্টিং স্পেস", "ফ্রি .com ডোমেইন", "সোশ্যাল মিডিয়া চ্যাট বট", "১ মাসের ফ্রি সাপোর্ট"] },
  { id: "p3", name: "বিজনেস প্রো", price: "১৮৫০০", duration: "এককালীন পেমেন্ট", features: ["ফুল ই-কমার্স সলিউশন", "ইনভেন্টরি ম্যানেজমেন্ট", "পেমেন্ট গেটওয়ে (বিকাশ/নগদ)", "অন-পেজ এসইও (SEO)", "ফেসবুক পিক্সেল সেটআপ", "৬ মাসের ফ্রি মেইনটেনেন্স"] }
];

export default function Pricing() {
  const { settings } = useSettings();
  const [dbPackages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে প্যাকেজ কালেকশন ফেচ করা হচ্ছে
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const snap = await getDocs(collection(db, "packages"));
        if (!snap.empty) {
          setPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("প্যাকেজ লোড করতে ত্রুটি হয়েছে", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const displayPackages = dbPackages.length > 0 ? dbPackages : defaultPackages;

  return (
    <div>
      {/* ১. হিরো ব্যানার সেকশন */}
      <section className="pricing-hero py-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)" }}>
        <div className="container py-5 text-center">
          <h1 className="fw-bold display-4 mb-3">আমাদের <span style={{ color: "var(--primary-color)" }}>প্রাইসিং</span> প্ল্যান</h1>
          <p className="lead opacity-75">আপনার ব্যবসার জন্য সঠিক প্যাকেজটি বেছে নিন। আমরা দিচ্ছি সাশ্রয়ী মূল্যে সেরা সার্ভিস।</p>
        </div>
      </section>

      {/* ২. প্রাইসিং কার্ড গ্রিড */}
      <section className="py-5 bg-light position-relative" style={{ marginTop: "-50px" }}>
        <div className="container">
          <div className="row g-4 justify-content-center align-items-stretch">
            {displayPackages.map((pkg, idx) => {
              // আপনার ডিজাইনের সাথে সামঞ্জস্য রাখতে ২য় বা মাঝখানের প্যাকেজটিকে হাইলাইট করা হবে
              const isFeatured = idx === 1;
              return (
                <div className="col-lg-4 col-md-6 mb-4" key={pkg.id}>
                  <div className={`card pricing-card h-100 border-0 shadow-lg text-center position-relative ${isFeatured ? "featured-card" : ""}`} 
                       style={{ borderRadius: "25px", transition: "0.4s", background: "#fff" }}>
                    
                    {/* মাঝখানের কার্ডে পপুলার ব্যাজ যুক্ত করা হচ্ছে */}
                    {isFeatured && <div className="popular-badge">BEST VALUE</div>}
                    
                    <div className="card-body p-4 p-md-5 d-flex flex-column">
                      <h3 className="fw-bold mb-3 text-dark">{pkg.name}</h3>
                      
                      {/* মূল্য বক্স */}
                      <div className="price-box mb-4 py-3" style={{ background: "rgba(255, 102, 0, 0.05)", borderRadius: "15px" }}>
                        <h2 className="display-4 fw-bold mb-0" style={{ color: "var(--primary-color)" }}>
                          <span className="fs-3">৳</span>{pkg.price}
                        </h2>
                        <p className="text-muted mb-0 small text-uppercase fw-bold">{pkg.duration}</p>
                      </div>

                      {/* ফিচার তালিকা */}
                      <ul className="list-unstyled mb-5 text-start mx-auto w-100" style={{ maxWidth: "280px", minHeight: "200px" }}>
                        {pkg.features && pkg.features.map((feat, i) => (
                          <li className="mb-3 d-flex align-items-start" key={i}>
                            <i className="fas fa-check-circle me-3 mt-1" style={{ color: "#28a745", fontSize: "18px" }}></i>
                            <span className="text-muted" style={{ fontSize: "15px", lineHeight: "1.5" }}>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {/* অর্ডার বাটন */}
                      <div className="mt-auto">
                        <a href={`https://wa.me/${settings.whatsapp || '8801854123433'}?text=Hello! আমি '${pkg.name}' প্যাকেজটি নিতে চাই।`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className={`btn btn-lg w-100 py-3 fw-bold ${isFeatured ? "text-white shadow orange-active-btn" : "shadow-sm blue-outline-btn"}`}
                        >
                          {isFeatured ? "এখনই কিনুন" : "অর্ডার করুন"}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ৩. কাস্টম প্যাকেজ ব্যানার */}
      <section className="py-5 bg-white">
        <div className="container py-4">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <div className="p-5 shadow-sm rounded-4 border">
                <h3 className="fw-bold mb-3">কাস্টম প্যাকেজ প্রয়োজন?</h3>
                <p className="text-muted mb-4">আপনার যদি বিশেষ কোনো চাহিদা থাকে তবে আমাদের সরাসরি কল দিন অথবা মেসেজ করুন।</p>
                <Link to="/contact" className="btn btn-outline-dark btn-lg px-5 rounded-pill fw-bold">যোগাযোগ করুন</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}