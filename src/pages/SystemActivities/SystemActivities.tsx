import { Select } from "antd";
import { ArrowRight, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { API_LOG_ACTIVITY } from "../../services/modules/LogServices";
import { useSelector } from "react-redux";
import { Activities, Meta } from "../../types";
import moment from "moment";
import useMomentFn from "../../hooks/useMomentFn";
import CustomPagination from "../../components/ui/CustomPanigation/CustomPanigation";
import { useTranslation } from "react-i18next";
import { InfoOutlined } from "@ant-design/icons";
import DatePickerCustom from "../../components/DatePicker/DatePickerCustom";

export default function SystemActivities() {
  const user = useSelector((state) => state.user);
  const [activities, setActivities] = useState<Activities[]>([]);
  const [action, setAction] = useState<string>("");
  const [userRole, setRole] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [meta, setMeta] = useState<Meta>();
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const { formatDate } = useMomentFn();
  const { t } = useTranslation();

  const handleGetSystemActivities = async (
    current = 1,
    pageSize = 10,
    queryParams?: any
  ) => {
    const query = {
      userId: user?._id,
      ...queryParams,
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
    if (user?._id) {
      handleGetSystemActivities();
    }
  }, [user?._id]);

  const formatValue = (value: any, key: string) => {
    if (value === "") {
      return t("null");
    }

    let newValue = value;

    if (key === "avatar" && typeof value === "string") {
      return (
        <a
          href={value}
          className="text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("view_avatar")}
        </a>
      );
    }

    if (typeof value === "boolean") {
      return value ? t("on") : t("off");
    }

    if (key === "gender") {
      const genderMap: { [key: number]: string } = {
        0: t("0"),
        1: t("1"),
        2: t("2"),
      };
      return genderMap[+value] || t("unknown");
    }

    if (moment(value, moment.ISO_8601, true).isValid()) {
      newValue = formatDate(value);
    }

    return newValue;
  };

  const changesDisplay = (activities: Activities) => {
    return (
      <div>
        <b>• {t("changes")}:</b>
        {Object?.entries(activities?.changes)?.map(([key, value], idx) => (
          <p key={idx} className="flex items-center gap-2 ml-5 w-full">
            <b className="whitespace-nowrap">• {t(key)}:</b>
            <span className="text-gray-500 line-through whitespace-nowrap overflow-hidden text-ellipsis">
              {formatValue(value?.old, key)}
            </span>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
              {formatValue(value?.new, key)}
            </span>
          </p>
        ))}
      </div>
    );
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      handleGetSystemActivities(1, 10, { keyword: debouncedSearch });
    }
  }, [debouncedSearch]);

  const handleActivity = (value: any) => {
    const userName = t("your") || value?.userId?.full_name;
    const activityDetail = value?.activityDetail;
    const entityName = value?.entityName;

    const activityMessages: { [key: string]: string } = {
      CREATE: `${userName} ${t("has")} ${t("activity_create")} ${t(
        activityDetail
      )} ${entityName}`,
      UPDATE: `${userName} ${t("has")} ${t("activity_update")} ${t(
        activityDetail,
        { entityName }
      )}`,
      DELETE: `${userName} ${t("has")} ${t(activityDetail, { entityName })}`,
      APPLY: `${userName} ${t("has")} ${t("activity_apply")} ${t(entityName)}`,
      FAVORITE: `${userName} ${t("has")} ${t("activity_favorite")} ${t(
        entityName
      )}`,
      UNFAVORITE: `${userName} ${t("has")} ${t("activity_unfavorite")} ${t(
        entityName
      )}`,
      UPLOAD_CV: `${userName} ${t("has")} ${t("activity_upload_cv")}`,
      DELETE_CV: `${userName} ${t("has")} ${t(
        "activity_delete_cv"
      )} ${entityName}`,
    };

    return activityMessages[value?.action] || "";
  };

  const changesLinkDisplay = (activity: Activities) => {
    return (
      <div className="flex items-center gap-2">
        <b>• {t("download_link_has_uploaded")}:</b>
        <a
          href={activity?.changesLink?.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400"
        >
          {t("view_changes_link")}
        </a>
      </div>
    );
  };

  const changeColumnsDisplay = (activity: Activities) => {
    return (
      <div>
        <b>• {t("change_columns")}:</b>
        {Object?.entries(activity?.changeColumns)?.map(([key, value], idx) => (
          <p key={idx} className="flex items-center gap-2 ml-5 w-full">
            <b className="whitespace-nowrap">• {t(key)}:</b>
            <span className="text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
              {formatValue(value?.value, key)}
            </span>
          </p>
        ))}
      </div>
    );
  };

  const handleSelectAction = async (value: string) => {
    setAction(value.toUpperCase());
    await handleGetSystemActivities(1, 10, {
      action: value.toUpperCase(),
    });
  };

  const handleSelectRole = async (value: string) => {
    setRole(value.toUpperCase());
    await handleGetSystemActivities(1, 10, {
      userRole: value.toUpperCase(),
    });
  };

  const getActivityIcon = (action: string) => {
    const icons: { [key: string]: { icon: JSX.Element; color: string } } = {
      CREATE: { icon: <Plus size={12} />, color: "blue-500" },
      UPDATE: { icon: <Pencil size={12} />, color: "green-500" },
      UPLOAD_CV: { icon: <Pencil size={12} />, color: "green-500" },
      DELETE: { icon: <Trash2 size={12} />, color: "red-500" },
      DELETE_CV: { icon: <Trash2 size={12} />, color: "red-500" },
      APPLY: { icon: <InfoOutlined size={12} />, color: "blue-500" },
      FAVORITE: { icon: <Star size={12} />, color: "yellow-500" },
      UNFAVORITE: { icon: <Star size={12} />, color: "gray-500" },
    };

    return icons[action] || { icon: <Plus size={12} />, color: "blue-500" };
  };

  return (
    <div className="p-4 max-w-full mx-6">
      <div className="flex gap-4 mb-6">
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          placeholder={t("select_action")}
          onChange={handleSelectAction}
        >
          <Select.Option value="all">{t("all_actions")}</Select.Option>
          <Select.Option value="update">{t("update")}</Select.Option>
          <Select.Option value="create">{t("create")}</Select.Option>
          <Select.Option value="delete">{t("delete")}</Select.Option>
          <Select.Option value="apply">{t("apply")}</Select.Option>
          <Select.Option value="favorite">{t("favorite")}</Select.Option>
          <Select.Option value="unfavorite">{t("unfavorite")}</Select.Option>
          <Select.Option value="upload_cv">{t("upload_cv")}</Select.Option>
          <Select.Option value="delete_cv">{t("delete_cv")}</Select.Option>
        </Select>

        {/* Select chức vụ */}
        <Select
          defaultValue="all"
          style={{ width: 200 }}
          placeholder={t("select_role")}
          onChange={(value) => handleSelectRole(value)}
        >
          <Select.Option value="all">{t("all_roles")}</Select.Option>
          <Select.Option value="user">{t("user")}</Select.Option>
          {user?.role?.role_name === "employer" && (
            <Select.Option value="employer">{t("employer")}</Select.Option>
          )}
          {user?.role?.role_name === "admin" && (
            <>
              <Select.Option value="admin">{t("admin")}</Select.Option>
            </>
          )}
        </Select>
        <DatePickerCustom
          onChange={(dates, dateStrings) => {
            handleGetSystemActivities(1, 10, {
              // start_date: moment(dateStrings[0]).toISOString(),
              // end_date: moment(dateStrings[1]).toISOString(),
              // start_date: new Date(dateStrings[0]),
              // end_date: new Date(dateStrings[1]),
              start_date: dateStrings[0],
              end_date: dateStrings[1],
            });
          }}
          isShowSubmit={false}
        />
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
                  : activity?.action === "UPDATE" ||
                    activity?.action === "UPLOAD_CV"
                  ? "border-green-500"
                  : activity?.action === "DELETE" ||
                    activity?.action === "DELETE_CV"
                  ? "border-red-500"
                  : activity?.action === "APPLY"
                  ? "border-blue-500"
                  : activity?.action === "FAVORITE"
                  ? "border-yellow-500"
                  : activity?.action === "UNFAVORITE"
                  ? "border-gray-500"
                  : "border-blue-500"
              }`}
            >
              {activity?.action === "CREATE" ? (
                <Plus size={12} className="text-blue-500" />
              ) : activity?.action === "UPDATE" ||
                activity?.action === "UPLOAD_CV" ? (
                <Pencil className="text-green-500" size={12} />
              ) : activity?.action === "DELETE" ||
                activity?.action === "DELETE_CV" ? (
                <Trash2 size={12} className="text-red-500" />
              ) : activity?.action === "APPLY" ? (
                <InfoOutlined size={12} className="text-blue-500" />
              ) : activity?.action === "FAVORITE" ? (
                <Star size={12} className="text-yellow-500" />
              ) : activity?.action === "UNFAVORITE" ? (
                <Star size={12} className="text-gray-500" />
              ) : (
                <Plus size={12} className="text-blue-500" />
              )}
            </div>

            <div className="bg-white rounded-lg p-2 max-w-sm">
              <div className="flex items-start justify-start flex-col-reverse">
                <span className="font-medium text-[12px]">
                  {handleActivity(activity)}
                </span>
                {/* Moved createdAt here */}
                <span className="text-gray-500 text-[12px]">
                  {formatDate(activity.createdAt)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="mt-1 text-[10px] text-gray-600">
                    <p>
                      • <b>{t("device")}</b>{" "}
                      {activity?.deviceInfo?.device?.model}
                    </p>
                    <p>
                      • <b>{t("device_id")}</b> {activity?.deviceId | ""}
                    </p>
                    <p>
                      • <b>{t("browser")}</b>{" "}
                      {activity?.deviceInfo?.browser?.name}
                    </p>
                    <p>
                      • <b>{t("os")}</b> {activity?.deviceInfo?.os?.name}
                    </p>
                    <p>
                      • <b>{t("ip_address")}</b> {activity?.ipAddress}
                    </p>
                    {activity?.changes && changesDisplay(activity)}
                    {activity?.changesLink && changesLinkDisplay(activity)}
                    {activity?.changeColumns && changeColumnsDisplay(activity)}
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
            handleGetSystemActivities(current, pageSize, {
              action: action,
              userRole: userRole,
            });
          }}
        />
      </div>
    </div>
  );
}
