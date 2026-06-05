"use client";

interface GameModalProps {

  children: React.ReactNode;

  maxWidth?: string;

  zIndex?: string;

}

export default function GameModal({

  children,

  maxWidth = "max-w-[760px]",

  zIndex = "z-[999]",

}: GameModalProps) {

  return (

    <div
      className={`
        fixed
        inset-0

        ${zIndex}

        flex
        items-start
        justify-center

        px-3
        pt-[72px]
        pb-[18px]

        md:px-4
        md:pt-[90px]
        md:pb-[28px]
      `}
    >

      {/* BACKDROP */}
      <div
        className="
          absolute
          inset-0

          bg-black/78
          backdrop-blur-[5px]
        "
      />

      {/* SCROLL AREA */}
      <div
        className="
          relative
          z-10

          w-full

          overflow-y-auto

          max-h-[calc(100dvh-90px)]

          scrollbar-thin
          scrollbar-thumb-green-500/20
          scrollbar-track-transparent
        "
      >

        {/* MODAL */}
        <div
          className={`
            relative

            w-full
            mx-auto

            ${maxWidth}

            rounded-[28px]

            border
            border-white/10

            overflow-hidden

            animate-[popup_.28s_ease]

            shadow-[0_0_45px_rgba(0,0,0,0.45)]
          `}
        >

          {children}

        </div>

      </div>

    </div>

  );

}