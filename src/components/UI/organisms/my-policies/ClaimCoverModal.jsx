import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { DisabledInput } from "@/components/UI/atoms/input/disabled-input";
import { Label } from "@/components/UI/atoms/label";
import { Modal } from "@/components/UI/molecules/modal/regular";
import { ModalCloseButton } from "@/components/UI/molecules/modal/close-button";
import { RegularButton } from "@/components/UI/atoms/button/regular";
import { TokenAmountInput } from "@/components/UI/organisms/token-amount-input";
import { getCoverImgSrc } from "@/src/helpers/cover";
import { useTokenSymbol } from "@/src/hooks/useTokenSymbol";
import { useClaimPolicyInfo } from "@/src/hooks/useClaimPolicyInfo";
import { convertFromUnits } from "@/utils/bn";
import { useDelayedValueUpdate } from "@/src/hooks/useDelayedValueUpdate";

export const ClaimCoverModal = ({
  modalTitle,
  isOpen,
  onClose,
  coverKey,
  incidentDate,
  cxTokenAddress,
}) => {
  const [value, setValue] = useState();
  const delayedValue = useDelayedValueUpdate({ value });

  const cxTokenSymbol = useTokenSymbol(cxTokenAddress);
  const { balance, canClaim, handleClaim, handleApprove, receiveAmount } =
    useClaimPolicyInfo({
      value: delayedValue,
      cxTokenAddress,
      coverKey,
      incidentDate,
    });

  const handleChooseMax = () => {
    setValue(convertFromUnits(balance).toString());
  };

  const handleChange = (val) => {
    if (typeof val === "string") {
      setValue(val);
    }
  };

  const imgSrc = getCoverImgSrc({ key: coverKey });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-w-lg w-full inline-block bg-f1f3f6 align-middle text-left p-12 rounded-3xl relative">
        <Dialog.Title className="font-sora font-bold text-h2 w-full flex items-center">
          <img src={imgSrc} alt="policy" height={48} width={48} />
          <span className="pl-3">{modalTitle}</span>
        </Dialog.Title>
        <ModalCloseButton onClick={onClose}></ModalCloseButton>
        <div className="mt-6">
          <TokenAmountInput
            tokenAddress={cxTokenAddress}
            tokenSymbol={cxTokenSymbol}
            tokenBalance={balance}
            labelText={`Enter your ${cxTokenSymbol}`}
            handleChooseMax={handleChooseMax}
            inputValue={value}
            id={"bond-amount"}
            onChange={handleChange}
          />
        </div>
        <div className="modal-unlock mt-8">
          <Label className="font-semibold mb-4">You will receive</Label>
          <DisabledInput
            value={convertFromUnits(receiveAmount).toString()}
            unit="DAI"
          />
          <p className="text-9B9B9B pt-2 px-3">Fee: 6.50%</p>
        </div>

        {!canClaim ? (
          <RegularButton
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            disabled={!value}
            onClick={handleApprove}
          >
            Approve
          </RegularButton>
        ) : (
          <RegularButton
            disabled={!canClaim}
            className="w-full mt-8 p-6 text-h6 uppercase font-semibold"
            onClick={handleClaim}
          >
            Claim
          </RegularButton>
        )}
      </div>
    </Modal>
  );
};
