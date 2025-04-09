import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ViewAllLinkProps {
  href: string;
  className?: string;
}

export default function ViewAllLink({
  href = "#",
  className = "",
}: ViewAllLinkProps) {
  const { t } = useTranslation();
  return (
    <a
      href={href}
      className={`inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium ${className}`}
    >
      {t("view_all")} <ArrowRight className="h-4 w-4" />
    </a>
  );
}
