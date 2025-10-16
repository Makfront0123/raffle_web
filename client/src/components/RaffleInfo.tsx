"use client";
import { cardIndex } from "@/const/cardIndex";
import { useRaffles } from "@/hook/useRaffles";
import { Raffle } from "@/type/Raffle";
import { Button } from "./ui/button";
import { Card, CardHeader, CardContent } from "./ui/card";


const RaffleInfo = () => {
    const { raffles, loading, error } = useRaffles();
    console.log(raffles);
    return (

        <div className="w-full min-h-[120vh] relative">
            <div className="flex flex-col items-start px-20">
                <div className="flex flex-col items-start text-white">
                    <span className="text-2xl">Como Participar</span>
                    <h3 className="uppercase text-4xl">Solo sigue estos 3 pasos</h3>
                </div>
                <div className="flex items-center gap-x-10 mt-10">
                    {
                        cardIndex.map((card: any) => (
                            <Card key={card.id} >
                                <CardHeader>
                                    <img src={card.image} alt="" />
                                    <span>{card.name}</span>
                                </CardHeader>
                                <CardContent>
                                    <p>{card.description}</p>
                                </CardContent>
                            </Card>
                        ))
                    }
                </div>

                <div>
                    <h1 className="mt-20">Participa en alguna rifa</h1>
                    <div className="flex flex-wrap items-center justify-center gap-20 py-3">
                        {
                            raffles.map((raffle: Raffle) => (
                                <Card key={raffle.id} >
                                    <CardHeader>
                                        <span>{raffle.title}</span>
                                        <p>{raffle.price}</p>
                                        <p>
                                            {raffle.total_numbers} tickets
                                        </p>
                                    </CardHeader>
                                    <CardContent>
                                        <p>{raffle.description}</p>
                                        <Button>Participar</Button>
                                    </CardContent>
                                </Card>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>

    )
}

export default RaffleInfo