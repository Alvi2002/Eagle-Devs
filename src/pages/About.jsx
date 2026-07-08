import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে দেখানোর জন্য ডিফল্ট প্যাকেজসমূহ
const defaultPackages = [
  { id: "p1", name: "স্টার্টার", price: "৩৫০০", duration: "এককালীন পেমেন্ট", features: ["১ পেজের ল্যান্ডিং পেজ", "মোবাইল ফ্রেন্ডলি ডিজাইন", "১০ জিবি ফাস্ট হোস্টিং", "১ বছরের ডোমেইন ফ্রি", "পেমেন্ট গেটওয়ে", "এসইও অপ্টিমাইজেশন"] },
  { id: "p2", name: "উদ্যোক্তা", price: "৮০০০", duration: "এককালীন পেমেন্ট", features: ["৫ পেজের ডায়নামিক ওয়েবসাইট", "প্রিমিয়াম ডিজাইন", "আনলিমিটেড হোস্টিং স্পেস", "ফ্রি .com ডোমেইন", "সোশ্যাল মিডিয়া চ্যাট বট", "১ মাসের ফ্রি সাপোর্ট"] },
  { id: "p3", name: "বিজনেস প্রো", price: "১৮৫০০", duration: "এককালীন পেমেন্ট", features: ["ফুল ই-কমার্স সলিউশন", "ইনভেন্টরি ম্যানেজমেন্ট", "পেমেন্ট গেটওয়ে (বিকাশ/নগদ)", "অন-পেজ এসইও (SEO)", "ফেসবুক পিক্সেল সেটআপ", "৬ মাসের ফ্রি মেইনটেনেন্স"] }
];

export default function About() {
  const { settings } = useSettings();
  const [dbPackages, setPackages] = useState([]);

  // ফায়ারস্টোর থেকে প্যাকেজসমূহের তথ্য নিয়ে আসা
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const snap = await getDocs(collection(db, "packages"));
        if (!snap.empty) {
          setPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("প্যাকেজ লোড করতে ত্রুটি হয়েছে", err);
      }
    };
    fetchPackages();
  }, []);

  const displayPackages = dbPackages.length > 0 ? dbPackages : defaultPackages;

  return (
    <div>
      {/* ১. হিরো ব্যানার সেকশন */}
      <section className="about-hero py-5 text-white">
        <div className="container py-5 text-center">
          <h1 className="fw-bold display-4 mb-3">আমাদের <span style={{ color: "var(--primary-color)" }}>সম্পর্কে</span> জানুন</h1>
          <p className="lead opacity-75">{settings.siteName || "Eagle Dev's"} — আপনার অনলাইন ব্যবসার নির্ভরযোগ্য ডিজিটাল পার্টনার।</p>
        </div>
      </section>

      {/* ২. কোম্পানি বিবরণ ও মেম্বার কাউন্টার */}
      <section className="py-5 bg-white overflow-hidden border-bottom">
        <div className="container py-4">
          <div className="row align-items-center g-5">
            <div className="col-lg-6">
              <div className="about-img-wrapper position-relative">
                <img src="https://www.creativedesign.com.bd/assets/images/about/1766477456.jpg" className="img-fluid rounded-4 shadow-lg main-about-img" alt="About Image" />
                <div className="experience-badge bg-white p-3 shadow-lg rounded-3 position-absolute">
                  <h3 className="fw-bold mb-0 text-primary">৬+</h3>
                  <p className="small mb-0 text-dark">বছরের অভিজ্ঞতা</p>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <h6 className="text-primary fw-bold text-uppercase mb-3">কোম্পানি সম্পর্কে —</h6>
              <h2 className="fw-bold mb-4 display-6" style={{ color: "#1a1a1a" }}>{settings.heroTitle || "আপনার অনলাইন ব্যবসার নির্ভরযোগ্য সহযোগী"}</h2>
              <p className="text-muted fs-5 mb-4 text-justify">{settings.heroSubtitle || "আমরা দিচ্ছি প্রিমিয়াম কোয়ালিটির ই-কমার্স ওয়েবসাইট, ডিজিটাল মার্কেটিং এবং সফটওয়্যার সলিউশন। আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমরা প্রস্তুত।"}</p>

              <div className="row g-4 mt-2">
                <div className="col-6">
                  <div className="counter-item d-flex align-items-center p-3 border rounded-3 bg-light">
                    <div className="counter-text">
                      <h4 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>১০০০+</h4>
                      <p className="small text-muted mb-0">হ্যাপি ক্লায়েন্ট</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-item d-flex align-items-center p-3 border rounded-3 bg-light">
                    <div className="counter-text">
                      <h4 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>১৩০০+</h4>
                      <p className="small text-muted mb-0">প্রজেক্ট সম্পন্ন</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-item d-flex align-items-center p-3 border rounded-3 bg-light">
                    <div className="counter-text">
                      <h4 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>২৪/৭</h4>
                      <p className="small text-muted mb-0">সাপোর্ট অ্যাক্টিভ</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="counter-item d-flex align-items-center p-3 border rounded-3 bg-light">
                    <div className="counter-text">
                      <h4 className="fw-bold mb-0" style={{ color: "var(--primary-color)" }}>৬+</h4>
                      <p className="small text-muted mb-0">বছরের অভিজ্ঞতা</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ৩. প্রাইসিং প্ল্যান সেকশন */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase">প্যাকেজ</h6>
            <h2 className="fw-bold">বাজেট অনুযায়ী সেরা প্ল্যান</h2>
          </div>
          <div className="row g-4 justify-content-center">
            {displayPackages.map((pkg, idx) => {
              const isFeatured = idx === 1; // ২য় প্যাকেজটিকে (উদ্যোক্তা) স্পেশালভাবে হাইলাইট করা হবে
              return (
                <div className="col-lg-4 col-md-6" key={pkg.id}>
                  <div className={`pricing-card h-100 p-4 border text-center rounded-4 shadow-sm bg-white ${isFeatured ? "featured-pricing" : ""}`}>
                    <h4 className="fw-bold">{pkg.name}</h4>
                    <h2 className="display-5 fw-bold text-primary">৳{pkg.price}</h2>
                    <p className="text-muted small">{pkg.duration}</p>
                    <hr />
                    <ul className="list-unstyled text-start mb-4" style={{ minHeight: "180px" }}>
                      {pkg.features && pkg.features.map((feat, i) => (
                        <li className="mb-2" key={i}>
                          <i className="fas fa-check text-success me-2"></i> {feat}
                        </li>
                      ))}
                    </ul>
                    <a href={`https://wa.me/${settings.whatsapp || '8801854123433'}?text=Hello! আমি ${pkg.name} প্যাকেজটি নিতে চাই।`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className={`btn w-100 rounded-pill fw-bold ${isFeatured ? "btn-primary" : "btn-outline-primary"}`}
                    >
                      অর্ডার করুন
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ৪. কাস্টম রিকোয়েস্ট কল ব্যানার */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <div className="custom-package-card p-5 shadow-sm rounded-4 border mx-auto bg-white" style={{ maxWidth: "850px", borderRadius: "20px" }}>
            <h2 className="fw-bold mb-3">কাস্টম প্যাকেজ প্রয়োজন?</h2>
            <p className="text-muted mb-4 fs-5">আপনার যদি বিশেষ কোনো চাহিদা থাকে তবে আমাদের সরাসরি কল দিন অথবা মেসেজ করুন।</p>
            <Link to="/contact" className="btn btn-outline-dark btn-lg px-5 py-2 rounded-pill fw-bold" style={{ borderWidth: "1.5px" }}>যোগাযোগ করুন</Link>
          </div>
        </div>
      </section>
    </div>
  );
}