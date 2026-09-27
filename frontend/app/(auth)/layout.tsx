import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex text-foreground">
            {/* Left side Image Panel */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
                <Image
                    src="/assets/auth-image.jpg"
                    alt="CareerPilot AI"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-12">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        Welcome to CareerPilot AI
                    </h1>
                    <p className="text-zinc-300 text-lg">
                        Your personal AI-driven career coach. Plan, strategize, and land your dream job faster.
                    </p>
                </div>
            </div>

            {/* Right side form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-50 dark:bg-zinc-950">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
                    {children}
                </div>
            </div>
        </div>
    );
}
