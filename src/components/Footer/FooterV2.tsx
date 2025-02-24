import { Button, Image, Input } from "antd";
import { Facebook, Github, Instagram, Send, Figma } from "lucide-react";
import { Link } from "react-router-dom";
import logoH from "../../assets/logo/LogoH.png";
import { useTranslation } from "react-i18next";

export default function FooterV2() {
  const { t } = useTranslation();
  return (
    <footer className="bg-zinc-900 text-white py-16">
      {/* Top Section */}
      <div className="container mx-auto px-4 mb-16">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xl">
            <h2 className="text-4xl font-bold mb-6">{t("start_work_today")}</h2>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email Address"
                className="bg-white text-black rounded-full"
              />
              <Button className="rounded-full bg-black hover:bg-zinc-800">
                {t("start_work_today")}
              </Button>
            </div>
          </div>
          <div className="w-64 h-64 relative">
            <Image
              src={logoH}
              alt="Decorative sphere"
              width={256}
              height={256}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo Section */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="font-bold text-xl">{t("hire_dev")}</div>
            </div>
            <p className="text-zinc-400 text-sm">
              {t(
                "specialized_in_creating_creative_recruitment_solutions_friendly_to_users_focusing_on_providing_design_and_developing_high_quality_web_solutions"
              )}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="col-span-2">
            <nav className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <Link to="/about" className="block hover:text-zinc-300">
                  {t("about_us")}
                </Link>
                <Link to="/features" className="block hover:text-zinc-300">
                  {t("features")}
                </Link>
                <Link to="/pricing" className="block hover:text-zinc-300">
                  {t("pricing")}
                </Link>
              </div>
              <div className="space-y-4">
                <Link to="#" className="block hover:text-zinc-300">
                  {t("gallery")}
                </Link>
                <Link to="#" className="block hover:text-zinc-300">
                  {t("team")}
                </Link>
              </div>
            </nav>
          </div>

          {/* Social Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">{t("lets_do_it")}</h3>
            <div className="flex gap-4">
              <Link to="#" className="hover:text-zinc-300">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-zinc-300">
                <Github className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-zinc-300">
                <Send className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-zinc-300">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link to="#" className="hover:text-zinc-300">
                <Figma className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
