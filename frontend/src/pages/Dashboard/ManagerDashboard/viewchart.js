import React from 'react';
import ReactApexChart from 'react-apexcharts';

class ApexChart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: [{
                name: "Daily Counts",
                data: []
            }],
            options: {
                chart: {
                    toolbar: {
                        show: false
                    },
                    height: 350,
                    type: 'line',
                    zoom: {
                        enabled: false
                    },
                    events: {
                        mouseMove: (event, chartContext, opts) => {
                            const { dataPointIndex } = opts;
                            if (dataPointIndex >= 0 && this.state.options.xaxis.categories[dataPointIndex]) {
                                const date = this.state.options.xaxis.categories[dataPointIndex];
                                const count = this.state.series[0].data[dataPointIndex];
                                //this.updateChartTitle(opts);
                            } else {
                                //console.log('No valid dataPointIndex or category found');
                            }
                        },
                        mouseLeave: (event, chartContext, opts) => {
                            //console.log('TooltipHidden');
                            //this.resetChartTitle();
                        }
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth',
                    colors: '#EE844F',
                },
                title: {
                    text: '',
                    align: 'left'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: [],
                }
            },
        };
    }

    componentDidMount() {
        if (this.props.data) {
            this.updateChartData(this.props.data);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.updateChartData(this.props.data);
        }
    }




    updateChartData(data) {
        const dates = data.map(item => window.formatMDate(item.date));
        const counts = data.map(item => item.count);

        this.setState({
            series: [{
                name: "Views",
                data: counts
            }],
            options: {
                ...this.state.options,
                xaxis: {
                    ...this.state.options.xaxis,
                    categories: dates,
                }
            }
        }, () => {
            // Force re-render if necessary
            this.forceUpdate();  // Optionally trigger a full re-render if the chart isn't syncing
        });
    }

    updateChartTitle = (config) => {
        const { dataPointIndex } = config;
        const { series } = this.state;
        const date = this.state.options.xaxis.categories[dataPointIndex];
        const count = series[0].data[dataPointIndex];

        this.setState(prevState => ({
            options: {
                ...prevState.options,
                title: {
                    ...prevState.options.title,
                    text: `${date} (${count})`
                }
            }
        }));
    };

    resetChartTitle = () => {
        this.setState(prevState => ({
            options: {
                ...prevState.options,
                title: {
                    ...prevState.options.title,
                    text: 'Views by Day'
                }
            }
        }));
    };

    render() {
        return (
            <div>
                <div id="chart">
                    <ReactApexChart
                        options={this.state.options}
                        series={this.state.series}
                        type="line"
                        height={350}
                        key={JSON.stringify(this.state.series)}  // This ensures a full re-render
                    />
                </div>
                <div id="html-dist"></div>
            </div>
        );
    }
}



export default ApexChart;
