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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface Organization {
  organization_type: string;
  industry_type: string;
  team_size: string;
  company_website: string;
  year_of_establishment: string;
  company_vision: string;
}

interface RootState {
  user: {
    _id: string;
    access_token: string;
  };
}

interface OrganizationParams {
  organization_type: string;
  industry_type: string;
  team_size: string;
  company_website: string;
  year_of_establishment: string;
  company_vision: string;
  owner: string;
}

export default function Founding() {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const [companyVision, setCompanyVision] = useState("");
  const dispatch = useDispatch();
  const userDetail = useSelector((state: RootState) => state.user);
  const queryClient = useQueryClient();

  const { data: organization, isLoading: isLoadingOrganization } = useQuery({
    queryKey: ["organization", userDetail?._id],
    queryFn: async () => {
      const params = {
        query: {
          owner: userDetail?._id,
        },
      };
      const res = await ORGANIZATION_API.getAll(
        params,
        userDetail?.access_token
      );
      return res.data?.items[0] as Organization;
    },
    enabled: !!userDetail?._id && !!userDetail?.access_token,
  });

  const createOrganizationMutation = useMutation({
    mutationFn: async (params: OrganizationParams) => {
      const res = await ORGANIZATION_API.createOrganization(
        params,
        userDetail.access_token
      );
      return res.data;
    },
    onSuccess: (data) => {
      notification.success({
        message: t("notification"),
        description: t("update_success"),
      });
      queryClient.invalidateQueries({ queryKey: ["organization"] });
      dispatch(
        updatePartialUser({
          organization: data,
          access_token: userDetail.access_token,
        })
      );
    },
    onError: (error: Error) => {
      notification.error({
        message: t("notification"),
        description: error.message || t("error_occurred"),
      });
    },
  });

  useEffect(() => {
    if (organization) {
      form.setFieldsValue({
        organization_type: organization.organization_type,
        industry_type: organization.industry_type,
        team_size: organization.team_size,
        company_website: organization.company_website,
        year_of_establishment: organization.year_of_establishment,
      });
      setCompanyVision(organization.company_vision);
    }
  }, [organization, form]);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const { year_of_establishment } = values;
      const params = {
        ...values,
        owner: userDetail?._id,
        year_of_establishment,
        company_vision: companyVision,
      };
      createOrganizationMutation.mutate(params);
    });
  };

  const { data: organizationTypes } = useOrganizationTypes(1, 50);
  const { data: industry_type } = useIndustryTypes(1, 50);
  const { data: teamSizes } = useTeamSizes(1, 50);

  const isLoading =
    isLoadingOrganization || createOrganizationMutation.isPending;

  return (
    <div className="p-6 min-h-screen">
      <Form form={form} layout="vertical">
        <LoadingComponentSkeleton isLoading={isLoading}>
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
                {organizationTypes?.map((type) => (
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
                {industry_type?.map((type) => (
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
                {teamSizes?.map((size) => (
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
