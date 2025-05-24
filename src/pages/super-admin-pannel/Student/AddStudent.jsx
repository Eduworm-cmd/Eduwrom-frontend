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
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { CreateStudent, UpdateStudent } from "@/Network/Super_Admin/auth";

const { Option } = Select;

export const AddStudent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [classList, setClassList] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  useEffect(() => {
    fetchSchools();
    if (isEditMode) {
      fetchStudentDetails();
    }
  }, [isEditMode, id]);

  const fetchSchools = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/school/dropdown");
      const data = await res.json();
      setSchools(data?.data || []);
    } catch (error) {
      message.error("Failed to fetch schools");
    }
  };

  const fetchStudentDetails = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:4000/api/superStudent/ById/${id}`);
      const data = await res.json();

      if (data?.student) {

        const student = data.student;
        // Populate form with existing student data
        form.setFieldsValue({
          // Basic Information
          firstName: student.firstName,
          lastName: student.lastName,
          rollNo: student.rollNo,
          gender: student.gender,
          dateOfBirth: student.dateOfBirth ? dayjs(student.dateOfBirth) : null,

          // School Details
          schoolId: student.school?.schoolName,
          branchId: student.schoolBranch?.name,
          classId: student.class?.className,

          // Additional Details
          photo: student.photo,
          admissionNumber: student.admissionNumber,
          dateOfJoining: student.dateOfJoining ? dayjs(student.dateOfJoining) : null,
          bloodGroup: student.bloodGroup,
          enrollmentStatus: student.enrollmentStatus,
          uniqueId: student.uniqueId,

          // Documents
          documents: student.documents || {
            transferCertificate: '',
            aadharCard: '',
            studentIDCard: ''
          },

          // Emergency Contact
          emergencyContact: student.emergencyContact || {
            name: '',
            relation: '',
            phone: ''
          },

          // Parents
          parents: student.parents || []
        });

        // Fetch branches based on selected school
        if (student.schoolId) {
          await fetchBranches(student.schoolId);
        }

        // Fetch classes based on selected branch
        if (student.branchId) {
          await fetchClassDropdown(student.branchId);
        }
      }
    } catch (error) {
      console.error("Error fetching student details:", error);
      message.error("Failed to fetch student details");
    }
  };

  const fetchBranches = async (schoolId) => {
    try {
      const res = await fetch(`http://localhost:4000/api/auth_SchoolBranch/${schoolId}`);
      const data = await res.json();
      setBranches(data?.data || []);
      setClassList([]);
      form.setFieldsValue({ branchId: undefined, classId: undefined });
    } catch (error) {
      message.error("Failed to fetch branches");
    }
  };

  const fetchClassDropdown = async (branchId) => {
    if (!branchId) return;
    try {
      const res = await fetch(`http://localhost:4000/api/class/${branchId}`);
      const data = await res.json();
      setClassList(data?.data || []);
      form.setFieldsValue({ classId: undefined });
    } catch (error) {
      message.error("Failed to fetch classes");
    }
  };

  const onFinish = async (values) => {
    const payload = {
      ...values,
      dateOfBirth: values.dateOfBirth?.format("YYYY-MM-DD"),
      dateOfJoining: values.dateOfJoining?.format("YYYY-MM-DD"),
    };

    try {
      setLoading(true);

      const res = isEditMode
        ? await UpdateStudent(id, payload)
        : await CreateStudent(payload);

      if (res?.success) {
        toast.success(res.message || "Operation successful!");
        window.history.back();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-8xl mx-auto">
      <ToastContainer />
      <Card title={isEditMode ? "Edit Student" : "Create Student"}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            parents: [
              {
                firstName: '',
                lastName: '',
                phoneNumber: '',
                email: '',
              },
            ],
            documents: {
              transferCertificate: '',
              aadharCard: '',
              studentIDCard: ''
            },
            emergencyContact: {
              name: '',
              relation: '',
              phone: ''
            }
          }}
        >

          {/* School Details Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="schoolId" label="School" rules={[{ required: true }]}>
                <Select placeholder="Select School" disabled={isEditMode} onChange={fetchBranches} >
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
                <Select placeholder="Select Branch" disabled={isEditMode} onChange={fetchClassDropdown}>
                  {branches.map((b) => (
                    <Option key={b._id} value={b._id}>
                      {b.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Class and Photo Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="classId" label="Class" rules={[{ required: true }]}>
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
              <Form.Item name="photo" label="Photo URL" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Name Row */}
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

          {/* Gender and Date of Birth Row */}
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

          {/* Roll No and Admission Number Row */}
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

          {/* Date of Joining and Blood Group Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dateOfJoining" label="Date of Joining" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="bloodGroup" label="Blood Group" rules={[{ required: true }]}>
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

          {/* Enrollment Status and Unique ID Row */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="enrollmentStatus" label="Enrollment Status" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="uniqueId" label="Unique ID">
                <Input disabled placeholder="Auto-generated" />
              </Form.Item>
            </Col>
          </Row>

          {/* Documents Section */}
          <Form.Item label="Transfer Certificate" name={["documents", "transferCertificate"]} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Aadhar Card" name={["documents", "aadharCard"]} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Student ID Card" name={["documents", "studentIDCard"]} rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          {/* Emergency Contact Section */}
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Emergency Contact Name" name={["emergencyContact", "name"]} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Relation" name={["emergencyContact", "relation"]} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Phone" name={["emergencyContact", "phone"]} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          {/* Parents Section */}
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
                        <Form.Item {...restField} label="Phone Number" name={[name, "phoneNumber"]} rules={[{ required: true }]}>
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item {...restField} label="Email" name={[name, "email"]} rules={[{ required: true }]}>
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
            <Button type="primary" htmlType="submit" block loading={loading}>
              {isEditMode ? "Update Student" : "Create Student"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};