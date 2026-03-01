import { useTranslations } from "next-intl";
import { Trophy, Users, Compass } from "lucide-react";

const features = [
  {
    key: "compete" as const,
    icon: Trophy,
  },
  {
    key: "connect" as const,
    icon: Users,
  },
  {
    key: "discover" as const,
    icon: Compass,
  },
];

export function WhyJoinSection() {
  const t = useTranslations("whyJoin");

  return (
    <section className="bg-gray-50 py-16">
      <div className="mx-auto max-w-container px-6 lg:px-20">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">{t("title")}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map(({ key, icon: Icon }) => (
            <div key={key} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">
                {t(`${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
