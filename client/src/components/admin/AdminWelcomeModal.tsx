"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hook/useAuth"

const steps = [
    {
        title: "Bienvenido al Panel de Administración 👋",
        description: "Este panel te permite gestionar rifas, premios y pagos.",
    },
    {
        title: "1. Crear proveedor",
        description:
            "Antes de crear premios, debes registrar un proveedor.",
    },
    {
        title: "2. Crear rifa",
        description:
            "Crea una rifa con fechas, precio y cantidad de tickets.",
    },
    {
        title: "3. Crear premio",
        description:
            "Para crear un premio necesitas:\n- Un proveedor\n- Una rifa existente",
    },
    {
        title: "4. Gestionar pagos",
        description:
            "Aquí puedes ver los pagos realizados por los usuarios.",
    },
    {
        title: "5. Elegir ganador",
        description:
            "Cuando la rifa termine, puedes seleccionar el ganador.",
    },
    {
        title: "Exportar Pagos",
        description:
            "Puedes exportar los pagos realizados a un archivo CSV para su análisis.",
    },
    {
        title: "¡Listo!",
        description:
            "¡Ya puedes comenzar a utilizar el panel de administración!",
    },
]
export function AdminWelcomeModal() {
    const { user } = useAuth();

    const [open, setOpen] = useState(false);
    const [step, setStep] = useState(0);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!user) return;

        const seen = sessionStorage.getItem("admin_onboarding_seen");
        if (user.role === "admin" && !seen) {
            setOpen(true);
        }

        setReady(true);
    }, [user]);

    const handleClose = () => {
        sessionStorage.setItem("admin_onboarding_seen", "true");
        setOpen(false);
    };
    const next = () => {
        if (step < steps.length - 1) setStep((prev) => prev + 1);
        else handleClose();
    };


    const prev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    };
    if (!ready) return null;

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            sessionStorage.setItem("admin_onboarding_seen", "true");
            setOpen(isOpen);
        }}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{steps[step].title}</DialogTitle>
                </DialogHeader>

                <p className="text-sm whitespace-pre-line text-muted-foreground">
                    {steps[step].description}
                </p>
                <div className="flex justify-center gap-2 mt-6">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all ${i === step ? "bg-primary w-4" : "bg-gray-300"
                                }`}
                        />
                    ))}
                </div>

                <div className="flex justify-between mt-6">
                    <Button
                        variant="ghost"
                        onClick={prev}
                        disabled={step === 0}
                    >
                        Atrás
                    </Button>

                    <Button onClick={next}>
                        {step === steps.length - 1 ? "Finalizar" : "Siguiente"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}