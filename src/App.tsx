import { useState, useEffect, ReactNode, lazy, Suspense } from 'react'
import bpLogo from './assets/bp_icon.svg'
import './App.css'
import Transaction from './components/Transaction'
import Loading from './components/Loading'
import ErrorMessage from './components/Error'

const Account = lazy(() => import('./components/Account'))
// Consider a .env file for things like this (not super important in this case, but good practice)
const baseUrl = 'https://api.dev.backpackpay.com/api/v1/mocks'
// Can you move these types to a separate file? It will make this component feel cleaner
// Types also don't need quotes around them.
type AccountType = {
    "id": string;
    "created_at": string;
    "updated_at": string;
    "status": string;
    "name": string;
    "account_number": string;
    "routing_number": string;
}

export type TransactionType = {
  "id": string;
  "created_at": string;
  "updated_at": string;
  "type": string;
  "date": string;
  "description": string;
  "enriched_description": string;
  "amount_in_cents": number
  "company_name": string;
  "trace_number": string;
  "transaction_id": string;
  "status": "SENT" | "PROCESSING" | "RETURNED" | "PENDING" | "FAILED" | "DONE"
  "method": string;
  "company_description": string;
  "processed_dt": string;
  "metadata"?: {
    "institution_payment": {
      "id": string;
      "type": string;
      "status": string;
      "institution": {
        "id": string;
        "name": string;
      },
      "beneficiary": {
        "id": string;
        "first_name": string;
        "last_name": string;
      },
      "enrollment_period": {
        "id": string;
        "description": string;
      }
    }
  }
}

function App() {
  const [accounts, setAccounts] = useState<AccountType[]>();
  const [transactions, setTransactions] = useState<TransactionType[]>();
  const [errors, setErrors] = useState({
    transactions: false,
    accounts: false,
  });
  /* 
    Try to avoid any types. It looks like you don't return anything here
    so you can either do Promise<void> or just omit a return type.
    
    If you have time, I would use a query library like Tanstack Query for all your data fetching.
    It will handle caching, error handling, and loading states for you.
    It also keeps you from having missing dependencies in your useEffect hooks.

    I left an example of what I consider a better way to query in Account.tsx and useBalance.ts.
  */
  const fetchAccountsAndTransactions = async () => {
    const transRes: Response = await fetch(`${baseUrl}/transactions`);
    const accRes: Response = await fetch(`${baseUrl}/bank-accounts`);
    /* 
      If you use a query library like mentioned above, these will be fetched simultaneously 
      when the component mounts: https://tanstack.com/query/v4/docs/framework/react/guides/parallel-queries#manual-parallel-queries
      This prevents the somewhat awkward situation of having to use index notation to do different things to your responses.

      Even if you don't use a query library, I don't know if this is a good use case for Promise.all(). It makes more sense to combine 
      them if the queries return the same type, but in this case they return different types (transactions and accounts). Unless this is 
      a very costly query and needs to be optimized, I would just await each response separately.
    */
    const responses = await Promise.allSettled([transRes, accRes]);

    if (responses[0].status === "fulfilled") {
      if (!responses[0].value.ok) {
        setErrors({ ...errors, transactions: true });
        return;
      }
      const transData = await responses[0].value.json();
      setTransactions(transData.data.transactions);
    } else {
      setErrors({ ...errors, transactions: true });
    }

    if (responses[1].status === "fulfilled") {
      if (!responses[1].value.ok) {
        setErrors({ ...errors, accounts: true });
        return;
      }
      const accData = await responses[1].value.json();
      setAccounts(accData.data.bank_accounts);
    } else {
      setErrors({ ...errors, accounts: true });
    }
  };

  useEffect(() => {
    console.log("Fetching accounts and transactions...");
    fetchAccountsAndTransactions();
  }, []);

  const accountCards = accounts?.map((account: AccountType): ReactNode => {
    return (
      <Account
        name={account.name}
        id={account.id}
        accountNumber={account.account_number}
        routingNumber={account.routing_number}
        key={account.id}
      />
    );
  });

  const transactionCards = transactions?.map(
    (transaction: TransactionType): ReactNode => {
      return <Transaction transaction={transaction} key={transaction.id} />;
    }
  );

  return (
    <>
      <header className="p-4 border-gray-400 border-b border-solid">
        <div className="m-auto max-w-6xl">
          <img
            src={bpLogo}
            alt={"Backpack logo and title"}
            width="170"
            height="35"
          />
        </div>
      </header>
      <main className="p-4">
        <h1 className="m-auto mb-2 max-w-6xl text-bpBlue">
          Accounts & Transactions
        </h1>
        <Suspense fallback={<Loading />}>
          <div className="lg:flex lg:gap-3 m-auto max-w-6xl">
            <section className="flex-1/3">
              {errors.accounts ? (
                <ErrorMessage errorData="accounts" />
              ) : (
                accountCards
              )}
            </section>
            <section className="flex-2/3 bg-lightGray mt-4 lg:mt-0 rounded-lg">
              {errors.transactions ? (
                <ErrorMessage errorData="transactions" />
              ) : (
                <div>
                  <h2 className="p-4 border-gray-400 border-b border-solid rounded-t-lg text-bpBlue">
                    Transactions
                  </h2>
                  <div>{transactionCards}</div>
                </div>
              )}
            </section>
          </div>
        </Suspense>
      </main>
    </>
  );
}

export default App
