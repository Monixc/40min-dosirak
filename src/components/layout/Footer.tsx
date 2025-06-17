import styled from "styled-components";
import { useEffect, useState } from "react";

interface FooterProps {
  isVisible: boolean;
}

const FooterContainer = styled.footer<FooterProps>`
  background: #242424;
  color: #fff;
  text-align: center;
  border-top: 1px solid #333;
  width: 100%;
  max-width: 480px;
  height: 60px;
  position: fixed;
  bottom: 0;
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight;
      setIsVisible(isBottom);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return <FooterContainer isVisible={isVisible}>©Monixc</FooterContainer>;
};

export default Footer;
