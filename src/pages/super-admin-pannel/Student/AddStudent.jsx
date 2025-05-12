import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Card,
  Row,
  Col,
  message
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

export const AddStudent = () => {
  const [form] = Form.useForm();
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
  }, []);

  const fetchSchools = async () => {
    const res = await fetch("http://localhost:4000/api/school/dropdown");
    const data = await res.json();
    setSchools(data?.data || []);
  };

  const fetchBranches = async (schoolId) => {
    const res = await fetch(`http://localhost:4000/api/auth_SchoolBranch/${schoolId}`);
    const data = await res.json();
    setBranches(data?.data || []);
    setClassList([]); // 🟢 reset class list on school change
    form.setFieldsValue({ branchId: undefined, classId: undefined }); // 🟢 reset dependent fields
  };

  // 🟢 Updated: Added default value check for branchId
  const fetchClassDropdown = async (branchId) => {
    if (!branchId) return;
    const res = await fetch(`http://localhost:4000/api/class/${branchId}`);
    const data = await res.json();
    setClassList(data?.data || []);
    form.setFieldsValue({ classId: undefined }); // 🟢 reset class
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      dateOfJoining: values.dateOfJoining?.format("YYYY-MM-DD"),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:4000/api/superStudent/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result?.success) {
        toast.success("Student created successfully");
        form.resetFields();
        navigate("/eduworm-admin/student/list");
      } else {
        message.error(result?.message || "Failed to create student");
      }
    } catch (err) {
      console.error(err);
      message.error("Server error");
    }
  };

  return (
    <div className="max-w-8xl mx-auto">
      <ToastContainer />
      <Card title="Create Student">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ parents: [] }} // ✅ removed unnecessary defaults
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="schoolId" label="School" rules={[{ required: true }]}>
                <Select placeholder="Select School" onChange={fetchBranches}>
                  {schools.map((s) => (
                    <Option key={s._id} value={s._id}>
                      {s.schoolName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="branchId" label="Branch" rules={[{ required: true }]}>
                <Select placeholder="Select Branch" onChange={fetchClassDropdown}>
                  {branches.map((b) => (
                    <Option key={b._id} value={b._id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="classId" label="Class" rules={[{ required: true }]}>
                <Select placeholder="Select Class">
                  {classList.map((c) => (
                    <Option key={c._id} value={c._id}>
                      {c.className}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="photo" label="Photo URL">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                <Select placeholder="Select Gender">
                  <Option value="Male">Male</Option>
                  <Option value="Female">Female</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="dateOfBirth" label="Date of Birth" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rollNo" label="Roll No" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="admissionNumber" label="Admission Number" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bloodGroup" label="Blood Group">
                <Select placeholder="Select Blood Group">
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((b) => (
                    <Option key={b} value={b}>
                      {b}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="enrollmentStatus" label="Enrollment Status">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="uniqueId" label="Unique ID">
                <Input disabled placeholder="Auto-generated" />
              </Form.Item>
            </Col>
          </Row>

          {/* Documents */}
          <Form.Item label="Transfer Certificate" name={["documents", "transferCertificate"]}>
            <Input />
          </Form.Item>
          <Form.Item label="Aadhar Card" name={["documents", "aadharCard"]}>
            <Input />
          </Form.Item>
          <Form.Item label="Student ID Card" name={["documents", "studentIDCard"]}>
            <Input />
          </Form.Item>

          {/* Emergency Contact */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Emergency Contact Name" name={["emergencyContact", "name"]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Relation" name={["emergencyContact", "relation"]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Phone" name={["emergencyContact", "phone"]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Parents */}
          <Form.List name="parents" rules={[{ required: true, message: "At least one parent is required." }]}>
            {(fields, { add, remove }) => (
              <>
                <Button onClick={() => add()} icon={<PlusOutlined />} type="dashed" block>
                  Add Parent
                </Button>
                {fields.map(({ key, name, ...restField }) => (
                  <Card
                    key={key}
                    style={{ marginTop: 20 }}
                    title={`Parent ${key + 1}`}
                    extra={
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                        danger
                        type="text"
                      />
                    }
                  >
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} label="First Name" name={[name, "firstName"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} label="Last Name" name={[name, "lastName"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} label="Relationship" name={[name, "relationship"]} rules={[{ required: true }]}>
                          <Select>
                            <Option value="Father">Father</Option>
                            <Option value="Mother">Mother</Option>
                            <Option value="Guardian">Guardian</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} label="Phone Number" name={[name, "phoneNumber"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item {...restField} label="Email" name={[name, "email"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} label="Current Address" name={[name, "currentAddress"]}>
                          <Input />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
