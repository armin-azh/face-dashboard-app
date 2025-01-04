import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from 'chart.js';
import {Line} from 'react-chartjs-2';
import {BiStats} from "react-icons/bi";
import {IoMdPerson} from "react-icons/io";
import {GiCctvCamera} from "react-icons/gi";

// Register required components
ChartJS.register(
    CategoryScale, // For x-axis
    LinearScale,   // For y-axis
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

// Sample data for the line chart (Activity Summary)
const activityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Recognized Faces',
            data: [20, 35, 40, 60, 90, 100, 80],
            borderColor: '#4A90E2',
            backgroundColor: 'rgba(74,144,226,0.2)',
            fill: true,
            tension: 0.4,
        },
        {
            label: 'Unknown Faces',
            data: [5, 10, 8, 12, 15, 20, 10],
            borderColor: '#E24A4A',
            backgroundColor: 'rgba(226,74,74,0.2)',
            fill: true,
            tension: 0.4,
        }
    ]
};


export default function AnalyticsSummeryCard() {


    // Placeholder for Recognition Stats
    const recognitionSuccessRate = '95%'; // Assume dynamic value
    const unknownDetectionRate = '5%';

    return (
        <div className="bg-white p-4 rounded shadow md:col-span-2">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <BiStats className="text-blue-500 text-2xl" />
                Analytics and Reports
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Recognition Stat Overview */}
                <div className="bg-blue-50 p-4 rounded flex items-center justify-center col-span-2 sm:col-span-1">
                    <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                        <IoMdPerson className="text-5xl text-blue-500 mr-4"/>
                        <div>
                            <p className="text-sm">Success Rate</p>
                            <p className="text-3xl font-bold">{recognitionSuccessRate}</p>
                        </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded flex items-center justify-center">
                        <IoMdPerson className="text-5xl text-red-500"/>
                        <div>
                            <p className="text-sm">Unknown Rate</p>
                            <p className="text-3xl font-bold">{unknownDetectionRate}</p>
                        </div>
                    </div>
                </div>

                {/* Camera Usage Stats Placeholder */}
                <div className="bg-yellow-50 p-4 rounded flex items-center justify-center col-span-2 sm:col-span-1">
                    <GiCctvCamera className="text-5xl text-yellow-500 mr-4"/>
                    <div>
                        <p className="text-sm">Active Cameras</p>
                        <p className="text-3xl font-bold">12</p> {/* Dynamic Number */}
                    </div>
                </div>

                {/* Activity Summary Chart */}
                <div className="col-span-2">
                    <h3 className="text-md font-semibold text-gray-800 mb-2">Activity Summary</h3>
                    <div style={{height: '300px'}}> {/* Set container height explicitly */}
                        <Line data={activityData} options={{
                            responsive: true,
                            maintainAspectRatio: false, // Disable maintainAspectRatio to allow height changes
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        color: '#333',
                                    },
                                },
                            },
                            scales: {
                                x: {
                                    grid: {
                                        display: false,
                                    },
                                },
                                y: {
                                    grid: {
                                        color: '#eee',
                                    },
                                    ticks: {
                                        color: '#333',
                                    },
                                    min: 0, // Adjust the minimum value for y-axis
                                    max: 100, // Adjust the maximum value for y-axis (squeezing the range)
                                },
                            },
                        }}/>
                    </div>
                </div>
            </div>
        </div>
    );
}