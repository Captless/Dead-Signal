// Simple cartoon outline icons for the 8 guns. viewBox 0 0 120 40, stroke only.
const S='fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
export const GUN_ICON:Record<string,string>={
pistol:`<svg viewBox="0 0 120 40" ${S}><path d="M10 12 H78 V20 H50 L46 32 H30 L34 20 H10 Z"/><path d="M78 12 H92 V20 H78"/><circle cx="20" cy="26" r="1.5" fill="currentColor"/></svg>`,
heavy:`<svg viewBox="0 0 120 40" ${S}><path d="M8 10 H84 V18 H52 L48 34 H30 L34 18 H8 Z"/><path d="M84 10 H100 V18 H84"/><path d="M100 12 H110 M100 16 H110"/></svg>`,
smg:`<svg viewBox="0 0 120 40" ${S}><path d="M14 10 H70 V18 H58 L56 34 H44 L46 18 H14 Z"/><path d="M70 10 H96 V16 H70"/><path d="M96 12 H108"/><path d="M20 18 L12 30 H22"/></svg>`,
rapid:`<svg viewBox="0 0 120 40" ${S}><path d="M14 10 H66 V18 H54 L52 34 H40 L42 18 H14 Z"/><path d="M66 10 H94 V15 H66"/><path d="M94 12 H110"/><path d="M22 18 L14 32 H26"/></svg>`,
rifle:`<svg viewBox="0 0 120 40" ${S}><path d="M20 12 H64 V20 H56 L52 32 H40 L44 20 H20 Z"/><path d="M64 12 H104 V18 H64"/><path d="M34 12 V6 H52 V12"/><path d="M104 14 H114"/></svg>`,
marksman:`<svg viewBox="0 0 120 40" ${S}><path d="M20 14 H60 V22 H52 L48 34 H36 L40 22 H20 Z"/><path d="M60 14 H108 V20 H60"/><circle cx="42" cy="10" r="5"/><path d="M42 5 V2 M37 10 H30"/></svg>`,
shotgun:`<svg viewBox="0 0 120 40" ${S}><path d="M16 12 H58 V20 H48 L44 32 H30 L34 20 H16 Z"/><path d="M58 12 H104 V20 H58"/><path d="M70 20 V26 H92 V20"/></svg>`,
lmg:`<svg viewBox="0 0 120 40" ${S}><path d="M16 10 H62 V18 H52 L48 34 H32 L36 18 H16 Z"/><path d="M62 10 H104 V17 H62"/><rect x="52" y="18" width="18" height="12"/><path d="M76 18 L70 30 M88 18 L94 30"/></svg>`,
};
