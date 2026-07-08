import React from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";

export default function Header() {
  const { settings } = useSettings();

  // ভাষা পরিবর্তন করানোর জন্য গ্লোবাল উইন্ডো ফাংশন ট্রিগার করা হচ্ছে
  const handleLangChange = (lang) => {
    if (window.changeLanguage) {
      window.changeLanguage(lang);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
        <div className="container">
            {/* ডাইনামিক লোগো ও ব্র্যান্ডিং সেকশন */}
            <Link className="navbar-brand" to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
                {settings.navbarLogo ? (
                    // যদি এডমিন প্যানেলে লোগো আপলোড করা থাকে তবে সেটি দেখাবে
                    <img src={settings.navbarLogo} alt={settings.siteName || "Logo"} style={{ height: "40px", objectFit: "contain" }} />
                ) : (
                    // লোগো আপলোড করা না থাকলে চমৎকার পিউর সিএসএস টাইপোগ্রাফি লোগো দেখাবে
                    <>
                        <div style={{
                            background: "linear-gradient(135deg, #ff6b00, #ff8c00)", 
                            color: "white", 
                            width: "42px", 
                            height: "42px", 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "center", 
                            borderRadius: "12px", // সংশোধন করা হয়েছে (camelCase)
                            fontWeight: "900", 
                            fontSize: "22px", 
                            boxShadow: "0 4px 12px rgba(255, 107, 0, 0.25)", 
                            fontFamily: "sans-serif"
                        }}>
                            E
                        </div>
                        <span style={{ 
                            fontWeight: "800", 
                            fontSize: "1.55rem", 
                            color: "#1a1a2a", 
                            letterSpacing: "-0.5px", 
                            fontFamily: "'Hind Siliguri', sans-serif" 
                        }}>
                            {settings.siteName || "Eagle"} <span style={{ color: "var(--primary-color)" }}>Dev's</span>
                        </span>
                    </>
                )}
            </Link>

            {/* মোবাইল মেনু টগল বাটন */}
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto align-items-center">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">হোম</Link>
                    </li>
                    
                    {/* সম্পর্কে সাব-মেনু */}
                    <li className="nav-item has-submenu">
                        <a className="nav-link" href="#" onClick={(e) => e.preventDefault()}>
                            সম্পর্কে <i className="fas fa-angle-down submenu-arrow"></i>
                        </a>
                        <ul className="submenu">
                            <li><Link to="/about">আমাদের সম্পর্কে</Link></li>
                            <li><Link to="/service">আমাদের সার্ভিস</Link></li>
                            <li><Link to="/themes">আমাদের প্রোডাক্ট</Link></li>
                            <li><Link to="/portfolio">আমাদের পোর্টফলিও</Link></li>
                            <li><Link to="/priceing">ওয়েব সাইট প্যাকেজ</Link></li>
                            <li><Link to="/team">আমাদের টিম</Link></li>
                        </ul>
                    </li>
              
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">যোগাযোগ</Link>
                    </li>
              
                    {/* ভাষা পরিবর্তন করার গুগল অনুবাদক ড্রপডাউন */}
                    <li className="nav-item dropdown ms-2">
                        <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" id="langDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: "inherit", fontWeight: 500 }}>
                            <i className="fas fa-language" style={{ fontSize: "1.1rem" }}></i>
                            <span>ভাষা</span>
                        </a>
                        
                        <ul className="dropdown-menu dropdown-menu-end shadow border-0 mt-2" aria-labelledby="langDropdown">
                            <li>
                                <button className="dropdown-item d-flex align-items-center py-2" onClick={() => handleLangChange('bn')} style={{ border: "none", background: "none", width: "100%" }}>
                                    <img src="https://flagcdn.com/w20/bd.png" alt="BD" className="me-2" style={{ width: "18px" }} /> 
                                    বাংলা
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item d-flex align-items-center py-2" onClick={() => handleLangChange('en')} style={{ border: "none", background: "none", width: "100%" }}>
                                    <img src="https://flagcdn.com/w20/us.png" alt="US" className="me-2" style={{ width: "18px" }} /> 
                                    English
                                </button>
                            </li>
                        </ul>
                    </li>

                    {/* ফ্রি পরামর্শ বাটন (নতুন হোয়াটসঅ্যাপ নাম্বারের সাথে লিংকড) */}
                    <li className="nav-item">
                        <a href={`https://wa.me/${settings.whatsapp || '8801854123433'}?text=Hello! আমি আপনাদের সার্ভিসের বিষয়ে কথা বলতে চাই।`} 
                           target="_blank" 
                           rel="noopener noreferrer" 
                           className="btn btn-custom ms-3 d-flex align-items-center gap-2"
                        >
                            <i className="fab fa-whatsapp" style={{ fontSize: "1.2rem" }}></i>
                            ফ্রি পরামর্শ
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
  );
                      }
