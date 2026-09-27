import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-3 sm:p-6 bg-[#214b53] text-zinc-100">
            <div className="max-w-5xl w-full min-h-[500px] sm:min-h-[600px] flex rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-2xl shadow-black/80 bg-[#162024] border border-[#2b3a40]">

                {/* Left side Image Panel - Hidden on mobile, visible on lg screens */}
                <div className="hidden lg:flex lg:w-[55%] relative bg-black">
                    <Image
                        src="/assets/auth-image.jpg"
                        alt="CareerPilot AI"
                        fill
                        className="object-cover opacity-60 hover:opacity-80 hover:scale-105 transition-all duration-1000"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#162024] via-black/20 to-transparent flex flex-col justify-end p-10 xl:p-12">
                        <h1 className="text-3xl xl:text-4xl font-bold text-white mb-4 whitespace-nowrap drop-shadow-md">
                            Welcome to <span className="text-orange-500">CareerPilot AI</span>
                        </h1>
                        <p className="text-zinc-200 text-base xl:text-lg leading-relaxed shadow-sm max-w-sm">
                            Your personal AI-driven career coach. Plan, strategize, and land your dream job faster.
                        </p>
                    </div>
                </div>

                {/* Right side form */}
                <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-gradient-to-b from-[#11191c] to-[#162024]">
                    <div className="w-full max-w-md z-10 mx-auto">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}
