"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
type RaffleTab = "active" | "ended" | "all";

interface Props {
  search: string;
  setSearch: (v: string) => void;

  filterPrize: string;
  setFilterPrize: (v: string) => void;

  sortBy: string;
  setSortBy: (v: string) => void;

  tab: RaffleTab;
  setTab: (v: RaffleTab) => void;
}


export default function RafflesFiltersPremium({
  search,
  setSearch,
  filterPrize,
  setFilterPrize,
  sortBy,
  setSortBy,
  tab,
  setTab,
}: Props) {
  return (
    <div className="flex flex-wrap justify-center items-center gap-4 mb-10">

      <Input
        placeholder="Buscar rifa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-[250px] bg-none placeholder:text-gold/40 backdrop-blur-md"
      />

      <Select onValueChange={setFilterPrize} value={filterPrize}>
        <SelectTrigger className="w-[180px] bg-none backdrop-blur-xl">
          <SelectValue placeholder="Tipo de premio" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los premios</SelectItem>
          <SelectItem value="cash">Dinero 💵</SelectItem>
          <SelectItem value="product">Producto 🎁</SelectItem>
          <SelectItem value="trip">Viaje ✈️</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={setSortBy} value={sortBy}>
        <SelectTrigger className="w-[180px] bg-none text-gold backdrop-blur-xl">
          <SelectValue placeholder="Ordenar por" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recent">Más recientes</SelectItem>
          <SelectItem value="price">Precio mayor</SelectItem>
          <SelectItem value="endingSoon">Próximas a finalizar</SelectItem>
        </SelectContent>
      </Select>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          if (v === "active" || v === "ended" || v === "all") {
            setTab(v);
          }
        }}
      >

        <TabsList className="bg-transparent border shadow-lg rounded-xl p-1">
          <TabsTrigger
            value="active"
            className="
      text-white
      bg-transparent
      data-[state=active]:bg-white
      data-[state=active]:text-black
      transition-all
    "
          >
            Activas
          </TabsTrigger>

          <TabsTrigger
            value="ended"
            className="
      text-white
      bg-transparent
      data-[state=active]:bg-white
      data-[state=active]:text-black
      transition-all
    "
          >
            Finalizadas
          </TabsTrigger>

          <TabsTrigger
            value="all"
            className="
      text-white
      bg-transparent
      data-[state=active]:bg-white
      data-[state=active]:text-black
      transition-all
    "
          >
            Todas
          </TabsTrigger>
        </TabsList>

      </Tabs>
    </div>
  );
}
