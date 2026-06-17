// Brand icons. Palm / casita / oven are the hand-drawn marks lifted straight
// from the logo (provided separated), used as CSS masks so a single asset can
// take any brand colour (ink on light, paper on dark). Mallet is an inline SVG.

type IconProps = { size?: number; className?: string; variant?: "ink" | "paper"; style?: React.CSSProperties };

const MARKS = {
  palm: { src: "/images/mark-palm.png", ar: 0.826 },
  casita: { src: "/images/mark-casita.png", ar: 1.631 },
  horno: { src: "/images/mark-horno.png", ar: 1.031 },
} as const;

function MaskIcon({ name, size = 32, className = "", variant = "ink", style }: IconProps & { name: keyof typeof MARKS }) {
  const { src, ar } = MARKS[name];
  const color = variant === "paper" ? "var(--paper)" : "var(--ink)";
  return (
    <span
      role="img"
      aria-hidden
      className={className}
      style={{
        display: "inline-block",
        height: size,
        width: size * ar,
        backgroundColor: color,
        WebkitMaskImage: `url("${src}")`,
        maskImage: `url("${src}")`,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        ...style,
      }}
    />
  );
}

export const PalmIcon = (p: IconProps) => <MaskIcon name="palm" {...p} />;
export const CasitaIcon = (p: IconProps) => <MaskIcon name="casita" {...p} />;
export const HornoIcon = (p: IconProps) => <MaskIcon name="horno" {...p} />;

export function MalletIcon({ size = 32, className = "", variant = "ink", style }: IconProps) {
  const color = variant === "paper" ? "var(--paper)" : "var(--ink)";
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} style={{ color, ...style }} aria-hidden>
      <g fill="currentColor" stroke="currentColor" strokeLinejoin="round" strokeWidth="1">
        <g transform="rotate(-40 32 32)">
          <rect x="28.5" y="7" width="7" height="35" rx="3.5" />
          <rect x="17" y="38" width="30" height="15" rx="2.5" />
        </g>
      </g>
    </svg>
  );
}

// Decorative row between sections — palm · oven · casita
export function IconRule({ variant = "ink", className = "" }: { variant?: "ink" | "paper"; className?: string }) {
  const line = variant === "paper" ? "rgba(243,238,227,0.4)" : "rgba(24,22,19,0.3)";
  return (
    <div className={`flex items-center justify-center gap-6 ${className}`}>
      <span className="h-px w-12" style={{ backgroundColor: line }} />
      <PalmIcon size={34} variant={variant} />
      <HornoIcon size={34} variant={variant} />
      <CasitaIcon size={30} variant={variant} />
      <span className="h-px w-12" style={{ backgroundColor: line }} />
    </div>
  );
}
