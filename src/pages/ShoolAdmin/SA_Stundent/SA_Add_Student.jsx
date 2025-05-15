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
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  ClassByBranchId,
  CreateStudent,
  studentGetById,
  UpdateStudent,
} from "@/Network/Super_Admin/auth";
import { useSelector } from "react-redux";

const { Option } = Select;

export const SA_Add_Student = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user.id) {
      fetchClassDropdown(user.id);
      if (isEditMode) {
        fetchStudentData(id);
      }
    }
  }, [user.id, id]);

  const fetchClassDropdown = async (branchId) => {
    try {
      const response = await ClassByBranchId(branchId);
      setClassList(response.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchStudentData = async (studentId) => {
    try {
      const response = await studentGetById(studentId);
      const student = response?.student;

      form.setFieldsValue({
        firstName: student.firstName,
        lastName: student.lastName,
        gender: student.gender,
        dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,
        dateOfJoining: student.dateOfJoining ? dayjs(student.dateOfJoining) : null,
        rollNo: student.rollNo,
        admissionNumber: student.admissionNumber,
        bloodGroup: student.bloodGroup,
        enrollmentStatus: student.enrollmentStatus,
        uniqueId: student.uniqueId,
        photo: student.photo,

        classId: student.class?._id || undefined,

        documents: student.documents || {
          transferCertificate: "",
          aadharCard: "",
          studentIDCard: "",
        },

        emergencyContact: student.emergencyContact || {
          name: "",
          relation: "",
          phone: "",
        },

        parents: student.parents?.length > 0 ? student.parents : [
          {
            firstName: "",
            lastName: "",
            phoneNumber: "",
            email: "",
          },
        ],
      });
    } catch (error) {
      console.error("Failed to fetch student:", error);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    const payload = {
      ...values,
      schoolId: user.schoolId,
      branchId: user.id,
      dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      dateOfJoining: values.dateOfJoining?.format("YYYY-MM-DD"),
    };

    try {
      if (isEditMode) {
        await UpdateStudent(id, payload);
        toast.success("Student updated successfully!", {
          onclose: navigate("/eduworm-school/stundent/list"),
          autoClose: 1000,
        });
      } else {
        await CreateStudent(payload);
        toast.success("Student Created successfully!", {
          onclose: navigate("/eduworm-school/stundent/list"),
          autoClose: 1000,
        }); form.resetFields();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-8xl mx-auto">
        <ToastContainer />
        <Card title={isEditMode ? "Edit Student" : "Create Student"}>
          <Form
            form={form}
            onFinish={onFinish}
            layout="vertical"
            initialValues={{
              parents: [
                {
                  firstName: "",
                  lastName: "",
                  phoneNumber: "",
                  email: "",
                },
              ],
              documents: {
                transferCertificate: "",
                aadharCard: "",
                studentIDCard: "",
              },
              emergencyContact: {
                name: "",
                relation: "",
                phone: "",
              },
            }}
          >
            {/* Class and Photo */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="classId"
                  label="Class"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select Class" disabled={isEditMode}>
                    {classList.map((c) => (
                      <Option key={c._id} value={c._id}>
                        {c.className}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="photo" label="Student Photo">
                  <Input placeholder="Photo URL or path" />
                </Form.Item>
              </Col>
            </Row>

            {/* Basic Info */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="First Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="Last Name"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Gender & DOB */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="Select Gender">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dateOfBirth"
                  label="Date of Birth"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Roll No and Admission No */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="rollNo"
                  label="Roll No"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="admissionNumber"
                  label="Admission Number"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Joining Date and Blood Group */}
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="dateOfJoining"
                  label="Date of Joining"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="bloodGroup" label="Blood Group">
                  <Select placeholder="Select Blood Group">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                      (b) => (
                        <Option key={b} value={b}>
                          {b}
                        </Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            {/* Enrollment Status & Unique ID */}
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
            <Form.Item
              label="Transfer Certificate"
              name={["documents", "transferCertificate"]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Aadhar Card" name={["documents", "aadharCard"]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Student ID Card"
              name={["documents", "studentIDCard"]}
            >
              <Input />
            </Form.Item>

            {/* Emergency Contact */}
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  label="Emergency Contact Name"
                  name={["emergencyContact", "name"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Relation"
                  name={["emergencyContact", "relation"]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="Phone" name={["emergencyContact", "phone"]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            {/* Parents Info */}
            <Form.List name="parents">
              {(fields, { add, remove }) => (
                <>
                  <Button
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    type="dashed"
                    block
                  >
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
                          <Form.Item
                            {...restField}
                            label="First Name"
                            name={[name, "firstName"]}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            label="Last Name"
                            name={[name, "lastName"]}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            label="Phone Number"
                            name={[name, "phoneNumber"]}
                            rules={[{ required: true }]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                        <Col span={12}>
                          <Form.Item
                            {...restField}
                            label="Email"
                            name={[name, "email"]}
                          >
                            <Input />
                          </Form.Item>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </>
              )}
            </Form.List>

            {/* Submit Button */}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
              >
                {isEditMode ? "Update Student" : "Create Student"}
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};
