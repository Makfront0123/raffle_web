"use client";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
    search: string;
    setSearch: (v: string) => void;
    filterPrize: string;
    setFilterPrize: (v: string) => void;
    sortBy: string;
    setSortBy: (v: string) => void;
    tab: "active" | "ended" | "all";
    setTab: (v: "active" | "ended" | "all") => void;
}

export default function RafflesFilters({
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
        <div className="flex flex-wrap items-center gap-4 mb-6">
            <Input
                placeholder="Buscar rifa..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[250px] bg-purple-600 text-white border-gray-600"
            />

            <Select onValueChange={setFilterPrize} value={filterPrize}>
                <SelectTrigger className="w-[180px] bg-purple-600 text-white border-gray-600">
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
                <SelectTrigger className="w-[180px] bg-purple-600 text-white border-gray-600">
                    <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recent">Más recientes</SelectItem>
                    <SelectItem value="price">Precio mayor</SelectItem>
                    <SelectItem value="endingSoon">Próximas a finalizar</SelectItem>
                </SelectContent>
            </Select>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "active" | "ended")}>
                <TabsList className="bg-purple-600">
                    <TabsTrigger value="active">Activas</TabsTrigger>
                    <TabsTrigger value="ended">Finalizadas</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    );
}
