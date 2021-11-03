import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useCallback, useEffect, useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import {
  Container,
  Header,
  Title,
  Content,
  ChartContainer,
  MonthSelect,
  MonthSelectButton,
  SelectIcon,
  Month,
  TransactionsTypes
} from './styles'
import { VictoryPie } from 'victory-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, subMonths, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';
import { TransactionTypeButton } from '../../components/Forms/TransactionTypeButton';

interface TransactionData {
  type: 'positive' | 'negative'
  title: string;
  amount: string;
  category: string;
  date: string;
}

interface CategoryData {
  name: string;
  total: number;
  totalFormatted: string;
  color: string;
  percentage: string;
}

export function Resume() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [categoryType, setCategoryType] = useState<'positive' | 'negative'>('positive');
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  function handleDateChange(action: "next" | "prev") {
    if (action === 'next') {
      setSelectedDate(addMonths(selectedDate, 1))
    } else {
      setSelectedDate(subMonths(selectedDate, 1))
    }
  }

  async function loadData() {
    setIsLoading(true);
    const response = await AsyncStorage.getItem("@gofinances:transactions");
    const responseFormatted = response ? JSON.parse(response) : [];
    const transactions = responseFormatted.filter((transaction: TransactionData) =>
      transaction.type === categoryType &&
      new Date(transaction.date).getMonth() === selectedDate.getMonth() &&
      new Date(transaction.date).getFullYear() === selectedDate.getFullYear()
    );


    const total = transactions.reduce((accumullator: number, transaction: TransactionData) => {
      return accumullator + Number(transaction.amount);
    }, 0)

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      transactions.forEach((transaction: TransactionData) => {
        if (transaction.category === category.key) {
          categorySum += Number(transaction.amount);
        }
      })

      let percentageValue = categorySum / total * 100

      if (categorySum > 0) {
        totalByCategory.push({
          name: category.name,
          totalFormatted: categorySum.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
          }),
          color: category.color,
          total: categorySum,
          percentage: percentageValue > 3 ? `${(categorySum / total * 100).toFixed(0)}%` : ' '
        });
      }
    });
    setTotalByCategories(totalByCategory)
    setIsLoading(false);
  }

  useFocusEffect(useCallback(() => {
    loadData();
  }, [selectedDate, categoryType]));

  return (
    <Container>
      <Header>
        <Title>Resumo por categoria</Title>

      </Header>
      <Content
        contentContainerStyle={{ padding: 24, paddingBottom: useBottomTabBarHeight() }}
        showsVerticalScrollIndicator={false}
      >
        <MonthSelect>
          <MonthSelectButton onPress={() => handleDateChange("prev")}>
            <SelectIcon name="chevron-left"></SelectIcon>
          </MonthSelectButton>
          <Month>{format(selectedDate, 'MMMM, yyyy', { locale: ptBR })}</Month>
          <MonthSelectButton onPress={() => handleDateChange("next")}>
            <SelectIcon name="chevron-right"></SelectIcon>
          </MonthSelectButton>
        </MonthSelect>
        {
          isLoading
            ?
            <ActivityIndicator color={theme.colors.primary} size="large" />
            :
            <>
              <ChartContainer>
                <VictoryPie
                  data={totalByCategories}
                  colorScale={totalByCategories.map(category => category.color)}
                  style={{
                    labels: {
                      fontSize: RFValue(18),
                      fontWeight: 'bold',
                      fill: theme.colors.shape
                    }
                  }}
                  labelRadius={50}
                  x="percentage"
                  y="total"
                />
              </ChartContainer>
              <TransactionsTypes>
                <TransactionTypeButton title="income" type="up" onPress={() => setCategoryType('positive')} isActive={categoryType === 'positive'}/>
                <TransactionTypeButton title="outcome" type="down" onPress={() => setCategoryType('negative')} isActive={categoryType === 'negative'}/>
              </TransactionsTypes>
              {
                totalByCategories.map((item, index) => {
                  return <HistoryCard key={index} color={item.color} title={item.name} amount={item.totalFormatted} />
                })
              }
            </>
        }
      </Content>
    </Container>
  )
}