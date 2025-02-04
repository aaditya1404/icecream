import Link from "next/link";

const Navbar: React.FC = () => {
    return (
        <div className='bg-white'>
            <ul className='flex h-24 items-center justify-evenly overflow-x-auto'>
                <Link href={'/'}><li className='px-10'>Home</li></Link>
                <Link href={'/flavor'}><li className='px-10'>Flavors</li></Link>
                <Link href={'/request'}><li className='px-10'>Request</li></Link>
                <Link href={'/account'}><li className='px-10'>Account</li></Link>
            </ul>
        </div>
    );
};

export default Navbar;
