import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import ChevronDownIcon from "@/icons/ChevronDownIcon";
import { classNames } from "@/utils/classnames";

export const Select = ({
  prefix = "",
  options,
  selected,
  setSelected,
  className = "w-64",
}) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      <div className={classNames("relative", className)}>
        <Listbox.Button className="relative w-full py-3 pl-4 pr-14 border border-B0C4DB bg-white rounded-lg cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9">
          <span className="block text-left truncate text-9B9B9B">
            {prefix}
            {selected.name}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none text-9B9B9B">
            <ChevronDownIcon className="w-6 h-6" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute w-full py-1 mt-1 overflow-auto text-base border border-B0C4DB bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none ">
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active }) =>
                  classNames(
                    `cursor-default select-none relative px-1`,
                    active ? "text-4e7dd9" : "text-black"
                  )
                }
                value={option}
              >
                {({ selected, active }) => (
                  <>
                    <span
                      className={classNames(
                        `block truncate px-4 py-2`,
                        selected ? "font-medium" : "font-normal",
                        active ? "bg-EEEEEE bg-opacity-50 rounded-lg" : ""
                      )}
                    >
                      {option.name}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
