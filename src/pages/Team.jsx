import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে লোড হওয়ার জন্য ডিফল্ট ৪ জন টিম মেম্বারের তথ্য
const defaultTeam = [
  { id: "tm1", name: "মোঃ নজরুল ইসলাম", designation: "সিইও", image: "https://www.creativedesign.com.bd/assets/images/team/1766477297Md-Nazrul.jpg", fb: "https://web.facebook.com/official.creativedesign", twitter: "https://web.facebook.com/official.creativedesign", linkedin: "https://web.facebook.com/official.creativedesign" },
  { id: "tm2", name: "মোঃ নাইম হোসেন", designation: "ম্যানেজিং ডিরেক্টর", image: "https://www.creativedesign.com.bd/assets/images/team/1766477332Md-Nayeem.jpg", fb: "https://web.facebook.com/official.creativedesign", twitter: "https://web.facebook.com/official.creativedesign", linkedin: "https://web.facebook.com/official.creativedesign" },
  { id: "tm3", name: "মোঃ জুনায়েদ আলি", designation: "ওয়েব ডিজাইনার", image: "https://www.creativedesign.com.bd/assets/images/team/1766477366juna.jpg", fb: "https://web.facebook.com/official.creativedesign", twitter: "https://web.facebook.com/official.creativedesign", linkedin: "https://web.facebook.com/official.creativedesign" },
  { id: "tm4", name: "মোঃ ফয়জার আলী", designation: "গ্রাফিক্স ডিজাইনার", image: "https://www.creativedesign.com.bd/assets/images/team/1766477404foyzer.jpg", fb: "https://web.facebook.com/official.creativedesign", twitter: "https://web.facebook.com/official.creativedesign", linkedin: "https://web.facebook.com/official.creativedesign" }
];

export default function Team() {
  const { settings } = useSettings();
  const [dbTeam, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফায়ারস্টোর থেকে টিম কালেকশন নিয়ে আসা হচ্ছে
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const snap = await getDocs(collection(db, "team"));
        if (!snap.empty) {
          setTeam(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("টিম ডেটা লোড করতে সমস্যা হয়েছে", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const displayTeam = dbTeam.length > 0 ? dbTeam : defaultTeam;

  return (
    <div>
      {/* ১. হিরো সেকশন */}
      <section className="team-hero py-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)" }}>
        <div className="container py-5 text-center">
          <h1 className="fw-bold display-4 mb-3">আমাদের <span style={{ color: "var(--primary-color)" }}>দক্ষ</span> টিম</h1>
          <p className="lead opacity-75">অভিজ্ঞ টিম নিয়ে আমরা দিচ্ছি আপনার ব্যবসার সেরা ডিজিটাল সমাধান।</p>
        </div>
      </section>

      {/* ২. টিম মেম্বার গ্রিড সেকশন */}
      <section className="py-5 bg-light position-relative" style={{ marginTop: "-50px" }}>
        <div className="container">
          <div className="row g-4 justify-content-center">
            {displayTeam.map((m) => (
              <div className="col-lg-3 col-md-6 mb-4" key={m.id}>
                <div className="team-card shadow-lg border-0 text-center">
                  <div className="image-box position-relative overflow-hidden">
                    
                    {/* কর্মী ছবি */}
                    <img src={m.image || "https://placehold.co/300x320"} className="img-fluid" alt={m.name} />
                    
                    {/* সোশ্যাল মিডিয়া ওভারলে লিংক */}
                    <div className="social-overlay d-flex align-items-center justify-content-center">
                      {m.fb && (
                        <a href={m.fb} target="_blank" rel="noopener noreferrer" className="mx-2">
                          <i className="fab fa-facebook-f"></i>
                        </a>
                      )}
                      {m.twitter && (
                        <a href={m.twitter} target="_blank" rel="noopener noreferrer" className="mx-2">
                          <i className="fab fa-twitter"></i>
                        </a>
                      )}
                      {m.linkedin && (
                        <a href={m.linkedin} target="_blank" rel="noopener noreferrer" className="mx-2">
                          <i className="fab fa-linkedin-in"></i>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* কর্মী তথ্য */}
                  <div className="info-box p-4 bg-white">
                    <h5 className="fw-bold mb-1 text-dark">{m.name}</h5>
                    <p className="small text-uppercase fw-bold" style={{ color: "var(--primary-color)" }}>{m.designation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৩. কাস্টম রিকোয়েস্ট কল ব্যানার */}
      <section className="py-5 bg-white">
        <div className="container py-4 text-center">
          <div className="p-5 shadow-sm rounded-4 border mx-auto" style={{ maxWidth: "900px", borderRadius: "20px" }}>
            <h2 className="fw-bold mb-3" style={{ color: "#222" }}>কাস্টম প্যাকেজ প্রয়োজন?</h2>
            <p className="text-muted mb-4 fs-5">আপনার যদি বিশেষ কোনো চাহিদা থাকে তবে আমাদের সরাসরি কল দিন অথবা মেসেজ করুন।</p>
            <Link to="/contact" className="btn btn-outline-dark btn-lg px-5 py-2 rounded-pill fw-bold" style={{ borderWidth: "1.5px" }}>যোগাযোগ করুন</Link>
          </div>
        </div>
      </section>
    </div>
  );
}