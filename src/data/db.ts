interface IceCream {
    id: number;
    name: string;
    flavor: string;
    rating: number;
    image: string;
}

const iceCreams: IceCream[] = [
    {
        id: 1,
        name: "Choco Delight",
        flavor: "Chocolate",
        rating: 4.8,
        image: "https://via.placeholder.com/250x150.png?text=Choco+Delight",
    },
    {
        id: 2,
        name: "Vanilla Bliss",
        flavor: "Vanilla",
        rating: 4.5,
        image: "https://via.placeholder.com/250x150.png?text=Vanilla+Bliss",
    },
    {
        id: 3,
        name: "Strawberry Swirl",
        flavor: "Strawberry",
        rating: 4.7,
        image: "https://via.placeholder.com/250x150.png?text=Strawberry+Swirl",
    },
    {
        id: 4,
        name: "Mango Magic",
        flavor: "Mango",
        rating: 4.6,
        image: "https://via.placeholder.com/250x150.png?text=Mango+Magic",
    },
    {
        id: 5,
        name: "Cookie Craze",
        flavor: "Cookies & Cream",
        rating: 4.9,
        image: "https://via.placeholder.com/250x150.png?text=Cookie+Craze",
    },
];

export const getIceCreams = (): Promise<IceCream[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(iceCreams);
        }, 500);
    });
};
