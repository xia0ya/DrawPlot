import React from 'react';

const ChartGallery = ({ charts, onImageClick }) => (
  <div style={{
    display: 'flex',
    gap: 32,
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: '32px 0',
    background: '#f8fafc',
    minHeight: '60vh',
  }}>
    {charts.map(chart => (
      <div
        key={chart.id}
        style={{
          textAlign: 'center',
          cursor: 'pointer',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 2px 16px #e5e7eb',
          padding: 20,
          transition: 'transform 0.2s, box-shadow 0.2s',
          width: 260,
        }}
        onClick={() => onImageClick(chart)}
        onMouseOver={e => {
          e.currentTarget.style.transform = 'translateY(-6px) scale(1.03)';
          e.currentTarget.style.boxShadow = '0 8px 32px #d1d5db';
        }}
        onMouseOut={e => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.boxShadow = '0 2px 16px #e5e7eb';
        }}
      >
        <img
          src={chart.image}
          alt={chart.title}
          style={{ width: 220, height: 160, objectFit: 'contain', borderRadius: 8, background: '#f1f5f9' }}
        />
        <div
          style={{
            marginTop: 14,
            fontWeight: 600,
            fontSize: 18,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 220,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          title={chart.title}
        >
          {chart.title}
        </div>
      </div>
    ))}
  </div>
);

export default ChartGallery; 