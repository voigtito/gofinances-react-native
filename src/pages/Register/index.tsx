import React from 'react';
import { TransactionCardProps } from '../../components/TransactionCard';
import { Container, Header, Title } from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Register() {

  return (
    <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>

    </Container>
  )
}
