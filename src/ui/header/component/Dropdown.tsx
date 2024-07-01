import React, { useState, useEffect, useRef } from "react";
import "../../../styles/ui/header/component/Dropdown.css";

export interface DropDownSpaceProps {
    activeItem: string | null;
    isFadingOut: boolean;
}

export const DropDownSpace: React.FC<DropDownSpaceProps> = ({ activeItem, isFadingOut }) => {
    const [isFirstRender, setIsFirstRender] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsFirstRender(false);
    }, []);

    const animationClass = isFirstRender ? '' : isFadingOut ? 'fadeOut slideUp' : 'fadeIn slideDown';

    const getContent = (activeItem: string | null) => {
        switch (activeItem) {
            case '급식증':
                return <div>급식증 Content</div>;
            case '홈':
                return <div>홈 Content</div>;
            case '일정':
                return <div>일정 Content</div>;
            case '급식표':
                return <div>급식표 Content</div>;
            case '메세지':
                return <div>메세지 Content</div>;
            case '프로필':
                return <div>프로필 Content</div>;
            default:
                return null;
        }
    }

    const content = getContent(activeItem);

    return (
        <>        
        <div ref={dropdownRef} className={`grow dropdownspace ${animationClass} ${isFadingOut ? 'fadeOut' : 'fadeIn'}`}>
            <div className={`dropdown-content ${isFadingOut ? 'blur' : ''}`}>
                {content}
            </div>
        </div>
        
        </>
    )
}