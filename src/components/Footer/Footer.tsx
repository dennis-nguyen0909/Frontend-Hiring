import { FacebookFilled, LinkedinOutlined, YoutubeOutlined, GithubOutlined, RobotFilled } from "@ant-design/icons";
import { Image } from "antd";
import { Link } from "react-router-dom";
import logoH from '../../assets/logo/LogoH.png';
import appStore from '../../assets/logo/app_store.webp';
import chPlay from '../../assets/logo/chplay.webp';
import qrCode from '../../assets/logo/qrCode.png';
import { Globe, Phone, Mail, Map } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-r from-primary to-secondary py-16 text-white">
            <div className="container px-6">
                <div className="flex flex-col md:flex-row justify-between gap-12">
                    {/* Logo & Contact */}
                    <div className="space-y-8 flex flex-col items-center md:items-start">
                        <Image
                            preview={false}
                            src={logoH}
                            alt="HireDev Logo"
                            width={140}
                            height={140}
                            className="mb-6"
                        />
                        <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
                            <h3 className="font-bold text-xl">Contact Us</h3>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={18} />
                                <p><a href="tel:02466805588" className="hover:text-primary">Call: (024) 6680 5588</a></p>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={18} />
                                <p><a href="mailto:hotro@HireDev.vn" className="hover:text-primary">Email: hotro@HireDev.vn</a></p>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Globe size={18} />
                                <p><a href="https://hiredev.com.vn" target="_blank" rel="noopener noreferrer" className="hover:text-primary">Website: HireDev.com.vn</a></p>
                            </div>
                        </div>
                        <div className="space-x-4 mt-4">
                            <Link to="#" className="text-xl hover:text-primary">
                                <FacebookFilled />
                            </Link>
                            <Link to="#" className="text-xl hover:text-primary">
                                <LinkedinOutlined />
                            </Link>
                            <Link to="#" className="text-xl hover:text-primary">
                                <YoutubeOutlined />
                            </Link>
                            <Link to="#" className="text-xl hover:text-primary">
                                <GithubOutlined />
                            </Link>
                        </div>
                    </div>

                    {/* App Download Links */}
                    <div className="flex flex-col items-center md:items-start space-y-4">
                        <h3 className="font-semibold text-lg">Download Our App</h3>
                        <div className="flex gap-4">
                            <Link to="#" className="block w-36">
                                <Image
                                    preview={false}
                                    src={appStore}
                                    alt="Download on App Store"
                                    width={140}
                                    height={50}
                                />
                            </Link>
                            <Link to="#" className="block w-36">
                                <Image
                                    preview={false}
                                    src={chPlay}
                                    alt="Get it on Google Play"
                                    width={140}
                                    height={50}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center mt-8 md:mt-0">
                        <Image
                            preview={false}
                            src={qrCode}
                            alt="QR Code"
                            width={120}
                            height={120}
                            className="mb-4"
                        />
                        <p className="text-sm text-center">Scan to access HireDev services</p>
                    </div>
                </div>

                <div className="mt-12 border-t pt-8">
                    {/* Company Info */}
                    <div className="flex flex-col md:flex-row justify-between text-center md:text-left">
                        <div className="space-y-3">
                            <h2 className="font-semibold text-lg">HireDev Corporation</h2>
                            <p className="text-sm">We are here to help you achieve your career goals and build a better future.</p>
                        </div>
                        <div className="space-y-2 text-sm flex flex-col items-center md:items-start">
                            <div className="flex items-center gap-2">
                                <RobotFilled size={18} className="text-primary" />
                                <p>Empowering Careers with AI</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={18} className="text-primary" />
                                <p>Global Reach - Local Impact</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Map size={18} className="text-primary" />
                                <p>Offices in Hanoi & HCMC</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
