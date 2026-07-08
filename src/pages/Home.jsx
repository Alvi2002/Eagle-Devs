import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে লোড হওয়ার জন্য ডিফল্ট ব্যাকআপ তথ্য
const defaultServices = [
  { id: "s1", title: "ওয়েব ডিজাইন", desc: "আমাদের ওয়েব ডিজাইন ও ডেভেলপমেন্ট প্যাকেজ শুরু ৮০০০ টাকা থেকে", icon: "fas fa-globe" },
  { id: "s2", title: "সফটওয়্যার ডেভেলপমেন্ট", desc: "আমাদের সফটওয়্যার ডেভেলপমেন্ট প্যাকেজ শুরু ১০০০০ টাকা থেকে", icon: "fas fa-laptop" },
  { id: "s3", title: "SEO সার্ভিস", desc: "আমাদের এসইও এর সকল সার্ভিস প্যাকেজ শুরু ৩০০০ টাকা থেকে", icon: "fas fa-chart-line" },
  { id: "s4", title: "ডোমেন, হোস্টিং ও সার্ভার", desc: "আমাদের ডোমেন এবং হোস্টিং এর প্যাকেজ শুরু ৩০০০ টাকা থেকে", icon: "fa fa-server" }
];

const defaultPackages = [
  { id: "p1", name: "স্টার্টার", price: "৩৫০০", duration: "এককালীন পেমেন্ট", features: ["১ পেজের ল্যান্ডিং পেজ", "মোবাইল ফ্রেন্ডলি ডিজাইন", "১০ জিবি ফাস্ট হোস্টিং", "১ বছরের ডোমেইন ফ্রি", "পেমেন্ট গেটওয়ে", "এসইও অপ্টিমাইজেশন"] },
  { id: "p2", name: "উদ্যোক্তা", price: "৮০০০", duration: "এককালীন পেমেন্ট", features: ["৫ পেজের ডায়নামিক ওয়েবসাইট", "প্রিমিয়াম ডিজাইন", "আনলিমিটেড হোস্টিং স্পেস", "ফ্রি .com ডোমেইন", "সোশ্যাল মিডিয়া চ্যাট বট", "১ মাসের ফ্রি সাপোর্ট"] },
  { id: "p3", name: "বিজনেস প্রো", price: "১৮৫০০", duration: "এককালীন পেমেন্ট", features: ["ফুল ই-কমার্স সリューション", "ইনভেন্টরি ম্যানেজমেন্ট", "পেমেন্ট গেটওয়ে (বিকাশ/নগদ)", "অন-পেজ এসইও (SEO)", "ফেসবুক পিক্সেল সেটআপ", "৬ মাসের ফ্রি মেইনটেনেন্স"] }
];

const defaultPortfolio = [
  { id: "port1", title: "ফাকল পুলিশ লাইন্স স্কুল অ্যান্ড কলেজ", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766477223phakal.jpg", link: "https://phakal.edu.bd/" },
  { id: "port2", title: "Astha Online Shop", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/17664771611.jpg", link: "https://asthaonlinnebd.shop/" },
  { id: "port3", title: "Nabanno BD", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766477105nobanno.jpg", link: "https://nabannobd.com" },
  { id: "port4", title: "Quick Pharma", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766477053gro.jpg", link: "https://quickpharma.com.bd/" },
  { id: "port5", title: "স্বাধীন একাত্তর", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766476992shadinek.jpg", link: "https://shadinekattor.news" },
  { id: "port6", title: "SJUS", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766476939sjus.jpg", link: "https://sjus.org.bd/" },
  { id: "port7", title: "Bapjan.com", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766476898bapjan.jpg", link: "https://bapjan.com/" },
  { id: "port8", title: "ই বই বিতান", category: "web-dijan", image: "https://www.creativedesign.com.bd/assets/images/portfolio/1766476853eboibitan.jpg", link: "https://eboibitan.com" }
];

const defaultTestimonials = [
  { id: "t1", name: "ফাতেমা আক্তার", role: "উদ্যোক্তা", rating: "5", feedback: "আমরা আমাদের নতুন ওয়েবসাইটের সমস্ত দিক নিয়ে খুব মুগ্ধ হয়েছি। আমরা একটি ওয়েবসাইট তৈরি করে ছিলাম ক্রিয়েটিভ ডিজাইন থেকে, ধন্যবাদ।", image: "https://www.creativedesign.com.bd/assets/images/testimonials/176624437417362348801814731466.png" },
  { id: "t2", name: "খালেদ মাহমুদ", role: "ম্যানেজার", rating: "5", feedback: "আমি ক্রিয়েটিভ ডিজাইনের সাথে কাজ করতে পেরে খুব খুশি। তারা খুব বন্ধুত্বপূর্ণ, তারা আমার কাজটি খুব সুন্দরভাবে করেছে। ধন্যবাদ ক্রিয়েটিভ ডিজাইন।", image: "https://www.creativedesign.com.bd/assets/images/testimonials/176624433817362347301097715037.png" },
  { id: "t3", name: "জিয়া হাসান", role: "কো-সিইও", rating: "5", feedback: "ক্রিয়েটিভ ডিজাইন এর সাথে কাজ করতে পেরে আমি খুবই খুশি। তারা খুব সহায়ক. তাদের কাস্টমার সাপোর্ট খুবই ভালো।", image: "https://www.creativedesign.com.bd/assets/images/testimonials/176624429517362346181434000873.png" }
];

const defaultTeam = [
  { id: "tm1", name: "মোঃ নজরুল ইসলাম", designation: "সিইও", image: "https://www.creativedesign.com.bd/assets/images/team/1766477297Md-Nazrul.jpg" },
  { id: "tm2", name: "মোঃ নাইম হোসেন", designation: "ম্যানেজিং ডিরেক্টর", image: "https://www.creativedesign.com.bd/assets/images/team/1766477332Md-Nayeem.jpg" },
  { id: "tm3", name: "মোঃ জুনায়েদ আলি", designation: "ওয়েব ডিজাইনার", image: "https://www.creativedesign.com.bd/assets/images/team/1766477366juna.jpg" },
  { id: "tm4", name: "মোঃ ফয়জার আলী", designation: "গ্রাফিক্স ডিজাইনার", image: "https://www.creativedesign.com.bd/assets/images/team/1766477404foyzer.jpg" }
];

const staticBrands = [
  { id: "b1", img: "https://www.creativedesign.com.bd/assets/images/brands/1766477495mylogo.png", url: "https://www.creativedesign.com.bd/" },
  { id: "b2", img: "https://www.creativedesign.com.bd/assets/images/brands/1766160015momo.png", url: "https://momo.com.bd/" },
  { id: "b3", img: "https://www.creativedesign.com.bd/assets/images/brands/1766159831surokhha.png", url: "https://surokkhapaybd.com" },
  { id: "b4", img: "https://www.creativedesign.com.bd/assets/images/brands/1766159723astha.png", url: "https://asthaonlinnebd.shop/" },
  { id: "b5", img: "https://www.creativedesign.com.bd/assets/images/brands/1766159594eboi.png", url: "https://eboibitan.com/" },
  { id: "b6", img: "https://www.creativedesign.com.bd/assets/images/brands/1766159017sottat.png", url: "https://web.facebook.com/p/%E0%A6%B8%E0%A6%A4%E0%A6%A4%E0%A6%BE-%E0%A6%89%E0%A6%A8%E0%A7%8D%E0%A6%A8%E0%A6%AF%E0%A6%BC%E0%A6%A8-%E0%A6%AB%E0%A7%8B%E0%A6%B0%E0%A6%BE%E0%A6%AE-100067069501902" },
  { id: "b7", img: "https://www.creativedesign.com.bd/assets/images/brands/1766158843doinik-jonatar-bngaladesh.png", url: "https://www.dailyjanatarbangladesh.com/" },
  { id: "b8", img: "https://www.creativedesign.com.bd/assets/images/brands/1766158648phakal.png", url: "https://phakal.edu.bd" }
];

export default function Home() {
  const { settings } = useSettings();
  const [dbServices, setServices] = useState([]);
  const [dbPortfolios, setPortfolios] = useState([]);
  const [dbPackages, setPackages] = useState([]);
  const [dbTestimonials, setTestimonials] = useState([]);
  const [dbTeam, setTeam] = useState([]);
  
  // পোর্টফোলিও ফিল্টার স্টেট
  const [activeFilter, setActiveFilter] = useState("*");

  // ফায়ারস্টোর থেকে ডাটা লোড করা হচ্ছে
  useEffect(() => {
    const fetchCollection = async (colName, setter) => {
      try {
        const snap = await getDocs(collection(db, colName));
        if (!snap.empty) {
          setter(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error(`${colName} লোড করতে সমস্যা হয়েছে`, err);
      }
    };

    fetchCollection("services", setServices);
    fetchCollection("portfolios", setPortfolios);
    fetchCollection("packages", setPackages);
    fetchCollection("testimonials", setTestimonials);
    fetchCollection("team", setTeam);
  }, []);

  // ডাটা রেন্ডার শেষ হওয়ার পর জেকোয়েরি স্লাইডারগুলো সক্রিয় করা
  useEffect(() => {
    const timer = setTimeout(() => {
      const $ = window.$;
      if ($ && typeof $.fn.owlCarousel === "function") {
        $(".owl-carousel").trigger('destroy.owl.carousel');

        // ব্র্যান্ড স্লাইডার
        $(".brand-slider").owlCarousel({
          loop: true,
          margin: 30,
          nav: false,
          dots: false,
          autoplay: true,
          autoplayTimeout: 3000,
          autoplayHoverPause: true,
          responsive: { 0: { items: 2 }, 600: { items: 3 }, 1000: { items: 6 } }
        });

        // টেস্টমোনিয়াল স্লাইডার
        $(".testimonial-carousel").owlCarousel({
          loop: true,
          margin: 20,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4000,
          smartSpeed: 1000,
          responsive: { 0: { items: 1 }, 768: { items: 2 }, 1000: { items: 3 } }
        });

        // টিম স্লাইডার
        $(".team-slider").owlCarousel({
          loop: true,
          margin: 25,
          nav: false,
          dots: true,
          autoplay: true,
          autoplayTimeout: 4000,
          responsive: { 0: { items: 1 }, 600: { items: 2 }, 1000: { items: 4 } }
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [dbTestimonials, dbTeam]);

  const displayServices = dbServices.length > 0 ? dbServices : defaultServices;
  const displayPortfolios = dbPortfolios.length > 0 ? dbPortfolios : defaultPortfolio;
  const displayPackages = dbPackages.length > 0 ? dbPackages : defaultPackages;
  const displayTestimonials = dbTestimonials.length > 0 ? dbTestimonials : defaultTestimonials;
  const displayTeam = dbTeam.length > 0 ? dbTeam : defaultTeam;

  const filteredPortfolios = activeFilter === "*" 
    ? displayPortfolios 
    : displayPortfolios.filter(item => item.category === activeFilter);

  return (
    <div>
      {/* ১. হিরো সেকশন */}
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title fw-bold">
                {settings.heroTitle || "আপনার অনলাইন ব্যবসার নির্ভরযোগ্য সহযোগী"} — <span style={{ color: "var(--primary-color)" }}>{settings.siteName || "Eagle Dev's"}</span>
              </h1>
              <p className="lead text-muted mb-4 fs-5">
                {settings.heroSubtitle || "আমরা দিচ্ছি প্রিমিয়াম কোয়ালিটির ই-কমার্স ওয়েবসাইট, ডিজিটাল মার্কেটিং এবং সফটওয়্যার সলিউশন। আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমরা প্রস্তুত।"}
              </p>
              <div className="d-flex gap-3 justify-content-lg-start justify-content-center">
                <Link to="/priceing" className="btn btn-custom btn-lg">প্যাকেজ দেখুন</Link>
                <Link to="/freeconsultant" className="btn btn-outline-primary btn-lg rounded-pill px-4">ফ্রি কনসালটেন্সি</Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="hero-img-wrapper text-center">
                <img src="https://www.creativedesign.com.bd/assets/images/about/1766477456.jpg" alt="Team Working" className="hero-img img-fluid rounded-4 shadow-lg" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ২. ডিজিটাল ইকোসিস্টেম ব্যানার */}
      <section className="py-5 text-center container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-3">বাংলাদেশে এইবার আমরাই নিয়ে এসেছি সম্পূর্ণ ডিজিটাল ইকোসিস্টেম</h2>
            <p className="text-muted">{settings.siteName || "Eagle Dev's"} শুধুমাত্র একটি সার্ভিস প্রোভাইডার নয়, আমরা আপনার ব্যবসার গ্রোথ পার্টনার। ওয়েবসাইট থেকে শুরু করে মার্কেটিং - সব সমাধান এক ছাদের নিচে।</p>
          </div>
        </div>
      </section>

      {/* ৩. আমাদের সেবা */}
      <section id="services" className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase">আমাদের সেবা</h6>
            <h2 className="fw-bold">আমরা কিভাবে সাহায্য করি?</h2>
          </div>
          <div className="row g-4">
            {displayServices.map((s) => (
              <div className="col-md-3 col-sm-6" key={s.id}>
                <div className="service-card">
                  <div className="icon-box">
                    <i className={s.icon || "fas fa-globe"}></i>
                  </div>
                  <h5 className="fw-bold">{s.title}</h5>
                  <p className="small text-muted mb-0">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৪. প্রাইসিং প্যাকেজ */}
      <section id="pricing" className="pricing-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase">আমাদের প্যাকেজ</h6>
            <h2 className="fw-bold display-6">বাজেট অনুযায়ী সেরা প্ল্যানটি বেছে নিন</h2>
            <p className="text-muted w-75 mx-auto">কোনো গোপন চার্জ নেই। আপনার ব্যবসার প্রয়োজন অনুযায়ী প্যাকেজ সিলেক্ট করুন এবং আজই শুরু করুন।</p>
          </div>
          <div className="row align-items-center justify-content-center">
            {displayPackages.map((pkg, idx) => {
              const isPopular = idx === 1;
              return (
                <div className="col-lg-4 col-md-6 mb-4" key={pkg.id}>
                  <div className={`pricing-card ${isPopular ? "popular" : ""}`}>
                    {isPopular && <div className="popular-badge">BEST VALUE</div>}
                    <div className="pricing-header">
                      <h4 className="fw-bold">{pkg.name}</h4>
                      <div className="price-value" style={{ fontSize: "3rem", fontWeight: "800", color: "#ff6b00" }}>
                        <span className="currency">৳</span>{pkg.price}
                      </div>
                      <span className="duration">{pkg.duration}</span>
                    </div>
                    <ul className="pricing-features">
                      {pkg.features && pkg.features.map((feat, i) => (
                        <li key={i} className="mb-3" style={{ display: "flex", alignItems: "center" }}><i className="fas fa-check" style={{ color: "#28a745", background: "#e8f5e9", padding: "5px", borderRadius: "50%", marginRight: "10px" }}></i> {feat}</li>
                      ))}
                    </ul>
                    <a href={`https://wa.me/${settings.whatsapp || '8801854123433'}?text=Hello! আমি ${pkg.name} প্যাকেজটি নিতে চাই।`} 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       className={`btn btn-pricing ${isPopular ? "btn-primary" : "btn-outline-primary"}`}
                       style={isPopular ? { background: "#ff6b00", borderColor: "#ff6b00" } : {}}
                    >
                      {isPopular ? "এখনই কিনুন" : "অর্ডার করুন"}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ৫. কেন আমাদেরই বেছে নিবেন? */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <img src="https://www.creativedesign.com.bd/assets/images/why-choose-us/1766477598_why.jpg" 
                   alt="Why Choose Us" 
                   className="img-fluid rounded-4 shadow mb-4 mb-lg-0" 
                   style={{ width: "100%", height: "500px", objectFit: "cover" }} />
            </div>
            <div className="col-lg-6 ps-lg-5">
              <h2 className="fw-bold mb-4">কেন আমাদেরই বেছে নিবেন?</h2>
              
              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <i className="fas fa-users fa-2x text-primary"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>অভিজ্ঞ টিম</h5>
                  <p className="text-muted">আমাদের রয়েছে অভিজ্ঞ ডেভেলপার এবং মার্কেটারদের একটি দক্ষ টিম।</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <i className="fas fa-clock fa-2x text-primary"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>সময়মত ডেলিভারি</h5>
                  <p className="text-muted">আমরা প্রজেক্টের ডেডলাইন মেনে কাজ করতে প্রতিশ্রুতিবদ্ধ।</p>
                </div>
              </div>

              <div className="d-flex mb-4">
                <div className="flex-shrink-0">
                  <i className="fas fa-hand-holding-dollar fa-2x text-primary"></i>
                </div>
                <div className="flex-grow-1 ms-3">
                  <h5>সাশ্রয়ী মূল্য</h5>
                  <p className="text-muted">সেরা মানের সেবা, কিন্তু বাজেটের মধ্যেই। কোনো গোপন চার্জ নেই।</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ৬. পোর্টফোলিও */}
      <section id="portfolio" className="portfolio-section">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase">পোর্টফোলিও</h6>
            <h2 className="fw-bold display-6">আমাদের সাম্প্রতিক কাজসমূহ</h2>
            <div style={{ width: "60px", height: "3px", background: "#ff6b00", margin: "15px auto" }}></div>
          </div>

          <div className="portfolio-menu">
            <button className={activeFilter === "*" ? "active" : ""} onClick={() => setActiveFilter("*")}>সকল</button>
            <button className={activeFilter === "web-dijan" ? "active" : ""} onClick={() => setActiveFilter("web-dijan")}>ওয়েব ডিজান</button>
            <button className={activeFilter === "sftwzar-development" ? "active" : ""} onClick={() => setActiveFilter("sftwzar-development")}>সফটওয়্যার ডেভেলোপমেন্ট</button>
            <button className={activeFilter === "esioo" ? "active" : ""} onClick={() => setActiveFilter("esioo")}>এসইও</button>
          </div>

          <div className="row">
            {filteredPortfolios.map((p) => (
              <div className="col-lg-3 col-md-6 col-sm-12 mb-4" key={p.id}>
                <div className="portfolio-item">
                  <img src={p.image || "https://placehold.co/400x300"} className="portfolio-img" alt={p.title} />
                  <div className="portfolio-overlay">
                    <h5 className="text-center px-2">{p.title}</h5>
                    <p className="text-uppercase small">{p.category === "web-dijan" ? "ওয়েব ডিজান" : p.category === "sftwzar-development" ? "সফটওয়্যার" : "এসইও"}</p>
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn-view">
                      <i className="fas fa-link"></i> ভিজিট করুন
                    </a>
                  </div>
                </div>
              </div>
            ))}
            {filteredPortfolios.length === 0 && (
              <div className="col-12 text-center py-5 text-muted">
                <h5>এই ক্যাটাগরিতে কোনো প্রজেক্ট নেই।</h5>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ৭. প্রশংসাপত্র */}
      <section id="testimonials" className="testimonial-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase">প্রশংসা সমূহ</h6>
            <h2 className="fw-bold display-6">আমাদের ক্লায়েন্টগন কি বলে</h2>
            <div style={{ width: "60px", height: "3px", background: "#ff6b00", margin: "15px auto" }}></div>
          </div>

          <div className="owl-carousel owl-theme testimonial-carousel">
            {displayTestimonials.map((t) => (
              <div className="item" key={t.id}>
                <div className="testimonial-card">
                  <i className="fas fa-quote-right quote-icon-bg"></i>
                  <div className="client-img-wrapper">
                    <img src={t.image || "https://placehold.co/100x100"} className="client-img" alt={t.name} />
                  </div>
                  <div className="stars">
                    {Array.from({ length: parseInt(t.rating || "5") }).map((_, i) => (
                      <i className="fas fa-star" key={i}></i>
                    ))}
                  </div>
                  <p className="review-text">"{t.feedback}"</p>
                  <div className="client-info">
                    <h5>{t.name}</h5>
                    <small>{t.role}</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ৮. স্ট্যাটস */}
      <section className="stats-section text-center py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-number">১০০০+</div>
              <div>হ্যাপি ক্লায়েন্ট</div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-number">১৩০০+</div>
              <div>প্রজেক্ট সম্পন্ন</div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-number">২৪/৭</div>
              <div>সাপোর্ট অ্যাক্টিভ</div>
            </div>
            <div className="col-md-3 col-6 mb-4 mb-md-0">
              <div className="stat-number">৬+</div>
              <div>বছরের অভিজ্ঞতা</div>
            </div>
          </div>
        </div>
      </section>

      {/* ৯. আমাদের টিম */}
      <section id="team" className="team-section py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold text-uppercase">আমাদের এক্সপার্টরা</h6>
            <h2 className="fw-bold display-6">আমাদের সকল টিম মেম্বারদের দেখুন</h2>
            <div style={{ width: "60px", height: "3px", background: "#ff6b00", margin: "15px auto" }}></div>
          </div>

          <div className="team-slider owl-carousel">
            {displayTeam.map((m) => (
              <div className="item" key={m.id}>
                <div className="team-card">
                  <div className="team-img-wrapper" style={{ height: "280px", width: "100%" }}>
                    <img src={m.image || "https://placehold.co/300x300"} className="team-img" alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center", transition: "transform 0.5s ease" }} />
                    <div className="team-social-overlay" style={{ position: "absolute", bottom: "-60px", left: 0, width: "100%", background: "rgba(255, 107, 0, 0.9)", textAlign: "center", padding: "12px 0", transition: "all 0.3s ease" }}>
                      <a href="https://web.facebook.com/official.creativedesign" target="_blank" rel="noopener noreferrer" style={{ color: "white", margin: "0 10px", fontSize: "18px" }}><i className="fab fa-facebook-f"></i></a>
                      <a href="https://web.facebook.com/official.creativedesign" target="_blank" rel="noopener noreferrer" style={{ color: "white", margin: "0 10px", fontSize: "18px" }}><i className="fab fa-linkedin-in"></i></a>
                      <a href="https://web.facebook.com/official.creativedesign" target="_blank" rel="noopener noreferrer" style={{ color: "white", margin: "0 10px", fontSize: "18px" }}><i className="fab fa-twitter"></i></a>
                    </div>
                  </div>
                  <div className="team-info" style={{ padding: "25px 20px", textAlign: "center" }}>
                    <h5 className="team-name" style={{ fontWeight: "700", fontSize: "1.2rem", color: "#333", marginBottom: "5px" }}>{m.name}</h5>
                    <span className="team-designation" style={{ color: "#ff6b00", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px" }}>{m.designation}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ১০. ব্র্যান্ড স্লাইডার */}
      <section className="brand-section py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h5 className="fw-bold text-muted">যাদের সাথে আমরা কাজ করছি</h5>
          </div>
          <div className="brand-slider owl-carousel">
            {staticBrands.map((b) => (
              <div className="single-brand-item px-3" key={b.id}>
                <a href={b.url} target="_blank" rel="noopener noreferrer">
                  <img src={b.img} alt="পার্টনার লোগো" className="brand-logo img-fluid" style={{ maxHeight: "80px", width: "auto", margin: "0 auto", objectFit: "contain" }} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ১১. কল টু অ্যাকশন */}
      <section className="py-5 text-center" style={{ background: "var(--primary-color)", color: "white" }}>
        <div className="container">
          <h2 className="fw-bold mb-3">আজই আপনার ওয়েবসাইট তৈরি করুন</h2>
          <p className="lead mb-4">আমাদের সাথে কথা বলতে কল করুন অথবা মেসেজ পাঠান</p>
          <div className="d-flex justify-content-center gap-3">
            <a href={`tel:+88${settings.whatsapp || '01854123433'}`} className="btn btn-light btn-lg rounded-pill text-dark fw-bold">
              <i className="fas fa-phone-alt"></i> কল করুন
            </a>
            <a href="https://m.me/official.creativedesign" target="_blank" rel="noopener noreferrer" className="btn btn-outline-light btn-lg rounded-pill fw-bold">
              <i className="fab fa-facebook-messenger"></i> মেসেজ পাঠান
            </a>
          </div>
        </div>
      </section>
    </div>
  );
   }
