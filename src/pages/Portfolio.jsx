import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে লোড হওয়ার জন্য ডিফল্ট ৮টি পোর্টফোলিওর তালিকা
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

export default function Portfolio() {
  const { settings } = useSettings();
  const [dbPortfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);

  // ফিল্টার এবং পেজিনেশন স্টেট
  const [activeFilter, setActiveFilter] = useState("*");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // প্রতি পেজে ৬টি করে প্রজেক্ট দেখাবে

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const snap = await getDocs(collection(db, "portfolios"));
        if (!snap.empty) {
          setPortfolios(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("পোর্টফোলিও লোড করতে ত্রুটি হয়েছে", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolios();
  }, []);

  const displayPortfolios = dbPortfolios.length > 0 ? dbPortfolios : defaultPortfolio;

  // ১. ফিল্টার অনুযায়ী পোর্টফোলিও তালিকা প্রস্তুত করা
  const filteredPortfolios = activeFilter === "*"
    ? displayPortfolios
    : displayPortfolios.filter(item => item.category === activeFilter);

  // যখনই ফিল্টার চেঞ্জ হবে পেজ নাম্বার ১ এ ব্যাক করবে
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  // ২. পেজিনেশন গণনা লজিক
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPortfolios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPortfolios.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  return (
    <div>
      {/* হিরো সেকশন */}
      <section className="portfolio-hero py-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)" }}>
        <div className="container py-5 text-center">
          <h1 className="fw-bold display-4 mb-3">আমাদের <span style={{ color: "var(--primary-color)" }}>সাম্প্রতিক</span> কাজসমূহ</h1>
          <p className="lead opacity-75">আমরা আমাদের ক্লায়েন্টদের জন্য সেরা মানের ডিজিটাল সলিউশন নিশ্চিত করি।</p>
        </div>
      </section>

      {/* পোর্টফোলিও গ্যালারি সেকশন */}
      <section id="portfolio" className="py-5 bg-light position-relative" style={{ marginTop: "-30px" }}>
        <div className="container">
          
          {/* ফিল্টার মেনু */}
          <div className="row mb-5">
            <div className="col-12 text-center">
              <div className="portfolio-filter">
                <button className={`btn-filter ${activeFilter === "*" ? "active" : ""}`} onClick={() => setActiveFilter("*")}>সকল</button>
                <button className={`btn-filter ${activeFilter === "web-dijan" ? "active" : ""}`} onClick={() => setActiveFilter("web-dijan")}>ওয়েব ডিজান</button>
                <button className={`btn-filter ${activeFilter === "sftwzar-development" ? "active" : ""}`} onClick={() => setActiveFilter("sftwzar-development")}>সফটওয়্যার ডেভেলোপমেন্ট</button>
                <button className={`btn-filter ${activeFilter === "esioo" ? "active" : ""}`} onClick={() => setActiveFilter("esioo")}>এসইও</button>
              </div>
            </div>
          </div>

          {/* পোর্টফোলিও আইটেম গ্রিড */}
          <div className="row portfolio-container g-4">
            {currentItems.map((p) => (
              <div className="col-lg-4 col-md-6 portfolio-item" key={p.id}>
                <div className="card border-0 shadow-sm overflow-hidden h-100 portfolio-wrapper">
                  <div className="portfolio-img-box position-relative">
                    <img src={p.image || "https://placehold.co/400x300"} className="img-fluid w-100" style={{ height: "280px", objectFit: "cover" }} alt={p.title} />
                    
                    <div className="portfolio-overlay d-flex flex-column align-items-center justify-content-center">
                      <h5 className="text-white fw-bold mb-1 text-center px-3">{p.title}</h5>
                      <p className="text-white-50 small mb-3 text-uppercase">
                        {p.category === "web-dijan" ? "ওয়েব ডিজান" : p.category === "sftwzar-development" ? "সফটওয়্যার" : "এসইও"}
                      </p>
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="btn btn-light btn-sm rounded-pill px-4 fw-bold text-orange">
                        <i class="fas fa-link me-1"></i> লাইভ ভিজিট
                      </a>
                    </div>
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

          {/* পেজিনেশন কন্ট্রোলার */}
          {totalPages > 1 && (
            <div className="row mt-5">
              <div className="col-12 d-flex justify-content-center">
                <nav aria-label="Portfolio Pagination">
                  <ul className="pagination">
                    {/* পূর্ববর্তী বাটন */}
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>

                    {/* পেজ সংখ্যা তালিকা */}
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <li key={idx} className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                          {idx + 1}
                        </button>
                      </li>
                    ))}

                    {/* পরবর্তী বাটন */}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* কল টু অ্যাকশন বাটন */}
      <section className="py-5 bg-white">
        <div className="container py-4 text-center">
          <div className="custom-package-card p-5 shadow-sm rounded-4 border mx-auto" style={{ maxWidth: "850px", borderRadius: "20px" }}>
            <h2 className="fw-bold mb-3" style={{ color: "#222" }}>আপনার প্রজেক্ট শুরু করতে চান?</h2>
            <p className="text-muted mb-4 fs-5">আমাদের দক্ষ টিমের সাথে আপনার আইডিয়া শেয়ার করুন এবং আজই শুরু করুন।</p>
            <Link to="/contact" className="btn btn-outline-dark btn-lg px-5 py-2 rounded-pill fw-bold" style={{ borderWidth: "1.5px" }}>যোগাযোগ করুন</Link>
          </div>
        </div>
      </section>
    </div>
  );
}