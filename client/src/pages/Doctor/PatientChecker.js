import React, { useEffect, useState } from "react";
import styles from "../../styles/page/PatientChecker.module.css";
import DocNavBar from "../../components/Doctor/DocNavBar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../../utils/Loader";
import toast, { Toaster } from "react-hot-toast";

function PatientChecker() {
  const api = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const init = {};
  const [localData, setLocalData] = useState(init);
  const [isLoad, setLoader] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tempData = localStorage.getItem("docData");
        if (!tempData) {
          navigate("/");
          return;
        }

        setLocalData(JSON.parse(tempData));
      } catch (err) {
        noUser("Not Authenticated")
      }
    };
    fetchData();
  }, [navigate]);
  const [tokenValid, setTokenValid] = useState("");
  const [tokenChecked, setTokenChecked] = useState(false);
  const [name, setName] = useState("");
  const [phno, setPhno] = useState("");
  const [age, setAge] = useState("");
  const [docName, setDocname] = useState("");
  const [patId, setPatid] = useState("");
  const prescriptionsFromServer = [];
  const [prescription, setPrescription] = useState(prescriptionsFromServer);
  const [enteredPres, setEnteredPres] = useState("");
  function clearData() {
    setDocname("");
    setName("");
    setAge("");
    setPhno("");
    setPrescription([]);
    setPatid("");
  }
  const checkToken = async (e) => {
    e.preventDefault();
    if (!tokenValid) return noUser("Enter Token Number");
    setLoader(true);
    try {
      const fetch = await axios.post(
        `${api}/api/docs/rettoken`,
        {
          id: tokenValid,
        }
      );
      setDocname(fetch.data.data.docs.name);
      setName(fetch.data.data.patient.name);
      setAge(fetch.data.data.patient.age);
      setPhno(fetch.data.data.patient.phno);
      setPrescription(fetch.data.data.patient.combinedData);
      setPatid(fetch.data.data.patient._id);
      setTokenChecked(true);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      noUser("Token Id Not Found");
    }
  };

  const noUser = (value) => toast.error(value);
  const added = (value) => toast.success(value);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const doctorData = localData?.data?.data || localData?.data;
    if (!tokenValid) return noUser("Enter Token Number");
    if (!tokenChecked) return noUser("Check The Token Id");
    if (!enteredPres) return noUser("Enter The Prescription Details");
    if (!doctorData?._id) return noUser("Not Authenticated");
    setLoader(true);
    try {
      await axios.post(
        `${api}/api/docs/enqpat`,
        {
          patid: patId,
          id: doctorData._id,
          pres: enteredPres,
        }
      );
      setLoader(false);
      setTokenChecked(false);
      setTokenValid("");
      clearData();
      added("Added Successfully");
    } catch (error) {
      setLoader(false);
      noUser("Error Occured");
    }
  };
  return (
    <>
      <DocNavBar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <h1>Patient Checker</h1>
          <p>To Diagnose The Patient</p>
          <Toaster />
          {isLoad && (
            <div className={styles.loader}>
              <Loader />
            </div>
          )}
          {!isLoad && (
            <div className={styles.addContainer}>
              <form className={styles.formContainer}>
                <div className={styles.formGroup}>
                  <label htmlFor="patientName">Name Of The Doctor</label>
                  <input
                    type="text"
                    id="patientName"
                    placeholder="This will automatically be filled based on the token number"
                    readOnly
                    value={docName}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="patientName">Name Of The Patient</label>
                  <input
                    type="text"
                    id="patientName"
                    readOnly
                    placeholder="This will automatically be filled based on the token number"
                    value={name}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="age">Age</label>
                  <input
                    type="number"
                    id="age"
                    readOnly
                    value={age}
                    placeholder="This will automatically be filled based on the token number"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="number"
                    id="phoneNumber"
                    readOnly
                    placeholder="This will automatically be filled based on the token number"
                    value={phno}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="token">Token</label>
                  <input
                    type="number"
                    id="token"
                    required
                    placeholder="Enter Token Number"
                    onChange={(e) => setTokenValid(e.target.value)}
                    value={tokenValid}
                  />
                  <div style={{ display: "grid", placeContent: "center" }}>
                    <button
                      type="button"
                      className={styles.btn}
                      onClick={checkToken}
                    >
                      Check
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Previous Consultations</label>
                  {prescription.map((data, index) => {
                    return (
                      <li key={index}>
                        {data.doctorName}-{data.prescription}
                      </li>
                    );
                  })}
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="address">Prescription</label>
                  <textarea
                    id="address"
                    cols="30"
                    rows="10"
                    required
                    value={enteredPres}
                    onChange={(e) => setEnteredPres(e.target.value)}
                  ></textarea>
                </div>
                <div style={{ display: "grid", placeContent: "center" }}>
                  <button
                    type="button"
                    className={styles.btn}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PatientChecker;
