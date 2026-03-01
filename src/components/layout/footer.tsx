import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-secondary text-slate-300">
      <div className="mx-auto max-w-container px-6 py-14 lg:px-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-extrabold text-white">5</span>
              </div>
              <span className="text-lg font-extrabold text-white">SPORT</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {t("aboutDesc")}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("links")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <a href="#" className="text-slate-400 transition-colors duration-200 hover:text-white">
                  {t("about")}
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors duration-200 hover:text-white">
                  {t("terms")}
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 transition-colors duration-200 hover:text-white">
                  {t("privacy")}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              {t("contact")}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>contact@5sport.vn</li>
              <li>Ho Chi Minh City, Vietnam</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">
          {t("copyright")}
        </div>
      </div>
    </footer>
  );
}
