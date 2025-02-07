import React, { useState } from "react";

interface UserInfoFormProps {
    onSubmit: (data: { name: string; phone: string; image: File | null }) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !phone) {
            alert("Name and phone are required!");
            return;
        }
        onSubmit({ name, phone, image });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
            </div>
            <div>
                <label>Phone:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone"
                    required
                />
            </div>
            <div>
                <label>Upload Photo:</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default UserInfoForm;
