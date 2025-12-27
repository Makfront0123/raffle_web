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
        className="w-[250px] bg-purple-900/30 border-gold/30 text-gold placeholder:text-gold/40 backdrop-blur-md"
      />

      <Select onValueChange={setFilterPrize} value={filterPrize}>
        <SelectTrigger className="w-[180px] bg-purple-900/30 border-gold/30 text-gold backdrop-blur-xl">
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
        <SelectTrigger className="w-[180px] bg-purple-900/30 border-gold/30 text-gold backdrop-blur-xl">
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

        <TabsList className="bg-purple-900/40 border border-gold/30 shadow-lg rounded-xl">
          <TabsTrigger value="active">Activas</TabsTrigger>
          <TabsTrigger value="ended">Finalizadas</TabsTrigger>
          <TabsTrigger value="all">Todas</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
}
