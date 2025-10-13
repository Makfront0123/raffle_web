 
import { cardIndex } from "@/models/cardIndex";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
 
import React from 'react'

const Raffles = () => {
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
    </div>
</div>

  )
}

export default Raffles