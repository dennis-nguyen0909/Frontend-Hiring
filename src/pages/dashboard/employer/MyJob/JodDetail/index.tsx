import { Button, Form, Input, Select, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/store/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { JobApi } from "../../../../../services/modules/jobServices";
import { useParams } from "react-router-dom";
import { notification } from "antd";

interface JobDetailProps {
  handleChangeHome: () => void;
  idJob?: string;
}

interface JobFormValues {
  title: string;
  description: string;
  requirement: string;
  salary_range_min: number;
  salary_range_max: number;
  job_type: "fulltime" | "parttime" | "contract";
}

const JobDetail = ({ handleChangeHome, idJob }: JobDetailProps) => {
  const { t } = useTranslation();
  const userDetail = useSelector((state: RootState) => state.user);
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<JobFormValues>();

  // Fetch job details
  const { data: jobData } = useQuery({
    queryKey: ["job", idJob || id],
    queryFn: async () => {
      if (!idJob && !id) throw new Error("Job ID is required");
      const res = await JobApi.getJobById(
        idJob || id || "",
        userDetail?.access_token || "",
        userDetail?.id || ""
      );
      return res.data;
    },
    enabled: !!(idJob || id) && !!userDetail?.access_token,
  });

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: JobFormValues }) => {
      return await JobApi.updateJob(id, data, userDetail?.access_token || "");
    },
    onSuccess: () => {
      notification.success({
        message: t("notification.success"),
        description: t("notification.updateJobSuccess"),
      });
      queryClient.invalidateQueries({ queryKey: ["job", idJob || id] });
      queryClient.invalidateQueries({ queryKey: ["jobs", userDetail?.id] });
    },
    onError: () => {
      notification.error({
        message: t("notification.error"),
        description: t("notification.updateJobError"),
      });
    },
  });

  const handleSubmit = (values: JobFormValues) => {
    if (!idJob && !id) return;
    updateJobMutation.mutate({
      id: idJob || id || "",
      data: values,
    });
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <Typography.Title level={4}>{t("job_detail")}</Typography.Title>
        <Button onClick={handleChangeHome}>{t("back")}</Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={jobData}
      >
        <Form.Item
          name="title"
          label={t("job_title")}
          rules={[{ required: true, message: t("please_input_job_title") }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label={t("job_description")}
          rules={[
            { required: true, message: t("please_input_job_description") },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="requirement"
          label={t("job_requirement")}
          rules={[
            { required: true, message: t("please_input_job_requirement") },
          ]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="salary_range_min"
          label={t("salary_range_min")}
          rules={[
            { required: true, message: t("please_input_salary_range_min") },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="salary_range_max"
          label={t("salary_range_max")}
          rules={[
            { required: true, message: t("please_input_salary_range_max") },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item
          name="job_type"
          label={t("job_type")}
          rules={[{ required: true, message: t("please_select_job_type") }]}
        >
          <Select>
            <Select.Option value="fulltime">{t("full_time")}</Select.Option>
            <Select.Option value="parttime">{t("part_time")}</Select.Option>
            <Select.Option value="contract">{t("contract")}</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updateJobMutation.isPending}
          >
            {t("save")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default JobDetail;
