import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ViewAllLinkProps {
  onClick?: () => void;
  className?: string;
}

export default function ViewAllLink({
  onClick,
  className = "",
}: ViewAllLinkProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium ${className}`}
    >
      {t("view_all")} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
