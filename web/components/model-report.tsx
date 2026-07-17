import { Reveal } from "@/components/reveal";
import { ConfusionMatrix } from "@/components/confusion-matrix";

const stats = [
  { value: "99.2%", label: "Test accuracy" },
  { value: "10", label: "Classes" },
  { value: "224 px", label: "Input size" },
  { value: "< 2 s", label: "Inference time" },
];

export function ModelReport() {
  return (
    <section id="model" className="scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            Behind the prediction
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
            An EfficientNetB0 network fine-tuned on the tomato subset of
            PlantVillage, running in the browser with ONNX Runtime.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="min-w-0 lg:col-span-4">
            <dl className="grid grid-cols-2">
              {stats.map((s, i) => (
                <div
                  key={s.label}
                  className={`py-6 ${i % 2 === 1 ? "pl-6" : "pr-6"} ${i < 2 ? "border-b" : ""}`}
                >
                  <dd className="font-mono text-3xl tracking-tight">{s.value}</dd>
                  <dt className="mt-1 text-xs text-muted-foreground">{s.label}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
              The confusion matrix shows where the model is confident and where
              classes overlap: almost everything sits on the diagonal, with a
              few spider mite and target spot leaves read as healthy.
            </p>
            <a
              href="https://github.com/aldeniaalexandra/tomato-leaf-disease/blob/main/tomato-leaf-disease.ipynb"
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
            >
              Read the training notebook
            </a>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-8">
            <ConfusionMatrix />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
