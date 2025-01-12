import { FacebookFilled, LinkedinOutlined, YoutubeOutlined } from "@ant-design/icons";
import { Image } from "antd";
import { Link } from "react-router-dom";
import logoH from '../../assets/logo/LogoH.png';
import appStore from '../../assets/logo/app_store.webp';
import chPlay from '../../assets/logo/chplay.webp';
import qrCode from '../../assets/logo/qrCode.png';
import { Building, MapPin, Newspaper } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-white py-12 border-t">
            <div className="container md:px-primary px-4">
                <div className="flex flex-col md:flex-row justify-between gap-8">
                    {/* Logo and Contact Section */}
                    <div className="space-y-6">
                        <Image
                            preview={false}
                            src={logoH}
                            alt="HireDev Logo"
                            width={120}
                            height={120}
                            className="mb-4"
                        />
                        <div className="space-y-2">
                            <h3 className="font-semibold">Liên hệ</h3>
                            <p className="text-sm">
                                Hotline: <a href="tel:02466805588" className="text-primary">(024) 6680 5588</a>
                            </p>
                            <p className="text-sm">
                                Email: <a href="mailto:hotro@HireDev.vn" className="text-primary">hotro@HireDev.vn</a>
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Ứng dụng tải xuống</h3>
                            <div className="flex space-x-2">
                                <Link to="#" className="block w-32">
                                    <Image
                                        preview={false}
                                        src={appStore}
                                        alt="Download on App Store"
                                        width={120}
                                        height={40}
                                    />
                                </Link>
                                <Link to="#" className="block w-32">
                                    <Image
                                        preview={false}
                                        src={chPlay}
                                        alt="Get it on Google Play"
                                        width={120}
                                        height={40}
                                    />
                                </Link>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h3 className="font-semibold">Cộng đồng HireDev</h3>
                            <div className="flex space-x-4">
                                <Link to="#" className="text-gray-600 hover:text-primary !text-[12px]">
                                    <FacebookFilled className="h-6 w-6" />
                                </Link>
                                <Link to="#" className="text-gray-600 hover:text-primary !text-[12px]">
                                    <YoutubeOutlined className="h-6 w-6" />
                                </Link>
                                <Link to="#" className="text-gray-600 hover:text-primary !text-[12px]">
                                    <LinkedinOutlined className="h-6 w-6" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-4">
                            <h3 className="font-semibold">Về HireDev</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Giới thiệu</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Góc báo chí</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Tuyển dụng</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Liên hệ</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Hỏi đáp</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Chính sách bảo mật</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Điều khoản dịch vụ</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Quy chế hoạt động</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Hồ sơ và CV</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Quản lý CV của bạn</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">HireDev Profile</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Hướng dẫn viết CV</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Review CV</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Khám phá</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Ứng dụng di động HireDev</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Tính lương Gross - Net</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Tính lãi suất kép</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Lập kế hoạch tiết kiệm</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="font-semibold">Xây dựng sự nghiệp</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Việc làm tốt nhất</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Việc làm lương cao</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Việc làm quản lý</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Việc làm IT</Link></li>
                                <li><Link to="#" className="hover:text-primary !text-[12px]">Việc làm Senior</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 md:mt-0 flex flex-col items-center">
                        <Image
                            preview={false}
                            src={qrCode}
                            alt="QR Code"
                            width={120}
                            height={120}
                            className="mx-auto md:mx-0"
                        />
                        <p className="text-sm text-center md:text-left mt-2">HireDev.com.vn</p>
                    </div>
                </div>

                {/* Thông tin công ty */}
            </div>
            <div className="mt-12 pt-8 px-primary border-t">
                <h2 className="font-semibold text-lg mb-4">Công ty Cổ phần HireDev Việt Nam</h2>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                        <Building size={18} className="text-primaryColorH" />
                        <p>Giấy phép đăng ký kinh doanh số: 0107307178</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Newspaper size={18} className="text-primaryColorH" />
                        <p>Giấy phép hoạt động dịch vụ việc làm số: 18/SLDTBXH-GP</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-primaryColorH" />
                        <p>Trụ sở HN: Tòa FS - GoldSeason số 47 Nguyễn Tuân, P.Thanh Xuân Trung, Q.Thanh Xuân, Hà Nội</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-primaryColorH" />
                        <p>Chi nhánh HCM: Tòa nhà Dali, 24C Phan Đăng Lưu, P.6, Q.Bình Thạnh, TP HCM</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
