import { useEffect, useState } from "react";
import { Avatar, Card, Image, Space } from "antd";
import { CheckCircle, XCircle } from "lucide-react";
import { StarFilled } from "@ant-design/icons";
import { USER_API } from "../../../../services/modules/userServices";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";

const CandidateDetailView = ({
  candidateId,
  userDetail,
}: {
  candidateId: string;
  userDetail: any;
}) => {
  const { t } = useTranslation();
  const [candidateDetail, setCandidateDetail] = useState();
  const { formatDate } = useMomentFn();
  const handleGetCandidateDetail = async () => {
    const res = await USER_API.viewProfileCandidate(
      candidateId,
      userDetail?.access_token
    );
    if (res?.data?.items) {
      setCandidateDetail(res?.data?.items);
    }
  };

  useEffect(() => {
    handleGetCandidateDetail();
  }, []);

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{t("candidate_information")}</h2>

      <div className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center space-x-4">
          <Avatar size={64} src={candidateDetail?.avatar} />
          <div className="text-xl font-semibold">
            {candidateDetail?.full_name}
          </div>
        </div>

        <div className="flex justify-start gap-2">
          <div className="font-medium">{t("introduce")}:</div>
          <div>{candidateDetail?.introduce}</div>
        </div>

        {/* Email */}
        <div className="flex justify-between">
          <div className="font-medium">{t("email")}:</div>
          <div>{candidateDetail?.email}</div>
        </div>

        {/* Số điện thoại */}
        <div className="flex justify-between">
          <div className="font-medium">{t("phone")}:</div>
          <div>{candidateDetail?.phone || t("not_updated")}</div>
        </div>

        {/* Address */}
        <div className="flex justify-between">
          <div className="font-medium">{t("address")}:</div>
          <div>{candidateDetail?.city_id?.name || t("not_updated")}</div>
        </div>

        {/* Gender */}
        <div className="flex justify-between">
          <div className="font-medium">{t("gender")}:</div>
          <div>
            {candidateDetail?.gender === 0
              ? t("male")
              : candidateDetail?.gender === 1
              ? t("female")
              : t("not_defined")}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="font-medium">{t("birthday")}:</div>
          <div>{formatDate(candidateDetail?.birthday) || t("not_updated")}</div>
        </div>

        {/* Search Job Status */}
        <div className="flex justify-between">
          <div className="font-medium">{t("search_job_status")}:</div>
          <div>
            {candidateDetail?.is_search_jobs_status
              ? t("searching")
              : t("not_searching")}
          </div>
        </div>

        {/* No Experience */}
        <div className="flex justify-between">
          <div className="font-medium">{t("no_experience")}:</div>
          <div>{candidateDetail?.no_experience ? t("yes") : t("no")}</div>
        </div>
        {/* Total Experience Years */}
        <div className="flex justify-between">
          <div className="font-medium">{t("total_experience_years")}:</div>
          <div>{candidateDetail?.total_experience_years}</div>
        </div>

        {/* Total Experience Months */}
        <div className="flex justify-between">
          <div className="font-medium">{t("total_experience_months")}:</div>
          <div>{candidateDetail?.total_experience_months}</div>
        </div>

        {/* Work Experience */}
        {candidateDetail?.work_experience_ids?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("work_experience")}:
            </div>
            {candidateDetail?.work_experience_ids?.length > 0 ? (
              candidateDetail?.work_experience_ids.map((work, index) => (
                <Card key={index}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{work?.company}</div>
                      <div>{work?.position}</div>
                      <div>
                        {work?.start_date &&
                          new Date(work?.start_date).toLocaleDateString()}{" "}
                        -{" "}
                        {work?.currently_working
                          ? "Hiện tại"
                          : new Date(work?.end_date).toLocaleDateString()}
                      </div>
                    </div>
                    <Image
                      width={100}
                      height={"100%"}
                      src={work?.image_url}
                      preview={false}
                    />
                  </div>
                </Card>
              ))
            ) : (
              <div>Chưa có kinh nghiệm làm việc</div>
            )}
          </div>
        )}

        {/* Skills */}
        {candidateDetail?.skills?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("skills")}:
            </div>
            <div className="flex flex-wrap gap-2">
              {candidateDetail?.skills?.map(
                (skill: { name: string }, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 rounded-full"
                  >
                    {skill.name}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {/* Education */}
        {candidateDetail?.education_ids?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("education")}:
            </div>
            {candidateDetail?.education_ids?.length > 0 ? (
              candidateDetail?.education_ids.map((education, index) => (
                <Card key={index}>
                  <div className="font-semibold">{education?.school}</div>
                  <div>{education?.major}</div>
                  <div>
                    {new Date(education?.start_date).toLocaleDateString()} -{" "}
                    {education?.currently_studying
                      ? t("studying")
                      : t("graduated")}
                  </div>
                </Card>
              ))
            ) : (
              <div>{t("no_education")}</div>
            )}
          </div>
        )}
        {candidateDetail?.certificates?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("certificate")}
            </div>
            {candidateDetail?.certificates?.map((item: any, index: number) => (
              <Card
                key={index}
                title={item.certificate_name}
                className="shadow-lg rounded-lg mt-4"
              >
                <div className="space-y-3 flex items-center justify-between">
                  <div>
                    <div className="flex items-center">
                      <strong>{t("organization_name")}: </strong>
                      <span className="ml-2">{item.organization_name}</span>
                    </div>
                    <div className="flex items-center">
                      <strong>{t("start_date")}: </strong>
                      <span className="ml-2">
                        {new Date(item.start_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <strong>{t("certificate_is_valid")}: </strong>
                      <span
                        className={`ml-2 ${
                          item.is_not_expired
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {item.is_not_expired ? t("valid") : t("expired")}
                      </span>
                      {item.is_not_expired ? (
                        <CheckCircle className="ml-2 text-green-500" />
                      ) : (
                        <XCircle className="ml-2 text-red-500" />
                      )}
                    </div>
                    {item.link_certificate && (
                      <div className="flex items-center">
                        <strong>{t("link")}</strong>
                        <a
                          target="_blank"
                          href={item.link_certificate}
                          className="ml-2"
                        >
                          {item?.link_certificate}
                        </a>
                      </div>
                    )}
                  </div>
                  {item.img_certificate && (
                    <div>
                      <Image
                        preview={false}
                        className="shadow-custom"
                        style={{
                          borderRadius: "20px",
                          maxWidth: 80,
                          maxHeight: 80,
                        }}
                        src={item?.img_certificate}
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {candidateDetail?.prizes?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("prize")}
            </div>
            {candidateDetail?.prizes?.map((item: any, index: number) => (
              <Card key={index} className="shadow-lg">
                <Space className="flex items-center justify-between" size={16}>
                  <div>
                    <div className="text-xl font-semibold">
                      {item.prize_name}
                    </div>
                    <div className="text-gray-600">
                      {item.organization_name}
                    </div>
                    <div className="text-gray-400">
                      {t("date_of_receipt")}: {formatDate(item.date_of_receipt)}
                    </div>
                    {item.prize_link && (
                      <a
                        href={item.prize_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-4"
                      >
                        {t("link")}
                      </a>
                    )}
                  </div>
                  {/* Hiển thị ảnh nếu có */}
                  {item.prize_image && (
                    <Image
                      preview={false}
                      className="shadow-custom"
                      style={{
                        borderRadius: "20px",
                        maxWidth: 80,
                        maxHeight: 80,
                      }}
                      src={item?.prize_image}
                    />
                  )}
                </Space>
              </Card>
            ))}
          </div>
        )}

        {candidateDetail?.projects?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("project")}
            </div>
            {candidateDetail?.projects?.map((item, index) => (
              <Card key={index} className="shadow-lg">
                <Space className="flex items-center justify-between" size={16}>
                  <div>
                    <div className="text-xl font-semibold">
                      {item.project_name}
                    </div>
                    <div className="text-gray-600">
                      {t("customer_name")}: {item.customer_name}
                    </div>
                    <div className="text-gray-400">
                      {t("time")}: {formatDate(item.start_date)} -{" "}
                      {formatDate(item.end_date)}
                    </div>
                    <div className="text-gray-400">
                      {t("technology")}: {item.technology}
                    </div>
                    <div className="text-gray-400">
                      {t("team")}: {item.team_number}
                    </div>
                    <div className="text-gray-400">
                      {t("location")}: {item.location}
                    </div>
                    <div className="text-gray-400">
                      {t("mission")}: {item.mission}
                    </div>
                    {item.project_link && (
                      <a
                        href={item.project_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-4"
                      >
                        {t("link")}
                      </a>
                    )}
                  </div>
                  {/* Hiển thị ảnh nếu có */}
                  {item.project_image && (
                    <Image
                      preview={true}
                      src={item.project_image}
                      alt="Project"
                      className="w-full h-auto rounded-md mt-4 shadow-lg"
                    />
                  )}
                </Space>
              </Card>
            ))}
          </div>
        )}

        {candidateDetail?.courses?.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium bg-[#cccccc] rounded-md p-2">
              {t("course")}
            </div>
            {candidateDetail?.courses?.map((item, index) => (
              <Card key={index} className="p-4 shadow-lg">
                <Space className="flex items-center justify-between" size={16}>
                  <div>
                    <div className="text-xl font-semibold">
                      {item.course_name}
                    </div>
                    <div className="text-gray-600">
                      {item.organization_name}
                    </div>
                    <div className="text-gray-400">
                      {t("time")}: {formatDate(item.start_date)} -{" "}
                      {formatDate(item.end_date)}
                    </div>
                    {item.course_link && (
                      <a
                        href={item.course_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-4"
                      >
                        {t("link")}
                      </a>
                    )}
                  </div>
                  {/* Hiển thị ảnh nếu có */}
                  {item.course_image && (
                    <Image
                      width={100}
                      height={100}
                      preview={true}
                      src={item.course_image}
                      alt="Course"
                      className="w-full h-auto rounded-md mt-4 shadow-lg"
                    />
                  )}
                </Space>
              </Card>
            ))}
            {/* <Button onClick={()=>downloadCV(candidateDetail?._id)}>Download cv</Button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateDetailView;
