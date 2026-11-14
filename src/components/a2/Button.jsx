// The chamfered control. A padded wrapper carries the rule because clip-path
// removes real borders; the inner surface carries the fill. On hover the
// directional edge highlight sweeps from the side the pointer is on, and the
// arrow advances — a small, 180ms acknowledgement, never a bounce.
import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  as = 'button',
  to,
  href,
  tone = 'accent',          // accent | ink | ghost
  arrow = true,
  external = false,
  children,
  className = '',
  ...rest
}) {
  const cls = `a2-btn a2-btn--${tone} a2-ch-s ${className}`.trim();
  const inner = (
    <span className="a2-btn__in a2-chamfer">
      <span className="a2-btn__edge" aria-hidden="true" />
      <span className="a2-btn__text">{children}</span>
      {arrow && <span className="a2-btn__arrow" aria-hidden="true">{external ? '↗' : '→'}</span>}
    </span>
  );

  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (href) {
    const ext = external || /^https?:/.test(href);
    return (
      <a
        className={cls}
        href={href}
        {...(ext ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
        {...rest}
      >
        {inner}
      </a>
    );
  }
  const Tag = as;
  return <Tag className={cls} {...rest}>{inner}</Tag>;
}
