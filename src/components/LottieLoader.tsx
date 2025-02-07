import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import React from 'react'

const LottieLoader = () => {
    return (
        <div className='flex justify-center items-center h-16'>
            <DotLottieReact
                src="/lottieLoading.json"
                loop={true}
                autoplay={true}
                className='w-16 h-16'
            />
        </div>
    )
}

export default LottieLoader;
