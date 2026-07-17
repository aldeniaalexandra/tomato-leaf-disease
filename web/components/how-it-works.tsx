import { Reveal } from "@/components/reveal";

const steps = [
  {
    title: "Photograph one leaf",
    body: "Take a clear photo of a single tomato leaf against any background. JPG and PNG both work.",
  },
  {
    title: "The model reads it",
    body: "The image is resized to 224 by 224 pixels and classified by an EfficientNetB0 network running in your browser.",
  },
  {
    title: "Act on the diagnosis",
    body: "You get the most likely condition, a confidence score, and a short description of what to look for next.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            How it works
          </h2>
        </Reveal>
        <div className="mt-10">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.06}>
              <div className="grid gap-2 border-t py-7 md:grid-cols-12 md:gap-6">
                <span className="font-mono text-sm text-muted-foreground md:col-span-1">
                  {i + 1}
                </span>
                <h3 className="text-lg font-medium tracking-tight md:col-span-4">
                  {step.title}
                </h3>
                <p className="max-w-prose text-sm leading-relaxed text-muted-foreground md:col-span-7">
                  {step.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
