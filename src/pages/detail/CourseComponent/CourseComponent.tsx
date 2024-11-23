import { useSelector } from 'react-redux';
import CourseComponent from './CourseComponent';
import { useEffect, useState } from 'react';
import { Button, Card, Form, Input, notification, Select } from 'antd';
import GeneralModal from '../../../components/ui/GeneralModal/GeneralModal';
import UploadForm from '../../../components/ui/UploadForm/UploadForm';
import moment from 'moment';
import { MediaApi } from '../../../services/modules/mediaServices';
import { COURSE_API } from '../../../services/modules/CourseServices';
import Course from './Course';
import { BookOpen } from 'lucide-react';
import TextArea from 'antd/es/input/TextArea';

interface Course {
    _id: string;
    user_id: string;
    course_name: string;
    organization_name: string;
    start_date?: Date;
    description: string;
    end_date?: Date;
    course_link?: string;
    course_image?: string;
}

export default function CourseView() {
    const userDetail = useSelector(state => state.user);
    const [courses, setCourses] = useState<Course[]>([]);
    const [type, setType] = useState<string>('');
    const [imgUrl, setImgUrl] = useState<string>('');
    const [visible, setVisible] = useState(false);
    const [link, setLink] = useState<string>('');
    const [selectedId, setSelectedId] = useState<string>('');

    const handleGetCoursesByUserId = async ({ current = 1, pageSize = 10 }) => {
        try {
            const params = {
                current,
                pageSize,
                query:{
                    user_id: userDetail._id
                }
            };
            const res = await COURSE_API.getAll(params, userDetail.accessToken);
            console.log("duydeptrai",res)
            if (res.data) {
                
                setCourses(res.data.items);
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        handleGetCoursesByUserId({});
    }, []);

    const closeModal = () => {
        setVisible(false);
        setType('');
        form.resetFields();
        setLink('');
        setImgUrl('');
    };


    const handleGetDetailCourse = async () => {
        const res = await COURSE_API.findByCOURSEId(selectedId,userDetail.accessToken);
        if(res.data){
            form.setFieldsValue({
                ...res.data,
                start_date: moment(res.data.start_date).isValid() 
                    ? moment(res.data.start_date).format('YYYY-MM-DD') 
                    : '',
                end_date: moment(res.data.end_date).isValid() 
                    ? moment(res.data.end_date).format('YYYY-MM-DD') 
                    : '',
            })
            setLink(res.data.course_link)
        }
    }

  useEffect(()=>{
    if(selectedId){
        handleGetDetailCourse()
    }
},[selectedId])
    const handleOpenModel = (type: string, id?: string) => {
        setType(type);
        setVisible(!visible);
        setSelectedId(id);
    };

    const [form] = Form.useForm();

    const onSubmit = async (values: any) => {
        const { start_date, end_date } = values;

        // Chuyển đổi start_date và end_date thành moment với giờ
        const formattedStartDate = moment(start_date).toDate();
        const formattedEndDate = moment(end_date).toDate();

        const params = {
            user_id: userDetail._id,
            course_name: values.course_name,
            organization_name: values.organization_name,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            course_link: link || null,
            course_image: imgUrl || null,
            description: values.description
        };

        const res = await COURSE_API.create(params, userDetail.accessToken);
        if (res.data) {
            notification.success({
                message: "Notification",
                description: 'Thêm Khóa học thành công'
            });
            closeModal();
            handleGetCoursesByUserId({});
        }
    };

    const handleOnchangeFile = async (file: File) => {
        const res = await MediaApi.postMedia(file, userDetail.access_token);
        if (res.data.url) {
            setImgUrl(res.data.url);
        } else {
            notification.error({
                message: "Notification",
                description: 'Tải thất bại'
            });
        }
    };

    const onUpdate = async () => {
        const values = form.getFieldsValue();
        const params = {
            ...values,
            course_link: link || null,
            course_image: imgUrl || null,
        };
        try {
            const res = await COURSE_API.update(selectedId, params, userDetail.accessToken);
            if (res.data) {
                notification.success({
                    message: "Notification",
                    description: 'Cập nhật thành công'
                });
                closeModal();
                handleGetCoursesByUserId({});
            }
        } catch (error) {
                notification.error({
                    message: "Notification",
                    description: error.response.data.message
                })
        }
    }
    const onDelete= async () => {
        try {
            const res = await COURSE_API.deleteByUser(selectedId,userDetail.accessToken)
            if(+res.statusCode === 200){
                notification.success({
                    message: "Notification",
                    description:'Xóa thông báo'
                })
                closeModal();
                handleGetCoursesByUserId({})
            }
        }catch(error){
            notification.error({
                message: "Notification",
                description: error.response.data.message
            })
        }
    }

    const renderBody = () => {
        return (
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Khóa học</h2>
                
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onSubmit}
                >
                    <Form.Item
                        label={<span>Tên khóa học <span className="text-red-500">*</span></span>}
                        name="course_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}
                    >
                        <Input placeholder="Tên khóa học" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Tổ chức"
                        name="organization_name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên tổ chức' }]}
                    >
                        <Input placeholder="Tổ chức" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày bắt đầu"
                        name="start_date"
                        rules={[{ required: true, message: 'Vui lòng nhập ngày bắt đầu' }]}
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Ngày kết thúc"
                        name="end_date"
                    >
                        <Input type="date" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea placeholder="Mô tả" rows={3} />
                    </Form.Item>

                    <div className="mt-4 mb-6">
                        <UploadForm onFileChange={handleOnchangeFile} link={link} setLink={setLink} />
                    </div>

                    {type === 'create' && (
                        <Button type="primary" htmlType="submit" className="w-full">
                            Thêm
                        </Button>
                    )}
                    {type === 'edit' && (
                        <div className='flex justify-between gap-2'>
                             <Button type="primary"  onClick={onUpdate} className="w-full !bg-primaryColor">
                            Cập nhật
                        </Button>
                        <Button type="primary" onClick={onDelete}  className="w-full !bg-black">
                            Xóa
                        </Button>
                        </div>
                    )}
                </Form>
            </div>
        );
    };

    return (
        <>
            {courses?.length > 0 ? (
              <Card className="p-6"> 
              <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-[#d3464f]" />
                  <h2 className="font-semibold">Khóa học</h2>
                  </div>
                  <Button onClick={() => handleOpenModel("create")}>
                  Thêm mục
                  </Button>
                  </div>
                    {courses?.map((course) => (
                        <Course
                            // key={course._id}
                            {...course}
                            onEdit={() => handleOpenModel("edit", course._id)}
                        />
                    ))}
                </Card>
            ) : (
                <Card className="p-6"> 
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-[#d3464f]" />
                    <h2 className="font-semibold">Khóa học</h2>
                    </div>
                    <Button onClick={() => handleOpenModel("create")}>
                    Thêm mục
                    </Button>
                    </div>
                    Nếu bạn đã có CV trên DevHire, bấm Cập nhật để hệ thống tự động điền phần này theo CV.
                </Card>
            )}

            <GeneralModal
                renderBody={renderBody}
                visible={visible}
                title={type === "create" ? "Thêm khóa học" : "Chỉnh sửa khóa học"}
                onCancel={closeModal}
            />
        </>
    );
}