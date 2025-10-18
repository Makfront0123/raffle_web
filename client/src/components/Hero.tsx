import { Button } from "./ui/button";

const Hero = () => {
    return (

        <header className="w-full min-h-[120vh] relative" >


            <div className="flex items-start px-20">
                <div className="flex flex-col items-start mt-40">
                    <span className="text-2xl text-blue-300">Contest FOR YOUR CHANCE</span>
                    <h3 className="uppercase text-8xl text-white">big win</h3>
                    <p className="font-medium mt-5 tracking-wide text-white">
                        Now's your chance to win a car! Check out the prestige cars you
                        can win in our car prize draws. Will you be our next lucky
                        winner?
                    </p>
                    <Button
                        className="text-md p-5 mt-7 bg-gradient-to-r from-purple-800 to-[#3B82F6] hover:from-[#3B82F6] hover:to-purple-800 transition-all"
                    >
                        <span>Participar Ahora</span>
                    </Button>
                </div>
                <img
                    src="/images/mt09_blue1.png"
                    className="object-contain size-160 z-80"
                    alt=""
                />
            </div>
        </header>

    )
}

export default Hero

