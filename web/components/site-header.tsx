import Link from "next/link";
import { GithubLogoIcon, LeafIcon } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "#diseases", label: "Diseases" },
  { href: "#model", label: "Model" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="#top" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <LeafIcon size={16} weight="fill" />
          </span>
          TomatoScan
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="https://github.com/aldeniaalexandra/tomato-leaf-disease"
            target="_blank"
            rel="noreferrer"
            aria-label="View the source on GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <GithubLogoIcon size={18} />
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
