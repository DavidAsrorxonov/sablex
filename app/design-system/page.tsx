type BiasMeterProps = {
  left: number;
  center: number;
  right: number;
  compact?: boolean;
};

type IconMarkProps = {
  children: React.ReactNode;
  label: string;
};

const colorTokens = [
  { name: "Text Primary", value: "#0D0D0F", className: "bg-[#0D0D0F]" },
  { name: "Text Secondary", value: "#6B7280", className: "bg-[#6B7280]" },
  { name: "Surface", value: "#F6F6F6", className: "bg-[#F6F6F6]" },
  { name: "Left Bias", value: "#B42318", className: "bg-[#B42318]" },
  { name: "Center", value: "#E5E7EB", className: "bg-[#E5E7EB]" },
  { name: "Right Bias", value: "#1D4ED8", className: "bg-[#1D4ED8]" },
  { name: "BG Primary", value: "#FFFFFF", className: "bg-white" },
  { name: "BG Secondary", value: "#F0F0F0", className: "bg-[#F0F0F0]" },
  { name: "Border", value: "#E5E7EB", className: "bg-[#F6F6F6]" },
  { name: "Divider", value: "#E5E7EB", className: "bg-[#F6F6F6]" },
];

const typeRows = [
  ["H1", "Page / Screen Title", "32px", "Bold", "1.2"],
  ["H2", "Section Title", "24px", "SemiBold", "1.3"],
  ["H3", "Card / Module Title", "20px", "SemiBold", "1.3"],
  ["H4", "Subheading", "16px", "Medium", "1.4"],
  ["Body Large", "Important content", "16px", "Regular", "1.6"],
  ["Body Medium", "Body text", "14px", "Regular", "1.6"],
  ["Body Small", "Supporting text", "13px", "Regular", "1.6"],
  ["Caption", "Labels, meta text", "11px", "Regular", "1.4"],
];

const spacingTokens = [4, 8, 16, 24, 32, 40, 64];

const radiusTokens = [
  ["Small", "4px", "rounded"],
  ["Medium", "8px", "rounded-lg"],
  ["Large", "12px", "rounded-xl"],
  ["Full", "9999px", "rounded-full"],
];

const shadowTokens = [
  ["Small", "0px 1px 2px rgba(0,0,0,0.05)", "shadow-sablex-sm"],
  ["Medium", "0px 4px 12px rgba(0,0,0,0.08)", "shadow-sablex-md"],
  ["Large", "0px 12px 24px rgba(0,0,0,0.12)", "shadow-sablex-lg"],
];

const iconLabels = [
  "Menu",
  "Search",
  "Save",
  "Clock",
  "Info",
  "Upload",
  "Open",
  "Calendar",
  "Signal",
  "Tag",
  "User",
  "Alerts",
  "Sliders",
  "Check",
  "More",
];

function BiasMeter({ left, center, right, compact = false }: BiasMeterProps) {
  return (
    <div className="w-full">
      <div
        className={`grid h-8 overflow-hidden rounded-md border border-[#D8DADD] text-[11px] font-semibold ${
          compact ? "h-7" : ""
        }`}
        style={{ gridTemplateColumns: `${left}fr ${center}fr ${right}fr` }}
      >
        <div className="flex items-center justify-center bg-[#B42318] px-2 text-white">
          Left {left}%
        </div>
        <div className="flex items-center justify-center bg-[#E5E7EB] px-2 text-[#0D0D0F]">
          Center {center}%
        </div>
        <div className="flex items-center justify-center bg-[#1D4ED8] px-2 text-white">
          Right {right}%
        </div>
      </div>
      {!compact && (
        <div className="mt-3 grid grid-cols-3 text-[11px] text-[#0D0D0F]">
          <span>0%</span>
          <span className="text-center">50%</span>
          <span className="text-right">100%</span>
        </div>
      )}
    </div>
  );
}

function Panel({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-xl border border-[#D6D8DC] bg-white p-5 shadow-sablex-sm ${className}`}
    >
      <div className="mb-6 border-b border-[#C9CCD1] pb-3">
        <h2 className="text-base font-bold uppercase leading-[1.4] text-[#0D0D0F]">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function IconMark({ children, label }: IconMarkProps) {
  return (
    <div
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center rounded text-2xl leading-none text-[#0D0D0F]"
    >
      {children}
    </div>
  );
}

function SystemIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    strokeWidth: 2,
  };

  const icons: Record<string, React.ReactNode> = {
    Menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),
    Search: (
      <>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" />
      </>
    ),
    Save: (
      <path d="M6 4h12v17l-6-4-6 4V4Z" />
    ),
    Clock: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5l4 2" />
      </>
    ),
    Info: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
    Upload: (
      <>
        <path d="M12 16V5" />
        <path d="m8 9 4-4 4 4" />
        <path d="M5 15v4h14v-4" />
      </>
    ),
    Open: (
      <>
        <path d="M14 5h5v5" />
        <path d="m10 14 9-9" />
        <path d="M19 14v5H5V5h5" />
      </>
    ),
    Calendar: (
      <>
        <path d="M7 4v4" />
        <path d="M17 4v4" />
        <path d="M5 8h14" />
        <rect x="5" y="6" width="14" height="14" rx="2" />
      </>
    ),
    Signal: (
      <>
        <path d="M5 19v-5" />
        <path d="M12 19v-9" />
        <path d="M19 19V5" />
        <path d="m5 10 5-5 4 4 5-6" />
      </>
    ),
    Tag: (
      <>
        <path d="M20 13 13 20 4 11V4h7l9 9Z" />
        <path d="M8 8h.01" />
      </>
    ),
    User: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c1.6-4 4.3-6 8-6s6.4 2 8 6" />
      </>
    ),
    Alerts: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),
    Sliders: (
      <>
        <path d="M4 7h8" />
        <path d="M16 7h4" />
        <circle cx="14" cy="7" r="2" />
        <path d="M4 17h4" />
        <path d="M12 17h8" />
        <circle cx="10" cy="17" r="2" />
      </>
    ),
    Check: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="m8 12 3 3 5-6" />
      </>
    ),
    More: (
      <>
        <circle cx="6" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        <circle cx="18" cy="12" r="1" fill="currentColor" stroke="none" />
      </>
    ),
  };

  return (
    <IconMark label={name}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-6"
        {...common}
      >
        {icons[name]}
      </svg>
    </IconMark>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F6F6F6] p-4 text-[#0D0D0F] sm:p-6 lg:p-8">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel title="Brand" className="lg:col-span-4">
          <div className="flex min-h-[160px] flex-col items-center justify-center text-center">
            <div className="relative inline-flex items-end">
              <span className="text-[56px] font-bold leading-none tracking-normal sm:text-[64px]">
                sablex
              </span>
              <span className="absolute -bottom-6 right-1 text-xl font-semibold leading-none text-[#6B7280]">
                News
              </span>
            </div>
            <p className="mt-12 max-w-[260px] text-base leading-[1.6] text-[#2F343D]">
              Balanced news coverage, powered by AI.
            </p>
          </div>
        </Panel>

        <Panel title="Typography" className="lg:col-span-5 lg:row-span-2">
          <div className="grid gap-8 md:grid-cols-[1fr_1.9fr]">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Font Family
              </p>
              <p className="text-[32px] font-bold leading-[1.2]">Poppins</p>
              <p className="mt-4 text-sm leading-[1.6] text-[#4B5563]">
                Poppins is a modern geometric sans-serif typeface that ensures
                clarity and excellent readability.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-left text-[11px]">
                <thead>
                  <tr className="uppercase text-[#0D0D0F]">
                    <th className="pb-4 font-semibold">Style</th>
                    <th className="pb-4 font-semibold">Use</th>
                    <th className="pb-4 font-semibold">Size</th>
                    <th className="pb-4 font-semibold">Weight</th>
                    <th className="pb-4 font-semibold">Line Height</th>
                  </tr>
                </thead>
                <tbody>
                  {typeRows.map(([style, use, size, weight, lineHeight]) => (
                    <tr key={style} className="align-top">
                      <td className="py-2 text-xl font-semibold">{style}</td>
                      <td className="py-2 text-[#4B5563]">{use}</td>
                      <td className="py-2">{size}</td>
                      <td className="py-2">{weight}</td>
                      <td className="py-2">{lineHeight}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Panel>

        <Panel title="UI Elements" className="lg:col-span-3 lg:row-span-2">
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Buttons
              </p>
              <div className="overflow-x-auto pb-2">
                <div className="grid min-w-[520px] grid-cols-[72px_repeat(4,minmax(88px,1fr))] gap-3 text-[11px]">
                  <span />
                  {["Default", "Hover", "Outline", "Disabled"].map((state) => (
                    <span key={state} className="text-center text-[#343A43]">
                      {state}
                    </span>
                  ))}
                  <span className="self-center font-semibold">Primary</span>
                  <button className="h-9 rounded-lg bg-[#0D0D0F] px-3 text-xs font-semibold text-white shadow-sablex-sm">
                    Button
                  </button>
                  <button className="h-9 rounded-lg bg-[#171B22] px-3 text-xs font-semibold text-white shadow-sablex-md">
                    Button
                  </button>
                  <button className="h-9 rounded-lg border border-[#CBD0D7] bg-white px-3 text-xs font-semibold">
                    Button
                  </button>
                  <button
                    disabled
                    className="h-9 rounded-lg bg-[#E5E7EB] px-3 text-xs font-semibold text-[#9CA3AF]"
                  >
                    Button
                  </button>
                  <span className="self-center font-semibold">Secondary</span>
                  <button className="h-9 rounded-lg border border-[#CBD0D7] bg-white px-3 text-xs font-semibold">
                    Button
                  </button>
                  <button className="h-9 rounded-lg border border-[#B9BEC7] bg-[#F6F6F6] px-3 text-xs font-semibold">
                    Button
                  </button>
                  <button className="h-9 rounded-lg border border-[#CBD0D7] bg-white px-3 text-xs font-semibold">
                    Button
                  </button>
                  <button
                    disabled
                    className="h-9 rounded-lg border border-[#E5E7EB] bg-[#F6F6F6] px-3 text-xs font-semibold text-[#9CA3AF]"
                  >
                    Button
                  </button>
                  <span className="self-center font-semibold">Text</span>
                  <button className="h-9 px-3 text-xs font-semibold">
                    Button
                  </button>
                  <button className="h-9 px-3 text-xs font-semibold text-[#1D4ED8]">
                    Button
                  </button>
                  <span className="self-center text-center">-</span>
                  <span className="self-center text-center">-</span>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Chip / Category
              </p>
              <div className="flex flex-wrap gap-3">
                {["World Cup", "IPL", "Business & Markets", "More"].map(
                  (chip) => (
                    <button
                      key={chip}
                      className="inline-flex h-8 items-center gap-3 rounded-lg bg-[#E5E7EB] px-4 text-xs font-semibold text-[#0D0D0F] shadow-sablex-sm"
                    >
                      {chip}
                      <span className="text-base leading-none">+</span>
                    </button>
                  ),
                )}
              </div>
            </div>

            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Bias Meter
              </p>
              <BiasMeter left={25} center={50} right={25} />
            </div>
          </div>
        </Panel>

        <Panel title="Colors" className="lg:col-span-4">
          <div className="space-y-8">
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Primary
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                {colorTokens.slice(0, 3).map((color) => (
                  <div key={color.name}>
                    <div
                      className={`h-12 w-16 rounded-md border border-[#D8DADD] ${color.className}`}
                    />
                    <p className="mt-2 text-[11px] font-semibold uppercase">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-[#4B5563]">{color.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Semantic
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-3">
                {colorTokens.slice(3, 6).map((color) => (
                  <div key={color.name}>
                    <div
                      className={`h-12 w-16 rounded-md border border-[#D8DADD] ${color.className}`}
                    />
                    <p className="mt-2 text-[11px] font-semibold uppercase">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-[#4B5563]">{color.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase">
                Neutrals
              </p>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {colorTokens.slice(6).map((color) => (
                  <div key={color.name}>
                    <div
                      className={`h-12 w-16 rounded-md border border-[#D8DADD] ${color.className}`}
                    />
                    <p className="mt-2 text-[11px] font-semibold uppercase">
                      {color.name}
                    </p>
                    <p className="text-[11px] text-[#4B5563]">{color.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Icons" className="lg:col-span-4">
          <div className="grid grid-cols-5 gap-x-5 gap-y-8 sm:gap-x-10">
            {iconLabels.map((name) => (
              <SystemIcon key={name} name={name} />
            ))}
          </div>
          <p className="mt-8 text-sm leading-[1.6] text-[#4B5563]">
            Line style / 2px stroke / Rounded caps
          </p>
        </Panel>

        <Panel title="Card Example" className="lg:col-span-4">
          <article className="grid gap-5 md:grid-cols-[1fr_1.45fr]">
            <div className="relative min-h-[190px] overflow-hidden rounded-lg bg-[#DDE1E8]">
              <div className="absolute inset-0 bg-[linear-gradient(135deg,#C8CDD6_0%,#F7F7F7_50%,#8D96A5_100%)]" />
              <div className="absolute bottom-0 left-8 h-36 w-24 rounded-t-full bg-[#1F2937]" />
              <div className="absolute bottom-0 left-16 h-24 w-28 bg-[#B42318]" />
              <div className="absolute right-0 top-0 h-full w-16 bg-[#0D0D0F]" />
              <div className="absolute right-4 top-5 flex size-6 items-center justify-center rounded-full border border-white/70 bg-[#0D0D0F]/60 text-xs font-semibold text-white">
                i
              </div>
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <p className="text-[11px] font-semibold text-[#4B5563]">
                Politics / United States
              </p>
              <h3 className="mt-2 text-xl font-semibold leading-[1.3]">
                Trump Sends Iran Revised Peace Proposal With Tougher Terms:
                Report
              </h3>
              <p className="mt-4 text-sm leading-[1.6] text-[#374151]">
                The proposal includes stricter limits on uranium enrichment and
                enhanced verification measures.
              </p>
              <div className="mt-4">
                <BiasMeter left={25} center={50} right={25} compact />
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-semibold">
                <span className="inline-flex items-center gap-2">
                  <SystemIcon name="Clock" />
                  2h ago
                </span>
                <span className="inline-flex items-center gap-2">
                  <SystemIcon name="Save" />
                  12 min read
                </span>
              </div>
            </div>
          </article>
        </Panel>

        <Panel title="Spacing System" className="lg:col-span-4">
          <div className="flex items-end justify-between gap-4 overflow-x-auto pb-2">
            {spacingTokens.map((space) => (
              <div key={space} className="min-w-10 text-center">
                <div
                  className="mx-auto bg-[#B9C0FF]"
                  style={{ width: `${space}px`, height: `${space}px` }}
                />
                <p className="mt-3 text-xs font-semibold">{space}px</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-sm leading-[1.6] text-[#4B5563]">
            Consistent spacing scale based on 4px base unit
          </p>
        </Panel>

        <Panel title="Grid System" className="lg:col-span-4">
          <div className="flex items-center gap-6">
            <div className="grid h-36 flex-1 grid-cols-12 gap-3 border border-[#D8DADD] bg-white px-5">
              {Array.from({ length: 12 }, (_, index) => (
                <div key={index} className="bg-[#E7E4FF]" />
              ))}
            </div>
            <div className="space-y-4 text-xs leading-tight">
              <p>
                <span className="font-semibold">Container</span>
                <br />
                1280px
              </p>
              <p>
                <span className="font-semibold">Columns</span>
                <br />
                12
              </p>
              <p>
                <span className="font-semibold">Gutter</span>
                <br />
                24px
              </p>
              <p>
                <span className="font-semibold">Margin</span>
                <br />
                24px
              </p>
            </div>
          </div>
        </Panel>

        <Panel title="Shadows" className="lg:col-span-2">
          <div className="space-y-6">
            {shadowTokens.map(([name, value, className]) => (
              <div key={name} className="grid grid-cols-[56px_1fr] gap-5">
                <div
                  className={`size-10 rounded-md border border-[#D8DADD] bg-white ${className}`}
                />
                <div>
                  <p className="text-xs font-semibold uppercase">{name}</p>
                  <p className="mt-1 text-xs leading-[1.4] text-[#0D0D0F]">
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Border Radius" className="lg:col-span-2">
          <div className="space-y-5">
            {radiusTokens.map(([name, value, radiusClass]) => (
              <div
                key={name}
                className="grid grid-cols-[48px_1fr_64px] items-center gap-4"
              >
                <div
                  className={`size-9 border border-[#D8DADD] bg-white ${radiusClass}`}
                />
                <p className="text-xs font-semibold uppercase">{name}</p>
                <p className="text-xs">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <footer className="mx-auto mt-4 flex max-w-[1280px] flex-col gap-8 rounded-lg bg-[#171B22] px-8 py-7 text-white shadow-sablex-lg sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-10">
          <div className="leading-none">
            <p className="text-3xl font-bold">sablex</p>
            <p className="-mt-1 text-center text-xs font-semibold">News</p>
          </div>
          <p className="max-w-[220px] text-sm leading-[1.6] text-white/90">
            Balanced news coverage, powered by AI.
          </p>
        </div>
        <p className="text-sm text-white/70">Design System v1.0</p>
        <p className="text-sm text-white/70">July 18, 2026</p>
        <p className="text-sm font-medium">Stay consistent. Stay unbiased.</p>
      </footer>
    </main>
  );
}
