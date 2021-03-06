// Initialize ticker class
const ticker = new Ticker;
// Initialize ui class
const ui = new UI;
// Get Value from input
const searchTicker = document.getElementById('ticker');
// Search Price for particular stock 

const labels = [];
const shares = [];
data.forEach(d => {
    labels.push(d['ticker']);
    shares.push(d['total_share']);
});

// Define UI vars 
const priceList = document.querySelectorAll('.price');
const changeList = document.querySelectorAll('.change');
const shareList = document.querySelectorAll('.total_share');
const aquisitionList = document.querySelectorAll('.aquisition_cost');
const profitList = document.querySelectorAll('.return');
const dollar = document.querySelector('#dollar')
const percent = document.querySelector('#percent');
const totalAsset = document.querySelector('#total-asset')
const totalCash = document.querySelector('#total-cash')
const summary = document.querySelectorAll('.summary')

// Get Live Stock Data using Fetch API every 5 min
//86,400,000 == 1 day
getStockPrice();
setInterval(() => {
    console.log('Call API')
    getStockPrice();
}, 86400000)

let stocks;
function getStockPrice() {
    ticker.getQuote(labels)
        .then(data => {
            data.forEach((d, i) => {
                stocks = data;
                price = parseFloat(d['Global Quote']['05. price']).toFixed(2);
                priceList[i].textContent = price;
                change = parseFloat(d['Global Quote']['09. change']).toFixed(2);
                setChange(change, i, '');
                calculateProfit(i);
            });
            calculateTotalAsset();
        })
}

function calculateProfit(i) {
    const price = priceList[i].textContent;
    const share = shareList[i].textContent;
    const aquisition_cost = aquisitionList[i].textContent;
    const profit = ((price * share) - (aquisition_cost * share)).toFixed(2);
    if (profit >= 0) {
        profitList[i].style.color = 'green';
    } else {
        profitList[i].style.color = 'red'
    }
    profitList[i].textContent = profit;
}

// EventListeners
// change the format to PERCENT
percent.addEventListener('click', () => {
    stocks.forEach((stock, i) => {
        change = parseFloat(stock['Global Quote']['10. change percent']).toFixed(2);
        setChange(change, i, '%');
    });
});

// change the format to Dollar 
dollar.addEventListener('click', () => {
    stocks.forEach((stock, i) => {
        change = parseFloat(stock['Global Quote']['09. change']).toFixed(2);
        setChange(change, i, '');
    });

});

// output the results
function setChange(change, i, sign) {
    if (change >= 0) {
        changeList[i].style.color = 'green';
    } else {
        changeList[i].style.color = 'red';
    }
    if (sign !== '') {
        changeList[i].textContent = `${change} ${sign}`;
    } else {
        changeList[i].textContent = change;
    }
}

// Calculate Total Account Value
function calculateTotalAsset() {
    let sum = 0.0;
    summary.forEach((data, i) => {
        const share = shareList[i].textContent;
        const aquisition_cost = aquisitionList[i].textContent;
        sum += (aquisition_cost * share);
    });
    sum = parseFloat(sum + parseFloat(totalCash.textContent.replace('$', ''))).toFixed(2);
    totalAsset.textContent = `$ ${sum}`
}

// Draw Chart
let myChart = document.getElementById('myChart').getContext('2d');
let type = 'pie';
let portfolioChart = new Chart(myChart, {
    type: type,
    data: {
        datasets: [
            {
                label: 'Portfolio',
                backgroundColor: ['#f1c40', '#e67e22', '#16a085', '#2980b9', '#FB3640'],
                data: shares,
            },
        ],
        labels: labels,
    },
    options: {
        legend: {
            position: 'right',
        },
        plugins: {
            datalabels: {
                color: '#fff',
                font: {
                    weight: 'bold',
                    size: 10
                },
            },
        },
    },
});

// destroy previous chart and create new one
document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('chart')) {
        type = e.target.parentElement.id;
        portfolioChart.destroy();
        myChart = document.getElementById('myChart').getContext('2d');
        if (type !== 'bar' || type !== 'horizontalBar' || type !== 'line') {
            portfolioChart = new Chart(myChart, {
                type: type,
                data: {
                    datasets: [
                        {
                            label: 'Portfolio',
                            backgroundColor: ['#f1c40', '#e67e22', '#16a085', '#2980b9', '#FB3640'],
                            data: shares,
                        },
                    ],
                    labels: labels,
                },
                options: {
                    legend: {
                        position: 'right',
                    },

                    plugins: {
                        datalabels: {
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 10
                            },
                        },
                    },
                },
            });
        } else {
            portfolioChart = new Chart(myChart, {
                type: type,
                data: {
                    datasets: [
                        {
                            label: 'Portfolio',
                            backgroundColor: ['#f1c40', '#e67e22', '#16a085', '#2980b9', '#FB3640'],
                            data: shares,
                        },
                    ],
                    labels: labels,
                },
                options: {
                    legend: {
                        position: 'right',
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,

                            }
                        }]
                    },
                    plugins: {
                        datalabels: {
                            color: '#fff',
                            font: {
                                weight: 'bold',
                                size: 10
                            },
                        },
                    },
                },
            });
        }
    }
});

// Toggle feature
const account = document.querySelector('#my-account');
const accountToggler = document.querySelector('#toggle-account');
const portofolio = document.querySelector('#my-portofolio');
const portofolioToggler = document.querySelector('#toggle-portofolio');
const chart = document.querySelector('#chart');
const chartToggler = document.querySelector('#toggle-chart');

accountToggler.addEventListener('click', function () {
    toggler(account, accountToggler);
});

portofolioToggler.addEventListener('click', function () {
    toggler(portofolio, portofolioToggler);
});

chartToggler.addEventListener('click', function () {
    toggler(chart, chartToggler);
});

function toggler(content, contentToggler) {
    if (content.style.display === '') {
        content.style.display = 'none';
        contentToggler.children[0].className = "fas fa-arrow-down"
    } else if (content.style.display === 'none') {
        content.style.display = '';
        contentToggler.children[0].className = "fas fa-arrow-up"
    }
}

// Default Symbol
let currentSymbol = labels[0];
let months = 12;
displayChart(currentSymbol, months);

document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('index')) {
        currentSymbol = e.target.parentElement.id;
        displayChart(currentSymbol, months);
    }
})

document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('months')) {
        months = e.target.parentElement.id;
        displayChart(currentSymbol, months);
    }
})

function displayChart(symbol, months) {
    ticker.getMonthlyPrice(symbol)
        .then(data => {
            // console.log(data['Monthly Time Series']['2020-12-11']);
            ui.displayChart(data['Monthly Time Series'], symbol, months);
        })
}



