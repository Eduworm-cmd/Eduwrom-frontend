import React, { useEffect } from "react";
import {
  Button,
  Input,
  Form,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CreateSchool,
  GetSchoolById,
  UpdateSchool,
} from "@/Network/Super_Admin/auth";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";

export const AddSchool = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

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
              location: {
                country: school.location?.country,
                state: school.location?.state,
                city: school.location?.city,
                pinCode: school.location?.pinCode,
                address: school.location?.address,
              },
            });
          }
        } catch (error) {
          console.error("Fetch error:", error);
        }
      })();
    }
  }, [id, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const countryOptions = [
    { value: "India", label: "India" },
  ];

  const stateOptions = [
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chhattisgarh", label: "Chhattisgarh" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "Delhi", label: "Delhi" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <ToastContainer />
      <h1 className="text-3xl font-semibold mb-6">
        {id ? "Edit School" : "Add School"}
      </h1>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        onFinishFailed={({ errorFields }) => {
          if (errorFields.length > 0) {
            form.scrollToField(errorFields[0].name, {
              behavior: "smooth",
              block: "center",
            });
          }
        }}
      >
        {/* Section: Basic Information */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[{ required: true, message: "First name is required!" }]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[{ required: true, message: "Last name is required!" }]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>
            <Form.Item
              label="Email"
              name={["contact", "email"]}
              rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
            >
              <Input placeholder="Enter email address" />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name={["contact", "phone"]}
              rules={[{ required: true, message: "Phone number is required!" }]}
            >
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </div>
        </div>

        {/* Section: School Details */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">School Details</h2>
          <Form.Item
            label="School Name"
            name="schoolName"
            rules={[{ required: true, message: "School name is required!" }]}
          >
            <Input placeholder="Enter school name" />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Start Date"
              name="startDate"
              rules={[{ required: true, message: "Start date is required!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item
              label="End Date"
              name="endDate"
              rules={[{ required: true, message: "End date is required!" }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
        </div>

        {/* Section: Address */}
        <div className="bg-white rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">Location Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Form.Item
              label="Country"
              name={['location', 'country']}
              rules={[{ required: true, message: "Country is required!" }]}
            >
              <Select placeholder="Select country" options={countryOptions} />
            </Form.Item>
            <Form.Item
              label="State"
              name={['location', 'state']}
              rules={[{ required: true, message: "State is required!" }]}
            >
              <Select
                placeholder="Select state"
                showSearch
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={stateOptions}
              />
            </Form.Item>

            <Form.Item
              label="City"
              name={['location', 'city']}
              rules={[{ required: true, message: "City is required!" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Pincode"
              name={['location', 'pinCode']}
              rules={[{ required: true, message: "Pincode is required!" }]}
            >
              <Input placeholder="Enter pincode" />
            </Form.Item>
            <Form.Item
              label="Address"
              name={['location', 'address']}
              rules={[{ required: true, message: "Address is required!" }]}
              className="md:col-span-2"
            >
              <Input.TextArea placeholder="Enter full address" autoSize={{ minRows: 2, maxRows: 5 }} />
            </Form.Item>
          </div>
        </div>
            
        <div className="flex items-center justify-end">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6"
          >
            {id ? "Update" : "Submit"}
          </Button>
        </div>
      </Form>
    </div>
  );
};
