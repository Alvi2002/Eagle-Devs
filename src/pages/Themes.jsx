import React, { useState, useEffect } from "react";
import { useSettings } from "../App";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// ডাটাবেজ খালি থাকলে লোড হওয়ার জন্য ডিফল্ট ৯টি প্রিমিয়াম থিমের তথ্য
const defaultThemes = [
  { id: "t1", title: "Union Porisodh Laravel Script", price: "12500", desc: "Union Porisodh হলো লারাভেল ফ্রেমওয়ার্কে তৈরি একটি আধুনিক ডিজিটাল ইউনিয়ন পরিষদ...", image: "https://www.creativedesign.com.bd/assets/images/products/1766474998_union.jpg" },
  { id: "t2", title: "Non Govt School Management Software and Website PHP Script.", price: "12500", desc: "আপনার শিক্ষা প্রতিষ্ঠানের জন্য একটি পূর্ণাঙ্গ ডিজিটাল সমাধান! এই সফটওয়্যারের মা...", image: "https://www.creativedesign.com.bd/assets/images/products/1766475199_non.jpg" },
  { id: "t3", title: "Govt School Management Software and Website PHP Script.", price: "12500", desc: "Govt School Management Software হলো সরকারি শিক্ষা প্রতিষ্ঠানের জন্য তৈরি একটি অ...", image: "https://www.creativedesign.com.bd/assets/images/products/1766475370_govt.jpg" },
  { id: "t4", title: "Songbad 71 Laravel Epaper", price: "10500", desc: "Songbad 71 Epaper হলো লারাভেল ফ্রেমওয়ার্কে তৈরি একটি আধুনিক ই-পেপার পাবলিশিং স...", image: "https://www.creativedesign.com.bd/assets/images/products/1766476616_ep.jpg" },
  { id: "t5", title: "Organic Shop Ecommerce Laravel Script", price: "10000", desc: "Organic Shop হলো লারাভেল ফ্রেমওয়ার্কে তৈরি একটি আধুনিক ই-কমার্স সলিউশন। এটি অর...", image: "https://www.creativedesign.com.bd/assets/images/products/1766476474_ecom.jpg" },
  { id: "t6", title: "Pos 1 Shop Management Software (মুদিওয়ালা ৮.৮)", price: "8000", desc: "Pos 1 (মুদিওয়ালা ৮.৮) হলো মুদি দোকানের জন্য সবচেয়ে সহজ এবং ইউজার ফ্রেন্ডলি পজ...", image: "https://www.creativedesign.com.bd/assets/images/products/1766476336_pos2.jpg" },
  { id: "t7", title: "Pos 2 Shop Management Software (মুদিওয়ালা ৮.৯)", price: "8000", desc: "Pos 2 (মুদিওয়ালা ৮.৯) হলো মুদি দোকান ও সুপার শপ পরিচালনার জন্য একটি পূর্ণাঙ্গ...", image: "https://www.creativedesign.com.bd/assets/images/products/1766476179_pos1.jpg" },
  { id: "t8", title: "Kalbela Clone Laravel Newsprotal Script", price: "10500", desc: "Kalbela Clone হলো জনপ্রিয় দৈনিক 'কালবেলা' পত্রিকার আদলে তৈরি একটি প্রিমিয়াম লার...", image: "https://www.creativedesign.com.bd/assets/images/products/1766475971_kalbela.jpg" },
  { id: "t9", title: "Songbad 72 Professional Laravel Newsprotal Script", price: "10500", desc: "Songbad 72 হলো লারাভেল ফ্রেমওয়ার্কে তৈরি একটি আল্ট্রা-মডার্ন নিউজ পোর্টাল স্ক্...", image: "https://www.creativedesign.com.bd/assets/images/products/1766475808_songbad-72.jpg" }
];

export default function Themes() {
  const { settings } = useSettings();
  const [dbThemes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  // পেজিনেশন স্টেট ম্যানেজমেন্ট
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // প্রতি পেজে ৬টি করে প্রজেক্ট দেখাবে

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const snap = await getDocs(collection(db, "themes"));
        if (!snap.empty) {
          setThemes(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("থিম লোড করতে ত্রুটি হয়েছে", err);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  const displayThemes = dbThemes.length > 0 ? dbThemes : defaultThemes;

  // পেজিনেশন হিসাব-নিকাশ লজিক
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentThemes = displayThemes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(displayThemes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // পেজ পরিবর্তনের সাথে সাথে ব্রাউজারের উইন্ডো স্ক্রোল করে টপে চলে যাবে
    window.scrollTo({ top: 150, behavior: "smooth" });
  };

  return (
    <div>
      {/* ১. হিরো সেকশন */}
      <section className="pricing-hero py-5 text-white" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)" }}>
        <div className="container py-5 text-center">
          <h1 className="fw-bold display-4 mb-3">আমাদের প্রিমিয়াম <span style={{ color: "var(--primary-color)" }}>থিমসমূহ</span></h1>
          <p className="lead opacity-75">আপনার ব্যবসার জন্য আধুনিক এবং রেসপনসিভ ডিজাইন বেছে নিন।</p>
        </div>
      </section>

      {/* ২. প্রোডাক্ট গ্রিড এবং পেজিনেশন */}
      <section className="py-5 bg-light">
        <div className="container py-4">
          <div className="row g-4">
            {currentThemes.map((t) => (
              <div className="col-lg-4 col-md-6" key={t.id}>
                <div className="card border-0 shadow-sm rounded-4 overflow-hidden h-100 theme-card">
                  <div className="position-relative overflow-hidden">
                    <img src={t.image || "https://placehold.co/400x250"} className="card-img-top" style={{ height: "230px", objectFit: "cover" }} alt={t.title} loading="lazy" />
                    <div className="price-badge">মূল্যঃ ৳ {t.price}</div>
                  </div>
                  <div className="card-body p-4 text-center d-flex flex-column">
                    <h5 className="fw-bold mb-2 text-dark">{t.title}</h5>
                    <p className="text-muted small mb-4">{t.desc}</p>
                    
                    <div className="d-flex gap-2 justify-content-center mt-auto">
                      {/* বিস্তারিত লিংক যদি এডমিন প্যানেলে দেওয়া থাকে তবে সেখানে রিডাইরেক্ট হবে অথবা হোয়াটসঅ্যাপে ডিরেক্ট করবে */}
                      <a href={t.link || `https://wa.me/${settings.whatsapp || '8801854123433'}?text=Hello! আমি ${t.title} এর বিস্তারিত জানতে চাই।`} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="btn btn-outline-dark rounded-pill px-3 fw-bold btn-sm"
                      >
                        বিস্তারিত
                      </a>
                      <a href={`https://wa.me/${settings.whatsapp || '8801854123433'}?text=Hello! আমি আপনার তৈরি করা '${t.title}' প্রোডাক্টটি কিনতে চাই।`} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="btn btn-orange rounded-pill px-4 fw-bold btn-sm"
                      >
                        কিনুন
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* পেজিনেশন বাটনসমূহ (বুটস্ট্র্যাপ রেসপনসিভ স্টাইল) */}
          {totalPages > 1 && (
            <div className="row mt-5">
              <div className="col-12 d-flex justify-content-center">
                <nav aria-label="Themes Pagination">
                  <ul className="pagination">
                    {/* পূর্ববর্তী পেজ বাটন */}
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button className="page-link" onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                      </button>
                    </li>

                    {/* পেজ নাম্বারের তালিকা */}
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <li key={idx} className={`page-item ${currentPage === idx + 1 ? "active" : ""}`}>
                        <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                          {idx + 1}
                        </button>
                      </li>
                    ))}

                    {/* পরবর্তী পেজ বাটন */}
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
    </div>
  );
}