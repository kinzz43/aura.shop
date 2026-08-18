import logoSvg from "@/shared/assets/logo.svg";

interface LogoProps {
  className?: string;
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <img
      src={logoSvg}
      alt="aura."
      className={className}
      style={{
        height: "28px",
        width: "auto",
        display: "block",
      }}
    />
  );
};