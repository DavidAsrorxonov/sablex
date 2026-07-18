import { ExternalMark } from "@/components/homepage-icons";

const companyLinks = ["About", "Careers", "Press", "Contact"];
const helpLinks = ["Help Center", "Guides", "Privacy Policy", "Terms of Service"];

export function SiteFooter() {
  return (
    <footer className="mt-2 bg-[#202020] text-white">
      <div className="mx-auto grid w-full max-w-[1460px] gap-8 px-4 py-8 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.4fr] lg:px-12">
        <div>
          <div className="leading-none">
            <p className="text-[30px] font-bold tracking-normal">sablex</p>
            <p className="-mt-1 ml-10 text-[12px] font-semibold text-white/75">
              News
            </p>
          </div>
          <p className="mt-5 max-w-44 text-[13px] leading-[1.55] text-white/75">
            Balanced news coverage powered by AI.
          </p>
        </div>

        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Help" links={helpLinks} />

        <div>
          <h2 className="text-[13px] font-bold leading-[1.4]">Connect</h2>
          <div className="mt-5 flex items-center gap-5 text-white/80">
            <a href="#" aria-label="sablex on X" className="text-lg font-medium">
              X
            </a>
            <a href="#" aria-label="sablex on LinkedIn" className="text-sm font-bold">
              in
            </a>
            <a
              href="#"
              aria-label="sablex on Instagram"
              className="flex size-5 items-center justify-center rounded-[5px] border border-white/70 text-[10px] font-bold"
            >
              IG
            </a>
            <a href="#" aria-label="sablex video channel">
              <ExternalMark className="size-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1460px] px-4 py-4 text-[12px] text-white/70 sm:px-6 lg:px-12">
          &copy; 2026 sablex News. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h2 className="text-[13px] font-bold leading-[1.4]">{title}</h2>
      <ul className="mt-4 space-y-2.5 text-[12px] leading-[1.45] text-white/75">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition hover:text-white">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
