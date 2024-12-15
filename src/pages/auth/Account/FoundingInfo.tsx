import { LinkOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Select } from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { useSelector } from "react-redux";
import { ORGANIZATION_API } from "../../../services/modules/OrganizationServices";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slices/userSlices";
import { useEffect, useState } from "react";
import moment from "moment";
import { useOrganizationTypes } from "../../../hooks/useOrganizationTypes";
import { useIndustryTypes } from "../../../hooks/useIndustryTypes";
import { useTeamSizes } from "../../../hooks/useTeamSizes";
import LoadingComponentSkeleton from "../../../components/Loading/LoadingComponentSkeleton";

const FoundingInfo = ({ handleTabChange }) => {
  const [form] = Form.useForm();
  const userDetail = useSelector((state) => state.user);
  const [companyVision, setCompanyVision] = useState("");
  const [loading,setLoading]=useState<boolean>(false)
  const dispatch = useDispatch();
  const [organization, setOrganization] = useState();
  const handleGetOrganization = async () => {
    try {
      setLoading(true)
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
    } finally{
      setLoading(false)
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
        owner: userDetail?.id,
        year_of_establishment,
        company_vision: companyVision,
      };
      const res = await ORGANIZATION_API.createOrganization(
        params,
        userDetail?.access_token
      );
      if (res.data) {
        notification.success({
          message: "Notification",
          description: "Cập nhật thành công",
        });
        dispatch(
          updateUser({ ...res.data, access_token: userDetail.access_token })
        );
        handleTabChange("social");
      } else {
        notification.error({
          message: "Notification",
          description: res.response.data.message,
        });
      }
    });
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
    <Form
      form={form}
      layout="vertical"
    >
      <LoadingComponentSkeleton isLoading={true}>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Form.Item
          label="Organization Type"
          name="organization_type"
          rules={[
            { required: true, message: "Please select organization type" },
          ]}
        >
          <Select placeholder="Select...">
            {organizationTypes.map((type) => (
              <Select.Option key={type._id} value={type.name}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Industry Types"
          name="industry_type"
          rules={[{ required: true, message: "Please select industry type" }]}
        >
          <Select placeholder="Select...">
            {industry_type.map((type) => (
              <Select.Option key={type._id} value={type.name}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Team Size"
          name="team_size"
          rules={[{ required: true, message: "Please select team size" }]}
        >
          <Select placeholder="Select...">
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
          label="Year of Establishment"
          name="year_of_establishment"
          rules={[
            { required: true, message: "Please select establishment date" },
          ]}
        >
          <Input placeholder="dd/mm/yyyy" />
        </Form.Item>

        <Form.Item
          label="Company Website"
          name="company_website"
          rules={[
            { required: true, message: "Please enter company_website URL" },
            { type: "url", message: "Please enter a valid URL" },
          ]}
        >
          <Input
            prefix={<LinkOutlined className="text-gray-400" />}
            placeholder="Website url..."
          />
        </Form.Item>
      </div>

      <div className="mb-6">
        <label className="block mb-2">Company Vision</label>
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
      </div>

      <Button type="primary" onClick={handleSave} className="bg-blue-500">
        Save Changes
      </Button>
      </LoadingComponentSkeleton>
    </Form>
  );
};

export default FoundingInfo;
