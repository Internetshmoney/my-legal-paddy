import { ArrowRight, Briefcase, Globe, GraduationCap, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    title: "Connect",
    description:
      "Meet ambitious law students and young lawyers from across Africa, exchange ideas and build meaningful professional relationships.",
    icon: Users,
  },
  {
    title: "Discover Opportunities",
    description:
      "Receive internships, scholarships, competitions, career opportunities and important legal updates directly in the community.",
    icon: Briefcase,
  },
  {
    title: "Learn Together",
    description:
      "Participate in webinars, mentorship sessions, legal discussions and practical learning experiences.",
    icon: GraduationCap,
  },
  {
    title: "Grow Your Network",
    description:
      "Ask questions, share experiences and become part of a supportive legal community that helps members succeed.",
    icon: Globe,
  },
];

const stats = [
  { value: "600+", label: "Community Members" },
  { value: "70+", label: "Articles Published" },
  { value: "5,000+", label: "Monthly Readers" },
  { value: "30+", label: "Webinars & Events" },
];

export default function Community() {
  return (
    <section className="relative overflow-hidden border-y border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.16),_transparent_30%),linear-gradient(135deg,_rgba(255,255,255,0.95),_rgba(250,245,235,0.72))] py-24 sm:py-28 lg:py-32 dark:bg-[radial-gradient(circle_at_top_left,_rgba(245,158,11,0.2),_transparent_32%),linear-gradient(135deg,_rgba(9,9,11,0.98),_rgba(24,24,27,0.95))]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600/90 dark:text-amber-400/90">
              COMMUNITY
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-foreground sm:text-5xl lg:text-6xl">
              Join Africa&apos;s Growing Student Legal Community
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Become part of a growing network of law students, graduates and legal professionals across Africa. Join conversations, discover opportunities, attend exclusive events and grow alongside people on the same legal journey.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-amber-500/90 px-6 text-white shadow-[0_12px_30px_rgba(217,119,6,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-amber-600 dark:bg-amber-500 dark:hover:bg-amber-400"
              >
                <a href="https://chat.whatsapp.com/your-community-link" target="_blank" rel="noreferrer">
                  Join WhatsApp Community
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              Free to join • Takes less than a minute
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <article
                  key={benefit.title}
                  className="group rounded-2xl border border-border/70 bg-background/70 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(15,23,42,0.1)] dark:bg-zinc-900/70"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 transition-colors duration-300 group-hover:bg-amber-500/20 dark:text-amber-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">
                    {benefit.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-12 grid gap-4 rounded-[1.75rem] border border-border/70 bg-background/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.06)] backdrop-blur-xl dark:bg-zinc-900/70 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border/60 bg-white/60 p-5 text-center dark:bg-zinc-950/50">
              <p className="text-2xl font-semibold tracking-[-0.02em] text-foreground">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
