import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-container px-6 py-12 lg:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-extrabold text-primary">5SPORT</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("aboutDesc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-foreground">{t("links")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  {t("about")}
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  {t("privacy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground">{t("contact")}</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>contact@5sport.vn</li>
              <li>Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6 text-center text-sm text-muted-foreground">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
