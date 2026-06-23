import { Bird } from 'lucide-react';

export const Login = () => {
    return (
        <div className="w-screen h-screen flex flex-col justify-center items-center">
            <div className="flex flex-row justify-between items-center pb-4">
                <Bird className="text-primary"/>
                <span className="text-primary text-2xl">Pigeon</span>
            </div>
            <div className="shadow-md p-8 w-1/5 h-1/6 rounded-md bg-white flex flex-col justify-center items-center">
                <span className="text-base-content pb-6 text-2xl font-light">Log In</span>
                <button className="btn btn-primary w-full">Continue with Keycloak</button>
            </div>
        </div>
    )
}