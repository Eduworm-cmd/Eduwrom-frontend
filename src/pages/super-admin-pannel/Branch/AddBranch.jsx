import React, { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
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
import { useNavigate, useParams } from "react-router-dom";
import {
  AcademicYearDropdown,
  ClassesDropdown,
  CreateBranch,
  GetBranchById,
  SchoolsDropdwon,
} from "@/Network/Super_Admin/auth";
import axios from "axios";

export const AddBranch = () => {

  const {id} = useParams();
  const isEditMode = Boolean(id);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoName, setLogoName] = useState("");
  const [logoBuffer, setLogoBuffer] = useState(null);
  const [classOptions, setClassOptions] = useState([]);
  const [academicYearOptions, setAcademicYearOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        if (isEditMode) {
          const res = await GetBranchById(id);
          const branch = res.data;

          const data = res.data;
          

          // Set form fields
          form.setFieldsValue({
            schoolId: data?.school?._id,
            name: data?.name,
            displayName: data?.displayName,
            startDate: data?.startDate ? dayjs(data?.startDate) : null,
            endDate: data?.endDate ? dayjs(data?.endDate) : null,
            country: data?.location?.country,
            state: data?.location?.state,
            city: data?.location?.city,
            pincode: data?.location?.pincode,
            address: data?.location?.address,
            branchEmail: data?.contact?.email,
            phone: data?.contact?.phone,
            classes: data?.classes,
            academicYear: data?.academicYear,
            affiliation_board: data?.affiliation_board,
          });

          if (branch.branchLogo) {
            setLogoPreview(`data:image/png;base64,${branch.branchLogo}`);
            setLogoBuffer(branch.branchLogo);
            setLogoName("Existing Logo");
          }
        }
      } catch (error) {
        console.error("Error fetching branch data:", error);
      }
    };

    fetchBranchData();
  }, [isEditMode, id]);
  

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        setIsLoading(true);
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


  console.log(schoolOptions);
  
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
      setIsLoading(true);
      let response;
      if (isEditMode) {
        // ✅ Update API
        response = await axios
        .put(
          `http://localhost:4000/api/auth_SchoolBranch/UpdateBranch/${id}`,
          submissionData
        );
      } else {
        // ✅ Create API
        response = await CreateBranch(submissionData);
      }

      if (response) {
        toast.success(
          response.data?.message || response.message ||
          (isEditMode ? "Branch updated successfully!" : "Branch created successfully!")
        );
        setTimeout(() => {
          navigate("/eduworm-admin/schoolbranch/list");
        }, 1000);
      }
    } catch (error) {
      console.error("Error submitting branch form:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
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
        <Form.Item
          label="Branch Logo"
          required
          className="flex justify-center"
          name="branchLogo"
          rules={[
            {
              validator: (_, value) =>
                logoPreview
                  ? Promise.resolve()
                  : Promise.reject(new Error("Branch logo is required")),
            },
          ]}
        >
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
              rules={[{ required: true, message: "Please enter a valid email", type: "email" }]}
            >
              <Input type="email" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please enter a phone number" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Branch Password"
              name="branchPassword"
              rules={[{ required: true, message: "Please enter a password" }]}
            >
              <Input.Password />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEditMode ? "Update Branch" : "Create Branch"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
