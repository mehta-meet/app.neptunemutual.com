import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useAuthValidation } from "@/src/hooks/useAuthValidation";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useTxToast } from "@/src/hooks/useTxToast";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

const defaultInfo = {
  totalStakeInWinningCamp: "0",
  totalStakeInLosingCamp: "0",
  myStakeInWinningCamp: "0",
  toBurn: "0",
  toReporter: "0",
  myReward: "0",
};

export const useUnstakeReportingStake = ({ coverKey, incidentDate }) => {
  const [info, setInfo] = useState(defaultInfo);
  const { account, library } = useWeb3React();
  const { networkId } = useAppContext();

  const txToast = useTxToast();
  const { requiresAuth } = useAuthValidation();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;
    if (!networkId || !account) {
      return;
    }

    async function fetchInfo() {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );
      const [
        totalStakeInWinningCamp,
        totalStakeInLosingCamp,
        myStakeInWinningCamp,
        toBurn,
        toReporter,
        myReward,
      ] = await resolutionContract.getUnstakeInfoFor(
        account,
        coverKey,
        incidentDate
      );

      if (ignore) {
        return;
      }

      setInfo({
        totalStakeInWinningCamp: totalStakeInWinningCamp.toString(),
        totalStakeInLosingCamp: totalStakeInLosingCamp.toString(),
        myStakeInWinningCamp: myStakeInWinningCamp.toString(),
        toBurn: toBurn.toString(),
        toReporter: toReporter.toString(),
        myReward: myReward.toString(),
      });
    }

    fetchInfo().catch(console.error);

    return () => {
      ignore = true;
    };
  }, [account, coverKey, incidentDate, library, networkId]);

  const unstake = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContract = await registry.Resolution.getInstance(
        networkId,
        signerOrProvider
      );
      const tx = await resolutionContract.unstake(coverKey, incidentDate);

      await txToast.push(tx, {
        pending: "Unstaking NPM",
        success: "Unstaked NPM Successfully",
        failure: "Could not unstake NPM",
      });
    } catch (err) {
      notifyError(err, "Unstake NPM");
    }
  };

  const unstakeWithClaim = async () => {
    if (!networkId || !account) {
      requiresAuth();
      return;
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId);
      const resolutionContractAddress = await registry.Resolution.getAddress(
        networkId,
        signerOrProvider
      );

      let resolutionContract = new ethers.Contract(
        resolutionContractAddress,
        ["function unstakeWithClaim(bytes32, uint256)"],
        signerOrProvider
      );

      const tx = await resolutionContract.unstakeWithClaim(
        coverKey,
        incidentDate
      );

      await txToast.push(tx, {
        pending: "Unstaking & claiming NPM",
        success: "Unstaked & claimed NPM Successfully",
        failure: "Could not unstake & claim NPM",
      });
    } catch (err) {
      notifyError(err, "Unstake & claim NPM");
    }
  };

  return {
    info,
    unstake,
    unstakeWithClaim,
  };
};
