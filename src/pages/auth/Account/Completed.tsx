import { Button } from "antd";
import { CheckIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
interface ICompletedProps {
  handleCompleted: () => void;
}
const Completed = ({ handleCompleted }: ICompletedProps) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white flex flex-col items-center justify-center p-6">
      <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8">
        <CheckIcon className="w-10 h-10 text-blue-500" />
      </div>

      <h1 className="text-2xl font-semibold text-center mb-2">
        {t("congratulations")}
      </h1>

      <p className="text-gray-500 text-center max-w-lg mb-8">
        {t("congratulations_description")}
      </p>

      <div className="flex gap-4">
        <Button onClick={handleCompleted} size="large">
          {t("start")}
        </Button>
      </div>
    </div>
  );
};

export default Completed;
