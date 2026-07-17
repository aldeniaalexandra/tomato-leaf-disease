import { diseases, type DiseaseGroup } from "@/lib/diseases";
import { Reveal } from "@/components/reveal";

const rows: { label: string; groups: DiseaseGroup[] }[] = [
  { label: "Fungal", groups: ["Fungal"] },
  { label: "Viral", groups: ["Viral"] },
  { label: "Bacterial and pests", groups: ["Bacterial", "Pest"] },
];

const healthy = diseases.find((d) => d.group === "None");

export function DiseaseIndex() {
  return (
    <section id="diseases" className="border-b scroll-mt-16">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <Reveal>
          <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            What the model can recognise
          </h2>
          <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground">
            Ten classes in total: nine conditions and a healthy baseline.
          </p>
        </Reveal>

        <div className="mt-12">
          {rows.map((row, i) => {
            const items = diseases.filter((d) => row.groups.includes(d.group));
            return (
              <Reveal key={row.label} delay={i * 0.05}>
                <div className="grid gap-4 border-t py-10 md:grid-cols-12 md:gap-8">
                  <h3 className="text-sm font-medium text-muted-foreground md:col-span-3">
                    {row.label}
                  </h3>
                  <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-9 lg:grid-cols-3">
                    {items.map((d) => (
                      <li key={d.name}>
                        <p className="text-sm font-medium">{d.name}</p>
                        <p className="mt-0.5 text-xs italic text-muted-foreground">
                          {d.agent}
                        </p>
                        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                          {d.description}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}

          {healthy && (
            <Reveal>
              <div className="grid gap-4 border-t py-10 md:grid-cols-12 md:gap-8">
                <h3 className="text-sm font-medium text-primary md:col-span-3">
                  Healthy
                </h3>
                <p className="max-w-prose text-sm leading-relaxed text-muted-foreground md:col-span-9">
                  {healthy.description} This is the baseline the model compares
                  every other class against.
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
