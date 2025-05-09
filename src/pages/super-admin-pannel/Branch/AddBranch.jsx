import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Form,
  Select,
  DatePicker,
  Upload,
  Row,
  Col,
} from "antd";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  AcademicYearDropdown,
  ClassesDropdown,
  SchoolsDropdwon,
} from "@/Network/Super_Admin/auth";
import axios from "axios";

export const AddBranch = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [logoBuffer, setLogoBuffer] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [classesResponse, academicYearsResponse, schoolResponse] = await Promise.all([
          ClassesDropdown(),
          AcademicYearDropdown(),
          SchoolsDropdwon(),
        ]);

        const classesData = classesResponse?.data?.map((cls) => ({
          value: cls._id,
          label: cls.className,
        }));

        const academicYearsData = academicYearsResponse?.data?.map((year) => ({
          value: year._id,
          label: year.name || `AY ${year.startYear} - ${year.endYear}`,
        }));

        const schoolData = schoolResponse?.data?.map((school) => ({
          value: school._id,
          label: school.schoolName,
        }));

        setClassOptions(classesData || []);
        setAcademicYearOptions(academicYearsData || []);
        setSchoolOptions(schoolData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogoChange = async (file) => {
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setLogoPreview(previewURL);
      setLogoName(file.name);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        setLogoBuffer(base64String);
      };

      reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast.error("Error reading the logo file");
      };
    }

    return false;
  };

  const handleSubmit = async (values) => {
    const {
      schoolId,
      name,
      displayName,
      branchPassword,
      branchEmail,
      phone,
      startDate,
      endDate,
      classes,
      academicYear,
      city,
      state,
      country,
      address,
      pincode,
      affiliation_board,
    } = values;

    const submissionData = {
      school: schoolId,
      name,
      displayName,
      branchPassword,
      contact: {
        email: branchEmail,
        phone,
      },
      location: {
        address,
        city,
        state,
        country,
        pincode,
      },
      affiliation_board,
      startDate: startDate?.format("YYYY-MM-DD"),
      endDate: endDate?.format("YYYY-MM-DD"),
      classes: classes || [],
      academicYear: academicYear || [],
      branchLogo: logoBuffer,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth_SchoolBranch/create_SchoolBranch",
        submissionData
      );

      if (response) {
        toast.success(response.message || "Branch created successfully!");
        form.resetFields();
        setLogoPreview(null);
        setLogoName("");
        setLogoBuffer(null);
        setTimeout(() => {
          navigate("/eduworm-admin/branch/list");
        }, 1000);
      }
    } catch (error) {
      console.error("CreateBranch Error:", error);
      toast.error("Branch creation failed.");
    }
  };

  const countryOptions = [
    { value: "India", label: "India" },
    { value: "USA", label: "USA" },
    { value: "UK", label: "UK" },
  ];

  const stateOptions = [
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "California", label: "California" },
  ];

  const cityOptions = [
    { value: "Mumbai", label: "Mumbai" },
    { value: "Bangalore", label: "Bangalore" },
    { value: "Los Angeles", label: "Los Angeles" },
  ];

  const boardOptions = [
    { value: "CBSE", label: "CBSE" },
    { value: "ICSE", label: "ICSE" },
    { value: "State Board", label: "State Board" },
    { value: "IB", label: "IB" },
    { value: "Other", label: "Other" },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading form data...</div>
      </div>
    );
  }

  return (
    <div className="container p-2">
      <ToastContainer />
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ startDate: null, endDate: null }}
        className="form-container"
      >
        <Form.Item label="Branch Logo" required className="flex justify-center">
          <Upload
            customRequest={({ file }) => handleLogoChange(file)}
            showUploadList={false}
            accept="image/*"
          >
            <div className="relative w-100 h-28 rounded-md border-2 border-dashed border-gray-300 bg-gray-100 overflow-hidden group cursor-pointer mx-auto">
              {!logoPreview ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <UploadOutlined className="text-2xl" />
                </div>
              ) : (
                <>
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex items-center justify-center text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Re-upload
                  </div>
                </>
              )}
            </div>
          </Upload>
          {logoPreview && (
            <p className="text-center mt-2 text-sm text-gray-700">{logoName}</p>
          )}
        </Form.Item>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Select School"
              name="schoolId"
              rules={[{ required: true, message: "Please select a school" }]}
            >
              <Select options={schoolOptions} placeholder="Select a school" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Branch Name" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Display Name" name="displayName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Start Date" name="startDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="End Date" name="endDate" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Country" name="country" rules={[{ required: true }]}>
              <Select options={countryOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State" name="state" rules={[{ required: true }]}>
              <Select options={stateOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="City" name="city" rules={[{ required: true }]}>
              <Select options={cityOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Pincode" name="pincode" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Address" name="address" rules={[{ required: true }]}>
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Classes" name="classes" rules={[{ required: true }]}>
              <Select mode="multiple" options={classOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Academic Year" name="academicYear" rules={[{ required: true }]}>
              <Select options={academicYearOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Affiliation Board" name="affiliation_board" rules={[{ required: true }]}>
              <Select options={boardOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Branch Email"
              name="branchEmail"
              rules={[{ required: true, message: "Please enter branch email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true, message: "Please enter phone number" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Branch Password"
              name="branchPassword"
              rules={[{ required: true, message: "Please enter password" }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Create Branch
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
