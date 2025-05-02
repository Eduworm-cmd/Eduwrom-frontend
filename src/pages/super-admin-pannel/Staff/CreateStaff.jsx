import React, { useState } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Upload,
  Row,
  Col,
  message
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;

export const CreateStaff = () => {
  const [form] = Form.useForm();
  const [profilePreview, setProfilePreview] = useState(null);
  const [profileFile, setProfileFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleProfileUpload = (file) => {
    if (file) {
      setProfileFile(file);
      const preview = URL.createObjectURL(file);
      setProfilePreview(preview);
    }
    return false; 
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      if (!profileFile) {
        toast.error("Profile picture is required");
        setIsSubmitting(false);
        return;
      }

      const base64 = await convertFileToBase64(profileFile);
      
      const staffData = {
        firstName: values.firstName,
        lastName: values.lastName,
        dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
        phoneNumber: values.phoneNumber,
        emailId: values.emailId,
        gender: values.gender,
        employeeRole: values.employeeRole,
        department: values.department,
        nationality: values.nationality || "",
        religion: values.religion || "",
        fatherName: values.fatherName || "",
        currentAddress: values.currentAddress,
        permanentAddress: values.permanentAddress || "",
        pinCode: values.pinCode || "",
        city: values.city || "",
        state: values.state || "",
        profile: base64, 
      };

      // Send the JSON data (not FormData)
      const response = await axios.post(
        "http://localhost:4000/api/SA_Staff/staffCreate",
        staffData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      toast.success("Staff created successfully");
      form.resetFields();
      setProfilePreview(null);
      setProfileFile(null);
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to create staff");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to convert file to base64
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Get only the base64 part without the prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="container p-4">
      <ToastContainer />
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        {/* Profile Image Upload */}
        <Form.Item label="Profile Picture" required>
          <Upload
            accept="image/*"
            showUploadList={false}
            customRequest={({ file }) => handleProfileUpload(file)}
          >
            <div className="w-32 h-32 border-dashed border-2 flex items-center justify-center cursor-pointer">
              {profilePreview ? (
                <img src={profilePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UploadOutlined className="text-xl" />
              )}
            </div>
          </Upload>
        </Form.Item>

        {/* Basic Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Date of Birth" name="dateOfBirth" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Email ID" name="emailId" rules={[{ required: true, type: "email" }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Gender" name="gender" rules={[{ required: true }]}>
              <Select placeholder="Select gender">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        {/* Employment Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Employee Role" name="employeeRole" rules={[{ required: true }]}>
              <Select placeholder="Select role">
                <Option value="staff">Staff</Option>
                <Option value="teacher">Teacher</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Department" name="department" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Optional Details */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Nationality" name="nationality">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Religion" name="religion">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Father's Name" name="fatherName">
          <Input />
        </Form.Item>

        {/* Addresses */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Current Address" name="currentAddress" rules={[{ required: true }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Permanent Address" name="permanentAddress">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>

        {/* Location Info */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Pincode" name="pinCode">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="State" name="state">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Submit */}
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            Create Staff
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};