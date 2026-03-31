"use client";

import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";



interface Props {
    actions: ActionItem[];
}

export interface ActionItem {
    label: string;
    onClick?: () => void;
    destructive?: boolean;
    disabled?: boolean;
    customRender?: React.ReactNode;
}


export function TableActionsDropdown({ actions }: Props) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                {actions.map((action, i) => {
                    if (action.customRender) {
                        return <div key={i}>{action.customRender}</div>;
                    }

                    return (
                        <DropdownMenuItem
                            key={i}
                            onClick={action.onClick}
                            disabled={action.disabled}
                            className={action.destructive ? "text-red-500" : ""}
                        >
                            {action.label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}