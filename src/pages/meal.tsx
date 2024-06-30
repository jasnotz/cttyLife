import React, { useEffect, useState } from "react";
import axios from "axios";
import NormalHeader from "../ui/header/normalHeader";

export interface MealtablePageProps {}

interface MealtableData {
    MMEAL_SC_NM: string;
    DDISH_NM: string;
}

interface ApiParams {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    AY?: string;
    SEM?: string;
    GRADE?: string;
    CLASS_NM?: string;
    MLSV_FROM_YMD?: string;
    MLSV_TO_YMD?: string;
}

const MealtablePage: React.FC<MealtablePageProps> = () => {
    const [Mealtable, setMealtable] = useState<MealtableData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMealtable = async () => {
            try {
                const currentDate = new Date();
                const day = currentDate.getDay();
                const diffToMonday = currentDate.getDate() - day + (day === 0 ? -6 : 1); // Calculate Monday
                const diffToFriday = diffToMonday + 4; // Calculate Friday

                const monday = new Date(currentDate.setDate(diffToMonday)).toISOString().split('T')[0].replace(/-/g, '');
                const friday = new Date(currentDate.setDate(diffToFriday)).toISOString().split('T')[0].replace(/-/g, '');

                const params: ApiParams = {
                    ATPT_OFCDC_SC_CODE: "J10", // 교육청 코드
                    SD_SCHUL_CODE: "7531292", // 학교 코드
                    MLSV_FROM_YMD: monday, // 급식표 시작 일자
                    MLSV_TO_YMD: friday, // 급식표 종료 일자
                };

                const response = await axios.get("https://open.neis.go.kr/hub/mealServiceDietInfo", {
                    params: {
                        ...params,
                        KEY: import.meta.env.VITE_API_KEY,
                        Type: "json"
                    },
                });

                console.log(response); // API 응답 확인을 위해 추가

                if (response.data.mealServiceDietInfo) {
                    const data = response.data.mealServiceDietInfo[1].row; // API 응답 구조에 따라 수정
                    setMealtable(data);
                } else {
                    setError("데이터가 없습니다.");
                }

                setLoading(false);
            } catch (err) {
                console.error(err); // 에러 로그 확인을 위해 추가
                setError("데이터를 불러오는데 실패했습니다.");
                setLoading(false);
            }
        };

        fetchMealtable();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const formatMealtable = (ddishNm: string): string => {
        return ddishNm.replace(/<br\/>/g, ', ').replace(/\([^)]*\)/g, '');
    };

    return (
        <>
            <NormalHeader />
            <br />
            <br />
            <table>
                <tbody>
                    {Mealtable.map((item, index) => (
                        <tr key={index}>
                            <td>{formatMealtable(item.DDISH_NM)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default MealtablePage;
