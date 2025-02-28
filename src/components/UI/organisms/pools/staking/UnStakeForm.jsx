import { RegularButton } from "@/components/UI/atoms/button/regular";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { useBlockHeight } from "@/src/hooks/useBlockHeight";
import {
  convertFromUnits,
  convertToUnits,
  isGreater,
  isValidNumber,
} from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

export const UnStakeForm = ({
  info,
  stakingTokenSymbol,
  stakedAmount,
  unstaking,
  handleUnstaking,
  inputValue,
  setInputValue,
}) => {
  /* const [inputValue, setInputValue] = useState(); */
  const blockHeight = useBlockHeight();

  /* const { withdrawing, handleWithdraw } = useStakingPoolWithdraw({
    value: inputValue,
    tokenAddress: info.stakingToken,
    tokenSymbol: stakingTokenSymbol,
    poolKey,
  }); */

  const canWithdraw = isGreater(blockHeight, info.canWithdrawFrom);
  const stakingTokenAddress = info.stakingToken;
  const isError =
    inputValue &&
    (!isValidNumber(inputValue) ||
      isGreater(convertToUnits(inputValue || "0"), stakedAmount));

  const handleChooseMax = () => {
    setInputValue(convertFromUnits(stakedAmount).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setInputValue(val);
    }
  };

  return (
    <div className="px-12 mt-6">
      <TokenAmountInput
        inputId={"withdraw-amount"}
        inputValue={inputValue}
        handleChooseMax={handleChooseMax}
        labelText={"Amount you wish to withdraw"}
        onChange={handleChange}
        tokenSymbol={stakingTokenSymbol}
        tokenAddress={stakingTokenAddress}
        disabled={unstaking}
      >
        <p>
          Staked:{" "}
          {
            formatCurrency(
              convertFromUnits(stakedAmount),
              stakingTokenSymbol,
              true
            ).long
          }
        </p>
        {!canWithdraw && (
          <p className="flex items-center text-FA5C2F">
            Could not withdraw during lockup period
          </p>
        )}
      </TokenAmountInput>

      <RegularButton
        disabled={isError || unstaking || !canWithdraw}
        className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
        onClick={handleUnstaking}
      >
        {unstaking ? "Unstaking..." : "Unstake"}
      </RegularButton>
    </div>
  );
};
