import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { doc, getDoc, updateDoc, collection, onSnapshot, addDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("settings");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // ১. জেনারেল সেটিংস স্টেট
  const [settings, setSettings] = useState({
    siteName: "",
    navbarLogo: "",
    footerLogo: "",
    favicon: "",
    whatsapp: "",
    phone: "",
    email: "",
    address: "",
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: "",
    heroTitle: "",
    heroSubtitle: ""
  });

  // ২. ডাইনামিক ডেটা কালেকশন স্টেটস
  const [services, setServices] = useState([]);
  const [portfolios, setPortfolios] = useState([]);
  const [packages, setPackages] = useState([]);
  const [themes, setThemes] = useState([]);
  const [team, setTeam] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [contactMsgs, setContactMsgs] = useState([]);
  const [consultancyMsgs, setConsultancyMsgs] = useState([]);

  // ৩. নতুন ডেটা ইনপুট স্টেটস (CRUD এর জন্য)
  const [newService, setNewService] = useState({ title: "", desc: "", icon: "fas fa-laptop" });
  const [newPortfolio, setNewPortfolio] = useState({ title: "", category: "web-dijan", image: "", link: "" });
  const [newPackage, setNewPackage] = useState({ name: "", price: "", duration: "এককালীন পেমেন্ট", features: "" });
  const [newTheme, setNewTheme] = useState({ title: "", price: "", image: "", desc: "", link: "" });
  const [newTeam, setNewTeam] = useState({ name: "", designation: "", image: "", fb: "", twitter: "", linkedin: "" });
  const [newReview, setNewReview] = useState({ name: "", role: "", feedback: "", rating: "5", image: "" });

  // ইউজার সাইন আউট ফাংশন
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  // ডাটাবেজ থেকে রিয়েল-টাইমে সকল কন্টেন্ট ফেচ করা
  useEffect(() => {
    // সেটিংস ফেচ
    const settingsRef = doc(db, "site_settings", "config");
    getDoc(settingsRef).then((snap) => {
      if (snap.exists()) setSettings(snap.data());
    });

    // রিয়েল-টাইম লিসেনার ফর কালেকশনস
    const unsubServices = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubPortfolios = onSnapshot(collection(db, "portfolios"), (snap) => {
      setPortfolios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubPackages = onSnapshot(collection(db, "packages"), (snap) => {
      setPackages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubThemes = onSnapshot(collection(db, "themes"), (snap) => {
      setThemes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubTeam = onSnapshot(collection(db, "team"), (snap) => {
      setTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubReviews = onSnapshot(collection(db, "testimonials"), (snap) => {
      setTestimonials(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubContact = onSnapshot(collection(db, "contact_submissions"), (snap) => {
      setContactMsgs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    const unsubConsult = onSnapshot(collection(db, "consultancy_bookings"), (snap) => {
      setConsultancyMsgs(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubServices();
      unsubPortfolios();
      unsubPackages();
      unsubThemes();
      unsubTeam();
      unsubReviews();
      unsubContact();
      unsubConsult();
    };
  }, []);

  // নোটিফিকেশন অ্যালার্ট হেল্পার
  const triggerAlert = (message, isError = false) => {
    if (isError) {
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(""), 4000);
    } else {
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  // ইমেজ ফাইলকে ফায়ারবেস স্টোরেজ ছাড়া সরাসরি Base64 স্ট্রিংয়ে রূপান্তরের হেল্পার
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e, key, nestedStateSetter = null) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const base64 = await convertFileToBase64(file);
      if (nestedStateSetter) {
        nestedStateSetter(prev => ({ ...prev, [key]: base64 }));
      } else {
        setSettings(prev => ({ ...prev, [key]: base64 }));
      }
      triggerAlert("ইমেজটি সফলভাবে নির্বাচন করা হয়েছে, সেভ বাটনে ক্লিক করুন।");
    } catch (err) {
      triggerAlert("ইমেজ ফাইল কনভার্ট করতে ত্রুটি হয়েছে!", true);
    }
  };

  // সেটিংস আপডেট ফাংশন
  const saveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "site_settings", "config"), settings);
      triggerAlert("জেনারেল সেটিংস সফলভাবে আপডেট করা হয়েছে।");
    } catch (err) {
      triggerAlert("সেটিংস সেভ করতে সমস্যা হয়েছে!", true);
    }
  };

  // CRUD অপারেশন ফাংশন সমূহ
  const handleAdd = async (collectionName, data, resetState, resetValue) => {
    try {
      await addDoc(collection(db, collectionName), data);
      resetState(resetValue);
      triggerAlert("নতুন তথ্য ডাটাবেজে সফলভাবে যোগ করা হয়েছে।");
    } catch (err) {
      triggerAlert("정보 যোগ করতে সমস্যা হয়েছে!", true);
    }
  };

  const handleDelete = async (collectionName, id) => {
    if (window.confirm("আপনি কি নিশ্চিতভাবে এই আইটেমটি ডিলিট করতে চান?")) {
      try {
        await deleteDoc(doc(db, collectionName, id));
        triggerAlert("আইটেমটি সফলভাবে ডিলিট করা হয়েছে।");
      } catch (err) {
        triggerAlert("ডিলিট করতে ত্রুটি হয়েছে!", true);
      }
    }
  };

  return (
    <div className="container-fluid py-4" style={{ minHeight: "100vh", background: "#f1f5f9" }}>
      {/* হেডার ও ব্রান্ডিং বার */}
      <div className="d-flex flex-wrap justify-content-between align-items-center bg-white p-3 mb-4 shadow-sm rounded-3">
        <div className="d-flex align-items-center gap-3">
          <div style={{ background: "#ff6b00", color: "#fff", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", fontWeight: "bold" }}>E</div>
          <h4 className="fw-bold mb-0">Eagle Dev's — কন্ট্রোল প্যানেল</h4>
        </div>
        <button className="btn btn-danger btn-sm px-4 rounded-pill fw-bold" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt me-1"></i> লগআউট করুন
        </button>
      </div>

      {/* সাকসেস/ইরর নোটিফিকেশন */}
      {successMsg && <div className="alert alert-success border-0 shadow-sm position-fixed top-4 end-4" style={{ zIndex: 9999, borderRadius: "10px" }}><i className="fas fa-check-circle me-2"></i> {successMsg}</div>}
      {errorMsg && <div className="alert alert-danger border-0 shadow-sm position-fixed top-4 end-4" style={{ zIndex: 9999, borderRadius: "10px" }}><i className="fas fa-exclamation-triangle me-2"></i> {errorMsg}</div>}

      <div className="row">
        {/* বাম পাশের ন্যাভিগেশন ক্যাটাগরি মেনু */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="list-group shadow-sm border-0 rounded-3 overflow-hidden bg-white">
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "settings" ? "active text-white" : ""}`} style={activeTab === "settings" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("settings")}><i className="fas fa-cog me-2"></i> জেনারেল সেটিংস</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "services" ? "active text-white" : ""}`} style={activeTab === "services" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("services")}><i className="fas fa-laptop me-2"></i> আমাদের সার্ভিসেস</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "portfolio" ? "active text-white" : ""}`} style={activeTab === "portfolio" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("portfolio")}><i className="fas fa-photo-video me-2"></i> পোর্টফোলিও গ্যালারি</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "packages" ? "active text-white" : ""}`} style={activeTab === "packages" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("packages")}><i className="fas fa-tags me-2"></i> ওয়েবসাইট প্যাকেজ</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "themes" ? "active text-white" : ""}`} style={activeTab === "themes" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("themes")}><i className="fas fa-code me-2"></i> থিম ও প্রোডাক্ট</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "team" ? "active text-white" : ""}`} style={activeTab === "team" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("team")}><i className="fas fa-users me-2"></i> আমাদের টিম</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 ${activeTab === "testimonials" ? "active text-white" : ""}`} style={activeTab === "testimonials" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("testimonials")}><i className="fas fa-star me-2"></i> ক্লায়েন্ট প্রশংসাপত্র</button>
            <button className={`list-group-item list-group-item-action border-0 py-3 d-flex justify-content-between align-items-center ${activeTab === "inbox" ? "active text-white" : ""}`} style={activeTab === "inbox" ? { background: "#ff6b00" } : {}} onClick={() => setActiveTab("inbox")}>
              <span><i className="fas fa-envelope me-2"></i> ক্লায়েন্ট ইনবক্স</span>
              <span className={`badge rounded-pill ${activeTab === "inbox" ? "bg-white text-dark" : "bg-danger text-white"}`}>{contactMsgs.length + consultancyMsgs.length}</span>
            </button>
          </div>
        </div>

        {/* ডান পাশের ক্যাটাগরি ওয়ার্কস্পেস */}
        <div className="col-lg-9 col-md-8">
          <div className="card shadow-sm border-0 rounded-3 p-4 bg-white" style={{ minHeight: "500px" }}>

            {/* ট্যাব ১: জেনারেল সেটিংস */}
            {activeTab === "settings" && (
              <form onSubmit={saveSettings}>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">গ্লোবাল সেটিংস এবং লোগো কন্ট্রোলার</h4>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">ওয়েবসাইটের নাম</label>
                    <input type="text" className="form-control" value={settings.siteName} onChange={(e) => setSettings({...settings, siteName: e.target.value})} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">হোয়াটসঅ্যাপ নাম্বার (সরাসরি চ্যাটের জন্য)</label>
                    <input type="text" className="form-control" value={settings.whatsapp} onChange={(e) => setSettings({...settings, whatsapp: e.target.value})} placeholder="যেমন: 8801854123433" />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">হেডার লোগো আপলোড (ইমেজ বা পিএনজি)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "navbarLogo")} />
                    {settings.navbarLogo && <img src={settings.navbarLogo} alt="Header Preview" className="mt-2" style={{ maxHeight: "35px", border: "1px solid #ddd", padding: "2px" }} />}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">ফুটার লোগো আপলোড (ডার্ক ব্যাকগ্রাউন্ডের জন্য)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "footerLogo")} />
                    {settings.footerLogo && <div className="bg-dark p-2 rounded mt-2 text-center" style={{ maxWidth: "150px" }}><img src={settings.footerLogo} alt="Footer Preview" style={{ maxHeight: "35px" }} /></div>}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">সাইটের ফেভিকন আপলোড (ব্রাউজার আইকন)</label>
                    <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "favicon")} />
                    {settings.favicon && <img src={settings.favicon} alt="Favicon Preview" className="mt-2" style={{ maxHeight: "30px" }} />}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">মোবাইল ফোন নাম্বার</label>
                    <input type="text" className="form-control" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">অফিস ইমেইল ঠিকানা</label>
                    <input type="email" className="form-control" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">অফিসের ঠিকানা</label>
                    <input type="text" className="form-control" value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} />
                  </div>
                  
                  {/* হিরো টেক্সট সেটিংস */}
                  <div className="col-12 mt-4">
                    <h5 className="fw-bold text-dark border-bottom pb-2">হোমপেজ হিরো ব্যানার কন্ট্রোলার</h5>
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">হিরো টাইটেল</label>
                    <input type="text" className="form-control" value={settings.heroTitle} onChange={(e) => setSettings({...settings, heroTitle: e.target.value})} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold">হিরো সাব-টাইটেল বা বিবরণ</label>
                    <textarea className="form-control" rows="2" value={settings.heroSubtitle} onChange={(e) => setSettings({...settings, heroSubtitle: e.target.value})}></textarea>
                  </div>

                  {/* সোশ্যাল লিংকস */}
                  <div className="col-12 mt-4">
                    <h5 className="fw-bold text-dark border-bottom pb-2">সোশ্যাল মিডিয়া প্রোফাইল লিংক</h5>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">ফেসবুক লিংক</label>
                    <input type="text" className="form-control" value={settings.facebook} onChange={(e) => setSettings({...settings, facebook: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">টুইটার লিংক</label>
                    <input type="text" className="form-control" value={settings.twitter} onChange={(e) => setSettings({...settings, twitter: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">ইনস্টাগ্রাম লিংক</label>
                    <input type="text" className="form-control" value={settings.instagram} onChange={(e) => setSettings({...settings, instagram: e.target.value})} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small">ইউটিউব লিংক</label>
                    <input type="text" className="form-control" value={settings.youtube} onChange={(e) => setSettings({...settings, youtube: e.target.value})} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary mt-4 py-2 px-5 fw-bold rounded-pill" style={{ background: "#ff6b00", border: "none" }}><i className="fas fa-save me-1"></i> আপডেট সেভ করুন</button>
              </form>
            )}

            {/* ট্যাব ২: সার্ভিস ম্যানেজার */}
            {activeTab === "services" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">আমাদের সার্ভিস ম্যানেজার</h4>
                <div className="card p-3 mb-4 bg-light border-0">
                  <h6 className="fw-bold text-muted mb-3">নতুন সার্ভিস যোগ করুন</h6>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="সার্ভিসের নাম" value={newService.title} onChange={(e) => setNewService({ ...newService, title: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="text" className="form-control" placeholder="ফন্ট-অসাম আইকন (যেমন: fas fa-laptop)" value={newService.icon} onChange={(e) => setNewService({ ...newService, icon: e.target.value })} />
                    </div>
                    <div className="col-md-5">
                      <input type="text" className="form-control" placeholder="সংক্ষিপ্ত বিবরণ" value={newService.desc} onChange={(e) => setNewService({ ...newService, desc: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn btn-dark btn-sm mt-3 px-4 rounded-pill align-self-start" onClick={() => handleAdd("services", newService, setNewService, { title: "", desc: "", icon: "fas fa-laptop" })}><i className="fas fa-plus"></i> যোগ করুন</button>
                </div>

                <h6 className="fw-bold text-dark mb-3">বর্তমানে সচল সার্ভিস সমূহ ({services.length})</h6>
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead>
                      <tr>
                        <th>আইকন</th>
                        <th>সার্ভিসের নাম</th>
                        <th>বিবরণ</th>
                        <th className="text-end">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody>
                      {services.map((s) => (
                        <tr key={s.id}>
                          <td><i className={`${s.icon} text-primary fs-5`}></i></td>
                          <td className="fw-bold">{s.title}</td>
                          <td className="text-muted small">{s.desc}</td>
                          <td className="text-end">
                            <button className="btn btn-outline-danger btn-sm rounded-circle" onClick={() => handleDelete("services", s.id)}><i className="fas fa-trash-alt"></i></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ট্যাব ৩: পোর্টফোলিও ম্যানেজার */}
            {activeTab === "portfolio" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">পোর্টফোলিও প্রজেক্ট গ্যালারি</h4>
                <div className="card p-3 mb-4 bg-light border-0">
                  <h6 className="fw-bold text-muted mb-3">নতুন প্রজেক্ট যুক্ত করুন</h6>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="প্রজেক্ট টাইটেল" value={newPortfolio.title} onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <select className="form-select" value={newPortfolio.category} onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}>
                        <option value="web-dijan">ওয়েব ডিজান</option>
                        <option value="sftwzar-development">সফটওয়্যার ডেভেলোপমেন্ট</option>
                        <option value="esioo">এসইও</option>
                      </select>
                    </div>
                    <div className="col-md-5">
                      <input type="text" className="form-control" placeholder="লাইভ ভিজিট লিংক (URL)" value={newPortfolio.link} onChange={(e) => setNewPortfolio({ ...newPortfolio, link: e.target.value })} />
                    </div>
                    <div className="col-md-6 mt-2">
                      <label className="form-label small fw-bold">প্রজেক্ট স্ক্রিনশট আপলোড (ইমেজ বা পিএনজি)</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "image", setNewPortfolio)} />
                    </div>
                  </div>
                  <button className="btn btn-dark btn-sm mt-3 px-4 rounded-pill align-self-start" onClick={() => handleAdd("portfolios", newPortfolio, setNewPortfolio, { title: "", category: "web-dijan", image: "", link: "" })}><i className="fas fa-plus"></i> প্রজেক্ট যোগ করুন</button>
                </div>

                <h6 className="fw-bold text-dark mb-3">সাম্প্রতিক পোর্টফোলিও তালিকা ({portfolios.length})</h6>
                <div className="row g-3">
                  {portfolios.map((p) => (
                    <div className="col-md-4 col-sm-6" key={p.id}>
                      <div className="card h-100 border rounded shadow-sm position-relative">
                        <img src={p.image || "https://placehold.co/300x200"} className="card-img-top" style={{ height: "150px", objectFit: "cover" }} alt={p.title} />
                        <div className="card-body p-2">
                          <span className="badge bg-secondary mb-1">{p.category === "web-dijan" ? "ওয়েব ডিজাইন" : p.category === "sftwzar-development" ? "সফটওয়্যার" : "এসইও"}</span>
                          <h6 className="fw-bold mb-1 small">{p.title}</h6>
                          <a href={p.link} target="_blank" rel="noopener noreferrer" className="small text-decoration-none text-primary"><i className="fas fa-external-link-alt me-1"></i> লাইভ সাইট</a>
                        </div>
                        <button className="btn btn-danger btn-sm position-absolute top-2 end-2 rounded-circle" style={{ width: "30px", height: "30px", padding: 0 }} onClick={() => handleDelete("portfolios", p.id)}><i className="fas fa-trash-alt"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ট্যাব ৪: প্যাকেজ ম্যানেজার */}
            {activeTab === "packages" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">ওয়েবসাইট প্যাকেজ ও প্রাইসিং ম্যানেজার</h4>
                <div className="card p-3 mb-4 bg-light border-0">
                  <h6 className="fw-bold text-muted mb-3">নতুন কাস্টম প্যাকেজ তৈরি করুন</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="প্যাকেজের নাম (যেমন: স্টার্টার)" value={newPackage.name} onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="মূল্য (যেমন: ৩৫০০)" value={newPackage.price} onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control" value={newPackage.duration} onChange={(e) => setNewPackage({ ...newPackage, duration: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <textarea className="form-control" rows="2" placeholder="ফিচার তালিকা (কমা দিয়ে আলাদা করুন, যেমন: ৫ পেজ ডিজাইন, ফ্রি ডোমেন, ফেসবুক পিক্সেল)" value={newPackage.features} onChange={(e) => setNewPackage({ ...newPackage, features: e.target.value })}></textarea>
                    </div>
                  </div>
                  <button className="btn btn-dark btn-sm mt-3 px-4 rounded-pill align-self-start" onClick={() => {
                    const featArray = newPackage.features.split(",").map(f => f.trim()).filter(Boolean);
                    handleAdd("packages", { ...newPackage, features: featArray }, setNewPackage, { name: "", price: "", duration: "এককালীন পেমেন্ট", features: "" });
                  }}><i className="fas fa-plus"></i> প্যাকেজ যোগ করুন</button>
                </div>

                <h6 className="fw-bold text-dark mb-3">বর্তমানে সক্রিয় প্যাকেজসমূহ ({packages.length})</h6>
                <div className="row g-3">
                  {packages.map((pkg) => (
                    <div className="col-md-4" key={pkg.id}>
                      <div className="card p-3 border h-100 shadow-sm position-relative">
                        <h5 className="fw-bold mb-1">{pkg.name}</h5>
                        <h4 className="text-primary fw-bold mb-2">৳{pkg.price}</h4>
                        <small className="text-muted mb-2 d-block">{pkg.duration}</small>
                        <hr />
                        <ul className="list-unstyled mb-4 small text-muted">
                          {pkg.features && pkg.features.map((f, i) => (
                            <li key={i} className="mb-1"><i className="fas fa-check text-success me-1"></i> {f}</li>
                          ))}
                        </ul>
                        <button className="btn btn-outline-danger btn-sm w-100 mt-auto" onClick={() => handleDelete("packages", pkg.id)}><i className="fas fa-trash-alt me-1"></i> প্যাকেজ ডিলিট</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ট্যাব ৫: থিম ও প্রোডাক্ট ম্যানেজার */}
            {activeTab === "themes" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">থিম এবং কাস্টম প্রোডাক্ট ম্যানেজার</h4>
                <div className="card p-3 mb-4 bg-light border-0">
                  <h6 className="fw-bold text-muted mb-3">নতুন থিম/প্রোডাক্ট যুক্ত করুন</h6>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <input type="text" className="form-control" placeholder="থিমের নাম (যেমন: Union Porisodh Laravel Script)" value={newTheme.title} onChange={(e) => setNewTheme({ ...newTheme, title: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="text" className="form-control" placeholder="মূল্য (যেমন: ১২৫০০)" value={newTheme.price} onChange={(e) => setNewTheme({ ...newTheme, price: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                      <input type="text" className="form-control" placeholder="বাই বা ডেমো লিংক (URL)" value={newTheme.link} onChange={(e) => setNewTheme({ ...newTheme, link: e.target.value })} />
                    </div>
                    <div className="col-md-12">
                      <textarea className="form-control" rows="2" placeholder="সংক্ষিপ্ত বিবরণ" value={newTheme.desc} onChange={(e) => setNewTheme({ ...newTheme, desc: e.target.value })}></textarea>
                    </div>
                    <div className="col-md-6 mt-2">
                      <label className="form-label small fw-bold">থিম কভার ইমেজ আপলোড (PNG/JPG)</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "image", setNewTheme)} />
                    </div>
                  </div>
                  <button className="btn btn-dark btn-sm mt-3 px-4 rounded-pill align-self-start" onClick={() => handleAdd("themes", newTheme, setNewTheme, { title: "", price: "", image: "", desc: "", link: "" })}><i className="fas fa-plus"></i> থিম আপলোড করুন</button>
                </div>

                <h6 className="fw-bold text-dark mb-3">বর্তমানে আপলোড করা থিমসমূহ ({themes.length})</h6>
                <div className="row g-3">
                  {themes.map((t) => (
                    <div className="col-md-4" key={t.id}>
                      <div className="card h-100 border rounded shadow-sm position-relative">
                        <img src={t.image || "https://placehold.co/400x250"} className="card-img-top" style={{ height: "140px", objectFit: "cover" }} alt={t.title} />
                        <div className="card-body p-3">
                          <h6 className="fw-bold mb-1 text-truncate">{t.title}</h6>
                          <div className="text-primary fw-bold mb-2">৳{t.price}</div>
                          <p className="text-muted small mb-3" style={{ fontSize: "11px" }}>{t.desc}</p>
                          <a href={t.link} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm w-100 rounded-pill border">ডেমো দেখুন</a>
                        </div>
                        <button className="btn btn-danger btn-sm position-absolute top-2 end-2 rounded-circle" style={{ width: "30px", height: "30px", padding: 0 }} onClick={() => handleDelete("themes", t.id)}><i className="fas fa-trash-alt"></i></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ট্যাব ৬: টিম ম্যানেজার */}
            {activeTab === "team" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">টিম মেম্বার এবং কর্মী কন্ট্রোলার</h4>
                <div className="card p-3 mb-4 bg-light border-0">
                  <h6 className="fw-bold text-muted mb-3">নতুন টিম মেম্বার যুক্ত করুন</h6>
                  <div className="row g-2">
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="মেম্বারের নাম" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="পদবী (যেমন: সিইও)" value={newTeam.designation} onChange={(e) => setNewTeam({ ...newTeam, designation: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="ফেসবুক প্রোফাইল লিংক" value={newTeam.fb} onChange={(e) => setNewTeam({ ...newTeam, fb: e.target.value })} />
                    </div>
                    <div className="col-md-6 mt-2">
                      <label className="form-label small fw-bold">মেম্বারের ছবি আপলোড করুন</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "image", setNewTeam)} />
                    </div>
                  </div>
                  <button className="btn btn-dark btn-sm mt-3 px-4 rounded-pill align-self-start" onClick={() => handleAdd("team", newTeam, setNewTeam, { name: "", designation: "", image: "", fb: "", twitter: "", linkedin: "" })}><i className="fas fa-plus"></i> মেম্বার যোগ করুন</button>
                </div>

                <h6 className="fw-bold text-dark mb-3">আমাদের বর্তমান টিম মেম্বার ({team.length})</h6>
                <div className="row g-3">
                  {team.map((m) => (
                    <div className="col-md-3 col-sm-6" key={m.id}>
                      <div className="card border text-center p-3 h-100 shadow-sm position-relative">
                        <img src={m.image || "https://placehold.co/200x200"} className="rounded-circle mx-auto mb-3" style={{ width: "90px", height: "90px", objectFit: "cover" }} alt={m.name} />
                        <h6 className="fw-bold mb-1">{m.name}</h6>
                        <span className="text-primary small d-block mb-3">{m.designation}</span>
                        <button className="btn btn-outline-danger btn-sm rounded-pill w-100" onClick={() => handleDelete("team", m.id)}><i className="fas fa-trash-alt me-1"></i> রিমুভ কর্মী</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ট্যাব ৭: ক্লায়েন্ট রিভিউ */}
            {activeTab === "testimonials" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2">ক্লায়েন্ট প্রশংসাপত্র ম্যানেজার</h4>
                <div className="card p-3 mb-4 bg-light border-0">
                  <h6 className="fw-bold text-muted mb-3">নতুন ক্লায়েন্ট রিভিউ যুক্ত করুন</h6>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="ক্লায়েন্টের নাম" value={newReview.name} onChange={(e) => setNewReview({ ...newReview, name: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <input type="text" className="form-control" placeholder="পদবী/অবস্থান (যেমন: উদ্যোক্তা)" value={newReview.role} onChange={(e) => setNewReview({ ...newReview, role: e.target.value })} />
                    </div>
                    <div className="col-md-4">
                      <select className="form-select" value={newReview.rating} onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}>
                        <option value="5">৫ স্টার</option>
                        <option value="4">৪ স্টার</option>
                        <option value="3">৩ স্টার</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <textarea className="form-control" rows="2" placeholder="রিভিউ ডেসক্রিপশন লিখুন..." value={newReview.feedback} onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}></textarea>
                    </div>
                    <div className="col-md-6 mt-2">
                      <label className="form-label small fw-bold">ক্লায়েন্ট ইমেজ আপলোড</label>
                      <input type="file" className="form-control" accept="image/*" onChange={(e) => handleImageUpload(e, "image", setNewReview)} />
                    </div>
                  </div>
                  <button className="btn btn-dark btn-sm mt-3 px-4 rounded-pill align-self-start" onClick={() => handleAdd("testimonials", newReview, setNewReview, { name: "", role: "", feedback: "", rating: "5", image: "" })}><i className="fas fa-plus"></i> রিভিউ যোগ করুন</button>
                </div>

                <h6 className="fw-bold text-dark mb-3">বর্তমান ক্লায়েন্ট ফিডব্যাক তালিকা ({testimonials.length})</h6>
                <div className="row g-3">
                  {testimonials.map((t) => (
                    <div className="col-md-4" key={t.id}>
                      <div className="card p-3 border h-100 shadow-sm position-relative">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <img src={t.image || "https://placehold.co/100x100"} className="rounded-circle" style={{ width: "45px", height: "45px", objectFit: "cover" }} alt={t.name} />
                          <div>
                            <h6 className="fw-bold mb-0" style={{ fontSize: "13px" }}>{t.name}</h6>
                            <small className="text-muted">{t.role}</small>
                          </div>
                        </div>
                        <div className="text-warning mb-2 small">{"★".repeat(parseInt(t.rating || "5"))}</div>
                        <p className="text-muted small mb-3">"{t.feedback}"</p>
                        <button className="btn btn-outline-danger btn-sm mt-auto" onClick={() => handleDelete("testimonials", t.id)}><i className="fas fa-trash-alt me-1"></i> ডিলিট রিভিউ</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ট্যাব ৮: ক্লায়েন্ট ইনবক্স */}
            {activeTab === "inbox" && (
              <div>
                <h4 className="fw-bold mb-4 text-dark border-bottom pb-2"><i className="fas fa-inbox text-primary me-2"></i> ক্লায়েন্ট মেসেজ ও ইনকোয়ারী বক্স</h4>
                
                {/* সাব-ট্যাব ১: যোগাযোগ ফর্ম মেসেজ */}
                <h5 className="fw-bold text-dark mb-3"><i className="fas fa-envelope-open-text me-2"></i> যোগাযোগ ফর্ম থেকে মেসেজ সমূহ ({contactMsgs.length})</h5>
                {contactMsgs.length === 0 ? (
                  <p className="text-muted small my-3">কোনো মেসেজ পাওয়া যায়নি।</p>
                ) : (
                  <div className="row g-3 mb-5">
                    {contactMsgs.map((msg) => (
                      <div className="col-12" key={msg.id}>
                        <div className="card p-3 border-0 bg-light shadow-sm position-relative">
                          <div className="d-flex justify-content-between flex-wrap gap-2">
                            <div>
                              <h6 className="fw-bold mb-1">{msg.name} ({msg.email})</h6>
                              <div className="small text-primary fw-bold mb-2">বিষয়: {msg.subject || "সাধারণ কৌতূহল"}</div>
                            </div>
                            <span className="small text-muted">{msg.timestamp ? new Date(msg.timestamp.seconds * 1000).toLocaleString() : ""}</span>
                          </div>
                          <p className="text-dark bg-white p-2.5 rounded border mb-0 small text-justify" style={{ lineHeight: "1.6" }}>{msg.message}</p>
                          <button className="btn btn-danger btn-sm position-absolute bottom-3 end-3 rounded-pill px-3" onClick={() => handleDelete("contact_submissions", msg.id)}><i className="fas fa-trash-alt me-1"></i> ডিলিট মেসেজ</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* সাব-ট্যাব ২: ফ্রি কনসালটেন্সি বুকিং */}
                <h5 className="fw-bold text-dark mb-3 border-top pt-4"><i className="fas fa-rocket me-2 text-warning"></i> ফ্রি কনসালটেন্সি বুকিং রিকোয়েস্ট ({consultancyMsgs.length})</h5>
                {consultancyMsgs.length === 0 ? (
                  <p className="text-muted small my-3">কোনো বুকিং রিকোয়েস্ট পাওয়া যায়নি।</p>
                ) : (
                  <div className="row g-3">
                    {consultancyMsgs.map((booking) => (
                      <div className="col-md-6" key={booking.id}>
                        <div className="card p-3 border-0 bg-light shadow-sm position-relative h-100">
                          <h6 className="fw-bold mb-1 text-dark">{booking.name}</h6>
                          <div className="small text-muted mb-1"><i className="fas fa-phone me-1"></i> {booking.phone}</div>
                          {booking.email && <div className="small text-muted mb-2"><i className="fas fa-envelope me-1"></i> {booking.email}</div>}
                          {booking.message && <p className="small text-dark p-2 bg-white rounded border text-justify mb-4"><strong>চাহিদা:</strong> {booking.message}</p>}
                          <button className="btn btn-outline-danger btn-sm position-absolute bottom-2 end-2 rounded-pill px-3" onClick={() => handleDelete("consultancy_bookings", booking.id)}><i className="fas fa-trash-alt me-1"></i> ডিলিট বুকিং</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
