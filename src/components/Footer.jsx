import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer>
        <div className="container">
            <div className="row">
                {/* ১. বাম পাশের কলাম: লোগো, ডেসক্রিপশন এবং সোশ্যাল আইকন */}
                <div className="col-lg-4 mb-4">
                    <h5 className="text-white d-flex align-items-center mb-3">
                        {settings.footerLogo ? (
                            // যদি এডমিন প্যানেলে ফুটার লোগো আপলোড করা থাকে তবে সেটি দেখাবে
                            <img src={settings.footerLogo} alt={settings.siteName || "Logo"} style={{ height: "40px", objectFit: "contain" }} />
                        ) : (
                            // লোগো আপলোড করা না থাকলে ডার্ক থিমের সাথে ফিট করা চমৎকার টাইপোগ্রাফি লোগো দেখাবে
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                <div style={{
                                    background: "linear-gradient(135deg, #ff6b00, #ff8c00)", 
                                    color: "white", 
                                    width: "35px", 
                                    height: "35px", 
                                    display: "flex", 
                                    alignItems: "center", 
                                    justifyContent: "center", 
                                    borderRadius: "8px", // সংশোধন করা হয়েছে (camelCase)
                                    fontWeight: "900", 
                                    fontSize: "18px", 
                                    fontFamily: "sans-serif"
                                }}>
                                    E
                                </div>
                                <span style={{ fontWeight: "800", fontSize: "1.4rem", color: "white" }}>
                                    {settings.siteName || "Eagle"} <span style={{ color: "var(--primary-color)" }}>Dev's</span>
                                </span>
                            </div>
                        )}
                    </h5>
                    <p className="small text-muted">আমরা ছোট এবং মাঝারি ব্যবসার জন্য ডিজিটাল সমাধান প্রদান করি। আপনার ব্যবসার প্রসারে আমরা সর্বদা পাশে আছি।</p>
                    
                    {/* ডাইনামিক সোশ্যাল মিডিয়া লিংকসমূহ */}
                    <div className="social-icons mt-3">
                        {settings.facebook && (
                            <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="me-3">
                                <i className="fab fa-facebook"></i>
                            </a>
                        )}
                        {settings.twitter && (
                            <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="me-3">
                                <i className="fab fa-twitter"></i>
                            </a>
                        )}
                        {settings.instagram && (
                            <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="me-3">
                                <i className="fab fa-instagram"></i>
                            </a>
                        )}
                        {settings.youtube && (
                            <a href={settings.youtube} target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-youtube"></i>
                            </a>
                        )}
                    </div>
                </div>

                {/* ২. মাঝের কলাম: গুরুত্বপূর্ণ লিঙ্কসমূহ */}
                <div className="col-lg-2 col-6 mb-4">
                    <h5>লিঙ্কস</h5>
                    <ul className="list-unstyled">
                        <li className="mb-2"><Link to="/">হোম</Link></li>
                        <li className="mb-2"><Link to="/about">আমাদের সম্পর্কে</Link></li>
                        <li className="mb-2"><Link to="/service">সার্ভিস</Link></li>
                        <li className="mb-2"><Link to="/contact">যোগাযোগ</Link></li>
                    </ul>
                </div>

                {/* ৩. ৩য় কলাম: আমাদের সার্ভিসসমূহ */}
                <div className="col-lg-3 col-6 mb-4">
                    <h5>সার্ভিসসমূহ</h5>
                    <ul className="list-unstyled">
                        <li className="mb-2"><Link to="/service">ই-কমার্স</Link></li>
                        <li className="mb-2"><Link to="/service">এসইও</Link></li>
                        <li className="mb-2"><Link to="/service">গ্রাফিক ডিজাইন</Link></li>
                        <li className="mb-2"><Link to="/service">কনটেন্ট রাইটিং</Link></li>
                    </ul>
                </div>

                {/* ৪. ডান পাশের কলাম: যোগাযোগের ঠিকানা ও কন্টাক্ট ডিটেইলস */}
                <div className="col-lg-3 mb-4">
                    <h5>যোগাযোগ</h5>
                    <p className="small mb-2">
                        <i className="fas fa-map-marker-alt me-2 text-primary"></i> 
                        {settings.address || "হাউজঃ ৩৫/৩/১- বি, নছের মার্কেট, কোনাবাড়ি, গাজিপুর"}
                    </p>
                    <p className="small mb-2">
                        <i className="fas fa-phone me-2 text-primary"></i> 
                        {settings.phone || "০১৮৫৪১২৩৪৩৩"}
                    </p>
                    <p className="small mb-0">
                        <i className="fas fa-envelope me-2 text-primary"></i> 
                        <a href={`mailto:${settings.email || 'info@eagledevs.com'}`}>{settings.email || "info@eagledevs.com"}</a>
                    </p>
                </div>
            </div>

            <hr className="border-secondary mt-4" />
            
            {/* ৫. কপিরাইট টেক্সট */}
            <div className="text-center pt-3">
               <p className="mb-0 small">&copy; {new Date().getFullYear()} সকল কিছুর স্বত্বাধিকারঃ <Link to="/" className="fw-bold text-white">{settings.siteName || "Eagle Dev's"}</Link></p>
            </div>
        </div>
    </footer>
  );
                      }
