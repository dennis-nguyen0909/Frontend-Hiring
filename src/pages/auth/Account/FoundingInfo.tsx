import { LinkOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useSelector } from "react-redux";
import { ORGANIZATION_API } from "../../../services/modules/OrganizationServices";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useOrganizationTypes } from "../../../hooks/useOrganizationTypes";
import { useIndustryTypes } from "../../../hooks/useIndustryTypes";
import { useTeamSizes } from "../../../hooks/useTeamSizes";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";
import { useTranslation } from "react-i18next";

const FoundingInfo = ({ handleTabChange }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const userDetail = useSelector((state) => state.user);
  const [companyVision, setCompanyVision] = useState("");
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
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
        userDetail?.access_token
      );
      if (res.data) {
        notification.success({
          message: t("notification"),
          description: t("update_success"),
        });

        handleTabChange("social");
      } else {
        notification.error({
          message: t("notification"),
          description: res.response.data.message,
        });
      }
    });
  };

  const validateCompanyVision = (_, value) => {
    if (!value.level.content || value.level.content.trim() === "") {
      return Promise.reject(new Error("Please enter company vision"));
    }
    return Promise.resolve();
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
    <Form form={form} layout="vertical">
      <LoadingComponentSkeleton isLoading={loading}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Form.Item
            label={t("organization_type")}
            name="organization_type"
            rules={[
              { required: true, message: t("please_select_organization_type") },
            ]}
          >
            <Select placeholder={t("select")}>
              {organizationTypes.map((type) => (
                <Select.Option key={type._id} value={type.name}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("industry_type")}
            name="industry_type"
            rules={[
              { required: true, message: t("please_select_industry_type") },
            ]}
          >
            <Select placeholder={t("select")}>
              {industry_type.map((type) => (
                <Select.Option key={type._id} value={type.name}>
                  {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={t("team_size")}
            name="team_size"
            rules={[{ required: true, message: t("please_select_team_size") }]}
          >
            <Select placeholder={t("select")}>
              {teamSizes.map((size) => (
                <Select.Option key={size._id} value={size.name}>
                  {size.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Form.Item
            label={t("year_of_establishment")}
            name="year_of_establishment"
            rules={[
              {
                required: true,
                message: t("please_select_establishment_date"),
              },
            ]}
          >
            <Input placeholder={t("example")} />
          </Form.Item>

          <Form.Item
            label={t("company_website")}
            name="company_website"
            rules={[
              {
                required: true,
                message: t("please_enter_company_website_url"),
              },
              { type: "url", message: t("please_enter_a_valid_url") },
            ]}
          >
            <Input
              prefix={<LinkOutlined className="text-gray-400" />}
              placeholder={t("website_url")}
            />
          </Form.Item>
        </div>

        <div className="mb-6">
          <Form.Item
            label={t("company_vision")}
            name="company_vision"
            // required
            // rules={[{ validator: validateCompanyVision }]}
          >
            <Editor
              value={companyVision}
              apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
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
          </Form.Item>
        </div>
        <Button
          htmlType="submit"
          onClick={handleSave}
          className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white"
        >
          {t("save_and_continue")}
        </Button>
      </LoadingComponentSkeleton>
    </Form>
  );
};

export default FoundingInfo;
