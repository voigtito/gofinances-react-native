import React from 'react';

import { Container, Header, Title, Icon, Footer, Amount, LastTransaction } from './style';

interface Props {
  title: string;
  amount: string;
  lastTransaction: string;
  type: "total" | "up" | "down"
}

const icons = {
  up:'arrow-up-circle',
  down:'arrow-down-circle',
  total:'dollar-sign'
}

export function HighlightCard({ title, amount, lastTransaction, type }: Props) {
  return (
    <Container type={type}>
      <Header>
        <Title type={type}>{title}</Title>
        <Icon name={icons[type]} type={type}></Icon>
      </Header>
      <Footer>
        <Amount type={type}>{amount ? amount : '0'}</Amount>
        <LastTransaction type={type}>{lastTransaction}</LastTransaction>
      </Footer>
    </Container>
  )
}