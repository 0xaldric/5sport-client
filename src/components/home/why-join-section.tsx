import { useTranslations } from "next-intl";
import { Trophy, Users, Compass } from "lucide-react";

const features = [
  {
    key: "compete" as const,
    icon: Trophy,
    gradient: "from-blue-500 to-blue-600",
  },
  {
    key: "connect" as const,
    icon: Users,
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    key: "discover" as const,
    icon: Compass,
    gradient: "from-amber-500 to-orange-500",
  },
];

export function WhyJoinSection() {
  const t = useTranslations("whyJoin");

  return (
    <section className="bg-muted py-20">
      <div className="mx-auto max-w-container px-6 lg:px-20">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-secondary md:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ key, icon: Icon, gradient }) => (
            <div
              key={key}
              className="group cursor-pointer rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50"
            >
              <div
                className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="mt-5 text-base font-bold text-secondary">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
