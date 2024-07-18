import React, { useState } from 'react';
import Text from '../components/elements/Text';
import Card from '../components/elements/Card';
import Button from '../components/elements/Button';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'react-modal';
import UPIPopup from '../components/elements/Modal';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

const Weekly_Investments = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [weeks, setWeeks] = useState(0);
    const [isUPIPopupOpen, setIsUPIPopupOpen] = useState(false);
    var amountWithInterest = 0;
    const calculateWeeklyAmounts = (initialAmount, weeks, weeklyRate) => {
        const amounts = [];
        const amount = parseInt(initialAmount) + (initialAmount * weeks * weeklyRate);
        amountWithInterest = amount;
        for (let i = 1; i <= weeks; i++) {
            const profit = (amount - initialAmount) / weeks;
            const weekamount = amount / weeks;
            amounts.push({ week: i, weekamount, profit });
        }
        return amounts;
    };

    const weeklyRate = 0.005;
    const weeklyAmounts = calculateWeeklyAmounts(amount, weeks, weeklyRate);

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
        if (e.target.value == "4weeks") {
            setWeeks(4);
        }
        else if (e.target.value == "8weeks") {
            setWeeks(8);
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
                                Weekly Investment !!!
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
                                    <option value="2000"> &#8377; 2,000</option>
                                    <option value="5000"> &#8377; 5,000</option>
                                    <option value="10000"> &#8377; 10,000</option>
                                    <option value="20000"> &#8377; 20,000</option>
                                    <option value="50000"> &#8377; 50,000</option>
                                </select>
                            </div>
                            <div className="selector">
                                <label htmlFor="time-period">Time Period:</label>
                                <select id="time-period" value={timePeriod} style={{ color: 'black', marginTop: 10, marginLeft: 20 }} onChange={handleTimePeriodChange}>
                                    <option value="">Select Time Period</option>
                                    <option value="4weeks">4 Weeks</option>
                                    <option value="8weeks">8 Weeks</option>
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
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Week</th>
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Amount to be Received</th>
                                        <th style={{ border: '1px solid white', padding: '8px' }}>Profit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {weeklyAmounts.map(({ week, weekamount, profit }) => (
                                        <tr key={week}>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{week}</td>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{weekamount}</td>
                                            <td style={{ border: '1px solid white', padding: '8px' }}>{profit}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {
                                weeks > 0 &&
                                <label>
                                    Total Profit: {amountWithInterest - amount}
                                    <br></br>
                                    Total Maturity Amount: {amountWithInterest}
                                </label>
                            }

                            <Button onClick={handleButtonClick} className="mt-6 w-full mx-auto">
                                Invest Now
                            </Button>
                            {isUPIPopupOpen && <UPIPopup type={"Weekly"} time={weeks} amount={amount} isOpen={isUPIPopupOpen} onClose={closeUPIPopup} />}
                            <ToastContainer />
                        </div>
                    </section>

                </section>
            </main>
        </>
    )
}

export default Weekly_Investments