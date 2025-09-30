import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImg, SetDocImg] = useState(false);
  const [name, SetName] = useState("");
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [experience, SetExperience] = useState("1 Year");
  const [fees, SetFees] = useState("");
  const [about, SetAbout] = useState("");
  const [speciality, SetSpeciality] = useState("General physician");
  const [degree, SetDegree] = useState("");
  const [address1, SetAddress1] = useState("");
  const [address2, SetAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();
      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      formData.forEach((value, key) => console.log(`${key}: ${value}`));

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        SetDocImg(false);
        SetName("");
        SetEmail("");
        SetPassword("");
        SetFees("");
        SetAbout("");
        SetDegree("");
        SetAddress1("");
        SetAddress2("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Image Upload */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="doc-img">
            <img
              className="w-16 bg-gray-100 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Doctor"
            />
          </label>
          <input
            onChange={(e) => SetDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>Upload doctor <br /> picture</p>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-name">Doctor Name</label>
              <input
                onChange={(e) => SetName(e.target.value)}
                value={name}
                className="border rounded px-3 py-2"
                type="text"
                id="doctor-name"
                placeholder="Name"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-email">Doctor Email</label>
              <input
                onChange={(e) => SetEmail(e.target.value)}
                value={email}
                className="border rounded px-3 py-2"
                type="email"
                id="doctor-email"
                placeholder="Email"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="doctor-password">Doctor Password</label>
              <input
                onChange={(e) => SetPassword(e.target.value)}
                value={password}
                className="border rounded px-3 py-2"
                type="password"
                id="doctor-password"
                placeholder="Password"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="experience">Experience</label>
              <select
                onChange={(e) => SetExperience(e.target.value)}
                value={experience}
                className="border rounded px-3 py-2"
                id="experience"
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {`${i + 1} Year`}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="fees">Fees</label>
              <input
                onChange={(e) => SetFees(e.target.value)}
                value={fees}
                className="border rounded px-3 py-2"
                type="number"
                id="fees"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="speciality">Speciality</label>
              <select
                onChange={(e) => SetSpeciality(e.target.value)}
                value={speciality}
                className="border rounded px-3 py-2"
                id="speciality"
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="degree">Education</label>
              <input
                onChange={(e) => SetDegree(e.target.value)}
                value={degree}
                className="border rounded px-3 py-2"
                type="text"
                id="degree"
                placeholder="Education"
                required
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <label htmlFor="address1">Address Line 1</label>
              <input
                onChange={(e) => SetAddress1(e.target.value)}
                value={address1}
                className="border rounded px-3 py-2"
                type="text"
                id="address1"
                placeholder="Address line 1"
                required
              />

              <label htmlFor="address2">Address Line 2</label>
              <input
                onChange={(e) => SetAddress2(e.target.value)}
                value={address2}
                className="border rounded px-3 py-2"
                type="text"
                id="address2"
                placeholder="Address line 2"
                required
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-4">
          <label htmlFor="about">About Doctor</label>
          <textarea
            onChange={(e) => SetAbout(e.target.value)}
            value={about}
            className="w-full px-4 pt-2 border rounded"
            placeholder="Write about doctor"
            rows={5}
            id="about"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#5F6FFF] px-10 py-3 mt-4 text-white rounded-full"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
