import React, { useEffect, useState } from "react";
import styles from "../../styles/page/Auth.module.css";
import axios from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import Loader from "../../utils/Loader";
import toast, { Toaster } from "react-hot-toast";

function Auth() {
  const api = process.env.REACT_APP_API_URL;
  const nav = useNavigate();
  const [pass, setPass] = useState("");
  const [email, setEmail] = useState("");
  const [isDoctor, setDoctor] = useState(true);
  const [isloader, setLoader] = useState(false);
  useEffect(() => {
    isDoctor
      ? (document.title = "Doctor | Clinic")
      : (document.title = "Receptionist | Clinic");
  }, [isDoctor]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await axios.post(
        // "http://localhost:3006/api/recept/logrecept",
        `${api}/api/recept/logrecept`,
        {
          password: pass,
          email: email,
        }
      );
      localStorage.setItem("receptData", JSON.stringify(response.data.data));
      localStorage.setItem("receptToken", response.data.token);
      nav("/recept/dashboard");
      success("Logging In")
      setLoader(false)
    } catch (err) {
      errorToast("Invalid Email Or Password Credentials")
      setLoader(false)
    }
  };
  const handleSign = async (e) => {
    e.preventDefault();
    setLoader(true);
    const data = {
      email: email,
      password: pass,
    };
    try {
      const response = await axios.post(`${api}/api/docs/logdoc/`, data);
      localStorage.setItem("docData", JSON.stringify(response.data.data));
      localStorage.setItem("docToken", response.data.token);
      success("Logging In");
      nav("/doc/dash");
      setLoader(false)
    } catch (err) {
      setLoader(false)
      errorToast("Invalid Email Or Password Credentials")
    }
  };
  const success = (value) =>toast.success(value);
  const errorToast = (value) =>toast.error(value);

  return (
    <div className={styles.webPage}>
      <Toaster/>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          {isloader && <div className={styles.overlay}><Loader /></div>}
          {!isloader && (
            <>
              {isDoctor ? <h2>Doctor!</h2> : <h2>Receptionist!</h2>}
              <p>Sign In To Your Account</p>
              <form
                className={styles.form}
                onSubmit={isDoctor ? handleSign : handleLogin}
              >
                <div className={styles.contentWrap}>
                  <label>Email</label>
                  <input
                    type="email"
                    required
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className={styles.contentWrap}>
                  <label>Password</label>
                  <input
                    type="password"
                    required
                    onChange={(e) => setPass(e.target.value)}
                  />
                </div>
                <div className={styles.contentWrap}>
                  <div className={styles.buttonWrap}>
                    <button className={styles.btn} type="submit">
                      Submit
                    </button>
                  </div>
                </div>
              </form>
              <p
                className={styles.accessChange}
                onClick={() => {
                  setDoctor((prev) => !prev);
                }}
              >
                {isDoctor ? "Not A Doctor ?" : "Not A Receptionist"}
              </p>
            </>
          )}
        </div>
        <div className={styles.textContainer}>
          <h1>Welcome Back!</h1>
          <p>
            "Medicine is not only a science; it is also an art. It does not
            consist of compounding pills and plasters; it deals with the very
            processes of life, which must be understood before they may be
            guided." - Paracelsus
          </p>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
