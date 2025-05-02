import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import ClickToCopy from "./ClickToCopy";
import ErrorMessage from "./Error";
import { useBalance } from "../queries/useBalance";

interface AccountProps {
  name: string;
  id: string;
  accountNumber: string;
  routingNumber: string;
}

const Account: React.FC<AccountProps> = ({
  name,
  id,
  accountNumber,
  routingNumber,
}) => {
  const { data: balance, isError } = useBalance(id);
  const styles = getStyles();

  return (
    <section className={styles.section}>
      <h2 className={styles.header}>{name}</h2>
      {isError ? (
        <ErrorMessage errorData="balance" />
      ) : (
        <div className={styles.balanceContainer}>
          <p className={styles.balanceAmount}>{balance?.availableBalance}</p>
          <p>Available balance</p>
        </div>
      )}
      <Disclosure as="div" className={styles.disclosureContainer}>
        <DisclosureButton className={styles.disclosureButton}>
          <h3>Account Details</h3>
          <ChevronDownIcon className={styles.chevronDownIcon} />
        </DisclosureButton>
        <DisclosurePanel transition className={styles.disclosurePanel}>
          {!isError && (
            <div className={styles.accountDetails}>
              <p>Pending balance</p>
              <p>{balance?.pendingBalance}</p>
            </div>
          )}
          <div className={styles.accountInfo}>
            <p className={styles.accountLabel}>Account Number</p>
            <ClickToCopy text={accountNumber} />
            <p className={styles.accountLabel}>Routing Number</p>
            <ClickToCopy text={routingNumber} />
          </div>
        </DisclosurePanel>
      </Disclosure>
    </section>
  );
};

export default Account;

// personally, I like to keep the styles in a separate function to keep the component clean and focused on rendering logic.  
const getStyles = () => ({
  section: "bg-lightGray rounded-lg transition-all duration-500 ease-in",
  header: "bg-bpBlue p-4 border-b-1 border-bpBlue rounded-t-lg text-lightGray",
  balanceContainer: "p-4 min-h-24 text-gray-600 text-right",
  balanceAmount: "text-4xl",
  chevronDownIcon: "w-5 group-data-open:rotate-180 transition-all",
  disclosureContainer: "p-4",
  disclosureButton:
    "group flex items-center gap-2 border-transparent border-b-2 hover:border-b-2 hover:border-bpBlue text-bpBlue transition-all hover:cursor-pointer",
  disclosurePanel: "data-closed:opacity-0 text-gray-600 duration-100 ease-in",
  accountDetails: "flex justify-between mt-2 text-lg",
  accountInfo: "mt-2",
  accountLabel: "font-medium",
});
