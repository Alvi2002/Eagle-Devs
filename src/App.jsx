import React, { createContext, useContext, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { db } from "./firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

// পেজ এবং কম্পোনেন্ট ইমপোর্ট
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import About from "./pages/About";
import Service from "./pages/Service";
import Themes from "./pages/Themes";
import Portfolio from "./pages/Portfolio";
import Pricing from "./pages/Pricing";
import Team from "./pages/Team";
import Contact from "./pages/Contact";
import FreeConsultancy from "./pages/FreeConsultancy";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// গ্লোবাল সেটিংসের জন্য রিঅ্যাক্ট কন্টেক্সট (Context) তৈরি
const SettingsContext = createContext();

// ফায়ারস্টোরে প্রথমবার ডিফল্ট ডেটা সেট করার জন্য ডেটা অবজেক্ট
const defaultSettings = {
  siteName: "Eagle Dev's",
  navbarLogo: "",     // Base64 বা ইমেজ পাথ
  footerLogo: "",     // Base64 বা ইমেজ পাথ
  favicon: "",        // Base64 বা ইমেজ পাথ
  whatsapp: "8801854123433",
  phone: "০১৮৫৪১২৩৪৩৩",
  email: "info@eagledevs.com",
  address: "হাউজঃ ৩৫/৩/১- বি, নছের মার্কেট, কোনাবাড়ি, গাজিপুর",
  facebook: "https://web.facebook.com/official.creativedesign",
  twitter: "https://web.facebook.com/official.creativedesign",
  instagram: "https://web.facebook.com/official.creativedesign",
  youtube: "https://www.youtube.com/@official.creativedesign",
  heroTitle: "আপনার অনলাইন ব্যবসার নির্ভরযোগ্য সহযোগী",
  heroSubtitle: "আমরা দিচ্ছি প্রিমিয়াম কোয়ালিটির ই-কমার্স ওয়েবসাইট, ডিজিটাল মার্কেটিং এবং সফটওয়্যার সলিউশন। আপনার আইডিয়াকে বাস্তবে রূপ দিতে আমরা প্রস্তুত।"
};

export default function App() {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ফায়ারস্টোর থেকে 'site_settings' কালেকশনের 'config' ডকুমেন্টটি রিয়েল-টাইমে ট্র্যাক করা হচ্ছে
    const docRef = doc(db, "site_settings", "config");
    
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSettings(data);
        
        // ১. ব্রাউজার টাইটেল পরিবর্তন করা
        if (data.siteName) {
          document.title = `${data.siteName} - আপনার অনলাইন ব্যবসার নির্ভরযোগ্য সহযোগী`;
        }
        
        // ২. ব্রাউজার ফেভিকন ডাইনামিকালি পরিবর্তন করা (ফায়ারস্টোর ইমেজ অথবা ফেভিকন পাথ)
        const faviconEl = document.getElementById("app-favicon");
        if (faviconEl && data.favicon) {
          faviconEl.href = data.favicon;
        }
      } else {
        // যদি ডাটাবেজে কোনো সেটিংস ডকুমেন্ট না থাকে, তবে ডিফল্ট ডেটা দিয়ে ডকুমেন্ট তৈরি করবে
        await setDoc(docRef, defaultSettings);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    // লোডিং এনিমেশন (আপনার ব্র্যন্ডিং কালার অনুযায়ী)
    return (
      <div style={{
        height: "100vh", 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        background: "#f8f9fa"
      }}>
        <div className="spinner-border" style={{color: "#ff6b00", width: "3rem", height: "3rem"}} role="status">
          <span className="visually-hidden">লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <Router>
        <Routes>
          {/* ১. মেইন ওয়েবসাইটের রাউটসমূহ (যা হেডার ও ফুটার সহ লোড হবে) */}
          <Route path="/" element={<><Header /><Home /><Footer /></>} />
          <Route path="/about" element={<><Header /><About /><Footer /></>} />
          <Route path="/service" element={<><Header /><Service /><Footer /></>} />
          <Route path="/themes" element={<><Header /><Themes /><Footer /></>} />
          <Route path="/portfolio" element={<><Header /><Portfolio /><Footer /></>} />
          <Route path="/priceing" element={<><Header /><Pricing /><Footer /></>} />
          <Route path="/team" element={<><Header /><Team /><Footer /></>} />
          <Route path="/contact" element={<><Header /><Contact /><Footer /></>} />
          <Route path="/freeconsultant" element={<><Header /><FreeConsultancy /><Footer /></>} />

          {/* ২. এডমিন রাউটসমূহ (যেখানে ওয়েবসাইটের মেইন হেডার-ফুটার থাকবে না) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </SettingsContext.Provider>
  );
}

// অন্যান্য ফাইলে সেটিংস ব্যবহারের সুবিধার্থে কাস্টম হুক এক্সপোর্ট করা হচ্ছে
export const useSettings = () => useContext(SettingsContext);