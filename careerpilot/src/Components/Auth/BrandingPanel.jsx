import logo from "../../assets/logo.jpg";

function BrandingPanel() {
  return (
    <div
      className="relative flex w-full max-w-[480px] flex-col items-center overflow-hidden rounded-2xl border border-white px-5 py-5 text-center shadow-2xl sm:px-8 sm:py-6 xl:h-[560px] xl:shrink-0 xl:rounded-t-3xl xl:px-12 xl:py-12"
      style={{
        clipPath: "polygon(0 0, 100% 0, 92% 100%, 6% 100%) ",
        background:
          "linear-gradient(145deg, rgba(15, 23, 42, 0.55), rgba(50, 64, 170, 0.72))"
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/20"></div>

      <div className="absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-blue-400/20 "></div>

      {/* Logo */}
      <div className="relative z-10 mb-2 flex h-12 w-12 items-center justify-center rounded-xl border border-white bg-white/10 p-1 shadow-3xl backdrop-blur-sm xl:absolute xl:-ml-80 xl:mb-0 xl:mt-10 xl:h-20 xl:w-20 xl:rounded-3xl">
        <img
          src={logo}
          alt="FYPTrack Logo"
          className="h-full w-full rounded-xl object-contain"
        />
      </div>

      {/* Brand Name */}
      <h1 className="relative z-10 mt-1 text-3xl font-bold tracking-tight text-white xl:mt-15 xl:text-5xl">
        FYP<span className="text-orange-500">Track</span>
      </h1>

      {/* Tagline */}
      <p className="relative z-10 mt-2 max-w-sm text-sm font-medium leading-relaxed text-blue-100 xl:mt-4 xl:text-lg">
        Intelligent Final Year Project
        <br />
        Management & <span className="text-orange-500">Automation System</span>
      </p>

      {/* Description */}
      <p className="relative z-10 mt-10 hidden max-w-sm text-sm leading-7 text-slate-300 xl:block">
        Manage your final year project from proposal submission to <span className="text-orange-500">final
        evaluation</span> — all in one centralized platform.
      </p>

      {/* Bottom Feature */}
      <div className="relative z-10 mt-auto hidden items-center gap-3 rounded-2xl border border-orange-500 bg-white/20 px-5 py-3 backdrop-blur-sm xl:flex">
        <div className="h-2.5 w-2.5 rounded-3xl bg-orange-500"></div>

        <span className="text-sm font-medium text-white">
          Simplifying FYP Management
        </span>
      </div>
    </div>
  );
}
export default BrandingPanel;