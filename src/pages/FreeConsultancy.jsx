import React, { useState } from "react";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function FreeConsultancy() {
  const { settings } = useSettings();

  // বুকিং ফর্মের ডেটা স্টেট
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  // সাবমিশন নোটিফিকেশন স্ট্যাটাস স্টেট
  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: ""
  });

  // কনসালটেন্সি বুকিং সাবমিট হ্যান্ডলার
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: "", error: "" });

    try {
      // ফায়ারস্টোর ডাটাবেজের 'consultancy_bookings' কালেকশনে বুকিং ইনফো পাঠানো হচ্ছে
      await addDoc(collection(db, "consultancy_bookings"), {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "", // ঐচ্ছিক ক্ষেত্র
        message: formData.message || "", // ঐচ্ছিক ক্ষেত্র
        timestamp: serverTimestamp()
      });

      // সাবমিশন সফল হলে ইনপুট ফিল্ড খালি করা হচ্ছে
      setStatus({
        loading: false,
        success: "আপনার ফ্রি কনসালটেন্সি বুকিংটি সফলভাবে সম্পন্ন হয়েছে! আমাদের একজন কনসালটেন্ট খুব শীঘ্রই আপনার সাথে যোগাযোগ করবেন।",
        error: ""
      });
      setFormData({ name: "", phone: "", email: "", message: "" });

      // ৫ সেকেন্ড পর সাকসেস মেসেজটি রিমুভ হবে
      setTimeout(() => setStatus(prev => ({ ...prev, success: "" })), 5000);
    } catch (err) {
      console.error("বুকিং জমা করতে সমস্যা হয়েছে:", err);
      setStatus({
        loading: false,
        success: "",
        error: "দুঃখিত! বুকিংটি জমা করা সম্ভব হয়নি। দয়া করে ইন্টারনেট কানেকশন চেক করে আবার চেষ্টা করুন।"
      });
    }
  };

  return (
    <div>
      {/* ১. হিরো ব্যানার সেকশন */}
      <section className="py-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)" }}>
        <div className="container py-4 text-center">
          <h1 className="fw-bold display-5 mb-3">ফ্রি <span style={{ color: "var(--primary-color)" }}>কনসালটেন্সি</span> বুক করুন</h1>
          <p className="lead opacity-75">আপনার ব্যবসার ডিজিটাল যাত্রা শুরু করতে আমাদের অভিজ্ঞ টিমের পরামর্শ নিন।</p>
        </div>
      </section>

      {/* ২. ইনফরমেশন এবং বুকিং ফর্ম গ্রিড */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row g-5 justify-content-center">
            
            {/* বাম কলাম: আমরা যেভাবে সাহায্য করব */}
            <div className="col-lg-5">
              <div className="pe-lg-4">
                <h2 className="fw-bold mb-4" style={{ color: "#1a1a1a" }}>আমরা আপনাকে কীভাবে সাহায্য করতে পারি?</h2>
                <p className="text-muted mb-4">আমাদের বিশেষজ্ঞরা আপনার ব্যবসার বর্তমান অবস্থা বিশ্লেষণ করে সঠিক ডিজিটাল সলিউশন প্রদান করবে।</p>
                
                {/* হাইলাইট ১: দ্রুত প্রবৃদ্ধি */}
                <div className="d-flex mb-4">
                  <div className="icon-circle me-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                    <i className="fas fa-rocket"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">দ্রুত প্রবৃদ্ধি</h5>
                    <p className="small text-muted mb-0">সভিক টেকনোলজি ব্যবহার করে আপনার ব্যবসার সেলস বৃদ্ধি করুন।</p>
                  </div>
                </div>

                {/* হাইলাইট ২: মার্কেটিং স্ট্র্যাটেজি */}
                <div className="d-flex mb-4">
                  <div className="icon-circle me-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                    <i className="fas fa-bullhorn"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">মার্কেটিং স্ট্র্যাটেজি</h5>
                    <p className="small text-muted mb-0">টার্গেটেড কাস্টমারের কাছে পৌঁছানোর সঠিক পরিকল্পনা।</p>
                  </div>
                </div>

                {/* হাইলাইট ৩: ২৪/৭ সাপোর্ট */}
                <div className="d-flex">
                  <div className="icon-circle me-3 flex-shrink-0 d-flex align-items-center justify-content-center">
                    <i className="fas fa-user-shield"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-1">২৪/৭ সাপোর্ট</h5>
                    <p className="small text-muted mb-0">যেকোনো টেকনিক্যাল প্রয়োজনে আমরা আছি আপনার পাশে।</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ডান কলাম: বুকিং ফর্ম কার্ড */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg p-4 p-md-5" style={{ borderRadius: "20px", background: "#ffffff" }}>
                
                {/* সাকসেস এবং ইরর অ্যালার্ট মেসেজ */}
                {status.success && (
                  <div className="alert alert-success border-0 small py-2.5 px-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: "10px" }}>
                    <i className="fas fa-check-circle fs-5"></i> {status.success}
                  </div>
                )}
                {status.error && (
                  <div className="alert alert-danger border-0 small py-2.5 px-3 mb-4 d-flex align-items-center gap-2" style={{ borderRadius: "10px" }}>
                    <i className="fas fa-exclamation-triangle fs-5"></i> {status.error}
                  </div>
                )}

                {/* বুকিং ফর্ম */}
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-bold small text-dark">আপনার নাম *</label>
                    <input 
                      type="text" 
                      className="form-control custom-input" 
                      placeholder="পুরো নাম লিখুন" 
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small text-dark">ফোন নাম্বার *</label>
                      <input 
                        type="text" 
                        className="form-control custom-input" 
                        placeholder="আপনার ফোন" 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required 
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-bold small text-dark">ইমেইল (ঐচ্ছিক)</label>
                      <input 
                        type="email" 
                        className="form-control custom-input" 
                        placeholder="আপনার ইমেইল" 
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-bold small text-dark">মেসেজ (আপনার চাহিদা সম্পর্কে লিখুন)</label>
                    <textarea 
                      className="form-control custom-input" 
                      rows="4" 
                      placeholder="যেমন: ওয়েবসাইট তৈরি বা মার্কেটিং..." 
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-lg w-100 text-white fw-bold py-3 orange-btn shadow"
                    disabled={status.loading}
                  >
                    {status.loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        অনুরোধ পাঠানো হচ্ছে...
                      </>
                    ) : (
                      <>
                        সাবমিট করুন <i className="fas fa-paper-plane ms-2"></i>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}