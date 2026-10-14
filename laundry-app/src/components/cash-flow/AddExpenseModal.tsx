'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateExpenseInput } from './types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExpenseInput) => void;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CreateExpenseInput['category']>('Operasional');
  const [amount, setAmount] = useState<number>(25000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || amount <= 0) return;

    onSubmit({
      description,
      category,
      amount,
    });

    setDescription('');
    setAmount(25000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Catat Pengeluaran Baru</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Keterangan Pengeluaran *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Contoh: Pembelian Deterjen Cair 5L"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Kategori</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as CreateExpenseInput['category'])
              }
            >
              <option value="Bahan baku">Bahan Baku (sabun, parfum, plastik)</option>
              <option value="Operasional">Operasional (listrik, air, gas, plastik)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nominal (Rp) *</label>
            <input
              type="number"
              min="1000"
              step="1000"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value, 10) || 0)}
              required
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-outline" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary">
              Simpan Pengeluaran
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
        }

        .close-btn:hover {
          color: #0f172a;
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
