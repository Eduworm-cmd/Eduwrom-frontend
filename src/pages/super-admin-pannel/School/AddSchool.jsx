import React from "react";
import { Button, Input, Form, Select, DatePicker, Row, Col } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AddSchool = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log("Form Data Submitted:", values);

    const payload = {
      ...values,
      startDate: values.startDate?.format("YYYY-MM-DD"),
      endDate: values.endDate?.format("YYYY-MM-DD"),
    };

    try {
      const response = await fetch("http://localhost:4000/api/school/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("School created successfully!");
        console.log("API Response:", result);
        form.resetFields();
      } else {
        toast.error(result.message || "Failed to create school.");
        console.error("Error Response:", result);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("An error occurred while creating the school.");
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

  return (
    <div className="container p-2">
      <ToastContainer />
      <h1 className="text-2xl py-1 mb-4 font-semibold">School Details</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
        {/* School Admin Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "First name is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Contact Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Email"
              name={["contact", "email"]}
              rules={[{ required: true, type: "email", message: "Email is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Phone Number"
              name={["contact", "phone"]}
              rules={[{ required: true, message: "Phone number is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* School Info */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="School Name"
              name="schoolName"
              rules={[{ required: true, message: "School name is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Display Name"
              name="displayName"
              rules={[{ required: true, message: "Display name is required!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Dates */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Start date is required!" }]}
            >
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "End date is required!" }]}
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

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
