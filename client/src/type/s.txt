import { Button } from "./ui/button";

const Hero = () => {
    return (
        <header className="w-full min-h-[120vh] relative">
            <div className="flex md:flex-row flex-col md:items-start items-center justify-between md:px-20 px-0 py-10">
                {/* Texto principal */}
                <div className="animate-left-fade-in flex flex-col md:text-start text-center items-start md:mt-40 mt-10">
                    <span className="md:text-2xl text-lg text-purple-600">Contest FOR YOUR CHANCE</span>
                    <h3 className="uppercase md:text-8xl text-6xl text-black font-extrabold">big win</h3>
                    <p className="font-medium mt-5 tracking-wide text-black md:w-130 w-60">
                        Now's your chance to win a car! Check out the prestige cars you
                        can win in our car prize draws. Will you be our next lucky winner?
                    </p>
                    <Button
                        className="text-md p-5 mt-7 md:mx-0 mx-auto bg-gradient-to-r from-purple-800 to-[#3B82F6] hover:from-[#3B82F6] hover:to-purple-800 transition-all"
                    >
                        <span>Participar Ahora</span>
                    </Button>
                </div>


                <div className="animate-right-fade-in relative flex items-center justify-center md:mt-0 mt-20">
                    <div className="relative rounded-full p-[6px] bg-gradient-to-r from-[#7B2FF7] to-[#F107A3]">
                        <div className="rounded-full bg-gradient-to-tr from-[#4F46E5] to-[#EC4899] p-1">
                            <div className="rounded-full bg-white flex items-center justify-center w-[500px] h-[500px]">
                                <img
                                    src="/images/mt09_blue1.png"
                                    alt="Moto"
                                    className="object-contain w-[450px] h-[450px]"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Hero;
