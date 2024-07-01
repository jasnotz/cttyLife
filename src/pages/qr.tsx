import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore";
import { QRCode } from "react-qrcode-logo";
import Cookies from "js-cookie";
import NormalHeader from "../ui/header/normalHeader";

export interface QrCheckPageProps {}

const QrCheckPage: React.FC<QrCheckPageProps> = ({}) => {
    const [qrBaseValue, setQrBaseValue] = useState<string | null>(null);
    const [userName, setUserName] = useState<string | null>(null);
    const [qrValue, setQrValue] = useState<string | null>(null);
    const [showQr, setShowQr] = useState<boolean>(true);
    const [timeLeft, setTimeLeft] = useState<number>(60);

    useEffect(() => {
        const fetchUserName = async () => {
            const db = getFirestore();
            const userCookie = Cookies.get("user");

            if (userCookie) {
                const { email } = JSON.parse(userCookie);
                const usersRef = collection(db, "user");
                const q = query(usersRef, where("email", "==", email));
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs.map(doc => doc.data());

                if (userData.length > 0 && userData[0].name) {
                    const baseValue = userData[0].name;
                    setQrBaseValue(baseValue);
                    setUserName(baseValue);
                    generateNewQrCode(baseValue);
                }
            }
        };

        fetchUserName();
    }, []);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (showQr && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setShowQr(false);
        }
        return () => clearInterval(timer);
    }, [showQr, timeLeft]);

    const generateNewQrCode = (baseValue: string) => {
        const timestamp = new Date().toISOString();
        setQrValue(`${baseValue}-${timestamp}`);
        setShowQr(true);
        setTimeLeft(60);
    };

    const regenerateQrCode = () => {
        if (qrBaseValue) {
            generateNewQrCode(qrBaseValue);
        }
    };

    return (
        <>
            <NormalHeader/>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <div style={{ display:"flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                {showQr && qrValue ? (
                    <>
                        <QRCode value={qrValue} />
                        <p style={{ fontWeight:"bold" }}>{userName}</p>
                        <div style={{ width:"10%", backgroundColor: "white", borderRadius:"5px", margin:"10px 0" }}>
                            <div style={{  height:"20px", backgroundColor:"#868e96", borderRadius:"5px", transition:"width 1s ease-in-out" ,width: `${(timeLeft / 60) * 100}%` }}></div>
                        </div>
                        <p style={{ display:"none" }}>QR code will expire in: {timeLeft} seconds</p>
                    </>
                ) : (
                    <>
                        <p>QR코드가 만료되었습니다</p>
                        <button onClick={regenerateQrCode}>재생성</button>
                    </>
                )}
            </div>
        </>
    );
};

export default QrCheckPage;