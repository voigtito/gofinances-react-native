import React, { useState, useEffect } from 'react';
import { InputForm } from '../../components/Forms/InputForm';
import { Keyboard, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { Button } from '../../components/Forms/Button';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';
import { Container, Header, Title, Form, Fields, TransactionsTypes } from './styles';
import { TransactionCardProps } from '../../components/TransactionCard';
import { CategorySelectButton } from '../../components/Forms/CategorySelectButton';
import { CategorySelect } from '../CategorySelect'
import { useForm } from 'react-hook-form';
import uuid from 'react-native-uuid';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const collectionKey = "@gofinances:transactions";
export interface DataListProps extends TransactionCardProps {
  id: string;
}

export interface FormDataProps {
  name: string;
  amount: string;
}

type NavigationProps = {
  navigate:(screen:string) => void;
}

const schema = Yup.object().shape({
  name: Yup.string().required("Nome é obrigatório"),
  amount: Yup.number().typeError("Informe um valor numérico").positive("O valor não pode ser negativo").required("O preço é obrigatório")
})

export function Register() {

  const [transactionType, setTransactionType] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria'
  });

  const navigation = useNavigation<NavigationProps>();

  function handleTransactionType(type: 'positive' | 'negative') {
    setTransactionType(type)
  }

  function handleCloseSelectCategoryModal() {
    setCategoryModalOpen(false)
  }

  function handleOpenSelectCategoryModal() {
    setCategoryModalOpen(true)
  }

  const { control, handleSubmit, formState: { errors }, reset } = useForm({resolver: yupResolver(schema)});

  async function handleRegister(form: FormDataProps) {

    if(!transactionType) {
      return Alert.alert("Selecione o tipo da transação")
    }

    if (category.key === "category") {
      return Alert.alert("Selecione a categoria")
    }

    const newTransaction = {
      id: String(uuid.v4()),
      title: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    }

    try {
      const data = await AsyncStorage.getItem(collectionKey);
      const currentData = data ? JSON.parse(data) : [];

      const dataFormatted = [
        ...currentData,
        newTransaction
      ];

      await AsyncStorage.setItem(collectionKey, JSON.stringify(dataFormatted));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria'
      });

      navigation.navigate("Listagem")

    } catch (error) {
      console.log(error);
      Alert.alert('Não foi possível salvar');
    }

  }

  useEffect(() => {
    (async() => {
      const response = await AsyncStorage.getItem('@gofinances:transactions');
    })()

  }, [])

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>
        <Form>
          <Fields>
            <InputForm placeholder="Nome" name="name" control={control} error={errors.name && errors.name.message} autoCapitalize="sentences" autoCorrect={false}></InputForm>
            <InputForm placeholder="Preço" name="amount" control={control} error={errors.amount && errors.amount.message} keyboardType="numeric"></InputForm>
            <TransactionsTypes>
              <TransactionTypeButton title="income" type="up" onPress={() => handleTransactionType('positive')} isActive={transactionType === 'positive'}></TransactionTypeButton>
              <TransactionTypeButton title="outcome" type="down" onPress={() => handleTransactionType('negative')} isActive={transactionType === 'negative'}></TransactionTypeButton>
            </TransactionsTypes>
            <CategorySelectButton title={category.name} onPress={handleOpenSelectCategoryModal} />
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
    </TouchableWithoutFeedback>
  )
}
