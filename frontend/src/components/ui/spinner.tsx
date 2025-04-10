const Spinner = () => {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <radialGradient
          id="a5"
          cx=".66"
          fx=".66"
          cy=".3125"
          fy=".3125"
          gradientTransform="scale(1.5)"
        >
          <stop offset="0" stopColor="#FF1146"></stop>
          <stop offset=".3" stopColor="#FF1146" stopOpacity=".9"></stop>
          <stop offset=".6" stopColor="#FF1146" stopOpacity=".6"></stop>
          <stop offset=".8" stopColor="#FF1146" stopOpacity=".3"></stop>
          <stop offset="1" stopColor="#FF1146" stopOpacity="0"></stop>
        </radialGradient>
        <circle
          transform-origin="center"
          fill="none"
          stroke="url(#a5)"
          strokeWidth="20"
          strokeLinecap="round"
          strokeDasharray="200 1000"
          strokeDashoffset="0"
          cx="100"
          cy="100"
          r="70"
        >
          <animateTransform
            type="rotate"
            attributeName="transform"
            calcMode="spline"
            dur="2s"
            values="360;0"
            keyTimes="0;1"
            keySplines="0 0 1 1"
            repeatCount="indefinite"
          ></animateTransform>
        </circle>
        <circle
          transform-origin="center"
          fill="none"
          opacity=".2"
          stroke="#FF1146"
          strokeWidth="20"
          strokeLinecap="round"
          cx="100"
          cy="100"
          r="70"
        ></circle>
      </svg>
    );
  };
  
  export default Spinner;
  