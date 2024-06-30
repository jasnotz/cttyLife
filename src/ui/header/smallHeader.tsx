import React from 'react';
import "../../styles/ui/header/bigHeader.css";

const BigHeader: React.FC = () => {
    return (
        <header className="bg-grey-900 text-white p-4 shadow-bottom md:p-2">
            <div className="container mx-auto flex justify-between items-center md:space-x-2">
                <a href="/"><h1 className="text-xl text-slate-950 font-bold header-font md:text-lg">👌창의고인</h1></a>
                <nav>
                    <ul className="flex space-x-4 md:space-x-2">
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