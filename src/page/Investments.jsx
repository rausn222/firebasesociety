import React from 'react';
import Text from '../components/elements/Text';
import Card from '../components/elements/Card';
import Button from '../components/elements/Button';
import { useNavigate } from 'react-router-dom';

const Investments = () => {
    const navigate = useNavigate();

    const onLogin = (values) => {
        if (values == 1){
            navigate("/weekly")
        }
        if (values == 3){
            navigate("/society")
        }
    }

    return (
        <>
            <main >
                <section className="text-white pt-10 pb-24 px-3  md:pt-10 md:pb-20">

                    <section className="grid grid-cols-1 space-y-6 md:space-y-0 md:gap-4">

                        <Card className="text-center pb-16">
                            <Text className="font-semibold text-xl">
                                Investment Now !!!
                            </Text>

                            <Text className="text-sm pt-2">
                                Please select the plan which you want to invest.
                            </Text>

                            <div className='flex flex-col'>
                                <Button onClick={() => onLogin(1)} className="mt-6 w-full mx-auto">
                                    Weekly Earning
                                </Button>
                                <Button onClick={() => onLogin(3)} className="mt-6 w-full mx-auto">
                                    Society Plan
                                </Button>
                            </div>
                        </Card>
                    </section>

                </section>
            </main>
        </>
    )
}

export default Investments