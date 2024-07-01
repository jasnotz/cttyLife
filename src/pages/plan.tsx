import React, { useEffect, useState } from "react";
import axios from "axios";
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import Cookies from 'js-cookie';
import NormalHeader from "../ui/header/normalHeader";
import "../styles/pages/timeTable.css";

export interface PlanPageProps {}

interface ApiParams {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    AY?: string;
    SEM?: string;
}

interface EventData {
    AA_YMD: string;
    EVENT_NM: string;
    ONE_GRADE_EVENT_YN?: string;
    TW_GRADE_EVENT_YN?: string;
    THREE_GRADE_EVENT_YN?: string;
}

const PlanPage: React.FC<PlanPageProps> = () => {
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userGrade, setUserGrade] = useState<string>('');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const db = getFirestore();
                const userCookie = Cookies.get('user');
                let grade = '';
    
                if (userCookie) {
                    const userEmail = JSON.parse(userCookie).email;
                    const usersRef = collection(db, 'user');
                    const q = query(usersRef, where('email', '==', userEmail));
                    const querySnapshot = await getDocs(q);
                    const userData = querySnapshot.docs[0]?.data();
                    if (userData) {
                        grade = userData.grade;
                        setUserGrade(grade);  // Set the user's grade
                    } else {
                        setError('사용자 정보를 불러오는데 실패했습니다.');
                        setLoading(false);
                        return;
                    }
                }
    
                // Get the current year dynamically
                const currentYear = new Date().getFullYear().toString();
                const academicYear = (parseInt(currentYear) - 1).toString();

                const params: ApiParams = {
                    ATPT_OFCDC_SC_CODE: "J10",
                    SD_SCHUL_CODE: "7531292",
                    AY: academicYear, // Use the current year
                    SEM: "1",
                };
    
                const response = await axios.get("https://open.neis.go.kr/hub/SchoolSchedule", {
                    params: {
                        ...params,
                        KEY: import.meta.env.VITE_API_KEY,
                        Type: "json"
                    },
                });
    
                let eventData: EventData[] = response.data.SchoolSchedule[1].row;
                const filteredEvents = eventData.filter(event => {
                    if (grade === '1' && event.ONE_GRADE_EVENT_YN === 'Y') return true;
                    if (grade === '2' && event.TW_GRADE_EVENT_YN === 'Y') return true;
                    if (grade === '3' && event.THREE_GRADE_EVENT_YN === 'Y') return true;
                    return false;
                });
    
                setEvents(filteredEvents);
                setLoading(false);
            } catch (err) {
                setError("행사 데이터를 불러오는데 실패했습니다.");
                setLoading(false);
            }
        };
    
        fetchEvents();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div style={{ backgroundColor: "white", minHeight: "100vh" }}>
            <NormalHeader />
            <br />
            <br />
            <br />
            <div>
                <ul>
                    {events.map((event, index) => (
                        <li key={index}>
                            {event.AA_YMD} - {event.EVENT_NM}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default PlanPage;
