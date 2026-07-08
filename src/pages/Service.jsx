import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে দেখানোর জন্য ডিফল্ট ৮টি সার্ভিসের তালিকা
const defaultServices = [
  { id: "s1", title: "প্রোডাক্ট ব্রান্ডিং ও ডিজাইন", desc: "আমাদের প্রোডাক্ট ব্রান্ডিং ও ডিজাইন প্যাকেজ শুরু ৮০০০ টাকা থেকে", icon: "fas fa-lightbulb" },
  { id: "s2", title: "UI/UX ডিজাইন এর সার্ভিস", desc: "আমাদের UI/UX ডিজাইন এর সার্ভিস এর প্যাকেজ শুরু ১০০০ টাকা থেকে", icon: "fas fa-paint-brush" },
  { id: "s3", title: "গ্রাফিক্স ডিজাইন এর সার্ভিস", desc: "আমাদের গ্রাফিক্স ডিজাইন এর সকল প্যাকেজ শুরু ৫০০০ টাকা থেকে", icon: "fas fa-crop" },
  { id: "s4", title: "সোশ্যাল মিডিয়া মার্কেটিং", desc: "আমাদের সোশ্যাল মিডিয়া মার্কেটিং প্যাকেজ শুরু ২০০০ টাকা থেকে", icon: "fab fa-facebook" },
  { id: "s5", title: "ডোমেন, হোস্টিং ও সার্ভার", desc: "আমাদের ডোমেন এবং হোস্টিং এর প্যাকেজ শুরু ৩০০০ টাকা থেকে", icon: "fa fa-server" },
  { id: "s6", title: "SEO সার্ভিস", desc: "আমাদের এসইও এর সকল সার্ভিস প্যাকেজ শুরু ৩০০০ টাকা থেকে", icon: "fas fa-chart-line" },
  { id: "s7", title: "সফটওয়্যার ডেভেলপমেন্ট", desc: "আমাদের সফটওয়্যার ডেভেলপমেন্ট প্যাকেজ শুরু ১০০০০ টাকা থেকে", icon: "fas fa-laptop" },
  { id: "s8", title: "ওয়েব ডিজাইন", desc: "আমাদের ওয়েব ডিজাইন ও ডেভেলপমেন্ট প্যাকেজ শুরু ৮০০০ টাকা থেকে", icon: "fas fa-globe" }
];

export default function Service() {
  const { settings } = useSettings();
  const [dbServices, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে সার্ভিসেস কালেকশন ফেচ করা হচ্ছে
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));
        if (!snap.empty) {
          setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("সার্ভিস লোড করতে সমস্যা হয়েছে", err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const displayServices = dbServices.length > 0 ? dbServices : defaultServices;

  return (
    <div>
      {/* ১. হিরো সেকশন */}
      <section className="hero-section py-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)", position: "relative" }}>
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <h1 className="display-4 fw-bold mb-3">
                আপনার অনলাইন ব্যবসার <span style={{ color: "var(--primary-color)" }}>নির্ভরযোগ্য</span> সহযোগী
              </h1>
              <p className="lead mb-0 opacity-75">
                আমরা দিচ্ছি প্রিমিয়াম কোয়ালিটির ই-কমার্স ওয়েবসাইট, ডিজিটাল মার্কেটিং এবং সফটওয়্যার সলিউশন। আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমরা প্রস্তুত।
              </p>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "4px", background: "var(--primary-color)" }}></div>
      </section>

      {/* ২. আমাদের সার্ভিসেস গ্রিড */}
      <section id="our-services" className="py-5 bg-light">
        <div className="container-fluid px-lg-5 py-4">
          <div className="text-center mb-5">
            <h6 className="fw-bold text-uppercase" style={{ letterSpacing: "2px", color: "var(--primary-color)" }}>আমাদের দক্ষতা</h6>
            <h2 className="fw-bold" style={{ color: "#1a1a1a" }}>আপনার ব্যবসার পূর্ণাঙ্গ সমাধান</h2>
            <div className="mx-auto mt-2" style={{ width: "60px", height: "3px", background: "var(--primary-color)" }}></div>
          </div>

          <div className="row g-4">
            {displayServices.map((s) => (
              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={s.id}>
                <div className="card h-100 border-0 shadow-sm p-4 text-center orange-hover-card">
                  <div className="icon-container mb-3 mx-auto d-flex align-items-center justify-content-center">
                    <i className={s.icon || "fas fa-lightbulb"}></i>
                  </div>
                  <h5 className="fw-bold mb-2 card-title-text">{s.title}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem", lineHeight: "1.6" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৩. গ্রোথ পার্টনার সিটিএ ব্যানার */}
      <section className="py-5 text-center text-white" style={{ background: "var(--primary-color)" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h3 className="fw-bold mb-3">আপনার ব্যবসার গ্রোথ পার্টনার হতে আমরা প্রস্তুত</h3>
              <p className="mb-4 opacity-100">সব সমাধান এক ছাদের নিচে - আজই শুরু করুন!</p>
              <Link to="/freeconsultant" className="btn btn-dark btn-lg rounded-pill px-5 fw-bold shadow">ফ্রি কনসালটেন্সি নিন</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}