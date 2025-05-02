import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Balance } from "../components/Account";

type UseBalance = (
  accountId: string
) => UseQueryResult<Balance, Error>;

type BalanceResponse = {
  data: {
    bank_account_balance: {
      bank_account_id: string;
      available_balance_in_cents: number;
      pending_balance_in_cents: number;
    }
  }
}

const formatBalanceData = (data: BalanceResponse): Balance => {
  const {available_balance_in_cents, pending_balance_in_cents} = data.data.bank_account_balance

  return {
    availableBalance: (available_balance_in_cents/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' }),
    pendingBalance: (pending_balance_in_cents/100).toLocaleString('en-US', { style: 'currency', currency: 'USD' })
  }
}

const fetchBalance = async (id: string) => {
    const response: Response = await fetch(`https://api.dev.backpackpay.com/api/v1/mocks/bank-accounts/${id}/balance`)

    const balanceData: BalanceResponse = await response.json()

    return formatBalanceData(balanceData)
}

export const useBalance: UseBalance = (accountId) =>
  useQuery({
    /* 
        One of the things tanstack query gets you is automatic caching, so if you do decide to go the route of separate components
        for different screen sizes instead of responsive components, you can just use this same query and the data will be cached and 
        reused. That's what the queryKey is for, it is a unique cache key for the query.

        The queryFn is the function that will be called to fetch the data, and it will be called automatically when the component mounts.
        This way you don't have to use the empty useEffects.

        This is probably the most useful library I know. Check out the docs here: https://tanstack.com/query/latest/docs/framework/react/reference/useQuery
    */
    queryKey: ["balance", accountId],
    queryFn: () => fetchBalance(accountId),
  });
