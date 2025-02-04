interface Review {
    user: string;
    profilePhoto: string;
    review: string;
    rating: number;
}

interface IceCream {
    id: number;
    name: string;
    flavor: string;
    rating: number;
    image: string;
    reviews: Review[];
}

const iceCreams: IceCream[] = [
    {
        id: 1,
        name: "Choco Delight",
        flavor: "Chocolate",
        rating: 4.8,
        image: "https://via.placeholder.com/250x150.png?text=Choco+Delight",
        reviews: [
            {
                user: "Alice Johnson",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Deliciously rich and chocolatey! Loved it.",
                rating: 5,
            },
            {
                user: "Mark Williams",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Good, but a bit too sweet for me.",
                rating: 4,
            },
        ],
    },
    {
        id: 2,
        name: "Vanilla Bliss",
        flavor: "Vanilla",
        rating: 4.5,
        image: "https://via.placeholder.com/250x150.png?text=Vanilla+Bliss",
        reviews: [
            {
                user: "Sarah Lee",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Classic and creamy, just perfect!",
                rating: 5,
            },
            {
                user: "James Carter",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Good vanilla flavor but could be more intense.",
                rating: 4,
            },
        ],
    },
    {
        id: 3,
        name: "Strawberry Swirl",
        flavor: "Strawberry",
        rating: 4.7,
        image: "https://via.placeholder.com/250x150.png?text=Strawberry+Swirl",
        reviews: [
            {
                user: "Emma Brown",
                profilePhoto: "https://via.placeholder.com/50",
                review: "So fresh and fruity! Loved the chunks of strawberries.",
                rating: 5,
            },
        ],
    },
    {
        id: 4,
        name: "Mango Magic",
        flavor: "Mango",
        rating: 4.6,
        image: "https://via.placeholder.com/250x150.png?text=Mango+Magic",
        reviews: [
            {
                user: "Liam Garcia",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Tastes like real mangoes! A must-try.",
                rating: 5,
            },
        ],
    },
    {
        id: 5,
        name: "Cookie Craze",
        flavor: "Cookies & Cream",
        rating: 4.9,
        image: "https://via.placeholder.com/250x150.png?text=Cookie+Craze",
        reviews: [
            {
                user: "Sophia Martinez",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Best cookies & cream ice cream I've ever had!",
                rating: 5,
            },
        ],
    },
    
    {
        id: 6,
        name: "Caramel Crunch",
        flavor: "Caramel",
        rating: 4.7,
        image: "https://via.placeholder.com/250x150.png?text=Caramel+Crunch",
        reviews: [
            {
                user: "Oliver Davis",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Amazing caramel flavor with just the right crunch!",
                rating: 5,
            },
        ],
    },
    {
        id: 7,
        name: "Minty Fresh",
        flavor: "Mint Chocolate",
        rating: 4.6,
        image: "https://via.placeholder.com/250x150.png?text=Minty+Fresh",
        reviews: [
            {
                user: "Isabella White",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Refreshing and chocolatey, perfect balance!",
                rating: 5,
            },
        ],
    },
    {
        id: 8,
        name: "Berry Blast",
        flavor: "Mixed Berries",
        rating: 4.8,
        image: "https://via.placeholder.com/250x150.png?text=Berry+Blast",
        reviews: [
            {
                user: "Mason Wilson",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Love the mix of berries, tastes so natural!",
                rating: 5,
            },
        ],
    },
    {
        id: 9,
        name: "Pistachio Paradise",
        flavor: "Pistachio",
        rating: 4.7,
        image: "https://via.placeholder.com/250x150.png?text=Pistachio+Paradise",
        reviews: [
            {
                user: "Charlotte Thomas",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Smooth and nutty, really enjoyed it.",
                rating: 5,
            },
        ],
    },
    {
        id: 10,
        name: "Coconut Dream",
        flavor: "Coconut",
        rating: 4.5,
        image: "https://via.placeholder.com/250x150.png?text=Coconut+Dream",
        reviews: [
            {
                user: "Henry Walker",
                profilePhoto: "https://via.placeholder.com/50",
                review: "Creamy coconut flavor, just like a tropical treat!",
                rating: 5,
            },
        ],
    },
];

export const getIceCreams = (): Promise<IceCream[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(iceCreams);
        }, 500);
    });
};
