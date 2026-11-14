import { useEffect, useState } from 'react';

/**
 * Subscribes to a media query from JavaScript.
 *
 * Presentation stays in CSS. This is only for the cases where the *markup*
 * has to differ rather than the styling — a control that becomes a different
 * control on a phone, or navigation that must not exist twice in the
 * accessibility tree.
 *
 * It returns false on the first paint and corrects itself in the effect, so
 * every caller's false branch is the wide one. That is also the safe one: it
 * renders the full control rather than an abbreviation of it.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const q = window.matchMedia(query);
    const sync = () => setMatches(q.matches);
    sync();
    q.addEventListener('change', sync);
    return () => q.removeEventListener('change', sync);
  }, [query]);

  return matches;
}

/**
 * The narrow header breakpoint: below this the four numbered destinations are
 * replaced by the INDEX disclosure. Must stay equal to the 620px CSS
 * breakpoint.
 */
export const NARROW = '(max-width: 620px)';

/**
 * The point below which the header cannot carry the three-segment theme
 * control, so it shows the cycling chip instead.
 *
 * This is deliberately *not* NARROW. The two cuts answer different questions:
 * NARROW asks whether the destinations still fit laid across the header, and
 * this asks whether the theme control does. Measured, the segmented control
 * plus the four links plus the monogram needs 724px; below that the strip ran
 * off the right edge and the document scrolled sideways. 760px is the next
 * breakpoint the stylesheet already uses, and it leaves headroom for a wider
 * fallback face before the webfonts land.
 *
 * The fractional bound pairs with `@media (min-width: 760px)` so that no
 * viewport width falls between the two rules.
 */
export const HEAD_TIGHT = '(max-width: 759.98px)';
