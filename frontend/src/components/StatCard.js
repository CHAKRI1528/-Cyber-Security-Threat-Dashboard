import React from 'react';

export default function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className={`${color} rounded-lg shadow-lg p-6 text-white`}>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold opacity-90">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <Icon size={40} opacity={0.5} />
      </div>
    </div>
  );
}
