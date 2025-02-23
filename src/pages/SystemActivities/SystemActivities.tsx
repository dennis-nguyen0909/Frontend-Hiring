import { Input, Select } from "antd";
import { ArrowRight, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_LOG_ACTIVITY } from "../../services/modules/LogServices";
import { useSelector } from "react-redux";
import { Activities, Meta } from "../../types";
import moment from "moment";
import useMomentFn from "../../hooks/useMomentFn";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import SearchInput from "../../components/SearchInput/SearchInput";

export default function SystemActivities() {
  const user = useSelector((state) => state.user);
  const [activities, setActivities] = useState<Activities[]>([]);
  const [search, setSearch] = useState<string>("");
  const [meta, setMeta] = useState<Meta>();
  const { formatDate } = useMomentFn();
  const [dateRange, setDateRange] = useState({
    start: "16/02/25",
    end: "23/02/25",
  });

  const handleGetSystemActivities = async (current = 1, pageSize = 10) => {
    const query = {
      userId: user?._id,
    };
    const res = await API_LOG_ACTIVITY.getActivity(current, pageSize, {
      query,
    });
    if (res.data) {
      setActivities(res.data.items);
      setMeta(res.data.meta);
    }
  };

  useEffect(() => {
    handleGetSystemActivities();
  }, []);

  console.log("activities", activities);
  const formatValue = (value: any) => {
    if (moment(value, moment.ISO_8601, true).isValid()) {
      return formatDate(value);
    }
    return value;
  };
  const changesDisplay = (activities: Activities) => {
    return (
      <div>
        <b>• Các thay đổi:</b>
        {Object.entries(activities?.changes)?.map(([key, value], idx) => (
          <p key={idx} className="flex items-center gap-2 ml-5 w-full">
            <b className="whitespace-nowrap">• {key}:</b>
            <span className="text-gray-500 line-through whitespace-nowrap overflow-hidden text-ellipsis">
              {value?.old ? formatValue(value?.old) : "Rỗng"}
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
              {value?.new ? formatValue(value?.new) : "Rỗng"}
            </span>
          </p>
        ))}
      </div>
    );
  };

  const handleSearch = (value: string) => {
    setSearch(value);
  };
  console.log("duydeptrai", search);
  return (
    <div className="p-4 max-w-full  mx-6">
      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <SearchInput
          color="black"
          borderColor="black"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          onClick={() => handleSearch(search)}
        />
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          placeholder="--Chọn hành động--"
        >
          <Select.Option value="all">Tất cả hành động</Select.Option>
          <Select.Option value="update">Cập nhật</Select.Option>
          <Select.Option value="create">Tạo mới</Select.Option>
        </Select>

        {/* Select chức vụ */}
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          placeholder="--Chọn chức vụ--"
        >
          <Select.Option value="all">Tất cả chức vụ</Select.Option>
          <Select.Option value="staff">Nhân viên</Select.Option>
          <Select.Option value="manager">Quản lý</Select.Option>
        </Select>

        <div className="flex items-center gap-2 bg-white border rounded-md px-3">
          <Input
            type="text"
            placeholder="DD/MM/YY"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
            className="w-24 border-0 p-0"
          />
          <span>~</span>
          <Input
            type="text"
            placeholder="DD/MM/YY"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
            className="w-24 border-0 p-0"
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className=" relative">
        {/* Vertical timeline line */}
        <div className="absolute left-[-5px] mt-[33px] z-0 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        {activities.map((activity, idx) => (
          <div key={idx} className="relative pl-4 ">
            {/* Timeline Dot */}
            <div
              className={`absolute bg-white -left-4 top-2.5 flex items-center justify-center w-6 h-6 border rounded-full z-[20] ${
                activity?.action === "CREATE"
                  ? "border-blue-500"
                  : activity?.action === "UPDATE"
                  ? "border-green-500"
                  : "border-red-500"
              }`}
            >
              {activity?.action === "CREATE" ? (
                <Plus size={12} className="text-blue-500" />
              ) : activity?.action === "UPDATE" ? (
                <Pencil className="text-green-500" size={12} />
              ) : (
                <Trash2 size={12} className="text-red-500" />
              )}
            </div>

            <div className="bg-white rounded-lg p-2 max-w-sm">
              <div className="flex items-start justify-start mb-1  flex-col-reverse">
                <span className="font-medium text-[12px]">
                  {activity.userId?.full_name} đã thực hiện {activity.action}
                </span>
                {/* Moved createdAt here */}
                <span className="text-gray-500 text-[12px]">
                  {formatDate(activity.createdAt)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="mt-1 space-y-1 text-[10px] text-gray-600">
                    <p>
                      • <b>Thiết bị:</b> {activity?.deviceInfo?.device?.model}
                    </p>
                    <p>
                      • <b>Mã thiết bị:</b> {activity?.deviceId | ""}
                    </p>
                    <p>
                      • <b>Trình duyệt:</b>{" "}
                      {activity?.deviceInfo?.browser?.name}
                    </p>
                    <p>
                      • <b>Hệ điều hành:</b> {activity?.deviceInfo?.os?.name}
                    </p>
                    <p>
                      • <b>Địa chỉ IP:</b> {activity?.ipAddress}
                    </p>
                    {changesDisplay(activity)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <CustomPagination
          currentPage={meta?.current}
          perPage={meta?.per_page}
          total={meta?.total}
          onPageChange={(current, pageSize) => {
            handleGetSystemActivities(current, pageSize);
          }}
        />
      </div>
    </div>
  );
}
