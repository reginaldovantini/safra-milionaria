type LayoutMobileProps = {

  children: React.ReactNode;

};

export default function LayoutMobile({
  children,
}: LayoutMobileProps) {

  return (

    <div
      className="
        mobile-game-layout

        md:hidden

        bg-[#04110b]

        text-white

        overflow-hidden
      "
    >

      {/* FUNDO */}

      <div
        className="
          fixed
          inset-0

          pointer-events-none
        "
      >

        {/* GRADIENTE */}
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_top,rgba(0,255,140,0.08),transparent_60%)]
          "
        />

        {/* VINHETA */}
        <div
          className="
            absolute
            inset-0

            bg-gradient-to-b
            from-black/20
            via-transparent
            to-black/50
          "
        />

      </div>

      {/* ÁREA PRINCIPAL */}

      <div
        className="
          relative
          z-10

          flex
          flex-col

          h-full

          px-2
          pt-2
          pb-2

          mobile-compact
        "
      >

        {children}

      </div>

    </div>

  );

}