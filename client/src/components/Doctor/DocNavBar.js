import React, { useEffect, useState } from "react";
import DocSideBar from "./DocSideBar";
import { useNavigate } from "react-router-dom";

function DocNavBar() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  useEffect(() => {
    let localData = localStorage.getItem("docData");
    if (!localData) return navigate("/");
    localData = JSON.parse(localData);
    const doctorData = localData?.data?.data || localData?.data;
    if (!doctorData?.name) {
      navigate("/");
      return;
    }
    setName(doctorData.name);
  }, [navigate]);
  return (
    <>
      <DocSideBar name={name} />
    </>
  );
}

export default DocNavBar;
