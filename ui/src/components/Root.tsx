import type {ReactNode} from "react";
import {Bird} from "lucide-react";

interface RootProps {
    children?: ReactNode
}
export const Root = ({children}: RootProps) => {
    return (
        <div className="size-full">
            <div className="navbar bg-primary shadow-sm text-primary-content">
                <div className="btn btn-ghost flex flex-column">
                    <Bird />
                    <span className="text-xl">Pigeon</span>
                </div>
            </div>
            {children}
        </div>
    )
}