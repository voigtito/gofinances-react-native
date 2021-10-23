import React from 'react';
import { HighlightCard } from '../../components/HIghlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { Container, Header, Photo, UserInfo, User, UserGreatings, UserName, UserContainer, Icon, HighlightCards, Transactions, Title, TransactionList } from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

export function Dashboard() {
  const data: DataListProps[] = [{
    id: '1',
    type: 'positive',
    title: "Desenvolvimento de site",
    amount: "R$ 12.000,00",
    category: { name: "Vendas", icon: "dollar-sign" },
    date: "13/04/2020"
  },
  {
    id: '2',
    type: 'negative',
    title: "Hambúrguer",
    amount: "R$ 59,00",
    category: { name: "Vendas", icon: "coffee" },
    date: "10/04/2020"
  },
  {
    id: '3',
    type: 'negative',
    title: "Aluguel",
    amount: "R$ 1.200,00",
    category: { name: "Vendas", icon: "shopping-bag" },
    date: "10/04/2020"
  }]

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
          <Icon name="power" />
        </UserContainer>
      </Header>
      <HighlightCards >
        <HighlightCard type="up" title="Entradas" amount="R$ 17.000,00" lastTransaction="Última entrada dia 13 de abril" />
        <HighlightCard type="down" title="Saídas" amount="R$ 10.000,00" lastTransaction="Última saída dia 15 de abril" />
        <HighlightCard type="total" title="Total" amount="R$ 7.000,00" lastTransaction="01 à 16 de abril" />
      </HighlightCards>
      <Transactions>
        <Title>Listagem</Title>
        <TransactionList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
        {/* <TransactionCard title="Desenvolvimento de site" amount="R$ 12.000,00" category={{name: "Vendas", icon: "dollar-sign"}} date="13/04/2020"></TransactionCard> */}
      </Transactions>
    </Container>
  )
}
