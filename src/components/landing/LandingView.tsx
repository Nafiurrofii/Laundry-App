'use client';

import React from 'react';
import Link from 'next/link';
import {
  Waves,
  Lock,
  ArrowRight,
  Wind,
  Shirt,
  Droplets,
  Check,
  Clock,
  Info,
  Search,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useLandingViewModel } from './hooks/useLandingViewModel';

export const LandingView: React.FC = () => {
  const {
    services,
    searchQuery,
    setSearchQuery,
    trackingResult,
    trackingNotFound,
    isTrackingModalOpen,
    handleOpenTracking,
    handleCloseTracking,
    handleSearch,
  } = useLandingViewModel();

  return (
    <div className="landing-page-root">
      {/* Top Navbar */}
      <header className="landing-navbar">
        <div className="nav-container">
          <Link href="/katalog" className="brand-logo">
            <div className="logo-icon-wrap">
              <Waves size={22} />
            </div>
            <span className="brand-name">LaundryKu</span>
          </Link>

          <nav className="nav-menu">
            <a href="#layanan" className="nav-link active">
              Katalog
            </a>
            <button
              className="nav-link"
              onClick={() => handleOpenTracking()}
            >
              Cek Status
            </button>
            <Link href="/dashboard" className="login-admin-btn">
              <Lock size={14} />
              <span>Login admin</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="landing-main">
        <div className="content-container">
          {/* Hero Banner Section */}
          <section className="hero-section">
            <div className="hero-left">
              <div className="hero-pill">BILAS LAUNDRY • MELATI</div>
              <h1 className="hero-title">
                Cucian beres.
                <br />
                Hari lebih ringan.
              </h1>
              <p className="hero-desc">
                Temukan layanan yang sesuai untuk cucian Anda. Sudah menitipkan pakaian?
                Pantau prosesnya lewat nomor pesanan.
              </p>
              <button
                className="hero-cta-btn"
                onClick={() => handleOpenTracking('BLS-0128')}
              >
                <ArrowRight size={18} />
                <span>Cek status cucian</span>
              </button>
            </div>

            <div className="hero-right">
              <div className="hero-image-card">
                {/* Visual SVG illustration styled after modern minimalist laundry aesthetic */}
                <div className="laundry-art-scene">
                  <div className="washing-machine-visual">
                    <div className="machine-door">
                      <div className="water-bubble b1" />
                      <div className="water-bubble b2" />
                    </div>
                  </div>
                  <div className="basket-visual">
                    <div className="folded-linen l1" />
                    <div className="folded-linen l2" />
                    <div className="folded-linen l3" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section: Layanan Cucian */}
          <section id="layanan" className="services-section">
            <h2 className="services-title">Layanan cucian</h2>
            <p className="services-subtitle">
              Tiga pilihan, satu standar bersih. Harga dihitung per kilogram.
            </p>

            <div className="pricing-grid">
              {services.map((svc) => {
                const IconComponent =
                  svc.iconType === 'kering'
                    ? Wind
                    : svc.iconType === 'setrika'
                    ? Shirt
                    : Droplets;

                return (
                  <div key={svc.id} className="card pricing-card">
                    <div className="card-top-header">
                      <h3 className="plan-name">{svc.name}</h3>
                      <div className="plan-icon-wrap">
                        <IconComponent size={20} />
                      </div>
                    </div>

                    <div className="plan-price-row">
                      <span className="price-num">
                        Rp{svc.pricePerKg.toLocaleString('id-ID')}
                      </span>
                      <span className="price-unit">/ kg</span>
                    </div>

                    <p className="plan-description">{svc.description}</p>

                    <div className="plan-divider" />

                    <div className="features-list">
                      {svc.features.map((f, i) => (
                        <div key={i} className="feature-item">
                          <Check size={14} className="check-icon" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>

                    <div className="duration-row">
                      <Clock size={14} className="clock-icon" />
                      <span>{svc.duration}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Notice Banner */}
          <div className="notice-banner">
            <Info size={17} className="notice-icon" />
            <p className="notice-text">
              Minimum 3 kg per pesanan. Estimasi mengikuti antrean dan jenis pakaian.
              Serahkan cucian langsung di Risky Laundry, Jl. Kawi Gang II No. 5 F,
              Mojoroto.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-container">
          <div className="footer-left">© 2026 Risky Laundry • Kediri</div>
          <div className="footer-right">
            Jl. Kawi Gang II No 5 F, Mojoroto • 08.00–20.00 WIB
          </div>
        </div>
      </footer>

      {/* Modal Cek Status Cucian Realtime */}
      {isTrackingModalOpen && (
        <div className="modal-overlay" onClick={handleCloseTracking}>
          <div
            className="modal-content tracking-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3 className="modal-title">Lacak Pesanan Cucian</h3>
                <p className="modal-subtitle">
                  Masukkan nomor pesanan (Contoh: BLS-0128, BLS-0126)
                </p>
              </div>
              <button className="close-btn" onClick={handleCloseTracking}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
              className="tracking-form"
            >
              <div className="tracking-search-bar">
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Nomor pesanan (contoh: BLS-0128)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                  autoFocus
                />
                <button type="submit" className="btn-primary search-btn">
                  Cari
                </button>
              </div>
            </form>

            {/* Tracking Result View */}
            {trackingResult && (
              <div className="tracking-result-box">
                <div className="result-header">
                  <div>
                    <span className="res-id">{trackingResult.id}</span>
                    <h4 className="res-name">{trackingResult.customerName}</h4>
                  </div>
                  <span className="badge badge-siap">{trackingResult.status}</span>
                </div>

                <div className="timeline-stepper">
                  {['Diterima', 'Dicuci', 'Disetrika', 'Siap diambil', 'Selesai'].map(
                    (step, idx) => {
                      const stepOrder = [
                        'Diterima',
                        'Dicuci',
                        'Disetrika',
                        'Siap diambil',
                        'Selesai',
                      ];
                      const currentIdx = stepOrder.indexOf(trackingResult.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step} className="step-node">
                          <div
                            className={`step-circle ${
                              isCompleted ? 'completed' : ''
                            } ${isCurrent ? 'current' : ''}`}
                          >
                            {isCompleted ? <Check size={12} /> : idx + 1}
                          </div>
                          <span
                            className={`step-text ${isCurrent ? 'active' : ''}`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>

                <div className="order-spec-card">
                  <div className="spec-item">
                    <span className="label">Layanan:</span>
                    <span className="val">{trackingResult.service}</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">Berat:</span>
                    <span className="val">{trackingResult.weight} kg</span>
                  </div>
                  <div className="spec-item">
                    <span className="label">Total Biaya:</span>
                    <span className="val font-bold">
                      Rp{trackingResult.totalPrice.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="label">Pembayaran:</span>
                    <span
                      className={
                        trackingResult.isPaid ? 'text-teal' : 'text-danger'
                      }
                    >
                      {trackingResult.isPaid ? 'Lunas' : 'Belum Lunas'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {trackingNotFound && (
              <div className="not-found-box">
                Pesanan dengan nomor &ldquo;{searchQuery}&rdquo; tidak ditemukan. Pastikan
                nomor nota Anda benar (Contoh: BLS-0128).
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .landing-page-root {
          min-height: 100vh;
          background-color: #ffffff;
          display: flex;
          flex-direction: column;
        }

        .landing-navbar {
          border-bottom: 1px solid var(--border-light);
          background: #ffffff;
          position: sticky;
          top: 0;
          z-index: 50;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon-wrap {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-name {
          font-size: 21px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .nav-menu {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          cursor: pointer;
          transition: color 0.15s ease;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #0d9488;
        }

        .login-admin-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-light);
          font-size: 13px;
          font-weight: 600;
          color: #334155;
          transition: all 0.15s ease;
        }

        .login-admin-btn:hover {
          border-color: #cbd5e1;
          background: #f8fafc;
        }

        .landing-main {
          flex: 1;
          padding: 40px 24px 60px;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Hero Banner */
        .hero-section {
          background-color: #e6f7f5;
          border-radius: 24px;
          padding: 50px 60px;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 40px;
          align-items: center;
          margin-bottom: 50px;
        }

        .hero-pill {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.8px;
          color: #0f766e;
          margin-bottom: 16px;
        }

        .hero-title {
          font-size: 44px;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 16px;
        }

        .hero-desc {
          font-size: 15px;
          color: #334155;
          line-height: 1.6;
          max-width: 480px;
          margin-bottom: 28px;
        }

        .hero-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background-color: #0d9488;
          color: #ffffff;
          padding: 14px 24px;
          border-radius: var(--radius-md);
          font-size: 14.5px;
          font-weight: 700;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.3);
          transition: all 0.15s ease;
        }

        .hero-cta-btn:hover {
          background-color: #0f766e;
          transform: translateY(-2px);
        }

        .hero-image-card {
          border-radius: 20px;
          background: #ffffff;
          padding: 30px;
          box-shadow: 0 10px 25px -5px rgba(13, 148, 136, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          height: 280px;
        }

        .laundry-art-scene {
          display: flex;
          align-items: flex-end;
          gap: 24px;
        }

        .washing-machine-visual {
          width: 140px;
          height: 180px;
          background: #f8fafc;
          border: 4px solid #0d9488;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
        }

        .machine-door {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 4px solid #14b8a6;
          background: #ccfbf1;
          position: relative;
          overflow: hidden;
        }

        .water-bubble {
          position: absolute;
          background: #ffffff;
          border-radius: 50%;
          opacity: 0.8;
        }

        .b1 {
          width: 20px;
          height: 20px;
          bottom: 10px;
          left: 15px;
        }

        .b2 {
          width: 14px;
          height: 14px;
          bottom: 25px;
          right: 18px;
        }

        .basket-visual {
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
        }

        .folded-linen {
          height: 20px;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        .l1 {
          width: 100px;
          background: #a7f3d0;
        }
        .l2 {
          width: 110px;
          background: #99f6e4;
        }
        .l3 {
          width: 120px;
          background: #cbd5e1;
        }

        /* Services section */
        .services-section {
          margin-bottom: 40px;
        }

        .services-title {
          font-size: 24px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.4px;
        }

        .services-subtitle {
          font-size: 14px;
          color: #64748b;
          margin-top: 4px;
          margin-bottom: 24px;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 22px;
        }

        .pricing-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
        }

        .card-top-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }

        .plan-name {
          font-size: 17px;
          font-weight: 700;
          color: #0f172a;
        }

        .plan-icon-wrap {
          color: #0d9488;
        }

        .plan-price-row {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 10px;
        }

        .price-num {
          font-size: 30px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .price-unit {
          font-size: 14px;
          color: #64748b;
        }

        .plan-description {
          font-size: 13px;
          color: #64748b;
          line-height: 1.5;
          min-height: 40px;
        }

        .plan-divider {
          border-bottom: 1px solid var(--border-light);
          margin: 18px 0;
        }

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #334155;
        }

        .check-icon {
          color: #0d9488;
        }

        .duration-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #64748b;
          margin-top: auto;
          padding-top: 12px;
        }

        .clock-icon {
          color: #94a3b8;
        }

        /* Notice Banner */
        .notice-banner {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px 20px;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
        }

        .notice-icon {
          color: #64748b;
          margin-top: 2px;
        }

        .notice-text {
          font-size: 12.5px;
          color: #64748b;
          line-height: 1.5;
        }

        /* Footer */
        .landing-footer {
          border-top: 1px solid var(--border-light);
          padding: 24px 28px;
          background: #ffffff;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12.5px;
          color: #94a3b8;
        }

        /* Modal styling */
        .tracking-modal {
          max-width: 580px;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 18px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .modal-subtitle {
          font-size: 12.5px;
          color: #64748b;
          margin-top: 2px;
        }

        .close-btn {
          color: #94a3b8;
        }

        .tracking-search-bar {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
        }

        .search-btn {
          padding: 10px 20px;
        }

        .tracking-result-box {
          background-color: #f8fafc;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          padding: 20px;
          margin-top: 16px;
        }

        .result-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }

        .res-id {
          font-size: 12px;
          font-weight: 700;
          color: #0d9488;
        }

        .res-name {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-top: 2px;
        }

        .timeline-stepper {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
          position: relative;
        }

        .step-node {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 1;
        }

        .step-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-circle.completed {
          background-color: #0d9488;
          color: #ffffff;
        }

        .step-circle.current {
          box-shadow: 0 0 0 4px #ccfbf1;
        }

        .step-text {
          font-size: 11px;
          color: #64748b;
        }

        .step-text.active {
          color: #0f766e;
          font-weight: 700;
        }

        .order-spec-card {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          background: #ffffff;
          border-radius: 8px;
          padding: 14px;
          font-size: 13px;
        }

        .spec-item {
          display: flex;
          justify-content: space-between;
        }

        .label {
          color: #64748b;
        }

        .val {
          color: #0f172a;
          font-weight: 600;
        }

        .font-bold {
          font-weight: 700;
        }

        .text-teal {
          color: #0d9488;
          font-weight: 700;
        }

        .text-danger {
          color: #ea580c;
          font-weight: 700;
        }

        .not-found-box {
          background-color: #fff1f2;
          color: #be123c;
          border: 1px solid #fecdd3;
          border-radius: var(--radius-md);
          padding: 14px;
          font-size: 13px;
          margin-top: 16px;
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 36px 28px;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};
