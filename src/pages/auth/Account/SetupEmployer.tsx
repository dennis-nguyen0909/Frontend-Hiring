import { Avatar } from "antd";
import Completed from "./Completed";
import logo from "../../../assets/logo/LogoH.png";
export default function AccountSetup({ tabs, activeTab }) {
  const progress = (tabs.findIndex((tab) => tab.id === activeTab) + 1) * 25;

  return (
    <div>
      <div className="max-w-7xl mx-auto bg-white ">
        {/* Logo */}
        <div className="mb-5">
          <div className="flex items-center gap-2">
            {/* <div className="w-8 h-8 bg-primaryColor rounded-lg" /> */}
            <Avatar shape="square" src={logo} />
            <span className="text-2xl font-semibold text-[#38151d]">
              HireDev
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        {activeTab !== "completed" && (
          <div className="mb-16">
            <div className="flex justify-between items-center relative px-8">
              {tabs.map((tab, index) => {
                const isCompleted =
                  index <= tabs.findIndex((tab) => tab.id === activeTab); // So sánh vị trí của tab hiện tại với các tab khác
                return (
                  <div
                    key={tab.id}
                    className="flex flex-col items-center z-10 w-48"
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center mb-3 text-base
          ${
            activeTab === tab.id
              ? "bg-primaryColor text-white"
              : isCompleted
              ? "bg-primaryColor text-white"
              : "bg-gray-200 text-gray-500"
          }`} // Điều kiện tô nền cho các tab đã hoàn thành
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`text-sm ${
                        activeTab === tab.id
                          ? "text-primaryColor"
                          : isCompleted
                          ? "text-primaryColor"
                          : "text-gray-500"
                      }`}
                    >
                      {tab.label}
                    </span>
                  </div>
                );
              })}
              {/* Progress line */}
              <div className="absolute top-3 left-[10%] right-[10%] h-[3px] bg-gray-200 -z-0">
                <div
                  className="h-full bg-primaryColor transition-all duration-300"
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Content */}

        {/* Tab Content */}
        <div className="mt-8">
            <div>{tabs.find((tab) => tab.id === activeTab)?.content}</div>
        </div>
      </div>
    </div>
  );
}
