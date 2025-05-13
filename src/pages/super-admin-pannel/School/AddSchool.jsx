import React, { useEffect } from "react";
import { Button, Input, Form, Select, DatePicker, Row, Col } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateSchool, GetSchoolById, UpdateSchool } from "@/Network/Super_Admin/auth";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

export const AddSchool = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id); 

  // Get school details in edit mode
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await GetSchoolById(id);
          if (res?.school) {
            const school = res.school;
            form.setFieldsValue({
              firstName: school.firstName,
              lastName: school.lastName,
              contact: {
                email: school.contact?.email,
                phone: school.contact?.phone,
              },
              schoolName: school.schoolName,
              displayName: school.displayName,
              startDate: dayjs(school.startDate),
              endDate: dayjs(school.endDate),
              country: school.country,
              state: school.state,
              city: school.city,
              pincode: school.pincode,
              address: school.address,
            });
          }
        } catch (error) {
          toast.error("Failed to fetch school details.");
          console.error("Fetch error:", error);
        }
      })();
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    const payload = {
      ...values,
      startDate: values.startDate?.format("YYYY-MM-DD"),
      endDate: values.endDate?.format("YYYY-MM-DD"),
    };

    try {
      const result = isEditMode
        ? await UpdateSchool(id, payload)
        : await CreateSchool(payload);

      toast.success(`School ${isEditMode ? "updated" : "created"} successfully!`, {
        autoClose: 1000,
        onClose: () => navigate("/eduworm-admin/school/list"),
      });

      form.resetFields();
    } catch (error) {
      console.error("API Error:", error);
      toast.error(`Failed to ${isEditMode ? "update" : "create"} school`);
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
      <h1 className="text-2xl py-1 mb-4 font-semibold">
        {id ? "Edit School" : "Add School"}
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ isActive: true }}
      >
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

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? "Update" : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
