import React, { useEffect, useState } from "react";
import DocNavBar from "../../components/Doctor/DocNavBar";
import styles from "../../styles/page/UserInfo.module.css";
import { useNavigate } from "react-router-dom";

function UserDocInfo() {
  const navigate = useNavigate();
  const [receptData, setReceptData] = useState({});
  useEffect(() => {
    const localData = localStorage.getItem("docData");
    if (!localData) return navigate("/");
    setReceptData(JSON.parse(localData));
  }, [navigate]);
  const doctorData = receptData?.data?.data || receptData?.data;
  return (
    <>
      <DocNavBar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
            <h1>Hi ! {doctorData && doctorData.name}</h1>
            <p className={styles.subHead}>Doctor</p>
            <h2>Name: {doctorData && doctorData.name}</h2>
            <h2>Age: {doctorData && doctorData.age}</h2>
            <h2>Gender: {doctorData && doctorData.gender}</h2>
            <h2>Ph No: {doctorData && doctorData.phno}</h2>
            <h2>Email: {doctorData && doctorData.email}</h2>
        </div>
      </div>
    </>
  );
}

export default UserDocInfo;
