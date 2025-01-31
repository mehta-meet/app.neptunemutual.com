import { useEffect, useState } from "react";

import { useWeb3React } from "@web3-react/core";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { registry } from "@neptunemutual/sdk";
import {
  convertToUnits,
  isGreater,
  isGreaterOrEqual,
  isValidNumber,
} from "@/utils/bn";
import { useTxToast } from "@/src/hooks/useTxToast";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useApprovalAmount } from "@/src/hooks/useApprovalAmount";

export const useStakingPoolDeposit = ({
  value,
  poolKey,
  tokenAddress,
  tokenSymbol,
  maximumStake,
}) => {
  const [balance, setBalance] = useState("0");
  const [allowance, setAllowance] = useState("0");
  const [approving, setApproving] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const { chainId, account, library } = useWeb3React();
  const { getApprovalAmount } = useApprovalAmount();

  const txToast = useTxToast();
  const { notifyError } = useErrorNotifier();

  const checkAllowance = async () => {
    try {
      const signerOrProvider = getProviderOrSigner(library, account, chainId);
      const instance = registry.IERC20.getInstance(
        chainId,
        tokenAddress,
        signerOrProvider
      );

      const poolContractAddress = await registry.StakingPools.getAddress(
        chainId,
        signerOrProvider
      );

      if (!instance) {
        console.log(
          "Could not get an instance of staking token from the address %s",
          tokenAddress
        );
      }

      let result = await instance.allowance(account, poolContractAddress);

      setAllowance(result.toString());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!chainId || !account || !tokenAddress) return;

    let ignore = false;
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    checkAllowance();

    const instance = registry.IERC20.getInstance(
      chainId,
      tokenAddress,
      signerOrProvider
    );

    instance
      .balanceOf(account)
      .then((bal) => {
        if (ignore) return;
        setBalance(bal.toString());
      })
      .catch((e) => {
        console.error(e);
        if (ignore) return;
      });

    return () => (ignore = true);
  }, [account, chainId, library, tokenAddress]);

  const handleApprove = async () => {
    try {
      setApproving(true);
      const signerOrProvider = getProviderOrSigner(library, account, chainId);

      const poolContractAddress = await registry.StakingPools.getAddress(
        chainId,
        signerOrProvider
      );

      const instance = registry.IERC20.getInstance(
        chainId,
        tokenAddress,
        signerOrProvider
      );

      const tx = await instance.approve(
        poolContractAddress,
        getApprovalAmount(convertToUnits(value).toString())
      );

      await txToast.push(tx, {
        pending: `Approving ${tokenSymbol}`,
        success: `Approved ${tokenSymbol} Successfully`,
        failure: `Could not approve ${tokenSymbol}`,
      });

      setApproving(false);
      checkAllowance();
    } catch (error) {
      notifyError(error, `approve ${tokenSymbol}`);
      setApproving(false);
    }
  };

  const handleDeposit = async () => {
    if (!account || !chainId) {
      return;
    }

    setDepositing(true);
    const signerOrProvider = getProviderOrSigner(library, account, chainId);

    try {
      const instance = await registry.StakingPools.getInstance(
        chainId,
        signerOrProvider
      );

      let tx = await instance.deposit(
        poolKey,
        convertToUnits(value).toString()
      );

      let txnStatus = await txToast.push(tx, {
        pending: `Staking ${tokenSymbol}`,
        success: `Staked ${tokenSymbol} successfully`,
        failure: `Could not stake ${tokenSymbol}`,
      });
      return txnStatus;
    } catch (err) {
      // console.error(err);
      notifyError(err, `stake ${tokenSymbol}`);
    } finally {
      setDepositing(false);
    }
  };

  const canDeposit =
    value &&
    isValidNumber(value) &&
    isGreaterOrEqual(allowance, convertToUnits(value || "0"));
  const isError =
    value &&
    (!isValidNumber(value) ||
      isGreater(convertToUnits(value || "0"), balance) ||
      isGreater(convertToUnits(value || "0"), maximumStake));

  return {
    balance,
    approving,
    depositing,

    canDeposit,
    isError,

    handleApprove,
    handleDeposit,
  };
};
