import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#214b53] text-zinc-100">
            <div className="max-w-5xl w-full min-h-[600px] flex rounded-[2rem] overflow-hidden shadow-2xl shadow-black/60 bg-[#162024] border border-[#2b3a40]">

                {/* Left side Image Panel */}
                <div className="hidden lg:flex lg:w-1/2 relative bg-black">
                    <Image
                        src="/assets/auth-image.jpg"
                        alt="CareerPilot AI"
                        fill
                        className="object-cover opacity-60 hover:opacity-80 hover:scale-105 transition-all duration-1000"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#162024] via-transparent to-transparent flex flex-col justify-end p-12">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Welcome to <span className="text-orange-500">CareerPilot AI</span>
                        </h1>
                        <p className="text-zinc-300 text-lg leading-relaxed shadow-sm">
                            Your personal AI-driven career coach. Plan, strategize, and land your dream job faster.
                        </p>
                    </div>
                </div>

                {/* Right side form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative bg-gradient-to-b from-[#11191c] to-[#162024]">
                    <div className="w-full max-w-sm z-10">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}
