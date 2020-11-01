import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';
import LoaderCardBalance from '../../components/LoaderCardBalance';
import LoaderCardTransaction from '../../components/LoaderCardTransaction';

import formatValue from '../../utils/formatValue';
import formatDate from '../../utils/formatDate';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const transactions = localStorage.getItem('@GoFinances:transactions');

    if (transactions) return JSON.parse(transactions);

    return [] as Transaction[];
  });
  const [balance, setBalance] = useState<Balance>(() => {
    const balance = localStorage.getItem('@GoFinances:balance');

    if(balance) {
      return JSON.parse(balance);
    }

    return {} as Balance;
  });
  const [showLoader, setShowLoader] = useState(true);
  const fakeTransactions = [1, 2, 3, 4, 5, 6, 7, 8];


  const [alreadyLoaded, setAlreadyLoaded] = useState(() => {
    const alreadyLoadedTransactions = localStorage.getItem("@GoFinances:import");
    
    if (alreadyLoadedTransactions) {
      setShowLoader(showLoader => !showLoader);

      return true;
    }

    return false;
  });

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const { data } = await api.get('transactions');

      const transactionsFormatted = data.transactions.map(
        (transaction: Transaction) => ({
          ...transaction,
          formattedValue: formatValue(transaction.value),
        }),
      );

      const balanceFormatted = {
        income: formatValue(data.balance.income),
        outcome: formatValue(data.balance.outcome),
        total: formatValue(data.balance.total),
      };

      setTransactions(transactionsFormatted);
      setBalance(balanceFormatted);

      localStorage.setItem('@GoFinances:balance', JSON.stringify(balanceFormatted));
      localStorage.setItem('@GoFinances:transactions', JSON.stringify(transactionsFormatted));

      if (!alreadyLoaded) {
        setTimeout(() => {
          setShowLoader(showLoader => !showLoader);
        }, 2000);
      }
      
      localStorage.removeItem("@GoFinances:import");
    }
    
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            {showLoader ? <LoaderCardBalance color="#f3f3f3" shadeValue={0.03} /> : <h1 data-testid="balance-income">{balance.income}</h1> }
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            {showLoader ? <LoaderCardBalance color="#f3f3f3" shadeValue={0.03}/> : <h1 data-testid="balance-income">{balance.outcome}</h1> }
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            {showLoader ? <LoaderCardBalance color="#ff872c" shadeValue={0.10}/> : <h1 data-testid="balance-income">{balance.total}</h1> }
          </Card>
        </CardContainer>


        {showLoader ? (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Data</th>
                  </tr>
                </thead>
              </table>
            </TableContainer>

            {fakeTransactions.map(_ => (
              <LoaderCardTransaction color="#f3f3f3" shadeValue={0.03} />
            ))}
          </>
        ) : (
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Preço</th>
                  <th>Categoria</th>
                  <th>Data</th>
                </tr>
              </thead>
        
              <tbody>
                {transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td className={transaction.type}>
                      {transaction.type === 'outcome' && ' - '}
                      {transaction.formattedValue}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{formatDate(new Date(transaction.created_at))}</td>
                  </tr>
                ))}
            </tbody>
            </table>
          </TableContainer>
        )}

        
      </Container>
    </>
  );
};

export default Dashboard;
