import * as Tooltip from "@radix-ui/react-tooltip";
import { useLiquidityTxs } from "@/components/UI/organisms/my-liquidity/useLiquidityTxs";
import {
  Table,
  TablePagination,
  TableWrapper,
  TBody,
  THead,
} from "@/components/UI/organisms/Table";
import AddCircleIcon from "@/icons/AddCircleIcon";
import ClockIcon from "@/icons/ClockIcon";
import OpenInNewIcon from "@/icons/OpenInNewIcon";
import { useRegisterToken } from "@/src/hooks/useRegisterToken";
import { convertFromUnits } from "@/utils/bn";
import { classNames } from "@/utils/classnames";
import { useWeb3React } from "@web3-react/core";
import { getBlockLink, getTxLink } from "@/lib/connect-wallet/utils/explorer";
import { useEffect, useState } from "react";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useCoverInfo } from "@/src/hooks/useCoverInfo";
import { fromNow } from "@/utils/formatter/relative-time";
import DateLib from "@/lib/date/DateLib";
import { formatCurrency } from "@/utils/formatter/currency";

const renderHeader = (col) => (
  <th
    scope="col"
    className={classNames(
      `px-6 py-6 font-bold text-sm uppercase`,
      col.align === "right" ? "text-right" : "text-left"
    )}
  >
    {col.name}
  </th>
);

const renderWhen = (row) => (
  <td
    className="px-6 py-6"
    title={DateLib.toLongDateFormat(row.transaction.timestamp)}
  >
    {fromNow(row.transaction.timestamp)}
  </td>
);

const renderDetails = (row) => <DetailsRenderer row={row} />;

const renderAmount = (row) => <PodAmountRenderer row={row} />;

const renderActions = (row) => <ActionsRenderer row={row} />;

const columns = [
  {
    name: "when",
    align: "left",
    renderHeader,
    renderData: renderWhen,
  },
  {
    name: "details",
    align: "left",
    renderHeader,
    renderData: renderDetails,
  },
  {
    name: "amount",
    align: "right",
    renderHeader,
    renderData: renderAmount,
  },
  {
    name: "",
    align: "right",
    renderHeader,
    renderData: renderActions,
  },
];

export const MyLiquidityTxsTable = () => {
  const [maxItems, setMaxItems] = useState(10);
  const { data, loading, page, maxPage, setPage } = useLiquidityTxs({
    maxItems,
  });
  const { account, chainId } = useWeb3React();

  // Go to page 1 if maxItems changes
  useEffect(() => {
    setPage(1);
  }, [maxItems, setPage]);

  const { blockNumber, transactions, totalCount } = data;
  return (
    <>
      {blockNumber && (
        <p className="text-9B9B9B text-xs text-right font-semibold mb-8">
          LAST SYNCED:{" "}
          <a
            href={getBlockLink(chainId, blockNumber)}
            target="_blank"
            rel="noreferrer noopener"
            className="pl-1 text-4e7dd9"
          >
            #{blockNumber}
          </a>
        </p>
      )}
      <TableWrapper>
        <Table>
          <THead columns={columns}></THead>
          {account ? (
            <TBody
              isLoading={loading}
              columns={columns}
              data={transactions}
            ></TBody>
          ) : (
            <tbody>
              <tr className="w-full text-center">
                <td className="p-6" colSpan={columns.length}>
                  Please connect your wallet...
                </td>
              </tr>
            </tbody>
          )}
        </Table>
        <TablePagination
          skip={maxItems * (page - 1)}
          limit={maxItems}
          totalCount={totalCount}
          hasPrev={page !== 1}
          hasNext={page !== maxPage}
          onPrev={() => {
            setPage(page === 1 ? page : page - 1);
          }}
          onNext={() => {
            setPage(page === maxPage ? page : page + 1);
          }}
          updateRowCount={(newCount) => {
            setMaxItems(parseInt(newCount, 10));
          }}
        />
      </TableWrapper>
    </>
  );
};

const DetailsRenderer = ({ row }) => {
  const { coverInfo } = useCoverInfo(row.cover.id);

  return (
    <td className="px-6 py-6">
      <div className="flex items-center">
        <img
          src={getCoverImgSrc({ key: row.cover.id })}
          alt="policy"
          height={32}
          width={32}
        />

        <span className="pl-4 text-left whitespace-nowrap">
          {row.type == "PodsIssued" ? "Added" : "Removed"}{" "}
          <span
            title={formatCurrency(convertFromUnits(row.liquidityAmount)).long}
          >
            {formatCurrency(convertFromUnits(row.liquidityAmount)).short}
          </span>{" "}
          {row.type == "PodsIssued" ? "to" : "from"} {coverInfo.projectName}
        </span>
      </div>
    </td>
  );
};

const PodAmountRenderer = ({ row }) => {
  const { register } = useRegisterToken();
  const tokenSymbol = useTokenSymbol(row.vault.id);

  return (
    <td className="px-6 py-6 text-right">
      <div className="flex items-center justify-end whitespace-nowrap">
        <span
          className={row.type == "PodsIssued" ? "text-404040" : "text-FA5C2F"}
          title={
            formatCurrency(convertFromUnits(row.podAmount), tokenSymbol, true)
              .long
          }
        >
          {
            formatCurrency(convertFromUnits(row.podAmount), tokenSymbol, true)
              .short
          }
        </span>
        <button
          className="ml-3 p-1"
          onClick={() => register(row.vault.id, tokenSymbol)}
        >
          <span className="sr-only">Add to metamask</span>
          <AddCircleIcon className="h-4 w-4" />
        </button>
      </div>
    </td>
  );
};

const ActionsRenderer = ({ row }) => {
  const { chainId } = useWeb3React();

  return (
    <td className="px-6 py-6 min-w-120">
      <div className="flex items-center justify-end">
        {/* Tooltip */}
        <Tooltip.Root>
          <Tooltip.Trigger className="p-1 mr-4 text-9B9B9B">
            <span className="sr-only">Timestamp</span>
            <ClockIcon className="h-4 w-4" />
          </Tooltip.Trigger>

          <Tooltip.Content side="top">
            <div className="text-sm leading-6 bg-black text-white p-3 rounded-xl max-w-sm">
              <p>
                {DateLib.toLongDateFormat(row.transaction.timestamp, "UTC")}
              </p>
            </div>
            <Tooltip.Arrow offset={16} className="fill-black" />
          </Tooltip.Content>
        </Tooltip.Root>

        <a
          href={getTxLink(chainId, { hash: row.transaction.id })}
          target="_blank"
          rel="noreferrer noopener"
          className="p-1 text-black"
        >
          <span className="sr-only">Open in explorer</span>
          <OpenInNewIcon className="h-4 w-4" />
        </a>
      </div>
    </td>
  );
};
