
import { cardIndex } from "@/models/cardIndex";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";

import React from 'react'
import { useRaffles } from "@/hook/useRaffles";
import type { Raffle } from "@/types/Raffle";

const Raffles = () => {
    const { raffles, loading, error } = useRaffles();
    console.log(raffles);
    return (

        <div className="w-full min-h-[120vh] relative">
            <div className="flex flex-col items-start px-60">
                <div className="flex flex-col items-start">
                    <span className="text-2xl">Como Participar</span>
                    <h3 className="uppercase text-4xl">Solo sigue estos 3 pasos</h3>
                </div>
                <div className="flex items-center gap-x-10 mt-10">
                    {
                        cardIndex.map((card: any) => (
                            <Card  >
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
                                <Card  >
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

export default Raffles