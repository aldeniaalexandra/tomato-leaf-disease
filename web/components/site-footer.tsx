import { GithubLogoIcon } from "@phosphor-icons/react/dist/ssr";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <p>TomatoScan</p>
        <a
          href="https://github.com/aldeniaalexandra/tomato-leaf-disease"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 font-medium text-foreground underline-offset-4 hover:underline"
        >
          <GithubLogoIcon size={16} />
          GitHub
        </a>
      </div>
    </footer>
  );
}
