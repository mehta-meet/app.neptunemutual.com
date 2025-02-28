import { Badge } from "@/components/UI/atoms/badge";
import { Divider } from "@/components/UI/atoms/divider";
import { ProgressBar } from "@/components/UI/atoms/progress-bar";
import { OutlinedCard } from "@/components/UI/molecules/outlined-card";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { formatCurrency } from "@/utils/formatter/currency";

export const CoverCard = ({ details }) => {
  const {
    projectName,
    coverFees,
    key,
    apr,
    utilizationRatio,
    protection,
    liquidity,
  } = details;

  const imgSrc = getCoverImgSrc({ key });

  return (
    <OutlinedCard className="bg-white p-6" type="link">
      <div className="flex justify-between">
        <div>
          <div className="">
            <img
              src={imgSrc}
              alt={projectName}
              className="inline-block max-w-full"
            />
          </div>
          <h4 className="text-h4 font-sora font-semibold uppercase mt-4">
            {projectName}
          </h4>
          <div className="text-sm text-7398C0 uppercase mt-2">
            cover fee: {coverFees.min}-{coverFees.max}%
          </div>
        </div>
        <div>
          <Badge className="text-21AD8C">APR: {apr}%</Badge>
        </div>
      </div>

      {/* Divider */}
      <Divider />

      {/* Stats */}
      <div className="flex justify-between text-sm px-1">
        <span className="uppercase">utilization Ratio</span>
        <span className="font-semibold text-right">{utilizationRatio}%</span>
      </div>
      <div className="mt-2 mb-4">
        <ProgressBar value={utilizationRatio / 100} />
      </div>
      <div className="flex justify-between text-sm px-1">
        <span className="" title={formatCurrency(protection).long}>
          Protection: {formatCurrency(protection).short}
        </span>
        {/* <span className="text-right">Liquidity: ${liquidity}M</span> */}
        <span className="text-right" title={formatCurrency(liquidity).long}>
          Liquidity: {formatCurrency(liquidity).short}
        </span>
      </div>
    </OutlinedCard>
  );
};
