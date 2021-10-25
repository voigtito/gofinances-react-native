import React, { useState } from 'react';
import { InputForm } from '../../components/Forms/InputForm';
import { Modal } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { Container, Header, Title, Form, Fields, TransactionsTypes } from './styles';
import { TransactionCardProps } from '../../components/TransactionCard';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import {CategorySelect} from '../CategorySelect'
import { useForm } from 'react-hook-form';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export interface FormDataProps {
  name: string;
  amount: string;
}

export function Register() {

  const [ transactionType, setTransactionType ] = useState('');
  const [ categoryModalOpen, setCategoryModalOpen ] = useState(false);
  const [ category, setCategory ] = useState({
    key: 'category',
    name: 'Categoria'
  });

  function handleTransactionType(type: 'up' | 'down') {
    setTransactionType(type)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  const { control, handleSubmit } = useForm();

  function handleRegister(form: FormDataProps) {

    const data = {
      name: form.name,
      amount: form.amount,
      transactionType,
      category: category.key
    }
    console.log(data)
  }

  return (
    <Container>
        <Header>
            <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm placeholder="Nome" name="name" control={control} error="s"></InputForm>
            <InputForm placeholder="Preço" name="amount" control={control} error="s"></InputForm>
            <TransactionsTypes>
              <TransactionTypeButton title="income" type="up" onPress={() => handleTransactionType('up')} isActive={transactionType === 'up'}></TransactionTypeButton>
              <TransactionTypeButton title="outcome" type="down" onPress={() => handleTransactionType('down')} isActive={transactionType === 'down'}></TransactionTypeButton>
            </TransactionsTypes>
            <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal}/>
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)}></Button>
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
    </Container>
  )
}
