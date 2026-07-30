import React from 'react';
import './v1.css';

export const metadata = {
  title: 'Alzah & Effri',
  description: "Hi, You're invited to our wedding ceremony - Alzah & Effri Wedding - Wednesday, August 5th 2026",
};

export default function V1Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="v1-root-wrapper">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css"
      />
      {children}
    </div>
  );
}
