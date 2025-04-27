import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const OccupancyRateChart = () => {
    // Sample data - replace with actual data from API
    const data = {
        labels: ['Occupied', 'Vacant'],
        datasets: [
            {
                data: [85, 15],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 99, 132, 0.8)',
                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || '';
                        const value = context.raw || 0;
                        return `${label}: ${value}%`;
                    }
                }
            }
        },
    };

    return (
        <div className="relative h-64 flex items-center justify-center">
            <Doughnut data={data} options={options} />
            <div className="absolute text-center">
                <div className="text-3xl font-bold">85%</div>
                <div className="text-sm text-gray-500">Overall Occupancy</div>
            </div>
        </div>
    );
};

export default OccupancyRateChart;