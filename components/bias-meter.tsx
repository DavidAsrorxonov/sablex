export type BiasMeterValues = {
  left: number;
  center: number;
  right: number;
};

type BiasMeterProps = BiasMeterValues;

export function BiasMeter({ left, center, right }: BiasMeterProps) {
  return (
    <div
      className="grid h-[18px] w-full overflow-hidden rounded-[3px] border border-[#D7D9DD] bg-white text-[9px] font-semibold leading-none sm:text-[10px]"
      style={{
        gridTemplateColumns: `${Math.max(left, 16)}fr ${Math.max(
          center,
          22,
        )}fr ${Math.max(right, 18)}fr`,
      }}
      aria-label={`AI-estimated framing: left ${left} percent, center ${center} percent, right ${right} percent`}
    >
      <div className="flex min-w-0 items-center justify-center bg-[#B42318] px-1 text-white">
        <span className="truncate">L {left}%</span>
      </div>
      <div className="flex min-w-0 items-center justify-center bg-[#F1F1EF] px-1 text-[#111114]">
        <span className="truncate">Center {center}%</span>
      </div>
      <div className="flex min-w-0 items-center justify-center bg-[#174EA6] px-1 text-white">
        <span className="truncate">Right {right}%</span>
      </div>
    </div>
  );
}
