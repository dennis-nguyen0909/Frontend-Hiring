import { Image, Rate } from "antd";
import {
  UserIcon as UserGroupIcon,
  BuildingIcon as BuildingOfficeIcon,
  BriefcaseIcon,
} from "lucide-react";
import { CTACard } from "./CTACard";
import { StatsCard } from "./StatsCard";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Importing images for better optimization
import amazonLogo from "../../assets/company/amazon.webp";
import googleLogo from "../../assets/company/google.webp";
import facebookLogo from "../../assets/company/face.webp";
import nioLogo from "../../assets/company/NIO_logo.svg.png";
import ieeeLogo from "../../assets/company/ieee-logo.png";
import team1 from "../../assets/avatars/team_1.webp";
import team3 from "../../assets/avatars/team_3.jpg";
import team4 from "../../assets/avatars/team_4.jpg";
import team5 from "../../assets/avatars/team_5.jpg";
import team6 from "../../assets/avatars/team_6.jpg";
import team7 from "../../assets/avatars/team_7.jpg";
import hiringImage from "../../assets/avatars/hiring.avif";
import johnWickImage from "../../assets/avatars/johnwick.jpg";
import candidateImage from "../../assets/avatars/candidate.png";
import employerImage from "../../assets/avatars/employer.png";

export default function AboutPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const arrayData = [
    {
      name: "amazon",
      sourceUrl: amazonLogo,
    },
    {
      name: "google",
      sourceUrl: googleLogo,
    },
    {
      name: "facebook",
      sourceUrl: facebookLogo,
    },
    {
      name: "nio",
      sourceUrl: nioLogo,
    },
    {
      name: "ieee",
      sourceUrl: ieeeLogo,
    },
  ];

  const teams = [
    {
      name: "Minh Duy",
      sourceUrl: team3,
      role: "Frontend Developer",
    },
    {
      name: "John",
      sourceUrl: team1,
      role: "Backend Developer",
    },
    {
      name: "KrasKa",
      sourceUrl: team7,
      role: "CTO",
    },
    {
      name: "Dennis",
      sourceUrl: team4,
      role: "Frontend Developer",
    },
    {
      name: "Kroaske",
      sourceUrl: team5,
      role: "Design Analyst",
    },
    {
      name: "Celine",
      sourceUrl: team6,
      role: "Tester",
    },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">{t("who_we_are")}</span>
            <h1 className="text-4xl font-bold">
              {t("who_we_are_description")}
            </h1>
            <p className="text-gray-600">{t("who_we_are_description_2")}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              icon={<BriefcaseIcon className="w-6 h-6 text-blue-600" />}
              number="175,324"
              label={t("jobs_open")}
            />
            <StatsCard
              icon={<BuildingOfficeIcon className="w-6 h-6 text-blue-600" />}
              number="97,354"
              label={t("company")}
            />
            <StatsCard
              icon={<UserGroupIcon className="w-6 h-6 text-blue-600" />}
              number="38,47,154"
              label={t("candidate")}
            />
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="container mx-auto px-4 py-12 border-y text-[12px]">
        <div className="flex flex-wrap justify-center gap-12 items-center opacity-60">
          {arrayData.map((logo, idx) => (
            <Image
              preview={false}
              key={idx}
              src={logo.sourceUrl}
              alt={logo.name}
              width={120}
              height={40}
              className="h-8 object-contain"
            />
          ))}
        </div>
      </section>

      {/* Image Grid Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden flex flex-col"
            >
              <Image
                preview={false}
                src={team.sourceUrl}
                alt={`${t("team")} ${index}`}
                width="100%"
                height="100%"
                className="w-full h-[300px] object-cover"
              />
              <div className="flex flex-col items-center justify-center">
                <div className="font-bold text-[20px]">{team.name}</div>
                <div>{team.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">
              {t("our_mission")}
            </span>
            <h2 className="text-3xl font-bold">
              {t("our_mission_description")}
            </h2>
            <p className="text-gray-600">{t("our_mission_description_2")}</p>
          </div>
          <div className="relative h-[400px]">
            <Image
              preview={false}
              src={hiringImage}
              alt={t("mission_illustration")}
              width={500}
              height={400}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-12 bg-gray-50 text-[12px]">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Image
            preview={false}
            src={johnWickImage}
            alt={t("testimonial")}
            style={{ objectFit: "contain" }}
            width={500}
            height={400}
            className="rounded-lg object-cover"
          />
          <div className="space-y-6">
            <span className="text-blue-600 font-medium">
              {t("testimonial")}
            </span>
            <h2 className="text-3xl font-bold">
              {t("testimonial_description")}
            </h2>
            <Rate defaultValue={5} disabled className="text-blue-600" />
            <blockquote className="text-gray-600 italic">
              {t("testimonial_description_2")}
            </blockquote>
            <div className="font-medium">
              <p className="text-gray-900">{t("john_wick")}</p>
              <p className="text-gray-500">{t("senior_engineer")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-12 text-[12px]">
        <div className="grid md:grid-cols-2 gap-8">
          <CTACard
            title={t("become_candidate")}
            description={t("become_candidate_description")}
            buttonText={t("register")}
            imageSrc={candidateImage}
          />
          <CTACard
            title={t("become_employer")}
            description={t("become_employer_description")}
            buttonText={t("register")}
            imageSrc={employerImage}
            variant="primary"
          />
        </div>
      </section>
    </main>
  );
}
