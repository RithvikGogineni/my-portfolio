// A front-elevation line drawing of the humanoid, in the viewBox 0 0 100 150.
// It is a labelled placeholder standing in for asset A-01 (studio photograph
// or CAD render) and is never presented as the machine itself. The subsystem
// focus boxes in content/projects.js address this coordinate space.
import React from 'react';

export default function HumanoidDrawing({ className = '' }) {
  return (
    <svg viewBox="0 0 100 150" className={className} aria-hidden="true" focusable="false">
      {/* Construction frame and datum */}
      <rect x="22" y="8" width="56" height="134" className="a2-ln a2-ln--frame" />
      <line x1="50" y1="4" x2="50" y2="146" className="a2-ln a2-ln--centre" />

      {/* Head and neck */}
      <circle cx="50" cy="22" r="9" className="a2-ln" />
      <line x1="50" y1="31" x2="50" y2="36" className="a2-ln a2-ln--thin" />

      {/* Shoulders and torso */}
      <circle cx="35" cy="42" r="5.5" className="a2-ln" />
      <circle cx="65" cy="42" r="5.5" className="a2-ln" />
      <rect x="40" y="36" width="20" height="34" className="a2-ln" />

      {/* Arms with elbow and wrist joints */}
      <line x1="31" y1="46" x2="31" y2="60" className="a2-ln" />
      <circle cx="31" cy="60" r="2.6" className="a2-ln a2-ln--thin" />
      <line x1="31" y1="63" x2="31" y2="77" className="a2-ln" />
      <rect x="28" y="77" width="6" height="7" className="a2-ln a2-ln--thin" />
      <line x1="69" y1="46" x2="69" y2="60" className="a2-ln" />
      <circle cx="69" cy="60" r="2.6" className="a2-ln a2-ln--thin" />
      <line x1="69" y1="63" x2="69" y2="77" className="a2-ln" />
      <rect x="66" y="77" width="6" height="7" className="a2-ln a2-ln--thin" />

      {/* Pelvis, legs, knees, ankles, feet */}
      <rect x="42" y="70" width="16" height="9" className="a2-ln a2-ln--thin" />
      <line x1="45" y1="79" x2="45" y2="97" className="a2-ln" />
      <circle cx="45" cy="97" r="3" className="a2-ln a2-ln--thin" />
      <line x1="45" y1="100" x2="45" y2="120" className="a2-ln" />
      <circle cx="45" cy="120" r="2.4" className="a2-ln a2-ln--thin" />
      <rect x="39" y="123" width="12" height="6" className="a2-ln" />
      <line x1="55" y1="79" x2="55" y2="97" className="a2-ln" />
      <circle cx="55" cy="97" r="3" className="a2-ln a2-ln--thin" />
      <line x1="55" y1="100" x2="55" y2="120" className="a2-ln" />
      <circle cx="55" cy="120" r="2.4" className="a2-ln a2-ln--thin" />
      <rect x="49" y="123" width="12" height="6" className="a2-ln" />
    </svg>
  );
}
