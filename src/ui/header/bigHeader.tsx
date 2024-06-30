import React from 'react';

import "../../styles/ui/header/bigHeader.css";

const BigHeader: React.FC = () => {
    return (
        <header className="bg-grey-900 text-white p-4 shadow-bottom">
            <div className="container mx-auto flex justify-between items-center">
                <a href="/"><h1 className="text-xl text-slate-950 font-bold header-font">👌창의고인</h1></a>
                <nav>
                    <ul className="flex space-x-4">
                        <li><a href="/" className="text-black hover:text-blue-300">홈</a></li>
                        <li><a href="/qr" className="text-black hover:text-blue-300">QR</a></li>
                        <li><a href="/meal" className="text-black hover:text-blue-300">급식</a></li>
                        <li><a href="/time" className="text-black hover:text-blue-300">시간표</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default BigHeader;