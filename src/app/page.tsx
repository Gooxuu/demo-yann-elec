import CertBadges from "@/components/CertBadges";
import EmergencySection from "@/components/EmergencySection";
import BeforeAfterSlider from "@/components/motion/BeforeAfterSlider";
import Reveal from "@/components/motion/Reveal";
import ProcessSteps, { type Step } from "@/components/ProcessSteps";
import { Container, CtaBand, SectionHeading } from "@/components/Section";
import ServiceCards from "@/components/ServiceCards";
import SplitHero from "@/components/SplitHero";
import StatsBand from "@/components/StatsBand";
import Testimonial from "@/components/Testimonial";
import { CERTIFICATIONS, STATS, TESTIMONIAL } from "@/lib/infos";
import { ACTIVE_SERVICES } from "@/lib/services";
import { STOCK_PHOTOS } from "@/lib/stockPhotos";

const HERO = {
  eyebrow: "Électricien à Elne · Pyrénées-Orientales",
  title: "Votre électricien à Elne, du neuf à la rénovation",
  text: "Installation neuve, rénovation, dépannage, domotique et bornes de recharge : un artisan, joignable directement.",
};

const STEPS: readonly Step[] = [
  { icon: "phone", title: "Vous appelez", text: "Vous nous décrivez la situation : panne, projet ou installation à prévoir." },
  { icon: "search", title: "Diagnostic sur place", text: "Nous examinons votre installation et vous expliquons ce qu’il faut faire." },
  { icon: "wrench", title: "Intervention", text: "Nous réalisons les travaux dans les règles de l’art et vous remettons une installation sûre." },
];

export default function Home() {
  return (
    <>
      <SplitHero {...HERO} photo={STOCK_PHOTOS.hero} badge="" />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Nos services"
            title="Ce que nous faisons pour vous"
            intro="Chaque intervention est expliquée avant de commencer et réalisée avec soin."
          />
          <ServiceCards services={ACTIVE_SERVICES} className="mt-12" />
        </Container>
      </section>

      {/* Avis client juste après les services : la preuve vient tout de suite après l'offre. */}
      {TESTIMONIAL && (
        <section className="bg-surface py-20 sm:py-28">
          <Container>
            <Testimonial testimonial={TESTIMONIAL} />
          </Container>
        </section>
      )}

      <EmergencySection />

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Comment ça se passe" title="Trois étapes, un seul interlocuteur" align="center" />
          <ProcessSteps steps={STEPS} className="mt-14" />
        </Container>
      </section>

      <section className="bg-surface py-20 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Avant / après"
            title="Des chantiers propres et soignés"
            intro="Faites glisser la poignée pour comparer."
          />
          <Reveal>
            <BeforeAfterSlider before={STOCK_PHOTOS.avant} after={STOCK_PHOTOS.apres} className="aspect-[4/3] shadow-2xl" />
            {/* À LA LIVRAISON : vraies photos avant/après de l'artisan ; retirer la mention ci-dessous seulement alors */}
            <p className="mt-3 text-xs text-muted">Photos d’illustration.</p>
          </Reveal>
        </Container>
      </section>

      <StatsBand stats={STATS} />

      {CERTIFICATIONS.length > 0 && (
        <section className="py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="Garanties" title="Un artisan qualifié et assuré" align="center" />
            <CertBadges className="mt-10" />
          </Container>
        </section>
      )}

      <CtaBand title="Un projet ou une panne ?" text="Appelez-nous ou écrivez-nous pour en parler." />
    </>
  );
}
