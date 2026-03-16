import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import DocNavBar from "../../components/Doctor/DocNavBar";
import Loader from "../../utils/Loader";
import styles from "../../styles/page/ReceptionistDash.module.css";

function TokenQueue() {
  const api = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const fetchTokens = useCallback(async () => {
    try {
      const response = await axios.post(`${api}/api/docs/retalltoken`);
      const tokenGroups = Array.isArray(response.data?.tokens)
        ? response.data.tokens
        : [];
      const flattenedTokens = tokenGroups.flatMap((group) =>
        Array.isArray(group?.tokens) ? group.tokens : []
      );

      const queueRows = await Promise.all(
        flattenedTokens.map(async (tokenData) => {
          try {
            const detailRes = await axios.post(`${api}/api/docs/rettoken`, {
              id: tokenData.token,
            });
            const detail = detailRes.data?.data;
            const tokenCreatedAt = new Date(detail?.createdAt || tokenData.createdAt);
            const consults = Array.isArray(detail?.patient?.combinedData)
              ? detail.patient.combinedData
              : [];
            const hasConsultAfterToken = consults.some((consult) => {
              if (!consult?.createdAt) return false;
              if (!consult?.doctorId || !detail?.docs?._id) return false;
              return (
                consult.doctorId === String(detail.docs._id) &&
                new Date(consult.createdAt) >= tokenCreatedAt
              );
            });

            const isSeen = tokenData.checked === true || hasConsultAfterToken;

            return {
              token: tokenData.token,
              patientName: detail?.patient?.name || "N/A",
              doctorName: detail?.docs?.name || "N/A",
              createdAt: detail?.createdAt || tokenData.createdAt,
              isSeen,
            };
          } catch (err) {
            return {
              token: tokenData.token,
              patientName: "N/A",
              doctorName: "N/A",
              createdAt: tokenData.createdAt,
              isSeen: tokenData.checked === true,
            };
          }
        })
      );

      queueRows.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setTokens(queueRows);
    } catch (err) {
      setTokens([]);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 30000);

    return () => clearInterval(interval);
  }, [fetchTokens]);

  const visibleTokens = showAll
    ? tokens
    : tokens.filter((item) => !item.isSeen);

  return (
    <>
      <DocNavBar />
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Today's Token Queue</h1>
          </div>

          {!isLoading && tokens.length > 0 && (
            <div style={{ margin: "12px 0" }}>
              <button
                type="button"
                onClick={() => setShowAll((prev) => !prev)}
              >
                {showAll ? "Show Pending Only" : "Show All (Including Seen)"}
              </button>
            </div>
          )}

          {isLoading && (
            <div style={{ display: "grid", placeItems: "center", height: "65vh" }}>
              <Loader />
            </div>
          )}

          {!isLoading && visibleTokens.length === 0 && (
            <h2 style={{ textAlign: "center", marginTop: "3rem" }}>
              No tokens for today
            </h2>
          )}

          {!isLoading && visibleTokens.length > 0 && (
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Token Number</th>
                    <th>Patient Name</th>
                    <th>Doctor Name</th>
                    <th>Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody className={styles.patient}>
                  {visibleTokens.map((item) => (
                    <tr
                      key={item.token}
                      className={styles.patDetails}
                      style={
                        item.isSeen
                          ? {
                              opacity: 0.55,
                              backgroundColor: "#f2f2f2",
                            }
                          : undefined
                      }
                    >
                      <td>{item.token}</td>
                      <td>{item.patientName}</td>
                      <td>{item.doctorName}</td>
                      <td>{new Date(item.createdAt).toLocaleString()}</td>
                      <td>{item.isSeen ? "Seen" : "Pending"}</td>
                      <td>
                        {!item.isSeen ? (
                          <button
                            type="button"
                            onClick={() =>
                              navigate("/doc/patientchecker", {
                                state: { token: item.token },
                              })
                            }
                          >
                            See Patient
                          </button>
                        ) : (
                          <span>Seen</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TokenQueue;
