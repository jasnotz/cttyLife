import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, query, where, getDocs, collection } from "firebase/firestore";
import Cookies from "js-cookie";

export interface LoginPageProps {}

const LoginPage: React.FC<LoginPageProps> = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();
    const db = getFirestore();

    useEffect(() => {
        const user = Cookies.get("user");
        if (user) {
            navigate("/");
        }
    }, [navigate]);

    async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const usersRef = collection(db, "user");
        const q = query(usersRef, where("email", "==", email), where("password", "==", password));
        try {
            const querySnapshot = await getDocs(q);
            if (querySnapshot.docs.length > 0) {
                // 로그인 성공, 쿠키에 사용자 정보 저장
                Cookies.set("user", JSON.stringify({ email }), { expires: 30 }); // 30일 후 만료
                navigate("/");
            } else {
                throw new Error("No matching user found.");
            }
        } catch (error) {
            console.error("로그인 실패", error);
            setErrorMessage("이메일이나 비밀번호가 잘못되었습니다.");
        }
    };

    return (
        <div>
            <div>
                <div>
                    <h2>Sign in to your account</h2>
                    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                </div>
                <form onSubmit={handleLogin}>
                    <div>
                        <div>
                            <label htmlFor="email-address">Email address</label>
                            <input id="email-address" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="Email address" />
                        </div>
                        <div>
                            <label htmlFor="password">Password</label>
                            <input id="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" required placeholder="Password" />
                        </div>
                    </div>
                    <div>
                        <button type="submit">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
