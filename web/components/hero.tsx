import { Scanner } from "@/components/scanner";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section id="top" className="relative border-b">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_20%,--alpha(var(--color-primary)/7%),transparent)]"
      />
      <div className="relative mx-auto grid min-h-[calc(88dvh-4rem)] max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:py-16">
        <Reveal className="lg:col-span-5">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Catch leaf disease before it spreads
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
            Pick a photo of a tomato leaf and get a diagnosis with a
            confidence score in seconds.
          </p>
          <p className="mt-8 text-sm text-muted-foreground">
            The model runs entirely in your browser. Photos never leave your
            device.
          </p>
        </Reveal>
        <Reveal delay={0.12} className="lg:col-span-7">
          <Scanner />
        </Reveal>
      </div>
    </section>
  );
}
