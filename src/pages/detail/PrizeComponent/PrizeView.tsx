import { useSelector } from "react-redux";
import Prize from "./PrizeComponent";
import { useEffect, useState } from "react";
import { PRIZE_API } from "../../../services/modules/PrizeServices";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  notification,
  Select,
} from "antd";
import { Award } from "lucide-react";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import UploadForm from "../../../components/ui/UploadForm/UploadForm";
import moment from "moment";
import { MediaApi } from "../../../services/modules/mediaServices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import useMomentFn from "../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
interface Prize {
  _id: string;
  user_id: string;
  name: string;
  organization_name: string;
  date_of_receipt: Date;
  prize_link?: string;
  prize_image?: string;
}
export default function PrizeView() {
  const { formatDate, dateFormat } = useMomentFn();
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [type, setType] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [visible, setVisible] = useState(false);
  const [link, setLink] = useState<string>("");
  const [selectedId, setSelectedId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );
  const handleGetPrizesByUserId = async ({ current = 1, pageSize = 10 }) => {
    try {
      setIsLoading(true);
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await PRIZE_API.getAll(params, userDetail.accessToken);
      if (res.data) {
        setPrizes(res.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleGetPrizesByUserId({});
  }, []);

  const closeModal = () => {
    setVisible(false);
    setType("");
    form.resetFields();
    setLink("");
    setImgUrl("");
    setSelectedId("");
  };

  const handleOpenModel = (type: string, id?: string) => {
    setType(type);
    setVisible(!visible);
    setSelectedId(id || "");
  };

  useEffect(() => {
    if (selectedId) {
      handleGetDetailPrize();
    }
  }, [selectedId]);

  const handleGetDetailPrize = async () => {
    try {
      setIsLoadingDetail(true);
      const res = await PRIZE_API.findByPrizeId(
        selectedId,
        userDetail.accessToken
      );
      if (res.data) {
        setLink(res.data.prize_link);
        form.setFieldsValue({
          ...res.data,
          date_of_receipt: {
            year: moment(res.data.date_of_receipt).year(),
            month: moment(res.data.date_of_receipt).month() + 1,
          },
        });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const [form] = Form.useForm();
  const onSubmit = async (values: any) => {
    setIsLoading(true);
    const { date_of_receipt } = values;

    // Chuyển đổi start_date và end_date thành moment với giờ
    const dateOfReceipt = moment(
      `${date_of_receipt.year}-${date_of_receipt.month}`,
      "YYYY-MM"
    );

    const params = {
      user_id: userDetail?._id,
      prize_name: values.prize_name,
      organization_name: values.organization_name,
      date_of_receipt: dateOfReceipt.toDate(),
      prize_link: link ? link : null,
      prize_image: imgUrl ? imgUrl : null,
    };
    const res = await PRIZE_API.create(params, userDetail.accessToken);
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      await handleGetPrizesByUserId({});
      closeModal();
      await handleUpdateProfile();
    }
    setIsLoading(false);
  };

  const handleOnchangeFile = async (file: File) => {
    setIsLoading(true);
    const res = await MediaApi.postMedia(
      file,
      userDetail?._id,
      userDetail.access_token
    );
    if (res.data.url) {
      setImgUrl(res.data.url);
      setIsLoading(false);
    } else {
      notification.error({
        message: t("notification"),
        description: t("upload_failed"),
      });
      setIsLoading(false);
    }
  };
  const onUpdate = async () => {
    setIsLoading(true);
    const values = form.getFieldsValue();
    // Chuyển đổi start_date và end_date thành moment với giờ
    const dateOfReceipt = moment(
      `${values.date_of_receipt.year}-${values.date_of_receipt.month}`,
      "YYYY-MM"
    );
    const params = {
      ...values,
      date_of_receipt: dateOfReceipt.toDate(),
      user_id: userDetail?._id,
      prize_image: imgUrl ? imgUrl : null,
      prize_link: link ? link : null,
    };

    const res = await PRIZE_API.update(
      selectedId,
      params,
      userDetail.accessToken
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      await handleGetPrizesByUserId({});
      closeModal();
      await handleUpdateProfile();
    }
    setIsLoading(false);
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      const res = await PRIZE_API.deleteByUser(
        selectedId,
        userDetail.accessToken
      );
      if (+res.statusCode === 200) {
        notification.success({
          message: t("notification"),
          description: t("delete_success"),
        });
        await handleGetPrizesByUserId({});
        closeModal();
        await handleUpdateProfile();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBody = () => {
    return (
      <LoadingComponentSkeleton isLoading={isLoadingDetail}>
        <LoadingComponent isLoading={isLoading}>
          <Form form={form} layout="vertical" onFinish={onSubmit}>
            <Form.Item
              label={<span className="text-[12px]">{t("prize_name")}</span>}
              name="prize_name"
              rules={[
                { required: true, message: t("please_enter_prize_name") },
              ]}
            >
              <Input
                placeholder={t("prize_name")}
                className="w-full text-[12px]"
              />
            </Form.Item>

            <Form.Item
              label={
                <div className="text-[12px]">{t("organization_name")}</div>
              }
              name="organization_name"
              rules={[
                {
                  required: true,
                  message: t("please_enter_organization_name"),
                },
              ]}
            >
              <Input
                placeholder={t("organization_name")}
                className="w-full text-[12px]"
              />
            </Form.Item>

            <div className="mb-4">
              <div className="grid ">
                <div>
                  <label className="block mb-2 text-[12px]">
                    <span className="text-red-500 mr-1">*</span>
                    {t("date_of_receipt")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <Form.Item
                      name={["date_of_receipt", "month"]}
                      rules={[
                        { required: true, message: t("please_select_month") },
                      ]}
                    >
                      <Select placeholder={t("please_select_month")}>
                        {Array.from({ length: 12 }, (_, i) => (
                          <Select.Option key={i + 1} value={i + 1}>
                            {t(`month_${i + 1}`)}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>

                    <Form.Item
                      name={["date_of_receipt", "year"]}
                      rules={[
                        { required: true, message: t("please_select_year") },
                      ]}
                    >
                      <Select placeholder={t("please_select_year")}>
                        {Array.from({ length: 10 }, (_, i) => {
                          const year = new Date().getFullYear() - i;
                          return (
                            <Select.Option key={year} value={year}>
                              {year}
                            </Select.Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 mb-6">
              <UploadForm
                onFileChange={handleOnchangeFile}
                link={link}
                setLink={setLink}
              />
            </div>

            {type === "edit" && (
              <div className="flex justify-between gap-4">
                <Button
                  type="primary"
                  onClick={onUpdate}
                  className="!bg-primaryColorH text-white"
                  danger
                  style={{
                    width: "100%",
                  }}
                >
                  {t("update")}
                </Button>
                <Button
                  type="danger"
                  onClick={() => onDelete()}
                  className="!bg-black hover:bg-green-600 text-white px-8 w-full"
                >
                  {t("delete")}
                </Button>
              </div>
            )}

            {type === "create" && (
              <Button
                type="primary"
                htmlType="submit"
                className="!bg-primaryColor !text-white px-8 w-full !text-[12px]"
              >
                {t("add")}
              </Button>
            )}
          </Form>
        </LoadingComponent>
      </LoadingComponentSkeleton>
    );
  };
  return (
    <>
      {prizes?.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-[#d3464f] text-[12px]" />
              <h2 className="font-semibold text-[12px]">{t("prize")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenModel("create")}
            >
              {t("add")}
            </Button>
          </div>
          {prizes.map((prize) => (
            <Prize
              prize_name={prize?.name}
              user_id={prize?.user_id}
              date_of_receipt={prize?.date_of_receipt}
              prize_image={prize?.prize_image}
              prize_link={prize?.prize_link}
              {...prize}
              onEdit={() => handleOpenModel("edit", prize?._id)}
            />
          ))}
        </Card>
      )}
      {!prizes.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-[#d3464f] text-[12px]" />
              <h2 className="font-semibold text-[12px]">{t("prize")}</h2>
            </div>
            <Button
              className="!text-[12px]"
              onClick={() => handleOpenModel("create")}
            >
              {t("add")}
            </Button>
          </div>
          <p className="text-[12px] text-gray-500">
            {t(
              "if_you_have_a_CV_on_DevHire_click_update_to_automatically_fill_this_part_according_to_the_CV"
            )}
          </p>
        </Card>
      )}

      <GeneralModal
        renderBody={renderBody}
        visible={visible}
        title={
          type === "create"
            ? t("prize")
            : type === "edit"
            ? t("update")
            : t("delete")
        }
        onCancel={closeModal}
        style={undefined}
      />
    </>
  );
}
