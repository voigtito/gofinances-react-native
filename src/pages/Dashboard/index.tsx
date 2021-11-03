import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { HighlightCard } from '../../components/HIghlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { Container, Header, Photo, UserInfo, User, UserGreatings, UserName, UserContainer, Icon, HighlightCards, Transactions, Title, TransactionList, LogoutButton, LoadContainer } from './styles';
import { useTheme } from 'styled-components';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightData {
  entries: {
    amount: string;
    lastTransaction: string;
  },
  expensives: {
    amount: string;
    lastTransaction: string;
  },
  total: {
    amount: string;
    lastTransaction: string;
  }
}

export function Dashboard() {

  const [transaction, setTransaction] = useState<DataListProps[]>();
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  function getLasTransactionDate(collection: DataListProps[], type: 'positive' | 'negative') {
    const lastTransaction = new Date(Math.max.apply(Math, collection
      .filter(transaction => transaction.type === type)
      .map(transaction => new Date(transaction.date).getTime())))

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`;
  }

  async function loadTransaction() {
    const response = await AsyncStorage.getItem("@gofinances:transactions");
    const transactions = response ? JSON.parse(response) : [];

    let entriesSum = 0;
    let expensive = 0;

    const transactionsFormatted: DataListProps[] = transactions.map((item: DataListProps) => {
      const amount = Number(item.amount).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
      const date = Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
      }).format(new Date(item.date));

      if (item.type === "positive") {
        entriesSum += Number(item.amount);
      } else {
        expensive += Number(item.amount);
      }

      return {
        id: item.id,
        title: item.title,
        amount,
        type: item.type,
        category: item.category,
        date
      }
    })


    const total = entriesSum - expensive;
    const lastTransactionEntries = getLasTransactionDate(transactions, 'positive');
    const lastTransactionExpensives = getLasTransactionDate(transactions, 'negative');
    const totalInterval = `01 a ${lastTransactionExpensives}`

    setHighlightData({
      expensives: {
        amount: expensive.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionEntries}`
      },
      entries: {
        amount: entriesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: `Última entrada dia ${lastTransactionExpensives}`
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }),
        lastTransaction: totalInterval
      }
    })
    setTransaction(transactionsFormatted)
    setIsLoading(false);
  }

  useEffect(() => {
    loadTransaction();
  }, []);

  useFocusEffect(useCallback(() => {
    loadTransaction();
  }, []));

  return (
    <Container>
      <Header>
        <UserContainer>
          <UserInfo>
            <Photo source={{ uri: "https://avatars.githubusercontent.com/u/55980259?v=4" }} />
            <User>
              <UserGreatings>Olá,</UserGreatings>
              <UserName>Rodrigo</UserName>
            </User>
          </UserInfo>
          <LogoutButton onPress={() => { }}>
            <Icon name="power" />
          </LogoutButton>
        </UserContainer>
      </Header>
      <HighlightCards >
        {
          isLoading
            ?
            <ActivityIndicator color={theme.colors.primary} size="large" />
            :
            <>
              <HighlightCard type="up" title="Entradas" amount={highlightData.entries.amount} lastTransaction={highlightData.entries.lastTransaction} />
              <HighlightCard type="down" title="Saídas" amount={highlightData.expensives.amount} lastTransaction={highlightData.expensives.lastTransaction} />
              <HighlightCard type="total" title="Total" amount={highlightData.total.amount} lastTransaction={highlightData.total.lastTransaction} />
            </>
        }
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        {
          isLoading
            ?
            <ActivityIndicator color={theme.colors.primary} size="large" />
            :
            <TransactionList
              data={transaction}
              keyExtractor={item => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
        }
      </Transactions>
    </Container>
  )
}
