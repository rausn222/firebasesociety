import React, { useState } from 'react';
import Text from '../components/elements/Text';
import Card from '../components/elements/Card';
import Button from '../components/elements/Button';
import { useNavigate } from 'react-router-dom';
import UPIPopup from '../components/elements/Modal';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Society_Investments = () => {
    const [amount, setAmount] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [weeks, setWeeks] = useState(0);
    const [isUPIPopupOpen, setIsUPIPopupOpen] = useState(false);
    var amountWithInterest = 0;
    var amountInvested = 0;

    const calculateWeeklyAmounts = (initialAmount, weeks) => {
        const amounts = [];
        var totalAmount = 0;
        var prevMonthValue = 0;
        for (let i = 1; i <= weeks; i++) {
            if (i == weeks) {
                totalAmount = (prevMonthValue * (1 + (10 / 1200))).toFixed(2);
            }
            else {
                totalAmount = ((prevMonthValue * (1 + (10 / 1200))) + parseInt(initialAmount)).toFixed(2);
            }
            var profit = (totalAmount - (parseInt(initialAmount) * i));
            profit = profit.toFixed(2);
            if (i == weeks) {
                amounts.push({ week: i, initialAmount: 0, totalAmount, profit });
            }
            else {
                amounts.push({ week: i, initialAmount, totalAmount, profit });
            }
            prevMonthValue = totalAmount;
            amountWithInterest = totalAmount;
        }
        amountInvested = amount * weeks;
        return amounts;
    };

    const weeklyAmounts = calculateWeeklyAmounts(amount, weeks);

    const handleButtonClick = () => {
        if(amount == '' || timePeriod == ''){
            toast("Please select amount and duration");
        }
        else{
            setIsUPIPopupOpen(true);
        }
    };

    const closeUPIPopup = (message) => {
        console.log(message);
        if(message == true){
            toast("Submitted");
        }
        setIsUPIPopupOpen(false);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const handleTimePeriodChange = (e) => {
        setTimePeriod(e.target.value);
        if (e.target.value == "2years") {
            setWeeks(25);
        }
        else if (e.target.value == "3years") {
            setWeeks(37);
        }
        else if (e.target.value == "5.5years") {
            setWeeks(67);
        }
        else {
            setWeeks(0);
        }
    };

    return (
        <>
            <main >
                <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">

                    <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">

                        <Card className="text-center pb-16">
                            <Text className="font-semibold text-xl">
                                Society Investment !!!
                            </Text>

                            <Text className="text-sm pt-2">
                                Please select the amonut and time for which you want to invest.
                            </Text>

                            <h2>Select Investment Options</h2>
                            <div className="selector" style={{ marginTop: 10 }}>
                                <label htmlFor="amount">Amount:</label>
                                <select id="amount" value={amount} style={{ color: 'black', marginLeft: 20, textAlign: 'center' }} onChange={handleAmountChange}>
                                    <option value="">Select Amount</option>
                                    <option value="500"> &#8377; 500</option>
                                    <option value="1000"> &#8377; 1,000</option>
                                    <option value="1500"> &#8377; 1,500</option>
                                    <option value="2000"> &#8377; 2,000</option>
                                    <option value="2500"> &#8377; 2,500</option>
                                    <option value="3000"> &#8377; 3,000</option>
                                    <option value="3500"> &#8377; 3,500</option>
                                    <option value="4000"> &#8377; 4,000</option>
                                    <option value="4500"> &#8377; 4,500</option>
                                    <option value="5000"> &#8377; 5,000</option>
                                    <option value="10000"> &#8377; 10,000</option>
                                </select>
                            </div>
                            <div className="selector">
                                <label htmlFor="time-period">Time Period:</label>
                                <select id="time-period" value={timePeriod} style={{ color: 'black', marginTop: 10, marginLeft: 20 }} onChange={handleTimePeriodChange}>
                                    <option value="">Select Time Period</option>
                                    <option value="2years">2 Years</option>
                                    <option value="3years">3 Years</option>
                                    <option value="5.5years">5.5 Years</option>
                                </select>
                            </div>
                        </Card>

                        <div>
                            <center><b><h1>Interest Calculation Table</h1></b></center>
                            <label>
                                Initial Amount: {amount}
                            </label>
                            <br />
                            <label>
                                Number of Weeks: {weeks}
                            </label>
                            <table border="10" style={{ borderColor: 'white', borderWidth: 1, marginTop: 10, marginBottom: 10, borderCollapse: 'collapse', width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Month</th>
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Amount to Deposit</th>
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Total Balance</th>
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyAmounts.map(({ week, initialAmount, totalAmount, profit }) => (
                                        <tr key={week}>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{week}</td>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{initialAmount}</td>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{totalAmount}</td>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{profit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {
                                weeks > 0 &&
                                <label>
                                    Total Profit: {(amountWithInterest - amountInvested).toFixed(2)}
                                    <br></br>
                                    Total Maturity Amount: {amountWithInterest}
                                </label>
                            }

                            <Button onClick={handleButtonClick} className="mt-6 w-full mx-auto">
                                Invest Now
                            </Button>
                            {isUPIPopupOpen && <UPIPopup type={"Monthly"} amount={amount} isOpen={isUPIPopupOpen} onClose={closeUPIPopup} />}
                            <ToastContainer />
                        </div>
                    </section>

                </section>
            </main>
        </>
    )
}

export default Society_Investments