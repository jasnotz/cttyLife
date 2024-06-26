import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Cookies from 'js-cookie';
import NormalHeader from "../ui/header/normalHeader";
import Toggle from '../ui/Toggle';
import PlanPage from './plan';
import "../styles/pages/timeTable.css"

export interface TimetablePageProps {}

interface TimetableData {
    SCHUL_NM: string;
    GRADE: string;
    CLASS_NM: string;
    ITRT_CNTNT: string;
    PERIO: string;
    ALL_TI_YMD: string;
}

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
    const [weekdays, setWeekdays] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [today, setToday] = useState<string>('');
    const [currentView, setCurrentView] = useState<string>('timetable');

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
                const diffToMonday = currentDate.getDate() - day + (day === 0 ? -6 : 1);
                const diffToFriday = diffToMonday + 4;

                const monday = new Date(currentDate.setDate(diffToMonday)).toISOString().split('T')[0].replace(/-/g, '');
                const friday = new Date(currentDate.setDate(diffToFriday)).toISOString().split('T')[0].replace(/-/g, '');
                const todayFormatted = new Date().toISOString().split('T')[0].replace(/-/g, '');

                setToday(todayFormatted);

                const params: ApiParams = {
                    ATPT_OFCDC_SC_CODE: "J10",
                    SD_SCHUL_CODE: "7531292",
                    AY: "2024",
                    SEM: "1",
                    GRADE: grade,
                    CLASS_NM: classNm,
                    TI_FROM_YMD: monday,
                    TI_TO_YMD: friday,
                };

                const response = await axios.get("https://open.neis.go.kr/hub/hisTimetable", {
                    params: {
                        ...params,
                        KEY: import.meta.env.VITE_API_KEY,
                        Type: "json"
                    },
                });
                const data: TimetableData[] = response.data.hisTimetable[1].row;

                const shortenedData = data.map(item => ({
                    ...item,
                    ITRT_CNTNT: item.ITRT_CNTNT
                        .replace("확률과 통계", "확통")
                        .replace("생명과학Ⅰ", "생과I")
                        .replace("지구과학Ⅰ", "지과I")
                        .replace("물리학Ⅰ", "물리I")
                        .replace("운동과 건강", "체육")
                        .replace("진로활동", "진로")
                        .replace("생활과 윤리", "생윤")
                        .replace("한국지리", "한지")
                        .replace("자율활동", "창체")
                        .replace("미술 창작", "미술")
                        .replace("일본어Ⅰ", "일어Ⅰ")
                        .replace("중국어Ⅰ", "중어Ⅰ")
                }));
                setTimetable(shortenedData);

                const uniqueDates = Array.from(new Set(shortenedData.map((item) => item.ALL_TI_YMD)));
                setWeekdays(uniqueDates);

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

    const groupedByDate: { [key: string]: TimetableData[] } = timetable.reduce((acc, item) => {
        if (!acc[item.ALL_TI_YMD]) {
            acc[item.ALL_TI_YMD] = [];
        }
        acc[item.ALL_TI_YMD].push(item);
        return acc;
    }, {} as { [key: string]: TimetableData[] });

    const getActivePeriod = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinutes = now.getMinutes();

        if (currentHour < 9 || (currentHour === 9 && currentMinutes < 50)) return 0;
        if (currentHour === 9 && currentMinutes >= 50) return 1;
        if (currentHour === 10 && currentMinutes < 50) return 1;
        if (currentHour === 10 && currentMinutes >= 50) return 2;
        if (currentHour === 11 && currentMinutes < 50) return 2;
        if (currentHour === 11 && currentMinutes >= 50) return 3;
        if (currentHour === 12 && currentMinutes < 50) return 3;
        if (currentHour === 12 && currentMinutes >= 50) return 4;
        if (currentHour === 13 || (currentHour === 14 && currentMinutes < 40)) return 4;
        if (currentHour === 14 && currentMinutes >= 40) return 5;
        if (currentHour === 15 && currentMinutes < 40) return 5;
        if (currentHour === 15 && currentMinutes >= 40) return 6;
        if (currentHour >= 16) return 6;

        return 0;
    };

    const activePeriod = getActivePeriod();

    return (
        <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <NormalHeader />
            <br />
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
                <Toggle currentView={currentView} onToggle={setCurrentView} />
            </div>
            <br />
            {currentView === 'timetable' ? (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                {weekdays.map((date, index) => (
                                    <th key={index} style={{ paddingBottom: "25px" }}>{new Date(date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8)).toLocaleDateString('ko-KR', { weekday: 'long' })}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(7)].map((_, periodIndex) => (
                                <tr key={periodIndex}>
                                    {weekdays.map((date, dayIndex) => (
                                        <td
                                            key={dayIndex}
                                            className={`${date === today ? 'today' : ''} ${periodIndex === activePeriod ? 'active-period' : ''}`}
                                            style={{ padding: "20px", textAlign: "center" }}
                                        >
                                            {groupedByDate[date]?.[periodIndex] ? (
                                                <>
                                                    <span style={{ fontWeight: date === today ? "bold" : "normal" }}>
                                                        {groupedByDate[date][periodIndex].ITRT_CNTNT}
                                                    </span>
                                                </>
                                            ) : null}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <PlanPage />
            )}
        </div>
    );
};

export default TimetablePage;
