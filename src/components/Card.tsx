interface IceCream {
    name: string;
    flavor: string;
    rating: number;
    image: string;
}

interface CardProps {
    iceCream: IceCream;
}

const Card: React.FC<CardProps> = ({ iceCream }) => {
    const { name, flavor, rating } = iceCream;

    return (
        <div className="m-8 bg-red-200 w-64">
            <p className="p-4">Name: {name}</p>
            <p className="p-4">Flavor: {flavor}</p>
            <p className="p-4">Rating: {rating}</p>
        </div>
    );
};

export default Card;
