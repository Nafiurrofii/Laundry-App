'use client';

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { CreateOrderInput } from './types';

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOrderInput) => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [service, setService] = useState<CreateOrderInput['service']>('Cuci Setrika');
  const [weight, setWeight] = useState<number>(5);
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Tunai'>('QRIS');

  if (!isOpen) return null;

  const priceRates: Record<CreateOrderInput['service'], number> = {
    'Cuci Setrika': 8000,
    'Cuci Kering': 6000,
    'Cuci Basah': 4000,
  };

  const calculatedTotal = weight * (priceRates[service] || 8000);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || weight <= 0) return;

    onSubmit({
      customerName,
      customerPhone,
      service,
      weight,
      isPaid,
      paymentMethod: isPaid ? paymentMethod : undefined,
    });

    // Reset form
    setCustomerName('');
    setCustomerPhone('');
    setWeight(5);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Tambah Pesanan Cucian</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Nama Pelanggan *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Siti Rahma"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">No. Telepon / WhatsApp</label>
            <input
              type="tel"
              className="form-input"
              placeholder="Contoh: 081234567890"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label className="form-label">Pilihan Layanan</label>
              <select
                className="form-select"
                value={service}
                onChange={(e) =>
                  setService(e.target.value as CreateOrderInput['service'])
                }
              >
                <option value="Cuci Setrika">Cuci Setrika (Rp8.000/kg)</option>
                <option value="Cuci Kering">Cuci Kering (Rp6.000/kg)</option>
                <option value="Cuci Basah">Cuci Basah (Rp4.000/kg)</option>
              </select>
            </div>

            <div className="form-group w-32">
              <label className="form-label">Berat (kg) *</label>
              <input
                type="number"
                step="0.5"
                min="1"
                className="form-input"
                value={weight}
                onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          {/* Pricing summary preview */}
          <div className="price-preview-box">
            <span className="price-label">Perkiraan Biaya:</span>
            <span className="price-amount">
              Rp{calculatedTotal.toLocaleString('id-ID')}
            </span>
          </div>

          {/* Payment Status */}
          <div className="form-group">
            <label className="form-label">Status Pembayaran</label>
            <div className="radio-pills">
              <button
                type="button"
                className={`pill-btn ${isPaid ? 'active' : ''}`}
                onClick={() => setIsPaid(true)}
              >
                <Check size={14} />
                <span>Langsung Lunas</span>
              </button>
              <button
                type="button"
                className={`pill-btn ${!isPaid ? 'active' : ''}`}
                onClick={() => setIsPaid(false)}
              >
                <span>Belum Lunas (Bayar Nanti)</span>
              </button>
            </div>
          </div>

          {isPaid && (
            <div className="form-group">
              <label className="form-label">Metode Pembayaran</label>
              <div className="radio-pills">
                <button
                  type="button"
                  className={`pill-btn ${paymentMethod === 'QRIS' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('QRIS')}
                >
                  <span>QRIS</span>
                </button>
                <button
                  type="button"
                  className={`pill-btn ${paymentMethod === 'Tunai' ? 'active' : ''}`}
                  onClick={() => setPaymentMethod('Tunai')}
                >
                  <span>Tunai (Cash)</span>
                </button>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Pesanan
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .close-btn {
          color: #94a3b8;
          transition: color 0.15s ease;
        }

        .close-btn:hover {
          color: #0f172a;
        }

        .form-row {
          display: flex;
          gap: 12px;
        }

        .flex-1 {
          flex: 1;
        }

        .w-32 {
          width: 110px;
        }

        .price-preview-box {
          background-color: #f0fdfa;
          border: 1px dashed #99f6e4;
          border-radius: var(--radius-md);
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .price-label {
          font-size: 13px;
          color: #0f766e;
          font-weight: 500;
        }

        .price-amount {
          font-size: 18px;
          font-weight: 800;
          color: #0d9488;
        }

        .radio-pills {
          display: flex;
          gap: 8px;
        }

        .pill-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: var(--radius-md);
          font-size: 13px;
          font-weight: 600;
          color: #64748b;
          background: #f1f5f9;
          transition: all 0.15s ease;
        }

        .pill-btn.active {
          background-color: #0d9488;
          color: #ffffff;
        }

        .modal-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border-light);
        }
      `}</style>
    </div>
  );
};
