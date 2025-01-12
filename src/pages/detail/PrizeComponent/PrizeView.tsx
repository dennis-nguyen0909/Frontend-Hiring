import { useSelector } from "react-redux";
import Prize from "./PrizeComponent";
import { useEffect, useState } from "react";
import { PRIZE_API } from "../../../services/modules/PrizeServices";
import { Button, Card, Form, Input, notification, Select } from "antd";
import { Award, BookOpen } from "lucide-react";
import GeneralModal from "../../../components/ui/GeneralModal/GeneralModal";
import UploadForm from "../../../components/ui/UploadForm/UploadForm";
import moment from "moment";
import { MediaApi } from "../../../services/modules/mediaServices";
import useCalculateUserProfile from "../../../hooks/useCaculateProfile";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
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
        message: "Thông báo",
        description: "Thêm Giải thưởng thành công",
      });
      await handleGetPrizesByUserId({});
      closeModal();
      await handleUpdateProfile();
    }
    setIsLoading(false);
  };

  const handleOnchangeFile = async (file: File) => {
    setIsLoading(true);
    const res = await MediaApi.postMedia(file, userDetail.access_token);
    if (res.data.url) {
      setImgUrl(res.data.url);
      setIsLoading(false);
    } else {
      notification.error({
        message: "Thông báo",
        description: "Tải thất bại",
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
        message: "Thông báo",
        description: "Cập nhật giải thưởng",
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
          message: "Thông báo",
          description: "Xóa thành công",
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
    label={
      <span className="text-[12px]">
        Tên giải thưởng
      </span>
    }
    name="prize_name"
    rules={[
      { required: true, message: "Vui lòng nhập Tên giải thưởng" },
    ]}
  >
    <Input placeholder="Tên giải thưởng" className="w-full text-[12px]" />
  </Form.Item>

  <Form.Item
    label={<div className="text-[12px]">Tổ chức</div>}
    name="organization_name"
    rules={[{ required: true, message: "Vui lòng nhập tên tổ chức" }]}
  >
    <Input placeholder="Tổ chức" className="w-full text-[12px]" />
  </Form.Item>

  <div className="mb-4">
    <div className="grid ">
      <div>
      <label className="block mb-2 text-[12px]">
      <span className="text-red-500 mr-1">*</span>
      Ngày nhận
    </label>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item
            name={["date_of_receipt", "month"]}
            rules={[{ required: true, message: "Vui lòng chọn tháng" }]}
          >
            <Select placeholder="Chọn tháng">
              {Array.from({ length: 12 }, (_, i) => (
                <Select.Option key={i + 1} value={i + 1}>
                  Tháng {i + 1}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={["date_of_receipt", "year"]}
            rules={[{ required: true, message: "Vui lòng chọn năm" }]}
          >
            <Select placeholder="Chọn năm">
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
        className="!bg-primaryColor hover:bg-green-600 text-white px-8 w-full"
      >
        Cập nhật
      </Button>
      <Button
        type="danger"
        onClick={() => onDelete()}
        className="!bg-black hover:bg-green-600 text-white px-8 w-full"
      >
        Xóa
      </Button>
    </div>
  )}

  {type === "create" && (
    <Button
      type="primary"
      htmlType="submit"
      className="!bg-primaryColor !text-white px-8 w-full !text-[12px]"
    >
      Thêm
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
              <h2 className="font-semibold text-[12px]">Giải thưởng</h2>
            </div>
            <Button className="!text-[12px]" onClick={() => handleOpenModel("create")}>Thêm mục</Button>
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
            <h2 className="font-semibold text-[12px]">Giải thưởng</h2>
            </div>
            <Button className="!text-[12px]" onClick={() => handleOpenModel("create")}>Thêm mục</Button>
          </div>
          <p className="text-[12px] text-gray-500">
            Nếu bạn đã có CV trên DevHire, bấm Cập nhật để hệ thống tự động điền
            phần này theo CV.
          </p>
        </Card>
      )}

      <GeneralModal
        renderBody={renderBody}
        visible={visible}
        title={
          type === "create"
            ? "Giải thưởng"
            : type === "edit"
            ? "Cập nhật"
            : "Xóa giải thưởng"
        }
        onCancel={closeModal}
        style={undefined}
      />
    </>
  );
}
