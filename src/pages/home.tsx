import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth, signOut } from 'firebase/auth';
import Cookies from 'js-cookie';
import NormalHeader from '../ui/header/normalHeader';

export interface MainPageProps {}

const MainPage: React.FC<MainPageProps> = () => {
    const [userInfo, setUserInfo] = useState('');

    useEffect(() => {
        const fetchUserInfo = async () => {
            const db = getFirestore();
            const userCookie = Cookies.get('user');
            if (userCookie) {
                const userEmail = JSON.parse(userCookie).email;
                const usersRef = collection(db, 'user');
                const q = query(usersRef, where('email', '==', userEmail));
                const querySnapshot = await getDocs(q);
                const userData = querySnapshot.docs[0]?.data();
                if (userData) {
                    setUserInfo(`${userData.grade}학년 ${userData.class}반 ${userData.name}`);
                } else {
                    setUserInfo('User');
                }
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            // Handle sign-out successfully.
            Cookies.remove('user'); // Assuming 'user' cookie is used for session management.
            window.location.reload(); // Refresh the page or redirect to login page.
        }).catch((error) => {
            // Handle errors here.
            console.error('Logout error:', error);
        });
    };

    return (
        <>
            <NormalHeader />
            <br />
            <br />
            <div>
                <h1>{`${userInfo}`}</h1>
            </div>
            <button onClick={handleLogout}>Logout</button>
        </>
    );
};

export default MainPage;