import { UploadOutlined } from "@ant-design/icons";
import { Avatar, Button, Form, Input, notification } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { Editor } from "@tinymce/tinymce-react";
import { useForm } from "antd/es/form/Form";
import { useState } from "react";
import { MediaApi } from "../../../services/modules/mediaServices";
import { useSelector } from "react-redux";
import { USER_API } from "../../../services/modules/userServices";
import LoadingComponent from "../../../components/Loading/LoadingComponent";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../redux/slices/userSlices";

const CompanyInfo = ({handleTabChange}) => {
  const [form] = useForm();
  const userDetail = useSelector((state) => state.user);
  const dispatch =useDispatch()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBanner, setIsLoadingBanner] = useState<boolean>(false);

  const onFinish = async(values: any) => {
    const params = {
        id:userDetail?._id,
        company_name:values.company_name,
        description:values?.description?.level?.content
    }
    const update = await USER_API.updateUser(params);
    if (update.data) {
    //   notification.success({
    //     message: "Thông báo",
    //     description: "Cập nhật thành công",
    //   });
      form.setFieldsValue({
        company_name:update?.data?.company_name,
        description:update?.data?.description,
      })
      handleTabChange("founding")
      dispatch(updateUser({...update.data}))
    }
  };

  const uploadFiled = async (file: File) => {
    try {
      const res = await MediaApi.postMedia(file, userDetail?.access_token);
      return res;
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error,
      });
    }
  };
  const handleFileChange = async (info: any, type: string) => {
    if (info.file) {
      if (type === "logo") {
        setIsLoading(true);
        const res = await uploadFiled(info?.file);
        if (res.data.url) {
          const params = {
            id: userDetail?._id,
            avatar_company: res?.data?.url,
          };
          const update = await USER_API.updateUser(params);
          if (update.data) {
            notification.success({
              message: "Thông báo",
              description: "Cập nhật thành công",
            });
;
            dispatch(updateUser({...update.data}))
          }
          setIsLoading(false);
        }
      } else if (type === "banner") {
        setIsLoadingBanner(true);
        const res = await uploadFiled(info?.file);
        if (res.data.url) {
          const params = {
            id: userDetail?._id,
            banner_company: res?.data?.url,
          };
          const update = await USER_API.updateUser(params);
          if (update.data) {
            notification.success({
              message: "Thông báo",
              description: "Cập nhật thành công",
            });
;
            dispatch(updateUser({...update.data}))
          }
          setIsLoadingBanner(false);
        }
      }
    } else if (info.file.status === "error") {
      console.log("File upload failed:", info.file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-6">Logo & Banner Image</h2>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Logo
          </label>
         {userDetail?.avatar_company ? (
            <Avatar shape="square" size={140}  src={userDetail?.avatar_company} />
         ):(
            <LoadingComponent isLoading={isLoading}>
            <Dragger
              name="logo"
              multiple={false}
              className="bg-gray-50 border-dashed"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => handleFileChange(info, "logo")}
            >
              <p className="text-gray-500">
                <UploadOutlined className="text-2xl mb-2" />
                <br />
                Browse photo or drop here
              </p>
              <p className="text-xs text-gray-400 mt-2">
                A photo larger than 400 pixels work best. Max photo size 5 MB.
              </p>
            </Dragger>
          </LoadingComponent>
         )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Image
          </label>
          {userDetail?.banner_company ? (
            <Avatar shape="square" size={140}  src={userDetail?.banner_company} />
          ):(
            <LoadingComponent isLoading={isLoadingBanner}>
            <Dragger
              name="banner"
              multiple={false}
              className="bg-gray-50 border-dashed"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => handleFileChange(info, "banner")}
            >
              <p className="text-gray-500">
                <UploadOutlined className="text-2xl mb-2" />
                <br />
                Browse photo or drop here
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Banner images optimal dimension 1520×400. Supported format JPEG,
                PNG. Max photo size 5 MB.
              </p>
            </Dragger>
          </LoadingComponent>
          )}
        </div>
      </div>

      <Form
        onFinish={onFinish}
        form={form}
        layout="vertical"
        className="space-y-6" 
        initialValues={{
            company_name:userDetail?.company_name,
            description:userDetail?.description,
        }}
      >
        <div>
          <Form.Item
            label="Company name"
            name="company_name"
            rules={[{ required: true, message: "Please input company name!" }]}
          >
            <Input placeholder="Enter company name" className="max-w-xl" />
          </Form.Item>
        </div>

        <div>
          <Form.Item
            label="About Us"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Editor
              apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
              // onEditorChange={(content) => form.setFieldsValue({ description: content })}
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
        <Button htmlType="submit" type="primary" size="large" className="px-8">
          Save & Next
        </Button>
      </Form>
    </div>
  );
};

export default CompanyInfo;
