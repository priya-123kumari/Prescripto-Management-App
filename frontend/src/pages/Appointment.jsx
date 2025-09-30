import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  // ✅ Fetch Doctor Info
  useEffect(() => {
    const info = doctors.find((doc) => doc._id === docId);
    setDocInfo(info || null);
  }, [doctors, docId]);

  // ✅ Generate Available Slots
  useEffect(() => {
    if (!docInfo) return;
    setDocSlots([]);

    const today = new Date();

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // Set working hours: 10 AM - 9 PM
      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      // If today, adjust start time
      if (i === 0) {
        if (currentDate.getHours() < 10) {
          currentDate.setHours(10, 0, 0, 0);
        } else {
          currentDate.setHours(currentDate.getHours() + 1);
          currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
        }
      } else {
        currentDate.setHours(10, 0, 0, 0);
      }

      const slotsForDay = [];

      while (currentDate < endTime) {
        const formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        const slotDate = `${currentDate.getDate()}_${
          currentDate.getMonth() + 1
        }_${currentDate.getFullYear()}`;

        const isBooked =
          docInfo.slots_booked?.[slotDate]?.includes(formattedTime);

        if (!isBooked) {
          slotsForDay.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, slotsForDay]);
    }
  }, [docInfo]);

  // ✅ Book Appointment
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    if (!docSlots[slotIndex] || !slotTime) {
      return toast.error("Please select a slot");
    }

    try {
      const date = docSlots[slotIndex][0].datetime;
      const slotDate = `${date.getDate()}_${date.getMonth() + 1}_${date.getFullYear()}`;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (!docInfo) return <p className="text-center mt-10">Loading doctor info...</p>;

  return (
    <div>
      {/* -------------------- Doctor Details -------------------- */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <img
            className="bg-[#5f6FFF] w-full sm:max-w-72 rounded-lg"
            src={docInfo.image}
            alt={docInfo.name}
          />
        </div>

        <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
          <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
            {docInfo.name}
            <img className="w-5" src={assets.verified_icon} alt="verified" />
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {docInfo.degree} - {docInfo.speciality}
            </p>
            <button className="py-0.5 px-2 border text-xs rounded-full">
              {docInfo.experience}
            </button>
          </div>

          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-gray-600 mt-3">
              About <img src={assets.info_icon} alt="info" />
            </p>
            <p className="text-sm text-gray-500 max-w-[700px] mt-1">
              {docInfo.about}
            </p>
          </div>

          <p className="text-gray-500 font-medium mt-4">
            Appointment fee:{" "}
            <span className="text-gray-600">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* -------------------- Booking Slots -------------------- */}
      <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
        <p>Booking slots</p>

        {/* Dates */}
        <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
          {docSlots.map((slots, index) => (
            <div
              onClick={() => setSlotIndex(index)}
              className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${
                slotIndex === index
                  ? "bg-[#5f6FFF] text-white"
                  : "border border-gray-200"
              }`}
              key={index}
            >
              <p>{slots[0] && daysOfWeek[slots[0].datetime.getDay()]}</p>
              <p>{slots[0] && slots[0].datetime.getDate()}</p>
            </div>
          ))}
        </div>

        {/* Times */}
        <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
          {docSlots[slotIndex]?.map((item, index) => (
            <p
              onClick={() => setSlotTime(item.time)}
              className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${
                item.time === slotTime
                  ? "bg-[#5f6FFF] text-white"
                  : "text-gray-400 border border-gray-300"
              }`}
              key={index}
            >
              {item.time.toLowerCase()}
            </p>
          ))}
        </div>

        <button
          onClick={bookAppointment}
          className="bg-[#5f6FFF] text-white text-sm font-light px-14 py-3 rounded-full my-6"
        >
          Book an appointment
        </button>
      </div>

      {/* -------------------- Related Doctors -------------------- */}
      <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
    </div>
  );
};

export default Appointment;
