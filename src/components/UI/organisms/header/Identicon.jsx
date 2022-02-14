export default function Identicon() {
  return (
    <div
      style={{
        borderRadius: "50%",
        overflow: "hidden",
        width: "24px",
        height: "24px",
        background: "rgb(1, 109, 142)",
      }}
    >
      <svg viewBox="0 0 32 32" x="0" y="0" width="24" height="24">
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          transform="translate(-1.9 6.6) rotate(150.9 16 16)"
          fill="#C81429"
        ></rect>
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          transform="translate(14.6 -6.0) rotate(429.8 16 16)"
          fill="#F2CE02"
        ></rect>
        <rect
          x="0"
          y="0"
          width="32"
          height="32"
          transform="translate(-3.2 22.9) rotate(199.2 16 16)"
          fill="#F97101"
        ></rect>
      </svg>
    </div>
  );
}
