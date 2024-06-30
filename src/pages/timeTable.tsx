import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Cookies from 'js-cookie';
import NormalHeader from "../ui/header/normalHeader";

export interface TimetablePageProps {}

interface TimetableData {
    SCHUL_NM: string;
    GRADE: string;
    CLASS_NM: string;
    ITRT_CNTNT: string;
    PERIO: string;
    ALL_TI_YMD: string;
}

// 추가: API 호출에 사용할 파라미터 인터페이스 정의
interface ApiParams {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    AY?: string;
    SEM?: string;
    GRADE?: string;
    CLASS_NM?: string;
    TI_FROM_YMD?: string;
    TI_TO_YMD?: string;
}

const TimetablePage: React.FC<TimetablePageProps> = () => {
    const [timetable, setTimetable] = useState<TimetableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTimetable = async () => {
            try {
                const db = getFirestore();
                const userCookie = Cookies.get('user');
                let grade = '';
                let classNm = '';

                if (userCookie) {
                    const userEmail = JSON.parse(userCookie).email;
                    const usersRef = collection(db, 'user');
                    const q = query(usersRef, where('email', '==', userEmail));
                    const querySnapshot = await getDocs(q);
                    const userData = querySnapshot.docs[0]?.data();
                    if (userData) {
                        grade = userData.grade;
                        classNm = userData.class;
                    } else {
                        setError('사용자 정보를 불러오는데 실패했습니다.');
                        setLoading(false);
                        return;
                    }
                }

                const currentDate = new Date();
                const day = currentDate.getDay();
                const diffToMonday = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Calculate Monday
                const diffToFriday = diffToMonday + 4; // Calculate Friday

                const monday = new Date(currentDate.setDate(diffToMonday)).toISOString().split('T')[0].replace(/-/g, '');
                const friday = new Date(currentDate.setDate(diffToFriday)).toISOString().split('T')[0].replace(/-/g, '');

                const params: ApiParams = {
                    ATPT_OFCDC_SC_CODE: "J10", // 교육청 코드
                    SD_SCHUL_CODE: "7531292", // 학교 코드
                    AY: "2024", // 학년도
                    SEM: "1", // 학기
                    GRADE: grade, // 학년
                    CLASS_NM: classNm, // 학급명
                    TI_FROM_YMD: monday, // 시간표 시작 일자
                    TI_TO_YMD: friday, // 시간표 종료 일자
                };

                const response = await axios.get("https://open.neis.go.kr/hub/hisTimetable", {
                    params: {
                        ...params,
                        KEY: import.meta.env.VITE_API_KEY,
                        Type: "json"
                    },
                });
                const data = response.data.hisTimetable[1].row; // API 응답 구조에 따라 수정
                setTimetable(data);
                setLoading(false);
            } catch (err) {
                setError("데이터를 불러오는데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchTimetable();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <NormalHeader />
            <table>
                <tbody>
                    {timetable.map((item, index) => (
                        <tr key={index}>
                            <td>{item.GRADE}학년</td>
                            <td>{item.CLASS_NM}반</td>
                            <td>{item.PERIO}교시</td>
                            <td>{item.ITRT_CNTNT}</td>
                            <td>{item.ALL_TI_YMD}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default TimetablePage;
