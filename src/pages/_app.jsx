import { Web3ReactProvider } from "@web3-react/core";
import "tailwindcss/tailwind.css";

import "@fontsource/poppins/latin.css";
import "@fontsource/sora/latin.css";
import "../styles/globals.css";
import { getLibrary } from "@/lib/connect-wallet/utils/web3";
import { Header } from "@/components/UI/organisms/header";
import { AppWrapper } from "@/src/context/AppWrapper";
import { ToastProvider } from "@/lib/toast/provider";
import { AppConstantsProvider } from "@/src/context/AppConstants";
import { CoversProvider } from "@/src/context/Covers";
import { UnlimitedApprovalProvider } from "@/src/context/UnlimitedApproval";

const position = {
  variant: "top_right",
};

function MyApp({ Component, pageProps }) {
  if (pageProps.noWrappers) {
    return <Component {...pageProps} />;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppWrapper>
        <AppConstantsProvider>
          <CoversProvider>
            <UnlimitedApprovalProvider>
              <ToastProvider variant={position.variant}>
                <Header></Header>
                <Component {...pageProps} />
              </ToastProvider>
            </UnlimitedApprovalProvider>
          </CoversProvider>
        </AppConstantsProvider>
      </AppWrapper>
    </Web3ReactProvider>
  );
}

export default MyApp;
