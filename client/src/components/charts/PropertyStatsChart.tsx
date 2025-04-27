import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PropertyStatsChart = () => {
    // Sample data - replace with actual data from API
    const data = {
        labels: ['Rental Income', 'Avg. Occupancy', 'Maintenance Costs', 'ROI'],
        datasets: [
            {
                label: 'Last Month',
                data: [8500, 92, 1200, 12],
                backgroundColor: 'rgba(75, 192, 192, 0.7)',
            },
            {
                label: 'This Month',
                data: [9200, 95, 900, 14],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: any, index: number) {
                        // Add appropriate units based on the metric
                        if (index === 0 || index === 2) return '$' + value;
                        if (index === 1) return value + '%';
                        if (index === 3) return value + '%';
                        return value;
                    }
                }
            }
        },
        plugins: {
            legend: {
                position: 'top' as const,
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const label = context.dataset.label || '';
                        const value = context.raw || 0;
                        const dataIndex = context.dataIndex;

                        // Format based on metric type
                        if (dataIndex === 0 || dataIndex === 2) {
                            return `${label}: $${value.toLocaleString()}`;
                        } else if (dataIndex === 1 || dataIndex === 3) {
                            return `${label}: ${value}%`;
                        }
                        return `${label}: ${value}`;
                    }
                }
            }
        },
    };

    return (
        <div className="h-64">
            <Bar data={data} options={options} />
        </div>
    );
};

export default PropertyStatsChart;