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
import {
  CreateSchool,
  GetAcademicYear,
  GetClasses,
} from "@/Network/Super_Admin/auth";

export const AddSchool = () => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [logoBuffer, setLogoBuffer] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const classesResponse = await GetClasses();
        const classesData = classesResponse?.data?.map((cls) => ({
          value: cls._id,
          label: cls.className || cls.name,
        }));
        setClassOptions(classesData || []);

        const academicYearsResponse = await GetAcademicYear();
        const academicYearsData = academicYearsResponse?.data?.map((year) => ({
          value: year._id,
          label: year.name || `AY ${year.startYear} - ${year.endYear}`,
        }));
        setAcademicYearOptions(academicYearsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load class or academic year data");
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
    }

    return false;
  };

  const handleSubmit = async (values) => {
    const {
      startDate,
      endDate,
      classes,
      academicYear,
      ...rest
    } = values;

    const submissionData = {
      ...rest,
      startDate: startDate ? startDate.format("YYYY-MM-DD") : "",
      endDate: endDate ? endDate.format("YYYY-MM-DD") : "",
      classes: classes || [],
      academicYear: academicYear || [],
      schoolLogoBuffer: logoBuffer,
    };

    try {
      const response = await CreateSchool(submissionData);
      toast.success(response.message);
      form.resetFields();
      setLogoPreview(null);
      setLogoName("");
      setLogoBuffer(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create school");
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
        {/* Logo Upload */}
        <Form.Item label="School Logo" required className="flex justify-center">
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

        {/* School Admin Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name="phone"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="School Name"
              name="schoolName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Display Name"
              name="displayName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Classes & Academic Year */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Select Classes"
              name="classes"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                options={classOptions}
                placeholder="Select Classes"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Academic Year"
              name="academicYear"
              rules={[{ required: true }]}
            >
              <Select
                mode="multiple"
                options={academicYearOptions}
                placeholder="Select Academic Year(s)"
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Dates */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
        </Row>

        {/* Location Info */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Country" name="country">
              <Select options={countryOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State" name="state">
              <Select options={stateOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="City" name="city">
              <Select options={cityOptions} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Pincode" name="pincode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Address" name="address">
              <Input.TextArea />
            </Form.Item>
          </Col>
        </Row>

        {/* Branch Info */}
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Branch Name"
              name="branchName"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Branch Email"
              name="branchEmail"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Branch Password"
              name="branchPassword"
              rules={[{ required: true }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
