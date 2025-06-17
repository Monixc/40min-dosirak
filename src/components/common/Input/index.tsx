import styled from "styled-components";

export const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #333;
  background: #242424;
  color: #fff;
  font-size: 16px;

  &::placeholder {
    color: #666;
  }
`;

export const Button = styled.button`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #2a2a2a;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  border: 1px solid #333;

  &:hover {
    background: #333;
  }
`;
