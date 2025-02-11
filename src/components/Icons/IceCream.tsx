import React from 'react'

const IceCream: React.FC<{ className?: string }> = ({ className }) => {
    return (
        <svg
            width="117"
            height="241"
            viewBox="0 0 117 241"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* <mask id="mask0_285_344" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="117" height="241"> */}
            <mask id="mask0_285_344" maskUnits="userSpaceOnUse" x="0" y="0" width="117" height="241">
                <path d="M104.735 35.4983C103.45 15.5353 86.8845 0 66.8833 0H49.1342C29.133 0 12.5671 15.5353 11.2821 35.4983L0.0600131 210.14C-0.996029 226.54 12.02 240.421 28.4586 240.421H87.5716C104.01 240.421 117.026 226.54 115.97 210.14L104.748 35.4983H104.735Z" fill="white" />
            </mask>
            <g mask="url(#mask0_285_344)">
                <path d="M141.977 -37.8901H-25.9592V282.091H141.977V-37.8901Z" fill="#FCE173" />
            </g>
        </svg>
    )
}

export default IceCream
