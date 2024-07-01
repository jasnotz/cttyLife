import React from 'react';
import '../styles/ui/Toggle.css';

interface ToggleProps {
    currentView: string;
    onToggle: (view: string) => void;
}

const Toggle: React.FC<ToggleProps> = ({ currentView, onToggle }) => {
    return (
        <div className="toggle-container">
            <div
                className={`toggle-item ${currentView === 'timetable' ? 'active' : ''}`}
                onClick={() => onToggle('timetable')}
            >
                시간표
            </div>
            <div
                className={`toggle-item ${currentView === 'plan' ? 'active' : ''}`}
                onClick={() => onToggle('plan')}
            >
                학사일정
            </div>
        </div>
    );
};

export default Toggle;
