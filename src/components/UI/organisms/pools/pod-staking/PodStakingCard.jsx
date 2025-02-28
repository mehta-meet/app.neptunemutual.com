import { useState } from "react";
import { CollectRewardModal } from "@/components/UI/organisms/pools/staking/CollectRewardModal";
import AddIcon from "@/icons/AddIcon";
import { SingleImage } from "@/components/common/SingleImage";
import { StakingCardTitle } from "@/components/UI/molecules/pools/staking/StakingCardTitle";
import { StakingCardSubTitle } from "@/components/UI/molecules/pools/staking/StakingCardSubTitle";
import { StakingCardCTA } from "@/components/UI/molecules/pools/staking/StakingCardCTA";
import { ModalTitle } from "@/components/UI/molecules/modal/ModalTitle";
import { Badge } from "@/components/UI/atoms/badge";
import { StakeModal } from "@/components/UI/organisms/pools/staking/StakeModal";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import BigNumber from "bignumber.js";
import { mergeAlternatively } from "@/utils/arrays";
import { getTokenImgSrc } from "@/src/helpers/token";
import { PoolCardStat } from "@/components/UI/molecules/pools/staking/PoolCardStat";
import { classNames } from "@/utils/classnames";
import { usePoolInfo } from "@/src/hooks/usePoolInfo";
import { convertFromUnits, isGreater } from "@/utils/bn";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { config } from "@neptunemutual/sdk";
import { useAppContext } from "@/src/context/AppWrapper";
import { explainInterval } from "@/utils/formatter/interval";
import { formatCurrency } from "@/utils/formatter/currency";

// data from subgraph
// info from `getInfo` on smart contract
// Both data and info may contain common data
export const PodStakingCard = ({ data }) => {
  const { networkId } = useAppContext();
  const { info } = usePoolInfo({ key: data.key });

  const rewardTokenAddress = info.rewardToken;
  const stakingTokenSymbol = useTokenSymbol(info.stakingToken);
  const rewardTokenSymbol = useTokenSymbol(info.rewardToken);

  const [isStakeModalOpen, setIsStakeModalOpen] = useState(false);
  const [isCollectModalOpen, setIsCollectModalOpen] = useState(false);

  function onStakeModalOpen() {
    setIsStakeModalOpen(true);
  }
  function onStakeModalClose() {
    setIsStakeModalOpen(false);
  }

  function onCollectModalClose() {
    setIsCollectModalOpen(false);
  }
  function onCollectModalOpen() {
    setIsCollectModalOpen(true);
  }

  const poolKey = data.key;
  const stakedAmount = info.accountStakeBalance;
  const rewardAmount = info.rewards;
  const hasStaked = isGreater(info.accountStakeBalance, "0");
  const approxBlockTime =
    config.networks.getChainConfig(networkId).approximateBlockTime;

  const lockupPeriod = BigNumber(data.lockupPeriodInBlocks).multipliedBy(
    approxBlockTime
  );

  const imgSrc = getTokenImgSrc(rewardTokenSymbol);
  const poolName = info.name;

  const leftHalf = [];

  if (hasStaked) {
    leftHalf.push({
      title: "Your Stake",
      value: formatCurrency(
        convertFromUnits(stakedAmount),
        stakingTokenSymbol,
        true
      ).long,
    });
  } else {
    leftHalf.push({
      title: "Lockup Period",
      value: `${explainInterval(data.lockupPeriodInBlocks * approxBlockTime)}`,
    });
  }

  const rightHalf = [
    {
      title: "TVL",
      value: formatCurrency(convertFromUnits(info.totalStaked), "USD").short,
      tooltip: formatCurrency(convertFromUnits(info.totalStaked), "USD").long,
    },
  ];

  const stats = mergeAlternatively(leftHalf, rightHalf, {
    title: "",
    value: "",
  });

  if (info.name === "") {
    return null;
  }

  return (
    <OutlinedCard className="bg-white px-6 pt-6 pb-10">
      <div className="flex justify-between">
        <div>
          <SingleImage src={imgSrc} alt={rewardTokenSymbol}></SingleImage>
          <StakingCardTitle text={poolName} />
          <StakingCardSubTitle text={"Stake " + stakingTokenSymbol} />
        </div>
        <div>
          <Badge className="text-21AD8C">APR: {25}%</Badge>
        </div>
      </div>

      <hr className="mt-4 border-t border-B0C4DB" />

      <div className="flex flex-wrap justify-between text-sm  px-1">
        {stats.map((x, idx) => {
          return (
            <div key={x.title} className="flex flex-col w-1/2 mt-5">
              <div
                className={classNames(idx % 2 && "text-right")}
                title={x.tooltip}
              >
                <PoolCardStat title={x.title} value={x.value} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center mt-5">
        {hasStaked ? (
          <>
            <div className="flex-1 text-sm">
              <PoolCardStat
                title="You Earned"
                value={
                  formatCurrency(
                    convertFromUnits(rewardAmount),
                    rewardTokenSymbol,
                    true
                  ).long
                }
              />
            </div>
            <div className="flex items-center">
              <StakingCardCTA
                className={"text-white px-2 mr-2"}
                onClick={onStakeModalOpen}
              >
                <AddIcon width={16} fill="currentColor" />
              </StakingCardCTA>
              <StakingCardCTA
                className={"font-semibold uppercase text-sm px-5 py-2"}
                onClick={onCollectModalOpen}
              >
                Collect
              </StakingCardCTA>
            </div>
          </>
        ) : (
          <StakingCardCTA onClick={onStakeModalOpen}>Stake</StakingCardCTA>
        )}
      </div>
      <StakeModal
        lockupPeriod={lockupPeriod}
        poolKey={poolKey}
        info={info}
        modalTitle={<ModalTitle imgSrc={imgSrc}>{poolName}</ModalTitle>}
        onClose={onStakeModalClose}
        isOpen={isStakeModalOpen}
        unitName={stakingTokenSymbol}
      />
      <CollectRewardModal
        poolKey={poolKey}
        info={info}
        stakedAmount={stakedAmount}
        rewardAmount={rewardAmount}
        rewardTokenAddress={rewardTokenAddress}
        rewardTokenSymbol={rewardTokenSymbol}
        stakingTokenSymbol={stakingTokenSymbol}
        isCollectModalOpen={isCollectModalOpen}
        onCollectModalClose={onCollectModalClose}
        modalTitle={
          <ModalTitle imgSrc={imgSrc}>Collect {stakingTokenSymbol}</ModalTitle>
        }
        unitName={stakingTokenSymbol}
      />
    </OutlinedCard>
  );
};
