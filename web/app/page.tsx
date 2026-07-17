import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { DiseaseIndex } from "@/components/disease-index";
import { ModelReport } from "@/components/model-report";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <DiseaseIndex />
        <ModelReport />
      </main>
      <SiteFooter />
    </>
  );
}
