import React, {useEffect, useState} from 'react';

const DateTimeDisplay: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);


    return (
        <div
            className="bg-gray-900 text-gray-50 font-medium flex items-center justify-center text-xs rounded shadow-md">
            {currentDate.toLocaleString('en-US', {year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true, second: '2-digit'})}
        </div>
    );
};

export default DateTimeDisplay;