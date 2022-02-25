import Link from "next/link";

import { Container } from "@/components/UI/atoms/container";
import { Grid } from "@/components/UI/atoms/grid";

import { CoverCard } from "@/components/UI/organisms/cover/card";
import React from "react";

import { HomeCard } from "@/components/UI/molecules/home-card";
import { HomeMainCard } from "@/components/UI/molecules/home-card/main";
import { SearchAndSortBar } from "@/components/UI/molecules/search-and-sort";
import IncreaseIcon from "@/icons/IncreaseIcon";
import { Hero } from "@/components/UI/molecules/Hero";
import { NeutralButton } from "@/components/UI/atoms/button/neutral-button";
import { TotalLiquidityChart } from "@/components/UI/molecules/TotalLiquidityChart";
import { getParsedKey } from "@/src/helpers/cover";
import { useCovers } from "@/src/context/Covers";
import ScrollTopArrowIcon from "@/icons/ScrollTopArrowIcon";

export const HomePage = () => {
  const { covers: availableCovers, loading } = useCovers();

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Hero>
        <Container className="py-10 md:py-16 md:px-10 lg:py-28 justify-between flex flex-wrap flex-col-reverse md:flex-col-reverse lg:flex-row lg:flex-nowrap">
          <div className="pt-10 md:flex md:gap-4 lg:block lg:mr-18 md:w-full lg:w-auto lg:pt-0">
            <div className="flex-1">
              <div className="md:mb-0 mb-2 lg:mb-8 flex md:justify-center lg:justify-start">
                <HomeCard
                  items={[
                    { name: "TVL (Cover)", amount: "$120M" },
                    { name: "TVL (Pool)", amount: "$100M" },
                  ]}
                  className="md:border-0.5 md:border-B0C4DB md:rounded-tl-xl md:rounded-tr-xl"
                />
              </div>
              <div className="md:mb-0 mb-2 lg:mb-8  flex md:justify-center lg:justify-start">
                <HomeCard
                  items={[
                    { name: "Covered", amount: "$12.5M" },
                    { name: "Cover Fee", amount: "$200K" },
                  ]}
                  className="md:border-0.5 md:border-t-0 md:border-B0C4DB md:border-t-transparent md:rounded-bl-xl md:rounded-br-xl"
                />
              </div>
            </div>
            <div className="flex flex-1 md:justify-center lg:justify-start">
              <HomeMainCard />
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="pt-6 mb-8">
              <h3 className="text-h3 font-sora text-4e7dd9 mb-1">
                Total Liquidity
              </h3>
              <div className="flex items-center">
                <h2 className="text-h2 text-black font-sora font-bold pr-3">
                  $250.32M
                </h2>
                <h6 className="text-h6 text-21AD8C font-sora font-bold flex items-center">
                  <span className="pr-1">
                    <span className="sr-only">Growth</span>
                    <IncreaseIcon width={19} />
                  </span>
                  <span>15.32%</span>
                </h6>
              </div>
            </div>
            <div className="flex-1 min-h-360">
              <TotalLiquidityChart />
            </div>
          </div>
        </Container>
        <hr className="border-b border-B0C4DB" />
      </Hero>

      <Container className="py-16">
        <div className="flex justify-between flex-wrap md:flex-nowrap gap-6 items-center">
          <h1 className="text-h3 lg:text-h2 font-sora font-bold">
            Available Covers
          </h1>
          <SearchAndSortBar
            sortClass="w-full md:w-48 lg:w-64 rounded-lg"
            containerClass="flex-col md:flex-row min-w-full md:min-w-sm"
            searchClass="w-full md:w-64 rounded-lg"
          />
        </div>
        <Grid className="mt-14 lg:mb-24 mb-14 gap-4">
          {loading && <>loading...</>}
          {!loading && availableCovers.length === 0 && <>No data found</>}
          {availableCovers.map((c) => {
            return (
              <Link href={`/cover/${getParsedKey(c.key)}/options`} key={c.key}>
                <a className="rounded-3xl focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
                  <CoverCard details={c}></CoverCard>
                </a>
              </Link>
            );
          })}
        </Grid>
        <NeutralButton className={"rounded-lg border-0.5"}>
          Show More
        </NeutralButton>
        <button
          onClick={scrollToTop}
          className="outline-none border-0 mt-14 mb-4 p-3 lg:hidden float-right rounded bg-black opacity-50"
        >
          <ScrollTopArrowIcon />
        </button>
      </Container>
    </>
  );
};
