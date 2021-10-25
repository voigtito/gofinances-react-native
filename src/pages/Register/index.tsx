import React, { useState } from 'react';
import { Input } from '../../components/Forms/Input';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { Container, Header, Title, Form, Fields, TransactionsTypes } from './styles';
import { TransactionCardProps } from '../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Register() {

  const [ transactionType, setTransactionType ] = useState('');

  function handleTransactionType(type: 'up' | 'down') {
    setTransactionType(type)
  }
  return (
    <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <Input placeholder="Nome"></Input>
            <Input placeholder="Preço"></Input>
            <TransactionsTypes>
              <TransactionTypeButton title="income" type="up" onPress={() => handleTransactionType('up')} isActive={transactionType === 'up'}></TransactionTypeButton>
              <TransactionTypeButton title="outcome" type="down" onPress={() => handleTransactionType('down')} isActive={transactionType === 'down'}></TransactionTypeButton>
            </TransactionsTypes>
          </Fields>
          <Button title="Enviar"></Button>
        </Form>
    </Container>
  )
}
