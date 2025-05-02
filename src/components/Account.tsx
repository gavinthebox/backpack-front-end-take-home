import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import ClickToCopy from "./ClickToCopy"
import ErrorMessage from "./Error"
import { useBalance } from "../queries/useBalance"

interface AccountProps {
  name: string;
  id: string;
  accountNumber: string;
  routingNumber: string;
}

export type Balance = {
  availableBalance: string;
  pendingBalance: string;
}

/*
  Typically in typescript, everything is a const instead of a function. If they are using functions, then by all means 
  use a function. But this is a little more concise and easier to read IMO.
*/ 
const Account: React.FC<AccountProps> = ({
  name, 
  id, 
  accountNumber, 
  routingNumber
}) => {
  const { data: balance, isError } = useBalance(id);

  return (
    <section className="bg-lightGray rounded-lg transition-all duration-500 ease-in">
      <h2 className="bg-bpBlue p-4 border-b-1 border-bpBlue rounded-t-lg text-lightGray">{name}</h2>
      {isError ? <ErrorMessage errorData="balance" /> :
        <div className="p-4 min-h-24 text-gray-600 text-right">
          <p className="text-4xl">{balance?.availableBalance}</p>
          <p>Available balance</p>
        </div>
      }
      <Disclosure as="div" className="p-4">
        <DisclosureButton className="group flex items-center gap-2 border-transparent border-b-2 hover:border-b-2 hover:border-bpBlue text-bpBlue transition-all hover:cursor-pointer">
          <h3>Account Details</h3>
          <ChevronDownIcon className="w-5 group-data-open:rotate-180 transition-all" />
        </DisclosureButton>
        <DisclosurePanel
          transition
          className="data-closed:opacity-0 text-gray-600 duration-100 ease-in"
        >
          {!isError &&
            <div className="flex justify-between mt-2 text-lg">
              <p>Pending balance</p>
              <p>{balance?.pendingBalance}</p>
            </div>
          }
          <div className="mt-2">
            <p className="font-medium">Account Number</p>
            <ClickToCopy text={accountNumber}/>
            <p className="font-medium">Routing Number</p>
            <ClickToCopy text={routingNumber}/>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </section>
  )
}

export default Account
