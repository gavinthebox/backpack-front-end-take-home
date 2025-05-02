import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { TransactionType } from "../App"
import ClickToCopy from "./ClickToCopy"

interface TransactionProps {
  transaction: TransactionType
}

// You don't need to have quotes around the type names in TypeScript
type MetadataType = {
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

interface StatusProps {
  status: "SENT" | "PROCESSING" | "RETURNED" | "PENDING" | "FAILED" | "DONE"
}

function StatusDisplay({ status }: StatusProps): React.JSX.Element {
  // This seems like a good use case for a switch statement 
  let colorClass: string 
  switch (status) {
    case "SENT":
    case "DONE":
      colorClass = "bg-success"
      break;
    case "PENDING":
    case "PROCESSING":
      colorClass = "bg-pending"
      break;
    case "FAILED":
    case "RETURNED":
      colorClass = "bg-fail"
      break;
    default:
      colorClass = "bg-gray-400"
      break;
  }

  return (
    <p className={`${colorClass} text-lightGray font-bold  mt-1 px-2 rounded-md min-w-20 text-center`}>{status}</p>
  )
}

function Transaction({ transaction }: TransactionProps): React.JSX.Element {
  const { date, company_name, amount_in_cents, status, trace_number } = transaction

  let metadata: MetadataType | null = null
  if (transaction.metadata?.institution_payment) {
    metadata = transaction.metadata.institution_payment
  }

  return (

    <div className="mb-5 px-4 text-sm">
      <div className="flex justify-between my-2">
        <div>
          <p>{formatDate(date)}</p>
          <p className="mt-1">{company_name}</p>
        </div>
        <div>
          <p className="font-bold text-right">{formatAmount(amount_in_cents)}</p>
          <StatusDisplay status={status} />
        </div>
      </div>
      {metadata &&
        <div className="mb-2">
          <p className="self-end font-bold">{`${metadata.beneficiary.first_name} ${metadata.beneficiary.last_name}`}</p>
          <div className="flex justify-between">
            <p className="row-start-4">{metadata.institution.name}</p>
            <p className="row-start-4">{`${metadata.enrollment_period.description} ${metadata.type.toLowerCase()}`}</p>
          </div>
        </div>
      }
      <Disclosure as="div" className="border-gray-400 border-b-1">
        <DisclosureButton className="group flex items-center gap-2 border-transparent border-b-2 hover:border-b-2 hover:border-bpBlue text-bpBlue transition-all hover:cursor-pointer">
          <p>Trace Number</p>
          <ChevronDownIcon className="w-5 group-data-open:rotate-180 transition-all" />
        </DisclosureButton>
        <DisclosurePanel
          transition
          className="data-closed:opacity-0 text-gray-600 duration-100 ease-in"
        >
          <div className="mt-2 pb-3 border-gray-400 border-b-1">
            <ClickToCopy text={trace_number} />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>
  )
}

export default Transaction


// helper functions
// You do this same thing to format the amount in cents in the formatBalanceData function in the 
// Account component, so I would move this to a util file and import it in both components
const formatAmount = (amount_in_cents: number): string => {
  return (amount_in_cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

const formatDate = (date: string): string => {
  const dateObj = new Date(date)
  return dateObj.toLocaleDateString("ed-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}
