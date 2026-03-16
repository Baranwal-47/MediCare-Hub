import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import styles from "../../styles/page/UserInfo.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const UserInfo = () => {
  const navigate = useNavigate();
  const [receptData, setReceptData] = useState({});
  useEffect(() => {
    const localData = localStorage.getItem("receptData");
    if (!localData) return navigate("/");
    setReceptData(JSON.parse(localData));
  }, [navigate]);
  const userData = receptData?.data || receptData;
  return (
    <>
    <NavBar/>
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1>Hi ! {userData && userData.name}</h1>
            <p className={styles.subHead}>Receptionist</p>
          <h2>Name:  {userData && userData.name}</h2>
          <h2>Age: {userData && userData.age}</h2>
          <h2>Gender: {userData && userData.gender}</h2>
          <h2>Ph No: {userData && userData.phno}</h2>
          <h2>Email: {userData && userData.email}</h2>
        </div>
      </div>
    </>
  );
};

export default UserInfo;
