"use client"
import React, { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";
import { pusherClient } from '@/libs/pusher';

const LiveChart = ({ data, channel }: { data: any[], channel: string }) => {
    console.log(data)
    // Initialize lastDate with the timestamp of the last data point
    let lastDate = data[data.length - 1].x;

    // Function to generate new data points
    const getNewSeries = (baseTime: any, range: { max: Number, min: Number }) => {
        const randomNumber = 0;
        // const randomNumber = Math.round(Math.random() * 10) / 10;
        lastDate = baseTime + 1000; // Increment by 1 second
        // Generate a new random data point within the range
        const newDataPoint = {
            x: new Date(lastDate).getTime(),
            y: randomNumber
        };
        // Push the new data point into the data array
        data.push(newDataPoint);
        // Limit the number of data points to a fixed size (e.g., 10)
        if (data.length > 10) {
            data.shift(); // Remove the oldest data point
        }
    };


    const [series, setSeries] = useState([{
        data: data.slice() // Copy of the initial data array
    }]);

    // Chart options
    const [options] = useState<ApexOptions>({
        // title: {
        //     text: 'Dynamic Updating Chart',
        //     align: 'left'
        // },
        colors: ["#5750F1", "#0ABEF9"],
        tooltip: {
            fixed: {
                enabled: !1,
            },
            x: {
                show: !1,
            },
            y: {
                title: {
                    formatter: function (e) {
                        return "";
                    },
                },
            },
            marker: {
                show: !1,
            },
        },
        grid: {
            strokeDashArray: 5,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: true,
                },
            },
        },
        fill: {
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        dataLabels: {
            enabled: false
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
            {
                breakpoint: 1366,
                options: {
                    chart: {
                        height: 320,
                    },
                },
            },
        ],
        stroke: {
            curve: "smooth",
        },
        markers: {
            size: 0
        },
        chart: {
            id: 'realtime',
            fontFamily: "Satoshi, sans-serif",
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        xaxis: {
            type: 'datetime',
        },
        yaxis: {
            max: 1
        },
        legend: {
            show: false
        }
    });


    useEffect(() => {
        let lastAnomalyReceived = false;
        pusherClient.subscribe(channel);

        pusherClient.bind("anomaly_logs", (anomaly: any) => {
            console.log(anomaly, "IN LIVESTREAM");
            const date = new Date(anomaly.timestamp);

            // Get the time in milliseconds
            const milliseconds = date.getTime();

            const newDataPoint = {
                x: milliseconds,
                // x: anomaly.timestamp,
                y: anomaly?.anomaly_score || 0,
            };
            lastAnomalyReceived = true;
            data.push(newDataPoint);
            if (data.length > 10) {
                data.shift();
            }
            ApexCharts.exec('realtime', 'updateSeries', [{
                data: data
            }]);
        });

        const intervalId = setInterval(() => {
            // if (!lastAnomalyReceived) {
            //     const newDataPoint = {
            //         x: new Date().getTime(),
            //         y: 0
            //     };
            //     data.push(newDataPoint);
            //     if (data.length > 8) {
            //         data.shift();
            //     }
            //     ApexCharts.exec('realtime', 'updateSeries', [{
            //         data: data
            //     }]);
            // }
            // lastAnomalyReceived = false;
        }, 1000);

        // Cleanup function: unsubscribe from Pusher and clear interval
        return () => {
            pusherClient.unsubscribe(channel);
            clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7 mt-8">
            <div className="-ml-4 -mr-5">
                <div id="chart">
                    <ReactApexChart options={options} series={series} type="line" height={200} />
                </div>
            </div>
        </div>
    );
};
export default LiveChart