import { classNames } from "@/utils/classnames";

/**
 * Props
 * @param {Object} props
 * @param {"normal"|"link"} props.type
 * @param {string} props.className
 * @param {*} props.children
 */
export const OutlinedCard = ({ children, className, type = "normal" }) => {
  return (
    <div
      className={classNames(
        className,
        "border-1 border-B0C4DB rounded-3xl",
        type === "link" &&
          "transition duration-150 ease-out hover:ease-in hover:shadow-card"
      )}
    >
      {children}
    </div>
  );
};
