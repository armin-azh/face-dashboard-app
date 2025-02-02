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

// Hooks
import {useGetEventWeekHistoryQuery} from "../../store/api/core.tsx";


export default function EventHistory(){

    const {data} = useGetEventWeekHistoryQuery();
    if (!data) return null;

    const labels = data.data.map((item) => item.day_name); // Extract day_name for labels
    const recognizedFaces = data.data.map((item) => item.known_count); // Extract known_count for dataset 1
    const unknownFaces = data.data.map((item) => item.unknown_count); // Extract unknown_count for dataset 2

    return (
        <div className="col-span-2">
            <h3 className="text-md font-semibold text-gray-800 mb-2">Activity Summary</h3>
            <div style={{height: '300px'}}> {/* Set container height explicitly */}
                <Line data={{
                    labels,
                    datasets: [
                        {
                            label: 'Recognized Faces',
                            data: recognizedFaces,
                            borderColor: '#4A90E2',
                            backgroundColor: 'rgba(74,144,226,0.2)',
                            fill: true,
                            tension: 0.4,
                        },
                        {
                            label: 'Unknown Faces',
                            data: unknownFaces,
                            borderColor: '#E24A4A',
                            backgroundColor: 'rgba(226,74,74,0.2)',
                            fill: true,
                            tension: 0.4,
                        }
                    ]
                }} options={{
                    responsive: true,
                    maintainAspectRatio: false, // Disable maintainAspectRatio to allow height changes
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                color: '#333',
                            },
                        },
                        filler: {
                            propagate: true
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
    )
}