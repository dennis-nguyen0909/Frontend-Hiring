import { useEffect, useState } from "react";
import { Select, Input, Button, Form, notification } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { LinkOutlined } from "@ant-design/icons";
import { ORGANIZATION_API } from "../../../../../services/modules/OrganizationServices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updatePartialUser } from "../../../../../redux/slices/userSlices";
import { useOrganizationTypes } from "../../../../../hooks/useOrganizationTypes";
import { useIndustryTypes } from "../../../../../hooks/useIndustryTypes";
import { useTeamSizes } from "../../../../../hooks/useTeamSizes";
import LoadingComponentSkeleton from "../../../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";

export default function Founding() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [companyVision, setCompanyVision] = useState("");
  const dispatch = useDispatch();
  const userDetail = useSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(false);
  const [organization, setOrganization] = useState();
  const handleGetOrganization = async () => {
    try {
      setLoading(true);
      const params = {
        query: {
          owner: userDetail?._id,
        },
      };
      const res = await ORGANIZATION_API.getAll(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        setOrganization(res.data.items[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    handleGetOrganization();
  }, []);

  const handleSave = () => {
    setLoading(true);
    form.validateFields().then(async (values) => {
      const { year_of_establishment } = values;
      const params = {
        ...values,
        owner: userDetail?._id,
        year_of_establishment,
        company_vision: companyVision,
      };
      const res = await ORGANIZATION_API.createOrganization(
        params,
        userDetail.access_token
      );
      if (res.data) {
        notification.success({
          message: t("notification"),
          description: t("update_success"),
        });
        handleGetOrganization();
        dispatch(
          updatePartialUser({
            organization: res.data,
            access_token: userDetail.access_token,
          })
        );
      } else {
        notification.error({
          message: t("notification"),
          description: res.response.data.message,
        });
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        organization_type: organization?.organization_type,
        industry_type: organization?.industry_type,
        team_size: organization?.team_size,
        company_website: organization?.company_website,
        year_of_establishment: organization?.year_of_establishment,
      });
      setCompanyVision(organization?.company_vision);
    }
  }, [organization]);

  const { data: organizationTypes } = useOrganizationTypes(1, 50);
  const { data: industry_type } = useIndustryTypes(1, 50);
  const { data: teamSizes } = useTeamSizes(1, 50);

  return (
    <div className="p-6 min-h-screen">
      <Form form={form} layout="vertical">
        <LoadingComponentSkeleton isLoading={loading}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Form.Item
              label={
                <div className="text-[12px]">{t("organization_type")}</div>
              }
              name="organization_type"
              rules={[
                {
                  required: true,
                  message: t("please_select_organization_type"),
                },
              ]}
            >
              <Select placeholder="Chọn" className="text-[12px]">
                {organizationTypes.map((type) => (
                  <Select.Option key={type._id} value={type.name}>
                    <span className="text-[12px]">{type.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("industry_type")}</div>}
              name="industry_type"
              rules={[
                { required: true, message: t("please_select_industry_type") },
              ]}
            >
              <Select placeholder="Chọn...">
                {industry_type.map((type) => (
                  <Select.Option key={type._id} value={type.name}>
                    <span className="text-[12px]">{type.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("team_size")}</div>}
              name="team_size"
              rules={[
                {
                  required: true,
                  message: t("please_select_team_size"),
                },
              ]}
            >
              <Select placeholder="Chọn...">
                {teamSizes.map((size) => (
                  <Select.Option key={size._id} value={size.name}>
                    <span className="text-[12px]"> {size.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Form.Item
              label={
                <div className="text-[12px]">{t("year_of_establishment")}</div>
              }
              name="year_of_establishment"
              rules={[
                {
                  required: true,
                  message: t("please_select_year_of_establishment"),
                },
              ]}
            >
              <Input placeholder="dd/mm/yyyy" className="text-[12px]" />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("company_website")}</div>}
              name="company_website"
              rules={[
                {
                  required: true,
                  message: t("please_enter_company_website"),
                },
                { type: "url", message: t("please_enter_valid_url") },
              ]}
            >
              <Input
                prefix={<LinkOutlined className="text-gray-400" />}
                placeholder={t("website_url")}
                className="text-[12px]"
              />
            </Form.Item>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-[12px]">
              {t("company_vision")}
            </label>
            <Editor
              apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
              value={companyVision}
              onEditorChange={(content) => setCompanyVision(content)}
              init={{
                height: 200,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "bold italic underline strikethrough | link | alignleft aligncenter alignright alignjustify | bullist numlist | removeformat",
                content_style:
                  "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              }}
            />
          </div>

          <Button
            htmlType="submit"
            onClick={handleSave}
            className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white mt-5 !text-[12px]"
          >
            {t("save")}
          </Button>
        </LoadingComponentSkeleton>
      </Form>
    </div>
  );
}
