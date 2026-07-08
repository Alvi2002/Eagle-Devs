import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Contact() {
  const { settings } = useSettings();
  
  // ফর্ম ডেটা স্টেট
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  // সাবমিশন স্ট্যাটাস স্টেট (লোডিং, সাকসেস ও ইরর নোটিফিকেশন)
  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: ""
  });

  // ফর্ম সাবমিশন হ্যান্ডলার ফাংশন
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });

    try {
      // ফায়ারস্টোরের 'contact_submissions' কালেকশনে মেসেজ জমা করা হচ্ছে
      await addDoc(collection(db, "contact_submissions"), {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        timestamp: serverTimestamp() // সার্ভার টাইমস্ট্যাম্প
      });

      // সফল হলে নোটিফিকেশন দেখানো ও ইনপুট খালি করা হচ্ছে
      setStatus({
        loading: false,
        success: "আপনার মেসেজটি সফলভাবে আমাদের কাছে পৌঁছেছে! আগামী ২৪ ঘণ্টার মধ্যে আমাদের সাপোর্ট টিম আপনার সাথে যোগাযোগ করবে।",
        error: ""
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      
      // ৫ সেকেন্ড পর সাকসেস মেসেজটি সরিয়ে নেওয়া হবে
      setTimeout(() => setStatus(prev => ({ ...prev, success: "" })), 5000);
    } catch (err) {
      console.error("মেসেজ পাঠাতে ত্রুটি হয়েছে:", err);
      setStatus({
        loading: false,
        success: "",
        error: "দুঃখিত! মেসেজটি পাঠানো সম্ভব হয়নি। দয়া করে ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।"
      });
    }
  };

  return (
    <div>
      {/* ১. হিরো ব্যানার সেকশন */}
      <section className="contact-hero py-5 position-relative overflow-hidden" style={{ minHeight: "250px" }}>
        <div className="container py-5 text-center position-relative" style={{ zIndex: 2 }}>
          <h1 className="fw-bold display-4 text-white mb-3">আমাদের সাথে <span style={{ color: "#ff6600" }}>যোগাযোগ</span> করুন</h1>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb justify-content-center bg-transparent">
              <li className="breadcrumb-item"><Link to="/" class="text-white opacity-75 text-decoration-none">হোম</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">কন্টাক্ট</li>
            </ol>
          </nav>
        </div>
        <div className="position-absolute" style={{ width: "300px", height: "300px", background: "rgba(255, 102, 0, 0.1)", borderRadius: "50%", top: "-100px", right: "-50px" }}></div>
      </section>

      {/* ২. কন্টাক্ট ইনফো এবং মেসেজ ফর্ম গ্রিড */}
      <section className="py-5 bg-white position-relative" style={{ marginTop: "-50px" }}>
        <div className="container">
          <div className="row g-4">
            
            {/* কন্টাক্ট ইনফো কলাম */}
            <div className="col-lg-4">
              <div className="row g-4">
                
                {/* ঠিকানা কার্ড */}
                <div className="col-12">
                  <div className="info-card p-4 shadow-sm border-0 d-flex align-items-center">
                    <div className="info-icon me-3 shadow-sm">
                      <i className="fas fa-map-marked-alt"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">আমাদের অফিস</h6>
                      <p className="small text-muted mb-0">{settings.address || "হাউজঃ ৩৫/৩/১- বি, নছের মার্কেট, কোনাবাড়ি, গাজিপুর"}</p>
                    </div>
                  </div>
                </div>

                {/* ফোন নম্বর কার্ড */}
                <div className="col-12">
                  <div className="info-card p-4 shadow-sm border-0 d-flex align-items-center">
                    <div className="info-icon me-3 shadow-sm" style={{ background: "rgba(40, 167, 69, 0.1)", color: "#28a745" }}>
                      <i className="fas fa-phone-volume"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">সরাসরি কথা বলুন</h6>
                      <p className="small text-muted mb-0">{settings.phone || "০১৮৫৪১২৩৪৩৩"}</p>
                    </div>
                  </div>
                </div>

                {/* ইমেইল কার্ড */}
                <div className="col-12">
                  <div className="info-card p-4 shadow-sm border-0 d-flex align-items-center">
                    <div className="info-icon me-3 shadow-sm" style={{ background: "rgba(0, 123, 255, 0.1)", color: "#007bff" }}>
                      <i className="fas fa-envelope-open-text"></i>
                    </div>
                    <div>
                      <h6 className="fw-bold mb-1">ইমেইল করুন</h6>
                      <p className="small text-muted mb-0">
                        <a href={`mailto:${settings.email || 'info@eagledevs.com'}`}>{settings.email || "info@eagledevs.com"}</a>
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* মেসেজ ফর্ম কলাম */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: "25px", background: "#fff" }}>
                <div className="mb-4">
                  <h3 className="fw-bold">আপনার কোন প্রশ্ন আছে?</h3>
                  <p className="text-muted">নিচের ফর্মটি পূরণ করুন, আমাদের সাপোর্ট টিম ২৪ ঘন্টার মধ্যে আপনার সাথে যোগাযোগ করবে।</p>
                </div>

                {/* সাকসেস এবং ফেইলর অ্যালার্ট নোটিফিকেশন */}
                {status.success && (
                  <div className="alert alert-success border-0 small py-2.5 px-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: "12px" }}>
                    <i className="fas fa-check-circle fs-5"></i> {status.success}
                  </div>
                )}
                {status.error && (
                  <div className="alert alert-danger border-0 small py-2.5 px-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: "12px" }}>
                    <i className="fas fa-exclamation-triangle fs-5"></i> {status.error}
                  </div>
                )}

                {/* ক্লায়েন্ট সাবমিশন ফর্ম */}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          type="text" 
                          className="form-control custom-input" 
                          id="name" 
                          placeholder="আপনার নাম" 
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required 
                        />
                        <label htmlFor="name">আপনার নাম *</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input 
                          type="email" 
                          className="form-control custom-input" 
                          id="email" 
                          placeholder="ইমেইল ঠিকানা" 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required 
                        />
                        <label htmlFor="email">ইমেইল ঠিকানা *</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <input 
                          type="text" 
                          className="form-control custom-input" 
                          id="subject" 
                          placeholder="বিষয়" 
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        />
                        <label htmlFor="subject">বিষয় (Subject)</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-4">
                        <textarea 
                          className="form-control custom-input" 
                          placeholder="আপনার বিস্তারিত বার্তা লিখুন" 
                          id="message" 
                          style={{ height: "150px" }}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                        ></textarea>
                        <label htmlFor="message">আপনার বিস্তারিত বার্তা লিখুন *</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2 orange-submit-btn shadow-sm"
                        disabled={status.loading}
                      >
                        {status.loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            বার্তা পাঠানো হচ্ছে...
                          </>
                        ) : (
                          <>
                            সাবমিট করুন <i className="fas fa-paper-plane"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ৩. গুগল ম্যাপ লোকেশন সেকশন */}
      <section className="container py-5">
        <div className="row">
          <div className="col-12 rounded-4 overflow-hidden border shadow-sm" style={{ height: "450px" }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114948.3370717257!2d89.37803875!3d25.807412749999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eed63fb5555555%3A0xe54cbbaee916a04!2sLalmonirhat!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Eagle Dev's Location"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}