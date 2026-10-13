'use client';

import React from 'react';
import { ExpenseCompositionItem } from './types';

interface ExpenseCompositionCardProps {
  composition: ExpenseCompositionItem[];
  totalExpense: number;
}

export const ExpenseCompositionCard: React.FC<ExpenseCompositionCardProps> = ({
  composition,
  totalExpense,
}) => {
  return (
    <div className="card expense-comp-card">
      <h3 className="section-title">Komposisi pengeluaran</h3>

      <div className="comp-list">
        {composition.map((item, idx) => (
          <div key={idx} className="comp-row">
            <div className="label-wrap">
              <span className="main-label">{item.label}</span>
              <span className="dot">•</span>
              <span className="sub-label">{item.sublabel}</span>
            </div>
            <span className="amount-val">
              Rp{item.amount.toLocaleString('id-ID')}
            </span>
          </div>
        ))}

        <div className="total-row">
          <span className="total-label">Total pengeluaran</span>
          <span className="total-amount">
            Rp{totalExpense.toLocaleString('id-ID')}
          </span>
        </div>
      </div>

      <style jsx>{`
        .expense-comp-card {
          padding: 24px;
          background: #ffffff;
        }

        .section-title {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 20px;
        }

        .comp-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .comp-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 13.5px;
        }

        .label-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .main-label {
          color: #334155;
          font-weight: 500;
        }

        .dot {
          color: #94a3b8;
        }

        .sub-label {
          color: #64748b;
        }

        .amount-val {
          font-weight: 700;
          color: #0f172a;
        }

        .total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 16px;
          border-top: 1px dashed var(--border-light);
          margin-top: 4px;
        }

        .total-label {
          font-size: 14px;
          font-weight: 600;
          color: #0f172a;
        }

        .total-amount {
          font-size: 15px;
          font-weight: 800;
          color: #0f172a;
        }
      `}</style>
    </div>
  );
};
