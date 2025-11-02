"use client";

import { cardIndex } from "@/const/cardIndex";

const RaffleInfo = () => {
  return (
    <div className="w-full min-h-[120vh] relative md:mt-0 mt-20">
      <div className="flex flex-col items-start md:px-20 px-0">
        <div className="flex flex-col md:items-start items-center text-center md:text-start">
          <span className="text-5xl text-black font-extrabold">Cómo Participar</span>
          <h3 className="uppercase text-4xl text-purple-600 mt-5">
            Solo sigue estos 3 pasos
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-10 mt-20">
          {cardIndex.map((card: any) => {
            const Icon = card.icon; // ← aquí tomamos el componente del ícono

            return (
              <div
                key={card.id}
                className="group relative w-[300px] h-[300px] rounded-2xl flex flex-col items-center justify-center overflow-hidden 
                shadow-[12px_12px_24px_#c5c5c5,-12px_-12px_24px_#ffffff] 
                bg-gradient-to-br from-[#f5f5f5] to-[#ffffff] 
                transition-all duration-500 hover:scale-[1.03] hover:shadow-[16px_16px_32px_#c5c5c5,-16px_-16px_32px_#ffffff]"
              >
                <div className="absolute inset-[6px] rounded-xl bg-white/70 backdrop-blur-xl border border-white/40 z-10 transition-all duration-500 group-hover:bg-white/80 group-hover:border-white/60"></div>

                <div className="absolute top-1/2 left-1/2 w-[160px] h-[160px] rounded-full 
                bg-[radial-gradient(circle_at_30%_30%,#9810fa,#b25cff)] 
                blur-3xl opacity-90 animate-blob-bounce 
                transition-all duration-700 ease-in-out z-0"></div>

                <div className="relative z-20 flex flex-col items-center justify-center gap-3 px-4 text-center">
                  <Icon className="w-10 h-10 text-[#9810fa]" /> {/* Ícono dinámico */}
                  <span className="text-xl font-semibold text-gray-800">{card.name}</span>
                  <p className="text-sm text-gray-600">{card.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RaffleInfo;



/*

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
*/